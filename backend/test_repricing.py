#!/usr/bin/env python3
"""
Test script for RepriceLab Repricing Engine
Tests all three strategies with demo products
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal
from app.models import Product, CompetitorOffer
from app.services.repricing_engine import RepricingEngine
from datetime import datetime

def test_repricing_strategies():
    """Test all three repricing strategies"""
    db = SessionLocal()
    
    try:
        print("\n" + "="*80)
        print("🚀 RepriceLab Repricing Engine Test")
        print("="*80)
        
        engine = RepricingEngine(db)
        
        products = db.query(Product).filter(Product.repricing_enabled == True).all()
        
        if not products:
            print("\n❌ No products found with repricing enabled!")
            return
        
        print(f"\n✅ Found {len(products)} products with repricing enabled\n")
        
        for product in products:
            print("-" * 80)
            print(f"\n📦 Product: {product.title[:50]}...")
            print(f"   SKU: {product.sku}")
            print(f"   Current Price: ${product.price:.2f}")
            print(f"   Strategy: {product.repricing_strategy.upper()}")
            print(f"   Lowest Competitor: ${product.lowest_competitor_price:.2f}" if product.lowest_competitor_price else "   No competitor data")
            print(f"   Min Price: ${product.min_price:.2f} | Max Price: ${product.max_price:.2f}")
            
            mock_competitors = []
            if product.lowest_competitor_price:
                mock_competitor = type('MockCompetitor', (), {
                    'price': product.lowest_competitor_price,
                    'shipping': 0.0,
                    'is_buybox': True,
                    'seller_id': 'COMPETITOR_123'
                })()
                mock_competitors.append(mock_competitor)
                
                mock_competitor2 = type('MockCompetitor', (), {
                    'price': product.lowest_competitor_price + 2.50,
                    'shipping': 0.0,
                    'is_buybox': False,
                    'seller_id': 'COMPETITOR_456'
                })()
                mock_competitors.append(mock_competitor2)
            
            result = engine.calculate_optimal_price(
                product=product,
                competitors=mock_competitors,
                strategy=product.repricing_strategy
            )
            
            print(f"\n   🎯 Repricing Result:")
            print(f"      New Price: ${result['new_price']:.2f}")
            print(f"      Should Reprice: {'✅ YES' if result['should_reprice'] else '❌ NO'}")
            print(f"      Reason: {result['reason']}")
            print(f"      Buy Box Chance: {result['estimated_buybox_chance']}%")
            print(f"      Competitors: {result['competitor_count']}")
            
            if result['should_reprice']:
                price_change = result['new_price'] - product.price
                change_pct = (price_change / product.price) * 100
                print(f"      Price Change: ${price_change:+.2f} ({change_pct:+.1f}%)")
        
        print("\n" + "="*80)
        print("✅ Test Complete!")
        print("="*80 + "\n")
        
    finally:
        db.close()

if __name__ == "__main__":
    test_repricing_strategies()
