#!/usr/bin/env python3
"""
Test RepricingEngine.reprice_product with database CompetitorOffer data
This simulates the full repricing flow after competitive pricing fetch
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal
from app.models import Product, CompetitorOffer, PriceHistory
from app.services.repricing_engine import RepricingEngine

def test_reprice_with_db_offers():
    """Test repricing using CompetitorOffer data from database"""
    
    db = SessionLocal()
    
    try:
        print("\n" + "="*80)
        print("🚀 Testing RepricingEngine.reprice_product with DB Offers")
        print("="*80)
        
        engine = RepricingEngine(db)
        
        products = db.query(Product).filter(Product.repricing_enabled == True).all()
        
        if not products:
            print("\n❌ No products with repricing enabled!")
            return
        
        print(f"\n✅ Found {len(products)} products with repricing enabled\n")
        
        for product in products:
            print("-" * 80)
            print(f"\n📦 Product: {product.title[:50]}...")
            print(f"   SKU: {product.sku}")
            print(f"   Current Price: ${product.price:.2f}")
            print(f"   Strategy: {product.repricing_strategy.upper()}")
            
            competitor_count = db.query(CompetitorOffer).filter(
                CompetitorOffer.product_id == product.id
            ).count()
            print(f"   Competitors in DB: {competitor_count}")
            
            print(f"\n   🔄 Executing reprice_product (dry_run=False)...")
            result = engine.reprice_product(product, dry_run=False)
            
            db.refresh(product)
            
            print(f"\n   🎯 Result:")
            print(f"      New Price: ${result['new_price']:.2f}")
            print(f"      Should Reprice: {'✅ YES' if result['should_reprice'] else '❌ NO'}")
            print(f"      Reason: {result['reason']}")
            print(f"      Buy Box Chance: {result['estimated_buybox_chance']}%")
            
            if result['should_reprice']:
                print(f"      ✅ Price updated in database!")
                print(f"      Updated Price in DB: ${product.price:.2f}")
        
        price_history_count = db.query(PriceHistory).count()
        print(f"\n📈 Total Price History Entries: {price_history_count}")
        
        if price_history_count > 0:
            print("\n📜 Recent Price History:")
            recent = db.query(PriceHistory).order_by(PriceHistory.ts.desc()).limit(10).all()
            for ph in recent:
                product = db.query(Product).filter(Product.id == ph.product_id).first()
                print(f"   {product.sku}: ${ph.price:.2f} | Buy Box: {ph.buybox_owning} | {ph.ts}")
        
        print("\n" + "="*80)
        print("✅ Test Complete!")
        print("="*80 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_reprice_with_db_offers()
