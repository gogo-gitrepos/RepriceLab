# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models, schemas


router = APIRouter(prefix="/metrics", tags=["metrics"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/summary", response_model=schemas.MetricsSummary)
def summary(db: Session = Depends(get_db)):
    total = db.query(models.Product).count()
    owned = db.query(models.Product).filter(models.Product.buybox_owning == True).count()
    pct = (owned / total * 100.0) if total else 0.0
    return schemas.MetricsSummary(total_products=total, buybox_ownership_pct=pct, last7days_ownership=[])
