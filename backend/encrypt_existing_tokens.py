#!/usr/bin/env python3
"""
Encrypt existing plaintext refresh tokens in the database
Run this migration script after implementing encryption
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.services.encryption import encryption_service
from app.models import Store
from sqlalchemy import text

def encrypt_existing_tokens():
    """Encrypt existing plaintext refresh tokens"""
    db = SessionLocal()
    
    try:
        # Find all stores with potentially unencrypted tokens
        stores = db.query(Store).all()
        
        updated_count = 0
        for store in stores:
            if store._encrypted_refresh_token and store._encrypted_refresh_token.strip():
                try:
                    # Try to decrypt - if it works, it's already encrypted
                    encryption_service.decrypt(store._encrypted_refresh_token)
                    print(f"✅ Store {store.id} token already encrypted")
                except:
                    # If decryption fails, it's plaintext - encrypt it
                    try:
                        plaintext_token = store._encrypted_refresh_token
                        encrypted_token = encryption_service.encrypt(plaintext_token)
                        
                        # Update directly in database to avoid property setter
                        db.execute(
                            text("UPDATE stores SET refresh_token = :encrypted WHERE id = :store_id"),
                            {"encrypted": encrypted_token, "store_id": store.id}
                        )
                        updated_count += 1
                        print(f"🔒 Encrypted token for store {store.id}")
                        
                    except Exception as e:
                        print(f"❌ Failed to encrypt token for store {store.id}: {e}")
                        continue
        
        db.commit()
        print(f"\n✅ Migration complete! Encrypted {updated_count} tokens.")
        
        return updated_count
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        db.rollback()
        return 0
    finally:
        db.close()

if __name__ == "__main__":
    print("🔐 Starting refresh token encryption migration...")
    count = encrypt_existing_tokens()
    print(f"🎉 Migration finished! {count} tokens encrypted.")