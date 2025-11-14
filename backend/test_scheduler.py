#!/usr/bin/env python3
"""
Test scheduler integration with new RepricingEngine
Manually trigger a repricing cycle
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.services.scheduler import run_cycle
from app.database import SessionLocal
from app.models import Product, PriceHistory

def test_scheduler_cycle():
    """Test scheduler cycle with new repricing engine"""
    
    print("\n" + "="*80)
    print("🔄 Testing Scheduler Integration")
    print("="*80)
    
    db = SessionLocal()
    
    try:
        print("\n📊 Before Repricing:")
        products_before = db.query(Product).all()
        for p in products_before:
            print(f"  {p.sku}: ${p.price:.2f} | Strategy: {p.repricing_strategy}")
        
        print(f"\n🚀 Running scheduler cycle...")
        run_cycle()
        
        print(f"\n✅ Cycle complete!")
        
        db.expire_all()
        
        print("\n📊 After Repricing:")
        products_after = db.query(Product).all()
        for p in products_after:
            print(f"  {p.sku}: ${p.price:.2f} | Strategy: {p.repricing_strategy}")
        
        price_history_count = db.query(PriceHistory).count()
        print(f"\n📈 Price History Entries: {price_history_count}")
        
        print("\n" + "="*80)
        print("✅ Scheduler Test Complete!")
        print("="*80 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error during scheduler test: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_scheduler_cycle()
