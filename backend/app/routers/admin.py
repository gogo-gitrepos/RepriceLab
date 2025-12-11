from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr
from typing import Optional

from ..database import get_db
from ..models import PriceHistory, Product, Store, Notification, User, ErrorLog
from ..services.admin_auth import get_admin_user
from ..services.password import hash_password

router = APIRouter(prefix="/admin", tags=["admin"])


class CreateAdminRequest(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None


class UpdateUserRequest(BaseModel):
    name: Optional[str] = None
    subscription_plan: Optional[str] = None
    subscription_status: Optional[str] = None
    is_admin: Optional[bool] = None


@router.get("/dashboard")
def get_admin_dashboard(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    last_24h = datetime.utcnow() - timedelta(hours=24)
    last_7d = datetime.utcnow() - timedelta(days=7)
    last_30d = datetime.utcnow() - timedelta(days=30)
    
    total_users = db.query(User).count()
    new_users_24h = db.query(User).filter(User.created_at >= last_24h).count()
    new_users_7d = db.query(User).filter(User.created_at >= last_7d).count()
    new_users_30d = db.query(User).filter(User.created_at >= last_30d).count()
    
    subscriptions = db.query(
        User.subscription_plan, func.count(User.id)
    ).group_by(User.subscription_plan).all()
    
    subscription_statuses = db.query(
        User.subscription_status, func.count(User.id)
    ).group_by(User.subscription_status).all()
    
    total_stores = db.query(Store).count()
    active_stores = db.query(Store).filter(Store.is_active == True).count()
    
    total_products = db.query(Product).count()
    repricing_active = db.query(Product).filter(Product.repricing_enabled == True).count()
    
    total_errors = db.query(ErrorLog).count()
    unresolved_errors = db.query(ErrorLog).filter(ErrorLog.resolved == False).count()
    errors_24h = db.query(ErrorLog).filter(ErrorLog.created_at >= last_24h).count()
    
    recent_price_changes = db.query(PriceHistory).filter(PriceHistory.ts >= last_24h).count()
    
    return {
        "users": {
            "total": total_users,
            "new_24h": new_users_24h,
            "new_7d": new_users_7d,
            "new_30d": new_users_30d
        },
        "subscriptions": {plan: count for plan, count in subscriptions},
        "subscription_statuses": {status: count for status, count in subscription_statuses},
        "stores": {
            "total": total_stores,
            "active": active_stores
        },
        "products": {
            "total": total_products,
            "repricing_active": repricing_active
        },
        "errors": {
            "total": total_errors,
            "unresolved": unresolved_errors,
            "last_24h": errors_24h
        },
        "activity": {
            "price_changes_24h": recent_price_changes
        }
    }


@router.get("/users")
def get_all_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    plan: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    query = db.query(User)
    
    if search:
        query = query.filter(
            (User.email.ilike(f"%{search}%")) | 
            (User.name.ilike(f"%{search}%"))
        )
    
    if plan:
        query = query.filter(User.subscription_plan == plan)
    
    if status:
        query = query.filter(User.subscription_status == status)
    
    total = query.count()
    users = query.order_by(desc(User.created_at)).offset((page - 1) * limit).limit(limit).all()
    
    store_counts = db.query(
        Store.user_id, func.count(Store.id)
    ).group_by(Store.user_id).all()
    store_count_map = {user_id: count for user_id, count in store_counts}
    
    product_counts = db.query(
        Product.user_id, func.count(Product.id)
    ).group_by(Product.user_id).all()
    product_count_map = {user_id: count for user_id, count in product_counts}
    
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
        "users": [
            {
                "id": u.id,
                "email": u.email,
                "name": u.name,
                "picture": u.picture,
                "is_admin": u.is_admin,
                "subscription_plan": u.subscription_plan,
                "subscription_status": u.subscription_status,
                "trial_ends_at": u.trial_ends_at,
                "stripe_customer_id": u.stripe_customer_id,
                "created_at": u.created_at,
                "store_count": store_count_map.get(u.id, 0),
                "product_count": product_count_map.get(u.id, 0)
            }
            for u in users
        ]
    }


@router.get("/users/{user_id}")
def get_user_details(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    stores = db.query(Store).filter(Store.user_id == user_id).all()
    products = db.query(Product).filter(Product.user_id == user_id).all()
    errors = db.query(ErrorLog).filter(ErrorLog.user_id == user_id).order_by(desc(ErrorLog.created_at)).limit(20).all()
    
    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "picture": user.picture,
            "is_admin": user.is_admin,
            "google_id": user.google_id is not None,
            "subscription_plan": user.subscription_plan,
            "subscription_status": user.subscription_status,
            "trial_ends_at": user.trial_ends_at,
            "subscription_period_end": user.subscription_period_end,
            "stripe_customer_id": user.stripe_customer_id,
            "stripe_subscription_id": user.stripe_subscription_id,
            "created_at": user.created_at
        },
        "stores": [
            {
                "id": s.id,
                "store_name": s.store_name,
                "region": s.region,
                "is_active": s.is_active,
                "last_sync": s.last_sync,
                "created_at": s.created_at
            }
            for s in stores
        ],
        "products_count": len(products),
        "repricing_enabled_count": sum(1 for p in products if p.repricing_enabled),
        "recent_errors": [
            {
                "id": e.id,
                "error_type": e.error_type,
                "message": e.message,
                "created_at": e.created_at,
                "resolved": e.resolved
            }
            for e in errors
        ]
    }


@router.patch("/users/{user_id}")
def update_user(
    user_id: int,
    request: UpdateUserRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if request.name is not None:
        user.name = request.name
    if request.subscription_plan is not None:
        user.subscription_plan = request.subscription_plan
    if request.subscription_status is not None:
        user.subscription_status = request.subscription_status
    if request.is_admin is not None:
        user.is_admin = request.is_admin
    
    db.commit()
    db.refresh(user)
    
    return {"message": "User updated successfully", "user_id": user.id}


@router.get("/errors")
def get_error_logs(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    error_type: Optional[str] = None,
    resolved: Optional[bool] = None,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    query = db.query(ErrorLog)
    
    if error_type:
        query = query.filter(ErrorLog.error_type == error_type)
    if resolved is not None:
        query = query.filter(ErrorLog.resolved == resolved)
    if user_id:
        query = query.filter(ErrorLog.user_id == user_id)
    
    total = query.count()
    errors = query.order_by(desc(ErrorLog.created_at)).offset((page - 1) * limit).limit(limit).all()
    
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
        "errors": [
            {
                "id": e.id,
                "user_id": e.user_id,
                "error_type": e.error_type,
                "error_code": e.error_code,
                "message": e.message,
                "endpoint": e.endpoint,
                "resolved": e.resolved,
                "created_at": e.created_at
            }
            for e in errors
        ]
    }


@router.get("/errors/{error_id}")
def get_error_details(
    error_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    error = db.query(ErrorLog).filter(ErrorLog.id == error_id).first()
    if not error:
        raise HTTPException(status_code=404, detail="Error not found")
    
    user = None
    if error.user_id:
        user = db.query(User).filter(User.id == error.user_id).first()
    
    return {
        "id": error.id,
        "user": {"id": user.id, "email": user.email, "name": user.name} if user else None,
        "error_type": error.error_type,
        "error_code": error.error_code,
        "message": error.message,
        "stack_trace": error.stack_trace,
        "endpoint": error.endpoint,
        "request_data": error.request_data,
        "resolved": error.resolved,
        "created_at": error.created_at
    }


@router.patch("/errors/{error_id}/resolve")
def resolve_error(
    error_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    error = db.query(ErrorLog).filter(ErrorLog.id == error_id).first()
    if not error:
        raise HTTPException(status_code=404, detail="Error not found")
    
    error.resolved = True
    db.commit()
    
    return {"message": "Error marked as resolved"}


@router.post("/create-admin")
def create_admin_user(
    request: CreateAdminRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if len(request.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    
    new_admin = User(
        email=request.email,
        password_hash=hash_password(request.password),
        name=request.name or request.email.split("@")[0],
        is_admin=True,
        subscription_plan="enterprise",
        subscription_status="active"
    )
    
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    
    return {"message": "Admin user created", "user_id": new_admin.id}


@router.get("/subscriptions")
def get_subscriptions_summary(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    plans = db.query(
        User.subscription_plan, 
        User.subscription_status,
        func.count(User.id)
    ).group_by(User.subscription_plan, User.subscription_status).all()
    
    active_trials = db.query(User).filter(
        User.subscription_status == "trial",
        User.trial_ends_at > datetime.utcnow()
    ).count()
    
    expired_trials = db.query(User).filter(
        User.subscription_status == "trial",
        User.trial_ends_at <= datetime.utcnow()
    ).count()
    
    paying_customers = db.query(User).filter(
        User.subscription_status == "active",
        User.subscription_plan.in_(["plus", "pro", "enterprise"])
    ).count()
    
    return {
        "breakdown": [
            {"plan": plan, "status": status, "count": count}
            for plan, status, count in plans
        ],
        "active_trials": active_trials,
        "expired_trials": expired_trials,
        "paying_customers": paying_customers
    }


@router.get("/scheduler/status")
def get_scheduler_status(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    last_24h = datetime.utcnow() - timedelta(hours=24)
    
    recent_price_changes = db.query(PriceHistory).filter(
        PriceHistory.ts >= last_24h
    ).count()
    
    recent_notifications = db.query(Notification).filter(
        Notification.sent == False
    ).count()
    
    last_price_change = db.query(PriceHistory).order_by(
        desc(PriceHistory.ts)
    ).first()
    
    total_products = db.query(Product).count()
    buybox_owned = db.query(Product).filter(Product.buybox_owning == True).count()
    
    repricing_active = db.query(Product).filter(
        Product.repricing_enabled == True
    ).count()
    
    strategy_stats = db.query(
        Product.repricing_strategy,
        func.count(Product.id)
    ).filter(
        Product.repricing_enabled == True
    ).group_by(Product.repricing_strategy).all()
    
    return {
        "status": "running",
        "cycle_interval_minutes": 10,
        "last_activity": last_price_change.ts if last_price_change else None,
        "statistics_24h": {
            "price_changes": recent_price_changes,
            "notifications": recent_notifications,
            "buybox_ownership_rate": round((buybox_owned / total_products * 100), 1) if total_products > 0 else 0
        },
        "products": {
            "total": total_products,
            "repricing_active": repricing_active,
            "buybox_owned": buybox_owned
        },
        "strategies": {
            strategy: count for strategy, count in strategy_stats
        }
    }
