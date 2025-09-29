#!/usr/bin/env python3
"""
Create demo store for testing product sync functionality
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User, Store
from datetime import datetime

def create_demo_store():
    db = SessionLocal()
    
    try:
        # Check if demo user exists
        demo_user = db.query(User).filter(User.id == 2).first()
        if not demo_user:
            demo_user = User(
                id=2,
                email="demo@repricelabdemo.com",
                created_at=datetime.utcnow()
            )
            db.add(demo_user)
            db.commit()
            print("✅ Demo user created")
        else:
            print("✅ Demo user already exists")
        
        # Check if demo store exists
        demo_store = db.query(Store).filter(Store.user_id == 2).first()
        if not demo_store:
            demo_store = Store(
                user_id=2,
                store_name="Demo Amazon Store",
                selling_partner_id="DEMO123456789",
                marketplace_ids="ATVPDKIKX0DER",  # US marketplace
                region="us-east-1",
                refresh_token="demo_refresh_token",
                is_active=True,
                created_at=datetime.utcnow(),
                last_sync=None
            )
            db.add(demo_store)
            db.commit()
            print(f"✅ Demo store created with ID: {demo_store.id}")
        else:
            print(f"✅ Demo store already exists with ID: {demo_store.id}")
            
        return demo_store.id
        
    except Exception as e:
        print(f"❌ Error creating demo store: {e}")
        db.rollback()
        return None
    finally:
        db.close()

if __name__ == "__main__":
    store_id = create_demo_store()
    if store_id:
        print(f"\n🎉 Demo environment ready!")
        print(f"Store ID: {store_id}")
        print(f"You can now test product sync at: POST /api/products/sync/{store_id}")