"""
RepriceLab Advanced Repricing Engine
Premium yet simple - The best algorithm for Buy Box domination
"""

from datetime import datetime, timedelta
from typing import List, Dict, Optional, Sequence, Any
from sqlalchemy.orm import Session
from ..models import Product, CompetitorOffer, PriceHistory
import logging

logger = logging.getLogger(__name__)


class RepricingEngine:
    """
    Advanced repricing engine with 3 simple strategies:
    1. Win Buy Box - Aggressive Buy Box winning
    2. Maximize Profit - Balance between profit and Buy Box
    3. Boost Sales - Sales velocity optimization
    """
    
    # Amazon Buy Box algorithm weights (based on 2025 research)
    BUYBOX_WEIGHTS = {
        'price': 0.25,  # Price weight in Buy Box algorithm
        'seller_rating': 0.40,  # Seller performance weight
        'fulfillment': 0.35  # Fulfillment method weight
    }
    
    # Strategy configurations
    STRATEGIES = {
        'win_buybox': {
            'name': 'Win Buy Box',
            'description': 'Aggressively win Buy Box with smart pricing',
            'price_below_competitor': 0.01,  # $0.01 below lowest
            'buybox_focus': True,
            'profit_threshold': 5.0  # Minimum 5% profit
        },
        'maximize_profit': {
            'name': 'Maximize Profit',
            'description': 'Balance profit margins with Buy Box wins',
            'price_below_competitor': 0.05,  # More margin
            'buybox_focus': True,
            'profit_threshold': 15.0  # Minimum 15% profit
        },
        'boost_sales': {
            'name': 'Boost Sales',
            'description': 'Drive high sales velocity',
            'price_below_competitor': 0.10,  # Even more aggressive
            'buybox_focus': True,
            'profit_threshold': 8.0  # Minimum 8% profit
        }
    }
    
    def __init__(self, db: Session):
        self.db = db
    
    def calculate_optimal_price(
        self,
        product: Product,
        competitors: Sequence[Any],
        strategy: str = 'win_buybox'
    ) -> Dict:
        """
        Calculate optimal price based on strategy and market conditions
        
        Returns dict with:
        - new_price: Recommended price
        - should_reprice: Whether to update price
        - reason: Explanation of pricing decision
        - estimated_buybox_chance: % chance of winning Buy Box
        """
        
        strategy_config = self.STRATEGIES.get(strategy, self.STRATEGIES['win_buybox'])
        
        # Get current competitors
        if not competitors:
            return {
                'new_price': product.price,
                'should_reprice': False,
                'reason': 'No competitors found',
                'estimated_buybox_chance': 100
            }
        
        # Find lowest competitor price (including shipping)
        buybox_competitor = next((c for c in competitors if c.is_buybox), None)
        lowest_competitor = min(competitors, key=lambda c: c.price + c.shipping)
        lowest_total_price = lowest_competitor.price + lowest_competitor.shipping
        
        # Use configured min/max prices, with cost-based fallbacks independent of current price
        # Critical: Never use current price as floor - it traps discounted products
        if product.min_price:
            min_safe_price = product.min_price
        else:
            # Fallback: Estimate cost at 60% of lowest competitor (conservative)
            estimated_cost = lowest_total_price * 0.6
            min_safe_price = estimated_cost
        
        if product.max_price:
            max_safe_price = product.max_price
        else:
            # Fallback: Allow up to 2x lowest competitor for premium positioning
            max_safe_price = lowest_total_price * 2.0
        
        # Apply strategy logic
        if strategy == 'win_buybox':
            # Most aggressive - aim to beat Buy Box holder
            if buybox_competitor:
                target_price = (buybox_competitor.price + buybox_competitor.shipping) - 0.01
            else:
                target_price = lowest_total_price - 0.01
            
            reason = f"Win Buy Box: Target ${target_price:.2f} (${0.01} below competitor)"
            
        elif strategy == 'maximize_profit':
            # Balance profit and Buy Box - stay competitive but protect margins
            target_margin = product.target_margin_percent or 15.0
            cost_based_price = min_safe_price * (1 + target_margin / 100)
            
            # Choose higher of margin-based or competitive price
            if cost_based_price < lowest_total_price:
                target_price = min(cost_based_price * 1.05, lowest_total_price - 0.05)
                reason = f"Maximize Profit: ${target_price:.2f} (protected {target_margin}% margin)"
            else:
                target_price = lowest_total_price - 0.05
                reason = f"Maximize Profit: ${target_price:.2f} (competitive with margin protection)"
        
        else:  # boost_sales
            # Most aggressive for velocity
            target_price = lowest_total_price - 0.10
            reason = f"Boost Sales: ${target_price:.2f} (${0.10} below to drive volume)"
        
        # Apply safety limits
        target_price = max(min_safe_price, min(target_price, max_safe_price))
        
        # Estimate Buy Box win chance
        price_competitiveness = self._calculate_price_competitiveness(
            target_price,
            lowest_total_price,
            buybox_competitor.price if buybox_competitor else lowest_total_price
        )
        
        # Buy Box chance: 25% from price + assumed 75% from fulfillment/ratings
        estimated_chance = min(100, price_competitiveness * 25 + 70)
        
        # Decide if repricing is needed
        price_difference = abs(product.price - target_price)
        should_reprice = price_difference >= 0.05  # Reprice if $0.05+ difference
        
        return {
            'new_price': round(target_price, 2),
            'should_reprice': should_reprice,
            'reason': reason,
            'estimated_buybox_chance': int(estimated_chance),
            'competitor_count': len(competitors),
            'lowest_competitor_price': lowest_total_price
        }
    
    def _calculate_price_competitiveness(
        self,
        our_price: float,
        lowest_price: float,
        buybox_price: float
    ) -> float:
        """
        Calculate how competitive our price is (0-100 scale)
        100 = best price, 0 = not competitive
        """
        if our_price <= lowest_price:
            return 100.0
        
        price_gap = our_price - lowest_price
        competitiveness = max(0, 100 - (price_gap / lowest_price * 100))
        
        return competitiveness
    
    def reprice_product(self, product: Product, dry_run: bool = False) -> Dict:
        """
        Execute repricing for a single product
        
        Args:
            product: Product to reprice
            dry_run: If True, only calculate without updating
        
        Returns:
            Dict with repricing results
        """
        
        # Get recent competitor data (last 15 minutes)
        recent_time = datetime.utcnow() - timedelta(minutes=15)
        competitors = self.db.query(CompetitorOffer).filter(
            CompetitorOffer.product_id == product.id,
            CompetitorOffer.ts >= recent_time
        ).all()
        
        # If no CompetitorOffer data, create mock competitor from product data
        if not competitors and product.lowest_competitor_price:
            # Create a mock competitor for calculation purposes
            mock_competitor = type('obj', (object,), {
                'price': product.lowest_competitor_price,
                'shipping': 0.0,
                'is_buybox': True,
                'seller_name': 'Competitor'
            })()
            competitors = [mock_competitor]
        
        # Calculate optimal price
        result = self.calculate_optimal_price(
            product,
            competitors,
            product.repricing_strategy
        )
        
        if result['should_reprice'] and not dry_run:
            old_price = product.price
            product.price = result['new_price']
            product.last_repriced_at = datetime.utcnow()
            product.competitor_count = result['competitor_count']
            product.lowest_competitor_price = result['lowest_competitor_price']
            
            # Log price history
            price_history = PriceHistory(
                product_id=product.id,
                price=result['new_price'],
                buybox_owning=product.buybox_owning,
                ts=datetime.utcnow()
            )
            self.db.add(price_history)
            self.db.commit()
            
            logger.info(
                f"Repriced product {product.sku}: ${old_price:.2f} → ${result['new_price']:.2f}"
                f" | Strategy: {product.repricing_strategy} | Buy Box chance: {result['estimated_buybox_chance']}%"
            )
        
        return result
    
    def reprice_all_active_products(self, user_id: int) -> Dict:
        """
        Reprice all active products for a user
        Flash reprice execution
        """
        products = self.db.query(Product).filter(
            Product.user_id == user_id,
            Product.repricing_enabled == True
        ).all()
        
        results = {
            'total_products': len(products),
            'repriced_count': 0,
            'skipped_count': 0,
            'errors': []
        }
        
        for product in products:
            try:
                result = self.reprice_product(product)
                if result['should_reprice']:
                    results['repriced_count'] += 1
                else:
                    results['skipped_count'] += 1
            except Exception as e:
                logger.error(f"Error repricing product {product.sku}: {str(e)}")
                results['errors'].append({
                    'sku': product.sku,
                    'error': str(e)
                })
        
        return results
    
    def get_strategy_info(self, strategy_key: str) -> Dict:
        """Get human-readable strategy information"""
        return self.STRATEGIES.get(strategy_key, self.STRATEGIES['win_buybox'])
    
    def get_all_strategies(self) -> List[Dict]:
        """Get all available strategies"""
        return [
            {
                'key': key,
                **config
            }
            for key, config in self.STRATEGIES.items()
        ]
