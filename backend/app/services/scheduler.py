from __future__ import annotations
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..database import SessionLocal
from ..models import Product, PriceHistory, CompetitorOffer, Store, Notification, User
from .spapi import SPAPIClient as MockSPAPIClient
from .amazon_spapi import create_spapi_client, AmazonSPAPIClient
from .buybox import determine_buybox
from .notify import send_email, send_push
from .repricing_engine import RepricingEngine
import json
import asyncio
import logging

logger = logging.getLogger(__name__)


def _parse_sp_api_pricing_to_offers(pricing_data: dict, marketplace_id: str) -> list:
    """
    Parse real SP-API pricing response into offer format for scheduler
    
    SP-API returns competitive pricing in a different format than our mock client.
    This function normalizes it to the format expected by the rest of the code.
    """
    offers = []
    
    try:
        # SP-API get_product_pricing_for_asins returns pricing data
        if not pricing_data or not pricing_data.get("success"):
            return []
        
        payload = pricing_data.get("pricing", [])
        if not payload:
            return []
        
        # Parse competitive offers from SP-API response
        # Format varies but typically includes competitive pricing info
        for asin_data in payload:
            product = asin_data.get("Product", {})
            competitive_pricing = product.get("CompetitivePricing", {})
            competitive_prices = competitive_pricing.get("CompetitivePrices", [])
            offers_list = product.get("Offers", [])
            
            # Parse competitive prices
            for comp_price in competitive_prices:
                price_data = comp_price.get("Price", {})
                landed_price = price_data.get("LandedPrice", {})
                listing_price = price_data.get("ListingPrice", {})
                
                price_amount = float(landed_price.get("Amount", 0) or listing_price.get("Amount", 0))
                
                offers.append({
                    "seller_id": comp_price.get("CompetitivePriceId", f"COMP_{len(offers)}"),
                    "price": price_amount,
                    "shipping": 0.0,  # Landed price includes shipping
                    "is_buybox": comp_price.get("belongsToRequester", False)
                })
            
            # Parse offers if available
            for offer in offers_list:
                buying_price = offer.get("BuyingPrice", {})
                listing_price_data = buying_price.get("ListingPrice", {})
                shipping_data = buying_price.get("Shipping", {})
                
                offers.append({
                    "seller_id": offer.get("SellerId", f"SELLER_{len(offers)}"),
                    "price": float(listing_price_data.get("Amount", 0)),
                    "shipping": float(shipping_data.get("Amount", 0)),
                    "is_buybox": offer.get("IsBuyBoxWinner", False)
                })
        
        return offers if offers else []
        
    except Exception as e:
        logger.error(f"Error parsing SP-API pricing data: {e}")
        return []


def _run_async(coro):
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        return asyncio.run(coro)
    fut = asyncio.run_coroutine_threadsafe(coro, loop)
    return fut.result()


def run_cycle():
    start_time = datetime.utcnow()
    products_processed = 0
    products_repriced = 0
    buybox_changes = 0
    
    logger.info("="*80)
    logger.info(f"🔄 REPRICING CYCLE STARTED at {start_time.strftime('%Y-%m-%d %H:%M:%S UTC')}")
    logger.info("="*80)
    
    db: Session = SessionLocal()
    try:
        # Only process active stores
        stores = db.query(Store).filter(Store.is_active == True).all()
        logger.info(f"📊 Processing {len(stores)} active store(s)")
        for st in stores:
            try:
                # Try to create real SP-API client, fallback to mock if unavailable
                real_client = create_spapi_client(st.refresh_token, st.region)
                client = real_client if real_client else MockSPAPIClient(st.region, st.refresh_token)
                
                is_real_client = isinstance(client, AmazonSPAPIClient)
                if is_real_client:
                    logger.info(f"Using real SP-API client for store {st.id}")
                else:
                    logger.info(f"Using mock SP-API client for store {st.id} (real credentials not available)")
                
                products = db.query(Product).filter(Product.user_id == st.user_id).all()
                logger.info(f"  📦 Store {st.id} ({st.store_name}): {len(products)} products")
                
                # Get marketplace ID from store
                marketplace_id = st.marketplace_ids.split(",")[0] if st.marketplace_ids else "ATVPDKIKX0DER"
                
                for p in products:
                    try:
                        # Get competitive pricing - different method for real vs mock client
                        if is_real_client:
                            # Real SP-API client - use get_product_pricing
                            pricing_result = _run_async(client.get_product_pricing(p.asin, marketplace_id))
                            
                            # Check if pricing failed due to authentication error
                            if not pricing_result.get("success", False):
                                error_msg = pricing_result.get("error", "")
                                if "invalid_grant" in str(error_msg).lower() or "refresh_token" in str(error_msg).lower():
                                    logger.error(f"🔒 Authentication failed for store {st.id} - marking as inactive")
                                    st.is_active = False
                                    db.commit()
                                    break  # Skip remaining products for this store
                            
                            offers = _parse_sp_api_pricing_to_offers(pricing_result, marketplace_id)
                        else:
                            # Mock client - use get_competitive_pricing
                            offers = _run_async(client.get_competitive_pricing(p.asin))
                    except Exception as e:
                        logger.error(f"  ⚠️ Error processing product {p.sku}: {e}")
                        continue  # Continue with next product
                
                products_processed += 1
                
                if not offers:
                    logger.debug(f"No offers found for product {p.sku} (ASIN: {p.asin})")
                    continue
                bb = determine_buybox(offers)
                owning = (bb.get("seller_id") == st.selling_partner_id) if bb else False
                if owning != p.buybox_owning:
                    buybox_changes += 1
                    status_change = "✅ GAINED" if owning else "❌ LOST"
                    logger.info(f"  {status_change} Buy Box: {p.sku} ({p.title[:40]}...)")
                    
                    p.buybox_owning = owning
                    p.buybox_owner = bb.get("seller_id") if bb else None
                    db.add(PriceHistory(product_id=p.id, price=p.price, buybox_owning=owning))
                    db.add(Notification(
                        user_id=p.user_id,
                        type=("BUYBOX_GAINED" if owning else "BUYBOX_LOST"),
                        payload_json=json.dumps({"asin": p.asin, "owner": p.buybox_owner}),
                        sent=False
                    ))
                # Delete old competitor offers for this product to prevent bloat
                db.query(CompetitorOffer).filter(
                    CompetitorOffer.product_id == p.id
                ).delete()
                
                # Store fresh competitor offers in database
                competitor_offers_list = []
                for o in offers:
                    comp_offer = CompetitorOffer(
                        product_id=p.id,
                        seller_id=o.get("seller_id", ""),
                        price=float(o.get("price", 0.0)),
                        shipping=float(o.get("shipping", 0.0)),
                        is_buybox=bool(o.get("is_buybox", False))
                    )
                    db.add(comp_offer)
                    competitor_offers_list.append(comp_offer)
                
                # Skip repricing if product doesn't have repricing enabled
                if not p.repricing_enabled:
                    continue
                
                # Use new RepricingEngine with advanced strategies
                engine = RepricingEngine(db)
                strategy = p.repricing_strategy or 'win_buybox'  # Default to Win Buy Box
                
                # Calculate optimal price using new engine
                repricing_result = engine.calculate_optimal_price(
                    product=p,
                    competitors=competitor_offers_list,
                    strategy=strategy
                )
                
                # Check if repricing is needed
                if repricing_result['should_reprice']:
                    new_price = repricing_result['new_price']
                    
                    # Update price on Amazon - different method for real vs mock client
                    if is_real_client:
                        # Real SP-API - use update_price with all required params
                        result = _run_async(client.update_price(
                            p.sku, 
                            st.selling_partner_id, 
                            marketplace_id, 
                            new_price
                        ))
                        ok = result.get("success", False)
                    else:
                        # Mock client - simple update_price
                        ok = _run_async(client.update_price(p.sku, new_price))
                    
                    if ok:
                        products_repriced += 1
                        old_price = p.price
                        p.price = new_price
                        p.last_repriced_at = datetime.utcnow()
                        p.competitor_count = repricing_result.get('competitor_count', len(offers))
                        p.lowest_competitor_price = repricing_result.get('lowest_competitor_price')
                        
                        # Log price change
                        db.add(PriceHistory(
                            product_id=p.id,
                            price=new_price,
                            buybox_owning=p.buybox_owning
                        ))
                        
                        db.add(Notification(
                            user_id=p.user_id,
                            type="PRICE_CHANGED",
                            payload_json=json.dumps({
                                "asin": p.asin,
                                "sku": p.sku,
                                "old_price": old_price,
                                "new_price": new_price,
                                "strategy": strategy,
                                "reason": repricing_result.get('reason', ''),
                                "buybox_chance": repricing_result.get('estimated_buybox_chance', 0)
                            }),
                            sent=False
                        ))
                        
                        price_change = ((new_price - old_price) / old_price) * 100
                        logger.info(
                            f"  💰 REPRICED {p.sku}: ${old_price:.2f} → ${new_price:.2f} ({price_change:+.1f}%) | "
                            f"Strategy: {strategy.upper()} | Buy Box: {repricing_result.get('estimated_buybox_chance', 0)}%"
                        )
            except Exception as e:
                logger.error(f"⚠️ Error processing store {st.id}: {e}")
                continue  # Continue with next store
                
        db.commit()
        pending = db.query(Notification, User).join(User, User.id == Notification.user_id).filter(Notification.sent == False).all()
        for n, u in pending:
            send_email(u.email, f"[BuyBox] {n.type}", n.payload_json)
            for row in db.execute(text("SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id=:uid"), {"uid": u.id}):
                send_push(
                    {"endpoint": row[0], "keys": {"p256dh": row[1], "auth": row[2]}},
                    json.loads(n.payload_json)
                )
            n.sent = True
        db.commit()
        
        # Log cycle summary
        end_time = datetime.utcnow()
        duration = (end_time - start_time).total_seconds()
        logger.info("="*80)
        logger.info(f"✅ REPRICING CYCLE COMPLETED in {duration:.1f}s")
        logger.info(f"   📦 Products Processed: {products_processed}")
        logger.info(f"   💰 Products Repriced: {products_repriced}")
        logger.info(f"   🎯 Buy Box Changes: {buybox_changes}")
        logger.info("="*80)
    except Exception as e:
        logger.error(f"❌ Error in repricing cycle: {e}", exc_info=True)
        db.rollback()
    finally:
        db.close()


def start_scheduler():
    sch = BackgroundScheduler(daemon=True)
    sch.add_job(run_cycle, "interval", minutes=10, id="poll-buybox", replace_existing=True)
    sch.start()
    return sch
