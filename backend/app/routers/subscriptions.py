"""
Subscription management endpoints for Stripe integration.
Handles checkout, billing portal, plan upgrades, and subscription status.
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import logging

from ..database import get_db
from ..dependencies import get_current_user_id
from ..models import User
from ..services.stripe_service import StripeService
from ..services.plan_limits import PLAN_LIMITS
from ..config import settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])

stripe_service = StripeService()


class CreateCheckoutRequest(BaseModel):
    plan: str
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None


class SubscriptionResponse(BaseModel):
    plan: str
    status: str
    trial_ends_at: Optional[str] = None
    current_period_end: Optional[str] = None
    cancel_at_period_end: bool = False
    limits: dict


@router.post("/create-checkout")
async def create_checkout_session(
    request: CreateCheckoutRequest,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Create a Stripe checkout session for subscription purchase.
    
    Returns checkout URL to redirect user to Stripe payment page.
    """
    try:
        # Get user
        user = db.query(User).filter(User.id == current_user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Validate plan
        if request.plan not in PLAN_LIMITS:
            raise HTTPException(status_code=400, detail=f"Invalid plan: {request.plan}")
        
        # Don't allow downgrade to free plan via checkout
        if request.plan == "free":
            raise HTTPException(
                status_code=400,
                detail="Cannot checkout for free plan. Use cancel endpoint instead."
            )
        
        # Check if user already has this plan
        if user.subscription_plan == request.plan and user.subscription_status == "active":
            raise HTTPException(
                status_code=400,
                detail=f"You already have an active {request.plan} subscription"
            )
        
        # Get Stripe Price ID for the plan from settings
        price_id_map = {
            "plus": settings.stripe_price_id_plus,
            "pro": settings.stripe_price_id_pro,
            "enterprise": settings.stripe_price_id_enterprise
        }
        
        price_id = price_id_map.get(request.plan)
        if not price_id:
            raise HTTPException(
                status_code=500,
                detail=f"Stripe Price ID not configured for plan: {request.plan}"
            )
        
        # Set default URLs if not provided
        success_url = request.success_url or "http://localhost:5000/settings?checkout=success"
        cancel_url = request.cancel_url or "http://localhost:5000/pricing?checkout=cancelled"
        
        # Create checkout session
        result = stripe_service.create_checkout_session(
            user=user,
            price_id=price_id,
            success_url=success_url,
            cancel_url=cancel_url,
            db=db
        )
        
        return {
            "checkout_url": result["url"],
            "session_id": result["session_id"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating checkout session: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create checkout session: {str(e)}"
        )


@router.post("/portal")
async def create_portal_session(
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Create a Stripe customer portal session for managing subscription.
    
    Allows users to update payment method, view invoices, and cancel subscription.
    """
    try:
        # Get user
        user = db.query(User).filter(User.id == current_user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check if user has Stripe customer ID
        if not user.stripe_customer_id:
            raise HTTPException(
                status_code=400,
                detail="No active subscription found. Please subscribe to a plan first."
            )
        
        # Create portal session
        result = stripe_service.create_customer_portal_session(
            user=user,
            return_url="http://localhost:5000/settings"
        )
        
        return {
            "portal_url": result["url"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating portal session: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create portal session: {str(e)}"
        )


@router.post("/cancel")
async def cancel_subscription(
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Cancel current subscription at period end.
    
    User retains access until the current billing period ends,
    then automatically downgrades to free plan.
    """
    try:
        # Get user
        user = db.query(User).filter(User.id == current_user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check if user has active subscription
        if not user.stripe_subscription_id:
            raise HTTPException(
                status_code=400,
                detail="No active subscription found"
            )
        
        # Cancel subscription at period end
        result = stripe_service.cancel_subscription(user.stripe_subscription_id)
        
        return {
            "success": True,
            "message": "Subscription will be cancelled at period end",
            "cancel_at": result.get("cancel_at")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error canceling subscription: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to cancel subscription: {str(e)}"
        )


@router.get("/status", response_model=SubscriptionResponse)
async def get_subscription_status(
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Get current subscription status and limits for the user.
    """
    try:
        # Get user
        user = db.query(User).filter(User.id == current_user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get plan limits
        plan_config = PLAN_LIMITS.get(user.subscription_plan, PLAN_LIMITS["free"])
        
        return SubscriptionResponse(
            plan=user.subscription_plan,
            status=user.subscription_status,
            trial_ends_at=user.trial_ends_at.isoformat() if user.trial_ends_at else None,
            current_period_end=None,  # TODO: Fetch from Stripe if needed
            cancel_at_period_end=False,  # TODO: Fetch from Stripe if needed
            limits={
                "products": {
                    "max": plan_config["products"],
                    "unlimited": plan_config["products"] == -1
                },
                "stores": {
                    "max": plan_config["stores"],
                    "unlimited": plan_config["stores"] == -1
                }
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting subscription status: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get subscription status: {str(e)}"
        )


@router.get("/plans")
async def list_available_plans():
    """
    List all available subscription plans with their limits.
    """
    plans = []
    
    for plan_name, config in PLAN_LIMITS.items():
        plans.append({
            "name": plan_name,
            "display_name": plan_name.capitalize(),
            "limits": {
                "products": config["products"],
                "stores": config["stores"]
            },
            "features": config.get("features", [])
        })
    
    return {
        "plans": plans
    }
