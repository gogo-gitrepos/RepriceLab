"""
Plan limits configuration and validation service.
Defines feature limits for each subscription tier.
"""
from typing import Dict, Optional, Any
from datetime import datetime

# Plan limits configuration
PLAN_LIMITS = {
    'free': {
        'products': 50,
        'stores': 1,
        'api_calls_per_day': 1000,
        'repricing_frequency_minutes': 60,  # Once per hour
        'features': {
            'advanced_repricing': False,
            'competitor_intelligence': False,
            'api_access': False,
            'custom_automations': False,
            'priority_support': False,
        }
    },
    'plus': {
        'products': 5000,
        'stores': 3,
        'api_calls_per_day': 10000,
        'repricing_frequency_minutes': 10,  # Current default
        'features': {
            'advanced_repricing': True,
            'competitor_intelligence': False,
            'api_access': False,
            'custom_automations': False,
            'priority_support': True,
        }
    },
    'pro': {
        'products': 10000,
        'stores': 10,
        'api_calls_per_day': 50000,
        'repricing_frequency_minutes': 5,  # More aggressive
        'features': {
            'advanced_repricing': True,
            'competitor_intelligence': True,
            'api_access': True,
            'custom_automations': True,
            'priority_support': True,
        }
    },
    'enterprise': {
        'products': None,  # Unlimited
        'stores': None,  # Unlimited
        'api_calls_per_day': None,  # Unlimited
        'repricing_frequency_minutes': 5,
        'features': {
            'advanced_repricing': True,
            'competitor_intelligence': True,
            'api_access': True,
            'custom_automations': True,
            'priority_support': True,
            'white_label': True,
            'dedicated_support': True,
            'custom_development': True,
        }
    }
}

# Stripe Price IDs (to be configured with real Stripe prices)
STRIPE_PRICE_IDS = {
    'plus': {
        'monthly': 'price_plus_monthly',  # Replace with real Stripe Price ID
        'yearly': 'price_plus_yearly'
    },
    'pro': {
        'monthly': 'price_pro_monthly',
        'yearly': 'price_pro_yearly'
    },
    'enterprise': {
        'monthly': 'price_enterprise_monthly',
        'yearly': 'price_enterprise_yearly'
    }
}


class PlanLimitError(Exception):
    """Exception raised when user exceeds plan limits"""
    def __init__(self, message: str, plan: str, limit_type: str, current: int, max_allowed: Optional[int]):
        self.message = message
        self.plan = plan
        self.limit_type = limit_type
        self.current = current
        self.max_allowed = max_allowed
        super().__init__(self.message)


def get_plan_limits(plan: str) -> Dict[str, Any]:
    """Get limits for a specific plan"""
    return PLAN_LIMITS.get(plan, PLAN_LIMITS['free'])


def check_limit(plan: str, limit_type: str, current_count: int) -> bool:
    """
    Check if current usage is within plan limits.
    
    Args:
        plan: User's subscription plan (free, plus, pro, enterprise)
        limit_type: Type of limit to check (products, stores, etc.)
        current_count: Current usage count
        
    Returns:
        True if within limits, False otherwise
    """
    limits = get_plan_limits(plan)
    max_allowed = limits.get(limit_type)
    
    # None means unlimited
    if max_allowed is None:
        return True
    
    return current_count < max_allowed


def validate_limit(plan: str, limit_type: str, current_count: int, increment: int = 1):
    """
    Validate that adding increment won't exceed plan limits.
    Raises PlanLimitError if limit would be exceeded.
    
    Args:
        plan: User's subscription plan
        limit_type: Type of limit to check
        current_count: Current usage count
        increment: How many items will be added (default 1)
        
    Raises:
        PlanLimitError: If adding increment would exceed limit
    """
    limits = get_plan_limits(plan)
    max_allowed = limits.get(limit_type)
    
    # None means unlimited - always allow
    if max_allowed is None:
        return
    
    new_count = current_count + increment
    
    if new_count > max_allowed:
        raise PlanLimitError(
            f"Adding {increment} {limit_type} would exceed your {plan.title()} plan limit of {max_allowed}. "
            f"You currently have {current_count}/{max_allowed} {limit_type}. Upgrade to add more.",
            plan=plan,
            limit_type=limit_type,
            current=current_count,
            max_allowed=max_allowed
        )


def has_feature_access(plan: str, feature: str) -> bool:
    """
    Check if plan has access to a specific feature.
    
    Args:
        plan: User's subscription plan
        feature: Feature name to check
        
    Returns:
        True if plan has access, False otherwise
    """
    limits = get_plan_limits(plan)
    features = limits.get('features', {})
    return features.get(feature, False)


def is_trial_expired(trial_ends_at: Optional[datetime]) -> bool:
    """Check if user's trial period has expired"""
    if trial_ends_at is None:
        return False
    return datetime.utcnow() > trial_ends_at


def can_access_service(subscription_status: str, trial_ends_at: Optional[datetime]) -> bool:
    """
    Check if user can access the service based on subscription status.
    
    Args:
        subscription_status: User's subscription status
        trial_ends_at: Trial expiration date
        
    Returns:
        True if user can access service, False otherwise
    """
    # Active subscriptions have full access
    if subscription_status == 'active':
        return True
    
    # Trial users have access if trial not expired
    if subscription_status == 'trial':
        return not is_trial_expired(trial_ends_at)
    
    # Past due might still have grace period access (configurable)
    if subscription_status == 'past_due':
        return True  # Give grace period
    
    # Canceled, incomplete, or other statuses - no access
    return False


def get_usage_percentage(current: int, max_allowed: Optional[int]) -> float:
    """Calculate usage percentage (0-100)"""
    if max_allowed is None:  # Unlimited
        return 0.0
    if max_allowed == 0:
        return 100.0
    return min(100.0, (current / max_allowed) * 100)


def should_show_upgrade_prompt(current: int, max_allowed: Optional[int], threshold: float = 80.0) -> bool:
    """Determine if upgrade prompt should be shown based on usage threshold"""
    if max_allowed is None:  # Unlimited plan
        return False
    usage_pct = get_usage_percentage(current, max_allowed)
    return usage_pct >= threshold
