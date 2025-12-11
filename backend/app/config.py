# backend/app/config.py
import os
from pydantic import Field, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore"  # Ignore extra env vars that don't match fields
    )
    
    database_url: str = "postgresql+psycopg2://app:app@localhost:5432/app"
    cors_origins: str = "http://localhost:5000,http://localhost:3000,https://*.replit.dev"
    app_base_url: str = "http://localhost:8000"
    frontend_url: str = "http://localhost:5000"
    
    # Environment setting (development or production)
    environment: str = Field(default="development", validation_alias="ENVIRONMENT")

    # Amazon SP-API (Private App - Self-Authorization)
    lwa_client_id: str = Field(default="changeme", validation_alias="AMAZON_SP_API_CLIENT_ID")
    lwa_client_secret: str = Field(default="changeme", validation_alias="AMAZON_SP_API_CLIENT_SECRET")
    amazon_sp_api_refresh_token: str = Field(default="", validation_alias="AMAZON_SP_API_REFRESH_TOKEN")
    amazon_sp_api_role_arn: str = Field(default="", validation_alias="AMAZON_SP_API_ROLE_ARN")
    amazon_sp_api_app_id: str = Field(default="", validation_alias="AMAZON_SP_API_APP_ID")
    
    @computed_field
    @property
    def amazon_sp_api_redirect_uri(self) -> str:
        """Dynamic redirect URI based on environment"""
        return "https://repricelab.com/api/auth/amazon/callback"
    
    # Google OAuth
    google_redirect_uri: str = "http://localhost:5000/auth/google/callback"

    # Stripe Payment Integration
    stripe_secret_key: str | None = None
    stripe_publishable_key: str | None = None
    stripe_webhook_secret: str | None = None
    stripe_price_id_plus: str = "price_plus_monthly"
    stripe_price_id_pro: str = "price_pro_monthly"
    stripe_price_id_enterprise: str = "price_enterprise_monthly"

    # Notifications
    vapid_private_key: str | None = None
    vapid_public_key: str | None = None
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_pass: str | None = None
    from_email: str = "no-reply@example.com"

    scheduler_enabled: bool = True
    development_mode: bool = False  # Set to True only in development via DEVELOPMENT_MODE env var
    public_registration_enabled: bool = True  # Set to False in production to disable public signups temporarily

settings = Settings()
