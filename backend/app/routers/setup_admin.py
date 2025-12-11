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
