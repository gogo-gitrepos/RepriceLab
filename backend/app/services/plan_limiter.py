"""
Plan limiting decorator and dependency for FastAPI endpoints.
Automatically checks plan limits before allowing operations.
"""
from functools import wraps
from typing import Callable
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..database import get_db
from ..models import User, Product, Store
from .plan_limits import validate_limit, PlanLimitError


def get_current_user_from_token(db: Session = Depends(get_db)) -> User:
    """
    FastAPI dependency to get current user from JWT token.
    This is a placeholder - you should implement actual JWT verification.
    
    For now, returns first user for testing. In production, decode JWT from header.
    """
    # TODO: Implement JWT token verification
    # token = request.headers.get('Authorization')
    # user_id = decode_jwt(token)
    # return db.query(User).filter(User.id == user_id).first()
    
    # Temporary: Return first user for testing
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


def check_product_limit(db: Session, user: User):
    """
    Check if user can add more products based on their plan.
    
    Raises:
        HTTPException(402): If user has reached product limit for their plan
    """
    # Count user's current products
    current_count = db.query(func.count(Product.id)).join(
        Store, Product.store_id == Store.id
    ).filter(Store.user_id == user.id).scalar()
    
    try:
        validate_limit(
            plan=user.subscription_plan,
            limit_type='products',
            current_count=current_count,
            increment=1
        )
    except PlanLimitError as e:
        raise HTTPException(
            status_code=402,  # Payment Required
            detail={
                'error': 'plan_limit_exceeded',
                'message': e.message,
                'current_plan': e.plan,
                'limit_type': e.limit_type,
                'current_usage': e.current,
                'max_allowed': e.max_allowed,
                'upgrade_required': True
            }
        )


def check_store_limit(db: Session, user: User):
    """
    Check if user can add more stores based on their plan.
    
    Raises:
        HTTPException(402): If user has reached store limit for their plan
    """
    # Count user's current stores
    current_count = db.query(func.count(Store.id)).filter(
        Store.user_id == user.id
    ).scalar()
    
    try:
        validate_limit(
            plan=user.subscription_plan,
            limit_type='stores',
            current_count=current_count,
            increment=1
        )
    except PlanLimitError as e:
        raise HTTPException(
            status_code=402,
            detail={
                'error': 'plan_limit_exceeded',
                'message': e.message,
                'current_plan': e.plan,
                'limit_type': e.limit_type,
                'current_usage': e.current,
                'max_allowed': e.max_allowed,
                'upgrade_required': True
            }
        )


def require_plan_limit(limit_type: str):
    """
    Decorator factory for checking plan limits on endpoints.
    
    Usage:
        @router.post("/products")
        @require_plan_limit('products')
        def create_product(...):
            ...
    
    Args:
        limit_type: Type of limit to check (products, stores, etc.)
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Extract db and user from kwargs (FastAPI dependencies)
            db = kwargs.get('db')
            user = kwargs.get('current_user')
            
            if not db or not user:
                raise HTTPException(
                    status_code=500,
                    detail="Missing db or user dependency"
                )
            
            # Check the specified limit
            if limit_type == 'products':
                check_product_limit(db, user)
            elif limit_type == 'stores':
                check_store_limit(db, user)
            else:
                raise ValueError(f"Unknown limit type: {limit_type}")
            
            # If check passes, call original function
            return await func(*args, **kwargs)
        
        return wrapper
    return decorator


# FastAPI Dependencies for easy use in route definitions

def require_product_limit(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """
    FastAPI dependency to check product limit before endpoint execution.
    
    Usage:
        @router.post("/products")
        def create_product(
            _limit_check = Depends(require_product_limit),
            db: Session = Depends(get_db)
        ):
            ...
    """
    check_product_limit(db, current_user)
    return True


def require_store_limit(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """
    FastAPI dependency to check store limit before endpoint execution.
    
    Usage:
        @router.post("/stores")
        def add_store(
            _limit_check = Depends(require_store_limit),
            db: Session = Depends(get_db)
        ):
            ...
    """
    check_store_limit(db, current_user)
    return True
