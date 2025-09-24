from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from ..config import settings
from ..database import SessionLocal
from ..models import Store, User
from ..services.spapi import SPAPIClient

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/connect")
def connect_amazon():
    url = SPAPIClient.build_authorization_url(state="repricelab")
    return {"authorize_url": url}

@router.get("/callback")
def auth_callback(code: str, state: str = "repricelab"):
    refresh = SPAPIClient.exchange_code_for_refresh_token(code)
    db = SessionLocal()
    try:
        user = db.query(User).first()
        if not user:
            user = User(email="owner@example.com")
            db.add(user); db.flush()
        store = db.query(Store).filter(Store.user_id == user.id).first()
        if not store:
            store = Store(user_id=user.id, region="NA", selling_partner_id="A1000", marketplace_ids="ATVPDKIKX0DER", lwa_refresh_token=refresh)
            db.add(store)
        else:
            store.lwa_refresh_token = refresh
        db.commit()
    finally:
        db.close()
    target = f"{settings.cors_origins.split(',')[0]}/connect?status=ok"
    return HTMLResponse(f"<html><head><meta http-equiv='refresh' content='0;url={target}'/></head><body>Connected. Redirecting...</body></html>")
