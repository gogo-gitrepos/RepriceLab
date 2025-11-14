# backend/app/models.py
from __future__ import annotations
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, DateTime, Text
from datetime import datetime
from .services.encryption import encryption_service
from .database import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    google_id: Mapped[str | None] = mapped_column(String(128), nullable=True, unique=True)
    picture: Mapped[str | None] = mapped_column(String(512), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Store(Base):
    __tablename__ = "stores"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    
    # Amazon SP-API Authentication
    selling_partner_id: Mapped[str] = mapped_column(String(64))
    _encrypted_refresh_token: Mapped[str] = mapped_column("refresh_token", Text)
    
    @property
    def refresh_token(self) -> str:
        """Decrypt and return refresh token"""
        if not self._encrypted_refresh_token:
            return ""
        try:
            return encryption_service.decrypt(self._encrypted_refresh_token)
        except Exception:
            # If decryption fails, assume it's plaintext (for migration)
            return self._encrypted_refresh_token
    
    @refresh_token.setter
    def refresh_token(self, value: str):
        """Encrypt and store refresh token"""
        if value:
            self._encrypted_refresh_token = encryption_service.encrypt(value)
        else:
            self._encrypted_refresh_token = value
    
    region: Mapped[str] = mapped_column(String(32))  # na, eu, fe
    marketplace_ids: Mapped[str] = mapped_column(String(255))  # comma-separated
    
    # Store Information
    store_name: Mapped[str] = mapped_column(String(255))
    seller_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    
    # Connection Status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_sync: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user: Mapped["User"] = relationship()
    products: Mapped[list["Product"]] = relationship(back_populates="store")

class Product(Base):
    __tablename__ = "products"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    store_id: Mapped[int | None] = mapped_column(ForeignKey("stores.id"), nullable=True)
    
    # Amazon Product Information
    sku: Mapped[str] = mapped_column(String(64))
    asin: Mapped[str] = mapped_column(String(16))
    title: Mapped[str] = mapped_column(String(512))
    condition_type: Mapped[str] = mapped_column(String(32), default="New")
    
    # Amazon Marketplace & Listing Details
    marketplace_id: Mapped[str] = mapped_column(String(16), default="ATVPDKIKX0DER")  # US marketplace default
    product_type: Mapped[str | None] = mapped_column(String(64), nullable=True)  # Amazon product type (LUGGAGE, etc.)
    listing_status: Mapped[str] = mapped_column(String(32), default="active")  # active, inactive, incomplete
    fulfillment_channel: Mapped[str] = mapped_column(String(8), default="FBM")  # FBA or FBM
    
    # Product Details for Listing Management
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    brand: Mapped[str | None] = mapped_column(String(128), nullable=True)
    manufacturer: Mapped[str | None] = mapped_column(String(128), nullable=True)
    product_image_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Physical Attributes for Shipping
    item_weight: Mapped[float | None] = mapped_column(Float, nullable=True)  # in pounds
    item_length: Mapped[float | None] = mapped_column(Float, nullable=True)  # in inches
    item_width: Mapped[float | None] = mapped_column(Float, nullable=True)   # in inches
    item_height: Mapped[float | None] = mapped_column(Float, nullable=True)  # in inches
    
    # Pricing Information
    price: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String(8), default="USD")
    min_price: Mapped[float | None] = mapped_column(Float, nullable=True)
    max_price: Mapped[float | None] = mapped_column(Float, nullable=True)
    
    # Inventory & Buy Box
    stock_qty: Mapped[int] = mapped_column(Integer, default=0)
    buybox_owner: Mapped[str | None] = mapped_column(String(64), nullable=True)
    buybox_owning: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Synchronization Tracking
    last_synced_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    sync_status: Mapped[str] = mapped_column(String(16), default="pending")  # pending, synced, error
    sync_error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Repricing Settings
    repricing_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    repricing_strategy: Mapped[str] = mapped_column(String(32), default="win_buybox")  # win_buybox, maximize_profit, boost_sales
    target_margin_percent: Mapped[float | None] = mapped_column(Float, nullable=True, default=15.0)
    last_repriced_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    competitor_count: Mapped[int] = mapped_column(Integer, default=0)
    lowest_competitor_price: Mapped[float | None] = mapped_column(Float, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    store: Mapped["Store"] = relationship(back_populates="products")

class PriceHistory(Base):
    __tablename__ = "price_history"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    ts: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    price: Mapped[float] = mapped_column(Float)
    buybox_owning: Mapped[bool] = mapped_column(Boolean)

class CompetitorOffer(Base):
    __tablename__ = "competitor_offers"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    ts: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    seller_id: Mapped[str] = mapped_column(String(64))
    price: Mapped[float] = mapped_column(Float)
    shipping: Mapped[float] = mapped_column(Float, default=0.0)
    is_buybox: Mapped[bool] = mapped_column(Boolean, default=False)

class PricingRule(Base):
    __tablename__ = "pricing_rules"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    min_price: Mapped[float] = mapped_column(Float)
    max_price_formula: Mapped[str] = mapped_column(String(128), default="current_price * 1.9")
    strategy: Mapped[str] = mapped_column(String(32), default="aggressive")

class PushSubscription(Base):
    __tablename__ = "push_subscriptions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    endpoint: Mapped[str] = mapped_column(Text)
    p256dh: Mapped[str] = mapped_column(Text)
    auth: Mapped[str] = mapped_column(Text)

class Notification(Base):
    __tablename__ = "notifications"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    type: Mapped[str] = mapped_column(String(64))
    payload_json: Mapped[str] = mapped_column(Text)
    ts: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    sent: Mapped[bool] = mapped_column(Boolean, default=False)