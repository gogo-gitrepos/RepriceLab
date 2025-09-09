# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models, schemas
from ..services.spapi import SPAPIClient


router = APIRouter(prefix="/products", tags=["products"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[schemas.ProductOut])
def list_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()


@router.post("/sync")
def sync_products(db: Session = Depends(get_db)):
    # Demo: tek bir kullanıcı, tek bir store varsayıyoruz
    store = db.query(models.Store).first()
    if not store:
        return {"error": "No store configured"}
    client = SPAPIClient(store.region, store.lwa_refresh_token)
    listings = []
    import asyncio
    listings = asyncio.run(client.list_listings())
    for l in listings:
        prod = db.query(models.Product).filter(models.Product.asin == l["asin"]).first()
        if not prod:
            prod = models.Product(user_id=store.user_id, **l)
            db.add(prod)
        else:
            prod.price = l["price"]
            prod.stock_qty = l["stock_qty"]
    db.commit()
    return {"synced": len(listings)}
