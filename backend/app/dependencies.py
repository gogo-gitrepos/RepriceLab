# backend/app/dependencies.py
from fastapi import HTTPException, Depends, Header
from sqlalchemy.orm import Session
from typing import Optional
from .database import SessionLocal
from .models import User

def get_db():
    """Database dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current authenticated user from authorization header.
    In production, this would validate JWT tokens.
    For now, we'll use a demo user for development.
    """
    # TODO: In production, implement proper JWT token validation
    # For now, return a demo user for development/testing
    user = db.query(User).filter(User.id == 2).first()
    if not user:
        # Create demo user if not exists
        user = User(id=2, email="demo@example.com")
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return user

def get_current_user_id(current_user: User = Depends(get_current_user)) -> int:
    """Get current user ID"""
    return current_user.id