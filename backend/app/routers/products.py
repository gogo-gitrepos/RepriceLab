# backend/app/routers/products.py
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, func, and_
from typing import List, Optional
import logging

from ..dependencies import get_db, get_current_user_id
from ..models import Product, Store
from ..services.product_sync import ProductSyncService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/products", tags=["Products"])

# Initialize product sync service
product_sync_service = ProductSyncService()

@router.get("/")
async def list_products(
    user_id: int = Query(2, description="User ID for demo"),
    store_id: Optional[int] = Query(None, description="Filter by store ID"),
    limit: int = Query(50, description="Number of products to return"),
    offset: int = Query(0, description="Offset for pagination"),
    db: Session = Depends(get_db)
):
    """Get list of products for a user, optionally filtered by store"""
    
    current_user_id = user_id
    
    # Get total count for pagination
    total_query = select(func.count(Product.id)).where(Product.user_id == current_user_id)
    if store_id:
        total_query = total_query.where(Product.store_id == store_id)
    total_count = db.execute(total_query).scalar()
    
    # Get products
    query = select(Product).where(Product.user_id == current_user_id)
    
    if store_id:
        query = query.where(Product.store_id == store_id)
    
    query = query.offset(offset).limit(limit)
    
    products = db.execute(query).scalars().all()
    
    product_list = []
    for product in products:
        product_list.append({
            "id": product.id,
            "sku": product.sku,
            "asin": product.asin,
            "title": product.title,
            "marketplace_id": product.marketplace_id,
            "condition_type": product.condition_type,
            "listing_status": product.listing_status,
            "fulfillment_channel": product.fulfillment_channel,
            "price": product.price,
            "currency": product.currency,
            "stock_qty": product.stock_qty,
            "buybox_owning": product.buybox_owning,
            "repricing_enabled": product.repricing_enabled,
            "repricing_strategy": product.repricing_strategy,
            "target_margin_percent": product.target_margin_percent,
            "last_synced_at": product.last_synced_at,
            "sync_status": product.sync_status,
            "created_at": product.created_at,
            "updated_at": product.updated_at,
            "store_id": product.store_id
        })
    
    return {
        "products": product_list,
        "count": len(product_list),
        "total": total_count,
        "offset": offset,
        "limit": limit
    }

@router.get("/{product_id}")
async def get_product(
    product_id: int,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get detailed information for a specific product"""
    
    product = db.execute(
        select(Product).where(
            and_(Product.id == product_id, Product.user_id == current_user_id)
        )
    ).scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {
        "id": product.id,
        "sku": product.sku,
        "asin": product.asin,
        "title": product.title,
        "description": product.description,
        "brand": product.brand,
        "manufacturer": product.manufacturer,
        "product_image_url": product.product_image_url,
        "marketplace_id": product.marketplace_id,
        "product_type": product.product_type,
        "condition_type": product.condition_type,
        "listing_status": product.listing_status,
        "fulfillment_channel": product.fulfillment_channel,
        "price": product.price,
        "currency": product.currency,
        "min_price": product.min_price,
        "max_price": product.max_price,
        "stock_qty": product.stock_qty,
        "buybox_owner": product.buybox_owner,
        "buybox_owning": product.buybox_owning,
        "item_weight": product.item_weight,
        "item_length": product.item_length,
        "item_width": product.item_width,
        "item_height": product.item_height,
        "repricing_enabled": product.repricing_enabled,
        "last_repriced_at": product.last_repriced_at,
        "last_synced_at": product.last_synced_at,
        "sync_status": product.sync_status,
        "sync_error_message": product.sync_error_message,
        "created_at": product.created_at,
        "updated_at": product.updated_at,
        "store_id": product.store_id,
        "user_id": product.user_id
    }

@router.post("/sync/{store_id}")
async def sync_store_products(
    store_id: int,
    sku_list: Optional[List[str]] = None,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Trigger product synchronization for a store"""
    
    # Verify store exists, is active, and belongs to current user
    store = db.execute(
        select(Store).where(
            and_(Store.id == store_id, Store.user_id == current_user_id)
        )
    ).scalar_one_or_none()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    if not store.is_active:
        raise HTTPException(status_code=400, detail="Store is not active")
    
    # Start product synchronization
    sync_result = await product_sync_service.sync_store_products(store_id, sku_list)
    
    if not sync_result["success"]:
        raise HTTPException(status_code=500, detail=sync_result["error"])
    
    return sync_result

@router.get("/sync/status/{store_id}")
async def get_sync_status(
    store_id: int,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get synchronization status for a store"""
    
    # Verify store exists and belongs to current user
    store = db.execute(
        select(Store).where(
            and_(Store.id == store_id, Store.user_id == current_user_id)
        )
    ).scalar_one_or_none()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    status = await product_sync_service.get_sync_status(store_id)
    
    if not status["success"]:
        raise HTTPException(status_code=500, detail=status["error"])
    
    return status

@router.post("/{product_id}/repricing/toggle")
async def toggle_product_repricing(
    product_id: int,
    enabled: bool = Query(..., description="Enable or disable repricing for this product"),
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Enable or disable repricing for a specific product"""
    
    product = db.execute(
        select(Product).where(
            and_(Product.id == product_id, Product.user_id == current_user_id)
        )
    ).scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product.repricing_enabled = enabled
    db.commit()
    
    return {
        "success": True,
        "product_id": product_id,
        "repricing_enabled": enabled,
        "message": f"Repricing {'enabled' if enabled else 'disabled'} for product {product.sku}"
    }

@router.get("/stats/summary")
async def get_products_summary(
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get summary statistics for user's products"""
    
    products = db.execute(
        select(Product).where(Product.user_id == current_user_id)
    ).scalars().all()
    
    total_products = len(products)
    active_products = len([p for p in products if p.listing_status == "active"])
    repricing_enabled = len([p for p in products if p.repricing_enabled])
    buybox_winning = len([p for p in products if p.buybox_owning])
    
    total_value = sum(p.price * p.stock_qty for p in products if p.price and p.stock_qty)
    
    return {
        "total_products": total_products,
        "active_products": active_products,
        "repricing_enabled": repricing_enabled,
        "buybox_winning": buybox_winning,
        "total_inventory_value": round(total_value, 2),
        "buybox_win_rate": round((buybox_winning / total_products * 100) if total_products > 0 else 0, 2),
        "repricing_coverage": round((repricing_enabled / total_products * 100) if total_products > 0 else 0, 2)
    }