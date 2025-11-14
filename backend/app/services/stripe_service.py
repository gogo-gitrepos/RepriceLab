"""
Stripe integration service for subscription management.
Handles checkout sessions, customer creation, and subscription management.
"""
import stripe
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from ..config import settings
from ..models import User

# Initialize Stripe with API key
stripe.api_key = settings.stripe_secret_key


class StripeService:
    """Service for managing Stripe subscriptions and payments"""
    
    @staticmethod
    def create_checkout_session(
        user: User,
        price_id: str,
        success_url: str,
        cancel_url: str,
        db: Session
    ) -> Dict[str, Any]:
        """
        Create a Stripe checkout session for subscription.
        
        Args:
            user: User object
            price_id: Stripe Price ID for the selected plan
            success_url: URL to redirect after successful payment
            cancel_url: URL to redirect if user cancels
            db: Database session
            
        Returns:
            Dictionary with checkout session details including url
        """
        # Get or create Stripe customer
        customer_id = user.stripe_customer_id
        
        if not customer_id:
            customer = stripe.Customer.create(
                email=user.email,
                name=user.name,
                metadata={'user_id': user.id}
            )
            customer_id = customer.id
            
            # Save customer ID to user
            user.stripe_customer_id = customer_id
            db.commit()
        
        # Create checkout session
        session = stripe.checkout.Session.create(
            customer=customer_id,
            mode='subscription',
            payment_method_types=['card'],
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            success_url=success_url + '?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=cancel_url,
            allow_promotion_codes=True,
            billing_address_collection='auto',
            metadata={
                'user_id': user.id
            }
        )
        
        return {
            'session_id': session.id,
            'url': session.url
        }
    
    @staticmethod
    def create_customer_portal_session(user: User, return_url: str) -> Dict[str, Any]:
        """
        Create a Stripe customer portal session for subscription management.
        Users can update payment methods, view invoices, and cancel subscriptions.
        
        Args:
            user: User object
            return_url: URL to redirect back to after portal session
            
        Returns:
            Dictionary with portal session url
        """
        if not user.stripe_customer_id:
            raise ValueError("User does not have a Stripe customer ID")
        
        session = stripe.billing_portal.Session.create(
            customer=user.stripe_customer_id,
            return_url=return_url
        )
        
        return {
            'url': session.url
        }
    
    @staticmethod
    def cancel_subscription(subscription_id: str) -> Dict[str, Any]:
        """
        Cancel a Stripe subscription at period end.
        
        Args:
            subscription_id: Stripe Subscription ID
            
        Returns:
            Dictionary with cancellation details
        """
        subscription = stripe.Subscription.modify(
            subscription_id,
            cancel_at_period_end=True
        )
        
        return {
            'success': True,
            'cancel_at': datetime.fromtimestamp(subscription.current_period_end).isoformat()
        }
    
    @staticmethod
    def handle_subscription_created(subscription: Dict[str, Any], db: Session):
        """
        Handle subscription.created webhook event.
        Updates user subscription status when a new subscription is created.
        """
        customer_id = subscription['customer']
        subscription_id = subscription['id']
        status = subscription['status']
        current_period_end = datetime.fromtimestamp(subscription['current_period_end'])
        
        # Find user by Stripe customer ID
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if not user:
            print(f"⚠️ User not found for Stripe customer {customer_id}")
            return
        
        # Determine plan from subscription metadata or price
        plan = 'plus'  # Default, should be determined from price_id
        items = subscription.get('items', {}).get('data', [])
        if items:
            price_id = items[0]['price']['id']
            # Map price_id to plan (you'll configure this)
            plan = _get_plan_from_price_id(price_id)
        
        # Update user subscription
        user.stripe_subscription_id = subscription_id
        user.subscription_plan = plan
        user.subscription_status = 'active' if status == 'active' else status
        user.subscription_period_end = current_period_end
        user.trial_ends_at = None  # Clear trial when subscription starts
        
        db.commit()
        print(f"✅ Subscription created for user {user.email}: {plan} plan")
    
    @staticmethod
    def handle_subscription_updated(subscription: Dict[str, Any], db: Session):
        """
        Handle subscription.updated webhook event.
        Updates user subscription when plan changes or status changes.
        """
        customer_id = subscription['customer']
        status = subscription['status']
        current_period_end = datetime.fromtimestamp(subscription['current_period_end'])
        
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if not user:
            return
        
        # Determine plan from subscription
        plan = user.subscription_plan  # Keep existing by default
        items = subscription.get('items', {}).get('data', [])
        if items:
            price_id = items[0]['price']['id']
            plan = _get_plan_from_price_id(price_id)
        
        user.subscription_plan = plan
        user.subscription_status = status
        user.subscription_period_end = current_period_end
        
        db.commit()
        print(f"✅ Subscription updated for user {user.email}: {plan} plan, status: {status}")
    
    @staticmethod
    def handle_subscription_deleted(subscription: Dict[str, Any], db: Session):
        """
        Handle subscription.deleted webhook event (cancellation).
        Downgrades user to free plan.
        """
        customer_id = subscription['customer']
        
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if not user:
            return
        
        # Downgrade to free plan
        user.subscription_plan = 'free'
        user.subscription_status = 'canceled'
        user.stripe_subscription_id = None
        user.subscription_period_end = None
        
        db.commit()
        print(f"⚠️ Subscription canceled for user {user.email}, downgraded to free plan")
    
    @staticmethod
    def handle_invoice_payment_succeeded(invoice: Dict[str, Any], db: Session):
        """
        Handle invoice.payment_succeeded webhook event.
        Confirms successful payment and extends subscription period.
        """
        customer_id = invoice['customer']
        subscription_id = invoice.get('subscription')
        
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if not user:
            return
        
        # Update subscription status to active
        user.subscription_status = 'active'
        
        # If this is a subscription invoice, update period end
        if subscription_id:
            subscription = stripe.Subscription.retrieve(subscription_id)
            user.subscription_period_end = datetime.fromtimestamp(subscription['current_period_end'])
        
        db.commit()
        print(f"✅ Payment successful for user {user.email}")
    
    @staticmethod
    def handle_invoice_payment_failed(invoice: Dict[str, Any], db: Session):
        """
        Handle invoice.payment_failed webhook event.
        Marks subscription as past_due.
        """
        customer_id = invoice['customer']
        
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if not user:
            return
        
        # Mark as past due
        user.subscription_status = 'past_due'
        
        db.commit()
        print(f"⚠️ Payment failed for user {user.email}, status: past_due")


def _get_plan_from_price_id(price_id: str) -> str:
    """
    Map Stripe Price ID to internal plan name.
    This should be configured based on your Stripe Price IDs.
    """
    # TODO: Replace with real Stripe Price IDs
    price_to_plan_map = {
        'price_plus_monthly': 'plus',
        'price_plus_yearly': 'plus',
        'price_pro_monthly': 'pro',
        'price_pro_yearly': 'pro',
        'price_enterprise_monthly': 'enterprise',
        'price_enterprise_yearly': 'enterprise',
    }
    
    return price_to_plan_map.get(price_id, 'plus')  # Default to plus


def initialize_trial_for_new_user(user: User, db: Session):
    """
    Initialize 14-day free trial for new users.
    Called during user registration.
    """
    user.subscription_plan = 'free'
    user.subscription_status = 'trial'
    user.trial_ends_at = datetime.utcnow() + timedelta(days=14)
    db.commit()
