# backend/app/routes/amazon_auth.py
from fastapi import APIRouter, HTTPException, Depends, Query, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import Dict, Any
import secrets
import logging
from datetime import datetime

from ..database import SessionLocal
from ..dependencies import get_current_user_id

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
from ..models import Store, User
from ..services.amazon_spapi import AmazonOAuthFlow, get_spapi_config, create_spapi_client

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth/amazon", tags=["Amazon Authentication"])

# In-memory state storage (in production, use Redis or database)
_oauth_states = {}

@router.get("/connect")
async def initiate_amazon_oauth(
    user_id: int = Query(..., description="User ID to connect store to"),
    db: Session = Depends(get_db)
):
    """Initiate Amazon OAuth flow to connect seller account"""
    
    # Check if user exists
    user = db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get SP-API configuration
    config = get_spapi_config()
    if not all([config["client_id"], config["client_secret"]]):
        raise HTTPException(
            status_code=500, 
            detail="Amazon SP-API not configured. Please contact administrator."
        )
    
    # Generate secure state parameter
    state = secrets.token_urlsafe(32)
    
    # Store state with user context (expires in 10 minutes)
    _oauth_states[state] = {
        "user_id": user_id,
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow().timestamp() + 600  # 10 minutes
    }
    
    # Create OAuth flow
    oauth_flow = AmazonOAuthFlow(
        client_id=config["client_id"],
        client_secret=config["client_secret"],
        redirect_uri=config["redirect_uri"]
    )
    
    # Generate authorization URL
    auth_url = oauth_flow.generate_authorization_url(state)
    
    return {
        "authorization_url": auth_url,
        "state": state,
        "message": "Please complete the authorization on Amazon Seller Central"
    }

@router.get("/callback")
async def amazon_oauth_callback(
    spapi_oauth_code: str = Query(..., description="Authorization code from Amazon"),
    selling_partner_id: str = Query(..., description="Seller Partner ID"),
    state: str = Query(..., description="State parameter for CSRF protection"),
    db: Session = Depends(get_db)
):
    """Handle Amazon OAuth callback and create store connection"""
    
    # Validate state parameter
    if state not in _oauth_states:
        raise HTTPException(status_code=400, detail="Invalid or expired state parameter")
    
    state_data = _oauth_states[state]
    
    # Check if state is expired
    if datetime.utcnow().timestamp() > state_data["expires_at"]:
        del _oauth_states[state]
        raise HTTPException(status_code=400, detail="Authorization session expired")
    
    user_id = state_data["user_id"]
    
    try:
        # Get SP-API configuration
        config = get_spapi_config()
        
        # Create OAuth flow
        oauth_flow = AmazonOAuthFlow(
            client_id=config["client_id"],
            client_secret=config["client_secret"],
            redirect_uri=config["redirect_uri"]
        )
        
        # Exchange code for tokens
        token_result = await oauth_flow.exchange_code_for_tokens(spapi_oauth_code)
        
        if not token_result["success"]:
            raise HTTPException(
                status_code=400, 
                detail=f"Token exchange failed: {token_result['error']}"
            )
        
        refresh_token = token_result["refresh_token"]
        
        # Test the connection
        spapi_client = create_spapi_client(refresh_token)
        if spapi_client:
            test_result = await spapi_client.test_connection()
            if not test_result["success"]:
                logger.warning(f"SP-API test failed: {test_result['message']}")
        
        # Check if store already exists for this seller
        existing_store = db.execute(
            select(Store).where(
                Store.user_id == user_id,
                Store.selling_partner_id == selling_partner_id
            )
        ).scalar_one_or_none()
        
        if existing_store:
            # Update existing store
            existing_store.refresh_token = refresh_token
            existing_store.is_active = True
            existing_store.last_sync = datetime.utcnow()
            store = existing_store
        else:
            # Create new store
            store = Store(
                user_id=user_id,
                selling_partner_id=selling_partner_id,
                refresh_token=refresh_token,
                region="NA",  # Default to North America
                marketplace_ids="ATVPDKIKX0DER",  # US marketplace
                store_name=f"Amazon Store ({selling_partner_id[:8]}...)",
                is_active=True,
                last_sync=datetime.utcnow(),
                created_at=datetime.utcnow()
            )
            db.add(store)
        
        db.commit()
        
        # Clean up state
        del _oauth_states[state]
        
        # Redirect to success page (you can customize this)
        return RedirectResponse(
            url=f"http://localhost:5000/settings?connected=success&store_id={store.id}",
            status_code=302
        )
        
    except Exception as e:
        logger.error(f"Amazon OAuth callback error: {e}")
        db.rollback()
        
        # Clean up state
        if state in _oauth_states:
            del _oauth_states[state]
        
        raise HTTPException(
            status_code=500,
            detail=f"Failed to connect Amazon store: {str(e)}"
        )

@router.post("/disconnect/{store_id}")
async def disconnect_amazon_store(
    store_id: int,
    db: Session = Depends(get_db)
):
    """Disconnect an Amazon store"""
    
    store = db.execute(select(Store).where(Store.id == store_id)).scalar_one_or_none()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    # Mark store as inactive instead of deleting to preserve history
    store.is_active = False
    store.last_sync = datetime.utcnow()
    
    db.commit()
    
    return {
        "success": True,
        "message": "Amazon store disconnected successfully"
    }

@router.get("/stores")
async def get_user_stores(
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get all Amazon stores for a user"""
    
    stores = db.execute(
        select(Store).where(Store.user_id == current_user_id, Store.is_active == True)
    ).scalars().all()
    
    store_list = []
    for store in stores:
        store_list.append({
            "id": store.id,
            "store_name": store.store_name,
            "selling_partner_id": store.selling_partner_id,
            "region": store.region,
            "marketplace_ids": store.marketplace_ids.split(","),
            "last_sync": store.last_sync,
            "created_at": store.created_at,
            "is_active": store.is_active
        })
    
    return {
        "stores": store_list,
        "count": len(store_list)
    }

@router.post("/test-connection/{store_id}")
async def test_store_connection(
    store_id: int,
    db: Session = Depends(get_db)
):
    """Test SP-API connection for a store"""
    
    store = db.execute(select(Store).where(Store.id == store_id)).scalar_one_or_none()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    # Create SP-API client
    spapi_client = create_spapi_client(store.refresh_token, store.region)
    if not spapi_client:
        raise HTTPException(status_code=500, detail="Failed to create SP-API client")
    
    # Test connection
    test_result = await spapi_client.test_connection()
    
    # Update last sync time if successful
    if test_result["success"]:
        store.last_sync = datetime.utcnow()
        db.commit()
    
    return test_result