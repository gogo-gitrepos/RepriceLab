# backend/app/routes/amazon_auth.py
"""
Amazon Authentication Routes

This module handles Amazon Seller Central OAuth integration.
Users connect their stores via OAuth consent flow.
"""
from fastapi import APIRouter, HTTPException, Depends, Query, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import Dict, Any
import secrets
import logging
import os
from datetime import datetime

from ..database import SessionLocal
from ..dependencies import get_current_user_id

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
from ..models import Store, User, OAuthState
from ..services.amazon_spapi import AmazonOAuthFlow, get_spapi_config, create_spapi_client

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth/amazon", tags=["Amazon Authentication"])

@router.get("/connect")
async def initiate_amazon_oauth(
    user_id: int = Query(..., description="User ID to connect store to"),
    db: Session = Depends(get_db)
):
    """Initiate Amazon OAuth flow to connect seller account"""
    from datetime import timedelta
    from ..models import ErrorLog
    
    logger.info(f"[AMAZON_OAUTH] /connect called for user_id={user_id}")
    
    # Check if user exists
    user = db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()
    if not user:
        logger.error(f"[AMAZON_OAUTH] User not found: user_id={user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    
    logger.info(f"[AMAZON_OAUTH] User found: {user.email}")
    
    # Get SP-API configuration
    config = get_spapi_config()
    logger.info(f"[AMAZON_OAUTH] SP-API config loaded - client_id exists: {bool(config['client_id'])}, redirect_uri: {config['redirect_uri']}")
    
    if not all([config["client_id"], config["client_secret"]]):
        logger.error("[AMAZON_OAUTH] SP-API credentials missing!")
        db.add(ErrorLog(
            user_id=user_id,
            error_type="amazon_error",
            error_code="CONFIG_MISSING",
            message="Amazon SP-API credentials not configured",
            endpoint="/auth/amazon/connect"
        ))
        db.commit()
        raise HTTPException(
            status_code=500, 
            detail="Amazon SP-API not configured. Please contact administrator."
        )
    
    # Generate secure state parameter
    state = secrets.token_urlsafe(32)
    logger.info(f"[AMAZON_OAUTH] Generated state: {state[:15]}...")
    
    # Clean up expired states
    deleted_count = db.query(OAuthState).filter(
        OAuthState.expires_at < datetime.utcnow()
    ).delete(synchronize_session=False)
    if deleted_count > 0:
        logger.info(f"[AMAZON_OAUTH] Cleaned up {deleted_count} expired states")
    
    # Store state in database (expires in 10 minutes)
    oauth_state = OAuthState(
        state=state,
        user_id=user_id,
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )
    db.add(oauth_state)
    db.commit()
    logger.info(f"[AMAZON_OAUTH] State saved to database, expires in 10 minutes")
    
    # Create OAuth flow
    oauth_flow = AmazonOAuthFlow(
        client_id=config["client_id"],
        client_secret=config["client_secret"],
        redirect_uri=config["redirect_uri"]
    )
    
    # Generate authorization URL
    auth_url = oauth_flow.generate_authorization_url(state)
    logger.info(f"[AMAZON_OAUTH] Generated auth URL: {auth_url[:80]}...")
    
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
    from ..models import ErrorLog
    
    logger.info(f"[AMAZON_OAUTH] /callback received - selling_partner_id={selling_partner_id}, state={state[:15]}...")
    logger.info(f"[AMAZON_OAUTH] OAuth code received (length={len(spapi_oauth_code)})")
    
    # Validate state parameter from database
    oauth_state = db.execute(
        select(OAuthState).where(
            OAuthState.state == state,
            OAuthState.used == False
        )
    ).scalar_one_or_none()
    
    if not oauth_state:
        logger.error(f"[AMAZON_OAUTH] FAILED: Invalid or already used OAuth state: {state[:20]}...")
        # Check if state exists but was already used
        existing_state = db.execute(
            select(OAuthState).where(OAuthState.state == state)
        ).scalar_one_or_none()
        if existing_state:
            logger.error(f"[AMAZON_OAUTH] State exists but used={existing_state.used}, expired={datetime.utcnow() > existing_state.expires_at}")
        else:
            logger.error(f"[AMAZON_OAUTH] State not found in database at all!")
        
        db.add(ErrorLog(
            error_type="amazon_error",
            error_code="INVALID_STATE",
            message=f"Invalid or expired OAuth state. State exists: {existing_state is not None}",
            endpoint="/auth/amazon/callback"
        ))
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid or expired state parameter")
    
    logger.info(f"[AMAZON_OAUTH] State valid - user_id={oauth_state.user_id}, created={oauth_state.created_at}")
    
    # Check if state is expired
    if datetime.utcnow() > oauth_state.expires_at:
        logger.error(f"[AMAZON_OAUTH] FAILED: State expired at {oauth_state.expires_at}, now is {datetime.utcnow()}")
        oauth_state.used = True
        db.add(ErrorLog(
            user_id=oauth_state.user_id,
            error_type="amazon_error",
            error_code="STATE_EXPIRED",
            message=f"OAuth state expired. Expired at: {oauth_state.expires_at}",
            endpoint="/auth/amazon/callback"
        ))
        db.commit()
        raise HTTPException(status_code=400, detail="Authorization session expired")
    
    user_id = oauth_state.user_id
    
    # Mark state as used immediately to prevent replay attacks
    oauth_state.used = True
    db.commit()
    logger.info(f"[AMAZON_OAUTH] State marked as used for user_id={user_id}")
    
    try:
        # Get SP-API configuration
        config = get_spapi_config()
        logger.info(f"[AMAZON_OAUTH] Config loaded, exchanging code for tokens...")
        
        # Create OAuth flow
        oauth_flow = AmazonOAuthFlow(
            client_id=config["client_id"],
            client_secret=config["client_secret"],
            redirect_uri=config["redirect_uri"]
        )
        
        # Exchange code for tokens
        token_result = await oauth_flow.exchange_code_for_tokens(spapi_oauth_code)
        
        if not token_result["success"]:
            logger.error(f"[AMAZON_OAUTH] FAILED: Token exchange failed - {token_result['error']}")
            db.add(ErrorLog(
                user_id=user_id,
                error_type="amazon_error",
                error_code="TOKEN_EXCHANGE_FAILED",
                message=f"Token exchange failed: {token_result['error']}",
                endpoint="/auth/amazon/callback"
            ))
            db.commit()
            raise HTTPException(
                status_code=400, 
                detail=f"Token exchange failed: {token_result['error']}"
            )
        
        logger.info(f"[AMAZON_OAUTH] Token exchange successful, got refresh_token (length={len(token_result.get('refresh_token', ''))})")
        refresh_token = token_result["refresh_token"]
        
        # Test the connection (optional, don't fail if this fails)
        try:
            spapi_client = create_spapi_client(refresh_token)
            if spapi_client:
                test_result = await spapi_client.test_connection()
                if not test_result["success"]:
                    logger.warning(f"[AMAZON_OAUTH] SP-API test failed (non-blocking): {test_result.get('message', 'unknown')}")
                else:
                    logger.info(f"[AMAZON_OAUTH] SP-API connection test passed")
        except Exception as test_e:
            logger.warning(f"[AMAZON_OAUTH] SP-API test skipped (AWS creds may not be configured): {test_e}")
        
        # Check if store already exists for this seller
        existing_store = db.execute(
            select(Store).where(
                Store.user_id == user_id,
                Store.selling_partner_id == selling_partner_id
            )
        ).scalar_one_or_none()
        
        if existing_store:
            logger.info(f"[AMAZON_OAUTH] Updating existing store {existing_store.id}")
            existing_store.refresh_token = refresh_token
            existing_store.is_active = True
            existing_store.last_sync = datetime.utcnow()
            store = existing_store
        else:
            logger.info(f"[AMAZON_OAUTH] Creating new store for seller {selling_partner_id}")
            # Check store limit before creating new store
            from ..services.plan_limiter import check_store_limit
            from ..models import User
            
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                check_store_limit(db, user)
            
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
        
        logger.info(f"[AMAZON_OAUTH] SUCCESS: Connected Amazon store {store.id} for user {user_id}")
        
        # Redirect to multichannel page with success message
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5000")
        redirect_url = f"{frontend_url}/multichannel?connected=success&store_id={store.id}"
        logger.info(f"[AMAZON_OAUTH] Redirecting to: {redirect_url}")
        
        return RedirectResponse(url=redirect_url, status_code=302)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[AMAZON_OAUTH] CRITICAL ERROR: {type(e).__name__}: {e}")
        import traceback
        logger.error(f"[AMAZON_OAUTH] Traceback: {traceback.format_exc()}")
        
        db.add(ErrorLog(
            user_id=user_id,
            error_type="amazon_error",
            error_code="CALLBACK_ERROR",
            message=str(e),
            stack_trace=traceback.format_exc(),
            endpoint="/auth/amazon/callback"
        ))
        db.rollback()
        db.commit()  # Commit the error log
        
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