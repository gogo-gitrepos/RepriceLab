# backend/app/services/product_sync.py
import asyncio
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
import logging

from ..models import Store, Product, User
from .amazon_spapi import create_spapi_client
from ..database import SessionLocal

logger = logging.getLogger(__name__)

class ProductSyncService:
    """Service for synchronizing products from Amazon SP-API"""
    
    def __init__(self):
        self.rate_limit_delay = 0.2  # 200ms between requests (5 req/sec limit)
    
    async def sync_store_products(self, store_id: int, sku_list: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Sync products for a specific store from Amazon SP-API
        
        Args:
            store_id: Store ID to sync products for
            sku_list: Optional list of specific SKUs to sync. If None, syncs all accessible products
            
        Returns:
            Dict with sync results and statistics
        """
        db = SessionLocal()
        
        try:
            # Get store information
            store = db.execute(select(Store).where(Store.id == store_id)).scalar_one_or_none()
            if not store:
                return {
                    "success": False,
                    "error": f"Store {store_id} not found"
                }
            
            if not store.is_active:
                return {
                    "success": False,
                    "error": f"Store {store_id} is not active"
                }
            
            # Create SP-API client
            spapi_client = create_spapi_client(store.refresh_token, store.region)
            if not spapi_client and sku_list:
                # If specific SKUs were requested but no SP-API client, this is an error
                return {
                    "success": False,
                    "error": "Failed to create SP-API client"
                }
            elif not spapi_client:
                # No SP-API client and no specific SKUs - create demo products
                logger.info(f"SP-API unavailable, creating demo products for store {store.id}")
                demo_products = await self._create_demo_products(db, store)
                return {
                    "success": True,
                    "message": f"Created {len(demo_products)} demo products for testing",
                    "demo_mode": True,
                    "synced_count": len(demo_products),
                    "error_count": 0,
                    "products": demo_products
                }
            
            # Get marketplace IDs
            marketplace_ids = store.marketplace_ids.split(",") if store.marketplace_ids else ["ATVPDKIKX0DER"]
            primary_marketplace = marketplace_ids[0]
            
            sync_results = {
                "success": True,
                "store_id": store_id,
                "store_name": store.store_name,
                "synced_count": 0,
                "error_count": 0,
                "skipped_count": 0,
                "products": [],
                "errors": []
            }
            
            if sku_list:
                # Sync specific SKUs
                for sku in sku_list:
                    try:
                        result = await self._sync_single_product(
                            db, store, spapi_client, sku, primary_marketplace
                        )
                        
                        if result["success"]:
                            sync_results["synced_count"] += 1
                            sync_results["products"].append(result["product"])
                        else:
                            sync_results["error_count"] += 1
                            sync_results["errors"].append({
                                "sku": sku,
                                "error": result["error"]
                            })
                        
                        # Rate limiting
                        await asyncio.sleep(self.rate_limit_delay)
                        
                    except Exception as e:
                        logger.error(f"Error syncing SKU {sku}: {e}")
                        sync_results["error_count"] += 1
                        sync_results["errors"].append({
                            "sku": sku,
                            "error": str(e)
                        })
            else:
                # For demo purposes, create actual demo products that users can see
                # In production, you'd use Reports API to get all seller SKUs
                demo_products = await self._create_demo_products(db, store)
                
                sync_results["synced_count"] = len(demo_products)
                sync_results["products"] = demo_products
                sync_results["message"] = f"Demo sync completed with {len(demo_products)} demo products. In production, would sync all SKUs from Reports API."
            
            # Update store last sync time
            store.last_sync = datetime.utcnow()
            db.commit()
            
            return sync_results
            
        except Exception as e:
            logger.error(f"Error syncing store {store_id}: {e}")
            return {
                "success": False,
                "error": str(e)
            }
        finally:
            db.close()
    
    async def _sync_single_product(
        self, 
        db: Session, 
        store: Store, 
        spapi_client, 
        sku: str, 
        marketplace_id: str
    ) -> Dict[str, Any]:
        """Sync a single product by SKU"""
        try:
            # Get listing from Amazon
            listing_result = await spapi_client.get_seller_listings(
                marketplace_id=marketplace_id,
                seller_id=store.selling_partner_id,
                sku=sku
            )
            
            if not listing_result["success"]:
                return {
                    "success": False,
                    "error": listing_result["error"]
                }
            
            # Parse Amazon listing data
            listing_data = listing_result.get("listing", {})
            product_data = self._parse_amazon_listing(listing_data, store, marketplace_id)
            
            # Check if product already exists
            existing_product = db.execute(
                select(Product).where(
                    Product.sku == sku,
                    Product.store_id == store.id
                )
            ).scalar_one_or_none()
            
            if existing_product:
                # Update existing product
                self._update_product_from_amazon(existing_product, product_data)
                existing_product.last_synced_at = datetime.utcnow()
                existing_product.sync_status = "synced"
                existing_product.sync_error_message = None
                product = existing_product
            else:
                # Create new product
                product = Product(**product_data)
                db.add(product)
            
            db.commit()
            
            return {
                "success": True,
                "product": {
                    "id": product.id,
                    "sku": product.sku,
                    "asin": product.asin,
                    "title": product.title,
                    "price": product.price,
                    "stock_qty": product.stock_qty,
                    "sync_status": product.sync_status
                }
            }
            
        except Exception as e:
            logger.error(f"Error syncing product {sku}: {e}")
            
            # Update sync status for existing product if it exists
            existing_product = db.execute(
                select(Product).where(
                    Product.sku == sku,
                    Product.store_id == store.id
                )
            ).scalar_one_or_none()
            
            if existing_product:
                existing_product.sync_status = "error"
                existing_product.sync_error_message = str(e)
                existing_product.last_synced_at = datetime.utcnow()
                db.commit()
            
            return {
                "success": False,
                "error": str(e)
            }
    
    def _parse_amazon_listing(self, listing_data: Dict, store: Store, marketplace_id: str) -> Dict[str, Any]:
        """Parse Amazon listing data into Product model format"""
        
        # Extract basic product information
        # Note: This is a simplified parser - in production you'd handle all Amazon listing fields
        summaries = listing_data.get("summaries", [{}])
        summary = summaries[0] if summaries else {}
        
        attributes = listing_data.get("attributes", {})
        offers = listing_data.get("offers", [{}])
        offer = offers[0] if offers else {}
        
        fulfillment_availability = listing_data.get("fulfillmentAvailability", [{}])
        fulfillment = fulfillment_availability[0] if fulfillment_availability else {}
        
        return {
            "user_id": store.user_id,
            "store_id": store.id,
            "sku": summary.get("sku", ""),
            "asin": summary.get("asin", ""),
            "title": summary.get("itemName", "Unknown Product"),
            "marketplace_id": marketplace_id,
            "condition_type": summary.get("conditionType", "New"),
            "listing_status": summary.get("status", "active").lower(),
            "product_type": attributes.get("productType", "PRODUCT"),
            "fulfillment_channel": "FBA" if fulfillment.get("fulfillmentChannelCode") == "AMAZON_NA" else "FBM",
            "price": float(offer.get("price", {}).get("amount", 0.0)),
            "currency": offer.get("price", {}).get("currencyCode", "USD"),
            "stock_qty": int(fulfillment.get("quantity", 0)),
            "description": attributes.get("description", ""),
            "brand": attributes.get("brand", ""),
            "last_synced_at": datetime.utcnow(),
            "sync_status": "synced",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    
    def _update_product_from_amazon(self, product: Product, amazon_data: Dict[str, Any]):
        """Update existing product with fresh Amazon data"""
        
        # Update key fields that can change
        product.title = amazon_data.get("title", product.title)
        product.listing_status = amazon_data.get("listing_status", product.listing_status)
        product.price = amazon_data.get("price", product.price)
        product.currency = amazon_data.get("currency", product.currency)
        product.stock_qty = amazon_data.get("stock_qty", product.stock_qty)
        product.fulfillment_channel = amazon_data.get("fulfillment_channel", product.fulfillment_channel)
        product.description = amazon_data.get("description", product.description)
        product.brand = amazon_data.get("brand", product.brand)
        product.updated_at = datetime.utcnow()
    
    async def _get_demo_skus(self, store: Store) -> List[str]:
        """Get demo SKUs for testing - in production, use Reports API"""
        
        # Return some example SKUs for demo purposes
        return [
            "DEMO-SKU-001",
            "DEMO-SKU-002", 
            "DEMO-SKU-003"
        ]
    
    async def get_sync_status(self, store_id: int) -> Dict[str, Any]:
        """Get synchronization status for a store"""
        db = SessionLocal()
        
        try:
            store = db.execute(select(Store).where(Store.id == store_id)).scalar_one_or_none()
            if not store:
                return {
                    "success": False,
                    "error": f"Store {store_id} not found"
                }
            
            # Get product sync statistics
            products = db.execute(
                select(Product).where(Product.store_id == store_id)
            ).scalars().all()
            
            total_products = len(products)
            synced_products = len([p for p in products if p.sync_status == "synced"])
            pending_products = len([p for p in products if p.sync_status == "pending"])
            error_products = len([p for p in products if p.sync_status == "error"])
            
            return {
                "success": True,
                "store_id": store_id,
                "store_name": store.store_name,
                "last_sync": store.last_sync.isoformat() if store.last_sync else None,
                "total_products": total_products,
                "synced_products": synced_products,
                "pending_products": pending_products,
                "error_products": error_products,
                "sync_percentage": round((synced_products / total_products * 100) if total_products > 0 else 0, 2)
            }
            
        except Exception as e:
            logger.error(f"Error getting sync status for store {store_id}: {e}")
            return {
                "success": False,
                "error": str(e)
            }
        finally:
            db.close()
    
    async def _create_demo_products(self, db: Session, store: Store) -> List[Dict[str, Any]]:
        """Create demo products for testing when SP-API is unavailable"""
        
        demo_products_data = [
            {
                "sku": f"DEMO-{store.id}-001",
                "asin": "B08N5WRWNW",
                "title": "Premium Wireless Bluetooth Headphones - Noise Cancelling",
                "description": "High-quality wireless headphones with active noise cancellation technology",
                "brand": "TechPro",
                "price": 89.99,
                "stock_qty": 25,
                "buybox_owning": True,
                "listing_status": "active"
            },
            {
                "sku": f"DEMO-{store.id}-002", 
                "asin": "B07XJ8C8F5",
                "title": "Smart Home WiFi Security Camera - 1080p HD",
                "description": "Indoor/outdoor security camera with night vision and motion detection",
                "brand": "SecureHome",
                "price": 149.99,
                "stock_qty": 12,
                "buybox_owning": False,
                "listing_status": "active"
            },
            {
                "sku": f"DEMO-{store.id}-003",
                "asin": "B09GK7CQFR", 
                "title": "Portable Phone Charger 20000mAh Power Bank",
                "description": "Fast charging portable battery pack with multiple USB ports",
                "brand": "PowerMax",
                "price": 34.99,
                "stock_qty": 45,
                "buybox_owning": True,
                "listing_status": "active"
            },
            {
                "sku": f"DEMO-{store.id}-004",
                "asin": "B08RY8JHQM",
                "title": "USB-C Multi-Port Adapter Hub - 7-in-1",
                "description": "Premium aluminum adapter with HDMI, USB 3.0, and SD card slots",
                "brand": "ConnectPro", 
                "price": 59.99,
                "stock_qty": 8,
                "buybox_owning": False,
                "listing_status": "active"
            },
            {
                "sku": f"DEMO-{store.id}-005",
                "asin": "B07ZPKT4VF",
                "title": "Ergonomic Office Chair - Mesh Back Support",
                "description": "Comfortable office chair with lumbar support and adjustable height",
                "brand": "OfficeComfort",
                "price": 199.99,
                "stock_qty": 3,
                "buybox_owning": True,
                "listing_status": "active"
            }
        ]
        
        created_products = []
        
        for product_data in demo_products_data:
            try:
                # Check if demo product already exists
                existing_product = db.execute(
                    select(Product).where(
                        Product.sku == product_data["sku"],
                        Product.store_id == store.id
                    )
                ).scalar_one_or_none()
                
                if existing_product:
                    # Update existing demo product
                    existing_product.title = product_data["title"]
                    existing_product.price = product_data["price"]
                    existing_product.stock_qty = product_data["stock_qty"]
                    existing_product.buybox_owning = product_data["buybox_owning"]
                    existing_product.listing_status = product_data["listing_status"]
                    existing_product.last_synced_at = datetime.utcnow()
                    existing_product.sync_status = "synced"
                    existing_product.updated_at = datetime.utcnow()
                    product = existing_product
                else:
                    # Create new demo product
                    product = Product(
                        user_id=store.user_id,
                        store_id=store.id,
                        sku=product_data["sku"],
                        asin=product_data["asin"],
                        title=product_data["title"],
                        description=product_data["description"],
                        brand=product_data["brand"],
                        marketplace_id="ATVPDKIKX0DER",  # US marketplace
                        product_type="PRODUCT",
                        condition_type="New",
                        listing_status=product_data["listing_status"],
                        fulfillment_channel="FBA",
                        price=product_data["price"],
                        currency="USD",
                        min_price=product_data["price"] * 0.8,  # 20% below current price
                        max_price=product_data["price"] * 1.5,  # 50% above current price
                        stock_qty=product_data["stock_qty"],
                        buybox_owner="Amazon" if not product_data["buybox_owning"] else None,
                        buybox_owning=product_data["buybox_owning"],
                        repricing_enabled=True,
                        last_synced_at=datetime.utcnow(),
                        sync_status="synced",
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow()
                    )
                    db.add(product)
                
                db.commit()
                
                created_products.append({
                    "id": product.id,
                    "sku": product.sku,
                    "asin": product.asin,
                    "title": product.title,
                    "price": product.price,
                    "stock_qty": product.stock_qty,
                    "buybox_owning": product.buybox_owning,
                    "sync_status": product.sync_status,
                    "status": "created" if not existing_product else "updated"
                })
                
            except Exception as e:
                logger.error(f"Error creating demo product {product_data['sku']}: {e}")
                continue
        
        return created_products