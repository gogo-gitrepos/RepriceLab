# backend/app/routers/spapi_test.py
"""
Test endpoint for SP-API Private App connection
This endpoint helps verify that the self-authorization works correctly.
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import logging

from ..services.amazon_spapi import get_access_token

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/dev/spapi-test", tags=["Development"])

@router.get("/token")
async def test_access_token() -> Dict[str, Any]:
    """
    Test endpoint to verify access token retrieval.
    
    DEV ONLY: This endpoint should not be exposed in production.
    Returns status of token exchange without exposing secrets.
    """
    result = await get_access_token()
    
    if result["success"]:
        return {
            "status": "success",
            "message": "Access token obtained successfully",
            "expires_in": result.get("expires_in"),
            "token_length": len(result.get("access_token", ""))
        }
    else:
        return {
            "status": "error",
            "message": result.get("error", "Unknown error")
        }

@router.get("/marketplace-participations")
async def test_marketplace_participations() -> Dict[str, Any]:
    """
    Test endpoint to call SP-API getMarketplaceParticipations.
    
    This verifies end-to-end SP-API connectivity using the private app credentials.
    """
    # Get access token
    token_result = await get_access_token()
    
    if not token_result["success"]:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get access token: {token_result.get('error')}"
        )
    
    access_token = token_result["access_token"]
    
    # TODO: Make actual SP-API call with access token
    # For now, just confirm token was obtained
    return {
        "status": "success",
        "message": "Access token obtained. SP-API client integration pending.",
        "token_obtained": True
    }
