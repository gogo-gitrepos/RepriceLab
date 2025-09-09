from app.database import SessionLocal, init_db
from app import models

def main():
    # Tabloları oluştur
    init_db()
    db = SessionLocal()
    try:
        # 1 kullanıcı ekle
        u = models.User(email="demo@example.com")
        db.add(u)
        db.flush()  # ID almak için commit öncesi flush

        # 1 store ekle
        st = models.Store(
            user_id=u.id,
            region="NA",
            selling_partner_id="A1000",
            marketplace_ids="ATVPDKIKX0DER",
            lwa_refresh_token="stub_refresh_token"
        )
        db.add(st)
        db.commit()
        print("Seed OK. user_id=", u.id, " store_id=", st.id)
    finally:
        db.close()

if __name__ == "__main__":
    main()
