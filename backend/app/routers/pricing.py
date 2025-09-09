# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models, schemas
from ..services.repricing import eval_max_price, suggest_price


router = APIRouter(prefix="/pricing", tags=["pricing"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/rule")
def set_rule(rule: schemas.PricingRuleIn, db: Session = Depends(get_db)):
    # Demo: tek kullanıcı varsayımı
    r = models.PricingRule(
        user_id=1,
        min_price=rule.min_price,
        max_price_formula=rule.max_price_formula,
        strategy=rule.strategy
    )
    db.add(r)
    db.commit()
    return {"ok": True}


@router.get("/preview/{asin}", response_model=schemas.PricingPreview)
def preview(asin: str, db: Session = Depends(get_db)):
    p = db.query(models.Product).filter(models.Product.asin == asin).first()
    if not p:
        return {"error": "Not found"}
    comp_min = 10.0
    max_price = eval_max_price("current_price * 1.9", p.price)
    newp = suggest_price(p.price, comp_min, 7.0, max_price, "aggressive")
    return schemas.PricingPreview(
        asin=p.asin,
        current_price=p.price,
        competitor_min=comp_min,
        min_price=7.0,
        max_price=max_price,
        suggested_price=newp,
    )
