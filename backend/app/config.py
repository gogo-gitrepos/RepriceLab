# backend/app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg2://app:app@localhost:5432/app"
    cors_origins: str = "http://localhost:5000,http://localhost:3000,https://*.replit.dev"
    app_base_url: str = "http://localhost:8000"

    # Amazon SP-API
    lwa_client_id: str = "changeme"
    lwa_client_secret: str = "changeme"
    amazon_sp_api_redirect_uri: str = "http://localhost:5000/api/auth/amazon/callback"
    
    # Google OAuth
    google_redirect_uri: str = "http://localhost:5000/auth/google/callback"

    # Notifications
    vapid_private_key: str | None = None
    vapid_public_key: str | None = None
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_pass: str | None = None
    from_email: str = "no-reply@example.com"

    scheduler_enabled: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()  # <-- ÖNEMLİ: main.py bunu import ediyor
