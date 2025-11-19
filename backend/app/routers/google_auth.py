from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
import httpx
import os
from datetime import datetime, timedelta
from jose import jwt

from ..database import get_db
from ..models import User
from ..config import settings

router = APIRouter(prefix="/auth/google", tags=["google-auth"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:5000/auth/google/callback")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class GoogleCallbackRequest(BaseModel):
    code: str


def create_access_token(data: dict):
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


@router.get("/login")
async def login_google():
    """
    Initiate Google OAuth flow
    Returns the Google authorization URL for frontend to redirect to
    """
    # Check if public registration is enabled
    if not settings.public_registration_enabled:
        raise HTTPException(
            status_code=503,
            detail="Login is temporarily disabled during system maintenance. Please check back later."
        )
    
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="Google OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET."
        )
    
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}&"
        f"redirect_uri={GOOGLE_REDIRECT_URI}&"
        f"response_type=code&"
        f"scope=openid email profile&"
        f"access_type=offline"
    )
    
    return {"auth_url": google_auth_url}


@router.post("/callback")
async def google_callback(request: GoogleCallbackRequest, db: Session = Depends(get_db)):
    """
    Handle Google OAuth callback
    Exchange authorization code for access token and get user info
    """
    # Check if public registration is enabled
    if not settings.public_registration_enabled:
        raise HTTPException(
            status_code=503,
            detail="Login is temporarily disabled during system maintenance. Please check back later."
        )
    
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="Google OAuth not configured"
        )
    
    try:
        async with httpx.AsyncClient() as client:
            # Exchange code for access token
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": request.code,
                    "client_id": GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_CLIENT_SECRET,
                    "redirect_uri": GOOGLE_REDIRECT_URI,
                    "grant_type": "authorization_code"
                }
            )
            
            if token_response.status_code != 200:
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to exchange authorization code: {token_response.text}"
                )
            
            token_data = token_response.json()
            access_token = token_data["access_token"]
            
            # Get user info from Google
            user_response = await client.get(
                f"https://www.googleapis.com/oauth2/v2/userinfo?access_token={access_token}"
            )
            
            if user_response.status_code != 200:
                raise HTTPException(
                    status_code=400,
                    detail="Failed to get user info from Google"
                )
            
            user_info = user_response.json()
            
            # Find or create user in database
            user = db.query(User).filter(User.google_id == user_info["id"]).first()
            
            if not user:
                # Check if user with this email already exists
                user = db.query(User).filter(User.email == user_info["email"]).first()
                
                if user:
                    # Update existing user with Google info
                    user.google_id = user_info["id"]
                    user.name = user_info.get("name")
                    user.picture = user_info.get("picture")
                else:
                    # Create new user with free trial (14 days)
                    from datetime import datetime, timedelta
                    user = User(
                        email=user_info["email"],
                        google_id=user_info["id"],
                        name=user_info.get("name"),
                        picture=user_info.get("picture"),
                        subscription_plan="free",
                        subscription_status="trial",
                        trial_ends_at=datetime.utcnow() + timedelta(days=14)
                    )
                    db.add(user)
                
                db.commit()
                db.refresh(user)
            
            # Create JWT token
            jwt_payload = {
                "sub": str(user.id),
                "email": user.email,
                "name": user.name,
                "auth_method": "google"
            }
            
            jwt_token = create_access_token(jwt_payload)
            
            return {
                "access_token": jwt_token,
                "token_type": "bearer",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name,
                    "picture": user.picture
                }
            }
    
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=500,
            detail=f"HTTP error occurred: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred: {str(e)}"
        )
