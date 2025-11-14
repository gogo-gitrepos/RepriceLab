"""
Stripe webhook endpoint for handling subscription events.
"""
from fastapi import APIRouter, Request, HTTPException, Depends, Header
from sqlalchemy.orm import Session
import stripe

from ..database import get_db
from ..config import settings
from ..services.stripe_service import StripeService

router = APIRouter(prefix="/stripe", tags=["stripe"])


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias="stripe-signature"),
    db: Session = Depends(get_db)
):
    """
    Handle Stripe webhook events.
    
    Critical security: Verifies webhook signature before processing.
    Handles subscription lifecycle events:
    - customer.subscription.created
    - customer.subscription.updated
    - customer.subscription.deleted
    - invoice.payment_succeeded
    - invoice.payment_failed
    """
    # Get raw body (required for signature verification)
    payload = await request.body()
    
    # Verify webhook signature
    if not settings.stripe_webhook_secret:
        # In development without webhook secret, allow unverified webhooks
        # WARNING: Never do this in production!
        try:
            event = stripe.Event.construct_from(
                stripe.util.convert_to_dict(payload), 
                stripe.api_key
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid payload: {str(e)}")
    else:
        # Production: Verify signature
        try:
            event = stripe.Webhook.construct_event(
                payload,
                stripe_signature,
                settings.stripe_webhook_secret
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Handle different event types
    event_type = event['type']
    event_data = event['data']['object']
    
    try:
        if event_type == 'customer.subscription.created':
            StripeService.handle_subscription_created(event_data, db)
        
        elif event_type == 'customer.subscription.updated':
            StripeService.handle_subscription_updated(event_data, db)
        
        elif event_type == 'customer.subscription.deleted':
            StripeService.handle_subscription_deleted(event_data, db)
        
        elif event_type == 'invoice.payment_succeeded':
            StripeService.handle_invoice_payment_succeeded(event_data, db)
        
        elif event_type == 'invoice.payment_failed':
            StripeService.handle_invoice_payment_failed(event_data, db)
        
        else:
            # Unhandled event type - log it but don't fail
            print(f"ℹ️ Unhandled Stripe webhook event: {event_type}")
    
    except Exception as e:
        # Log error but still return 200 to Stripe
        # (prevents Stripe from retrying failed webhooks repeatedly)
        print(f"❌ Error processing webhook {event_type}: {str(e)}")
        # In production, you'd want to log this to monitoring service
    
    # Always return 200 to acknowledge receipt
    return {"status": "success"}
