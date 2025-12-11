from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import os

from ..database import get_db
from ..models import User
from ..services.password import hash_password

router = APIRouter(prefix="/setup", tags=["setup"])

ADMIN_SETUP_KEY = os.getenv("ADMIN_SETUP_KEY", "")


class SetupAdminRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    setup_key: str


@router.post("/first-admin")
def create_first_admin(request: SetupAdminRequest, db: Session = Depends(get_db)):
    if not ADMIN_SETUP_KEY:
        raise HTTPException(status_code=403, detail="Admin setup not configured")
    
    if request.setup_key != ADMIN_SETUP_KEY:
        raise HTTPException(status_code=403, detail="Invalid setup key")
    
    admin_exists = db.query(User).filter(User.is_admin == True).first()
    if admin_exists:
        raise HTTPException(status_code=400, detail="Admin user already exists")
    
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        existing.is_admin = True
        existing.subscription_plan = "enterprise"
        existing.subscription_status = "active"
        db.commit()
        return {"message": "Existing user promoted to admin", "user_id": existing.id}
    
    new_admin = User(
        email=request.email,
        password_hash=hash_password(request.password),
        name=request.name,
        is_admin=True,
        subscription_plan="enterprise",
        subscription_status="active"
    )
    
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    
    return {"message": "Admin user created", "user_id": new_admin.id}


@router.post("/make-admin")
def make_user_admin(email: str, setup_key: str, db: Session = Depends(get_db)):
    if not ADMIN_SETUP_KEY:
        raise HTTPException(status_code=403, detail="Admin setup not configured")
    
    if setup_key != ADMIN_SETUP_KEY:
        raise HTTPException(status_code=403, detail="Invalid setup key")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_admin = True
    user.subscription_plan = "enterprise"
    user.subscription_status = "active"
    db.commit()
    
    return {"message": f"User {email} is now admin", "user_id": user.id}


@router.get("/make-admin")
def make_user_admin_get(email: str, setup_key: str, db: Session = Depends(get_db)):
    """GET version for easy browser access"""
    current_key = os.getenv("ADMIN_SETUP_KEY", "")
    
    if not current_key:
        raise HTTPException(status_code=403, detail="Admin setup not configured - ADMIN_SETUP_KEY env var is empty")
    
    if setup_key != current_key:
        raise HTTPException(status_code=403, detail=f"Invalid setup key. Expected length: {len(current_key)}, got length: {len(setup_key)}")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_admin = True
    user.subscription_plan = "enterprise"
    user.subscription_status = "active"
    db.commit()
    
    return {"message": f"User {email} is now admin", "user_id": user.id}


@router.get("/emergency-admin-bootstrap-dec2025")
def emergency_admin_bootstrap(token: str, new_password: str = None, db: Session = Depends(get_db)):
    """
    ONE-TIME EMERGENCY ENDPOINT with token verification
    Expires: December 15, 2025
    Optionally sets password if new_password provided
    """
    from datetime import datetime
    
    VALID_TOKEN = "RL2025SecureBootstrap"
    EXPIRY_DATE = datetime(2025, 12, 15, 23, 59, 59)
    
    if datetime.utcnow() > EXPIRY_DATE:
        raise HTTPException(status_code=403, detail="This endpoint has expired")
    
    if token != VALID_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid token")
    
    allowed_emails = ["codexiallc@gmail.com", "repricelab@gmail.com"]
    promoted = []
    password_updated = []
    
    for email in allowed_emails:
        user = db.query(User).filter(User.email == email).first()
        if user:
            if not user.is_admin:
                user.is_admin = True
                user.subscription_plan = "enterprise"
                user.subscription_status = "active"
                promoted.append(email)
            
            if new_password:
                user.password_hash = hash_password(new_password)
                password_updated.append(email)
    
    db.commit()
    
    messages = []
    if promoted:
        messages.append(f"Promoted to admin: {', '.join(promoted)}")
    if password_updated:
        messages.append(f"Password updated for: {', '.join(password_updated)}")
    if not messages:
        messages.append("No changes needed (already admin, password not provided)")
    
    return {"message": " | ".join(messages), "success": True}


