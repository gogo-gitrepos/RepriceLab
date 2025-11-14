# backend/app/dependencies.py
from fastapi import HTTPException, Depends, Header, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional
from .database import SessionLocal
from .models import User
from .services.jwt_token import verify_token
from .config import settings

# OAuth2 scheme for bearer token extraction (absolute path required)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def get_db():
    """Database dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current authenticated user from JWT token.
    Validates the bearer token and returns the authenticated user.
    
    Production (default): Requires valid JWT token, returns 401 if missing.
    Development: Set DEVELOPMENT_MODE=true in env to enable demo user fallback.
    """
    # If no token and no Authorization header, check development mode
    if not token and not authorization:
        if settings.development_mode:
            # Development fallback: return demo user
            user = db.query(User).filter(User.id == 2).first()
            if not user:
                # Create demo user if not exists
                user = User(id=2, email="demo@example.com", name="Demo User")
                db.add(user)
                db.commit()
                db.refresh(user)
            return user
        else:
            # Production: require authentication
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    # If Authorization header exists but token is invalid/missing, reject
    if authorization and not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header format",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Validate JWT token
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Guard against JWT decode errors
    try:
        payload = verify_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Extract user ID from token payload
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Fetch user from database
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

def get_current_user_id(current_user: User = Depends(get_current_user)) -> int:
    """Get current user ID"""
    return current_user.id