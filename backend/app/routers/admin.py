from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta

from ..database import get_db
from ..models import PriceHistory, Product, Store, Notification

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/scheduler/status")
def get_scheduler_status(db: Session = Depends(get_db)):
    """Get scheduler status and recent activity"""
    
    # Get last 24 hours statistics
    last_24h = datetime.utcnow() - timedelta(hours=24)
    
    # Recent price changes
    recent_price_changes = db.query(PriceHistory).filter(
        PriceHistory.ts >= last_24h
    ).count()
    
    # Recent notifications (just count all unsent)
    recent_notifications = db.query(Notification).filter(
        Notification.sent == False
    ).count()
    
    # Last price change
    last_price_change = db.query(PriceHistory).order_by(
        desc(PriceHistory.ts)
    ).first()
    
    # Buy Box statistics
    total_products = db.query(Product).count()
    buybox_owned = db.query(Product).filter(Product.buybox_owning == True).count()
    
    # Active products with repricing enabled
    repricing_active = db.query(Product).filter(
        Product.repricing_enabled == True
    ).count()
    
    # Strategy breakdown
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


@router.get("/scheduler/history")
def get_scheduler_history(limit: int = 50, db: Session = Depends(get_db)):
    """Get recent repricing history"""
    
    price_changes = db.query(PriceHistory).order_by(
        desc(PriceHistory.ts)
    ).limit(limit).all()
    
    return {
        "total": len(price_changes),
        "changes": [
            {
                "product_id": pc.product_id,
                "price": pc.price,
                "buybox_owning": pc.buybox_owning,
                "timestamp": pc.ts
            }
            for pc in price_changes
        ]
    }
