"""
Repricing API Endpoints - Simple yet powerful
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from ..database import get_db
from ..models import Product
from ..services.repricing_engine import RepricingEngine

router = APIRouter(prefix="/api/repricing", tags=["repricing"])


class RepricingStrategyUpdate(BaseModel):
    product_ids: List[int]
    strategy: str  # win_buybox, maximize_profit, boost_sales
    enabled: bool = True
    target_margin_percent: Optional[float] = 15.0


class RepricingTestRequest(BaseModel):
    product_id: int


@router.get("/strategies")
async def get_available_strategies(db: Session = Depends(get_db)):
    """
    Get all available repricing strategies
    Simple interface for users
    """
    engine = RepricingEngine(db)
    strategies = engine.get_all_strategies()
    
    return {
        'strategies': strategies,
        'default': 'win_buybox'
    }


@router.post("/set-strategy")
async def set_repricing_strategy(
    request: RepricingStrategyUpdate,
    user_id: int = 2,  # Demo user
    db: Session = Depends(get_db)
):
    """
    Set repricing strategy for products
    One-click strategy selection
    """
    
    if request.strategy not in ['win_buybox', 'maximize_profit', 'boost_sales']:
        raise HTTPException(
            status_code=400,
            detail="Invalid strategy. Choose: win_buybox, maximize_profit, or boost_sales"
        )
    
    # Update products
    updated_count = 0
    for product_id in request.product_ids:
        product = db.query(Product).filter(
            Product.id == product_id,
            Product.user_id == user_id
        ).first()
        
        if product:
            product.repricing_enabled = request.enabled
            product.repricing_strategy = request.strategy
            product.target_margin_percent = request.target_margin_percent
            updated_count += 1
    
    db.commit()
    
    return {
        'success': True,
        'updated_products': updated_count,
        'strategy': request.strategy,
        'message': f'Successfully updated {updated_count} products with {request.strategy} strategy'
    }


@router.post("/test-reprice")
async def test_repricing(
    request: RepricingTestRequest,
    user_id: int = 2,
    db: Session = Depends(get_db)
):
    """
    Test repricing calculation for a product
    Shows what price would be without actually changing it
    """
    
    product = db.query(Product).filter(
        Product.id == request.product_id,
        Product.user_id == user_id
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    engine = RepricingEngine(db)
    result = engine.reprice_product(product, dry_run=True)
    
    return {
        'product_sku': product.sku,
        'current_price': product.price,
        'recommended_price': result['new_price'],
        'should_reprice': result['should_reprice'],
        'reason': result['reason'],
        'estimated_buybox_chance': result['estimated_buybox_chance'],
        'competitor_count': result['competitor_count'],
        'lowest_competitor_price': result.get('lowest_competitor_price'),
        'strategy': product.repricing_strategy
    }


@router.post("/reprice-now")
async def reprice_now(
    user_id: int = 2,
    db: Session = Depends(get_db)
):
    """
    Flash reprice - reprice all active products immediately
    The magic button!
    """
    
    engine = RepricingEngine(db)
    results = engine.reprice_all_active_products(user_id)
    
    return {
        'success': True,
        'total_products': results['total_products'],
        'repriced_count': results['repriced_count'],
        'skipped_count': results['skipped_count'],
        'errors': results['errors'],
        'message': f"Flash reprice completed! Updated {results['repriced_count']} products."
    }


@router.get("/product-status/{product_id}")
async def get_product_repricing_status(
    product_id: int,
    user_id: int = 2,
    db: Session = Depends(get_db)
):
    """
    Get repricing status for a single product
    """
    
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.user_id == user_id
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {
        'product_id': product.id,
        'sku': product.sku,
        'title': product.title,
        'current_price': product.price,
        'min_price': product.min_price,
        'max_price': product.max_price,
        'repricing_enabled': product.repricing_enabled,
        'repricing_strategy': product.repricing_strategy,
        'target_margin_percent': product.target_margin_percent,
        'buybox_owning': product.buybox_owning,
        'competitor_count': product.competitor_count,
        'lowest_competitor_price': product.lowest_competitor_price,
        'last_repriced_at': product.last_repriced_at
    }


@router.get("/dashboard-stats")
async def get_repricing_dashboard_stats(
    user_id: int = 2,
    db: Session = Depends(get_db)
):
    """
    Get repricing statistics for dashboard
    """
    
    # Get all products
    all_products = db.query(Product).filter(Product.user_id == user_id).all()
    active_repricing = [p for p in all_products if p.repricing_enabled]
    buybox_winning = [p for p in all_products if p.buybox_owning]
    
    # Strategy breakdown
    strategy_counts = {}
    for product in active_repricing:
        strategy = product.repricing_strategy
        strategy_counts[strategy] = strategy_counts.get(strategy, 0) + 1
    
    return {
        'total_products': len(all_products),
        'active_repricing': len(active_repricing),
        'buybox_winning': len(buybox_winning),
        'buybox_win_rate': round(len(buybox_winning) / len(all_products) * 100, 1) if all_products else 0,
        'strategy_breakdown': strategy_counts,
        'avg_competitor_count': round(
            sum(p.competitor_count for p in active_repricing) / len(active_repricing), 1
        ) if active_repricing else 0
    }
