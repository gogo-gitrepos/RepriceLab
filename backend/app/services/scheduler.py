from __future__ import annotations
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..database import SessionLocal
from ..models import Product, PriceHistory, CompetitorOffer, Store, PricingRule, Notification, User
from .spapi import SPAPIClient
from .buybox import determine_buybox
from .repricing import eval_max_price, suggest_price
from .notify import send_email, send_push
import json
import asyncio


def _run_async(coro):
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        return asyncio.run(coro)
    fut = asyncio.run_coroutine_threadsafe(coro, loop)
    return fut.result()


def run_cycle():
    db: Session = SessionLocal()
    try:
        stores = db.query(Store).all()
        for st in stores:
            client = SPAPIClient(st.region, st.refresh_token)
            products = db.query(Product).filter(Product.user_id == st.user_id).all()
            for p in products:
                offers = _run_async(client.get_competitive_pricing(p.asin))
                if not offers:
                    continue
                bb = determine_buybox(offers)
                owning = (bb.get("seller_id") == st.selling_partner_id) if bb else False
                if owning != p.buybox_owning:
                    p.buybox_owning = owning
                    p.buybox_owner = bb.get("seller_id") if bb else None
                    db.add(PriceHistory(product_id=p.id, price=p.price, buybox_owning=owning))
                    db.add(Notification(
                        user_id=p.user_id,
                        type=("BUYBOX_GAINED" if owning else "BUYBOX_LOST"),
                        payload_json=json.dumps({"asin": p.asin, "owner": p.buybox_owner}),
                        sent=False
                    ))
                for o in offers:
                    db.add(CompetitorOffer(
                        product_id=p.id,
                        seller_id=o.get("seller_id", ""),
                        price=float(o.get("price", 0.0)),
                        shipping=float(o.get("shipping", 0.0)),
                        is_buybox=bool(o.get("is_buybox", False))
                    ))
                rule = db.query(PricingRule).filter(PricingRule.user_id == p.user_id).first()
                if rule:
                    comp_min = min(
                        ((o.get("price", 0.0) + o.get("shipping", 0.0)) for o in offers if o.get("seller_id") != st.selling_partner_id),
                        default=None
                    )
                    try:
                        max_price = eval_max_price(rule.max_price_formula, p.price)
                    except Exception:
                        max_price = p.price * 1.9
                    new_price = suggest_price(p.price, comp_min, rule.min_price, max_price, rule.strategy)
                    if new_price != p.price:
                        ok = _run_async(client.update_price(p.sku, new_price))
                        if ok:
                            p.price = new_price
                            db.add(Notification(
                                user_id=p.user_id,
                                type="PRICE_CHANGED",
                                payload_json=json.dumps({"asin": p.asin, "new_price": new_price}),
                                sent=False
                            ))
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
    finally:
        db.close()


def start_scheduler():
    sch = BackgroundScheduler(daemon=True)
    sch.add_job(run_cycle, "interval", minutes=10, id="poll-buybox", replace_existing=True)
    sch.start()
    return sch
