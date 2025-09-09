# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models


router = APIRouter(prefix="/notifications", tags=["notifications"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def list_notifications(db: Session = Depends(get_db)):
    return db.query(models.Notification).all()


@router.post("/subscribe")
def subscribe_push(sub: dict, db: Session = Depends(get_db)):
    ps = models.PushSubscription(
        user_id=1,
        endpoint=sub["endpoint"],
        p256dh=sub["keys"]["p256dh"],
        auth=sub["keys"]["auth"]
    )
    db.add(ps)
    db.commit()
    return {"ok": True}
