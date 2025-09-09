from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, DateTime, Text
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)

class Store(Base):
    __tablename__ = "stores"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    region: Mapped[str] = mapped_column(String(32))
    selling_partner_id: Mapped[str] = mapped_column(String(64))
    marketplace_ids: Mapped[str] = mapped_column(String(255))
    lwa_refresh_token: Mapped[str] = mapped_column(Text)
    user: Mapped["User"] = relationship()

class Product(Base):
    __tablename__ = "products"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    sku: Mapped[str] = mapped_column(String(64))
    asin: Mapped[str] = mapped_column(String(16))
    title: Mapped[str] = mapped_column(String(512))
    price: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String(8), default="USD")
    stock_qty: Mapped[int] = mapped_column(Integer, default=0)
    buybox_owner: Mapped[str | None] = mapped_column(String(64), nullable=True)
    buybox_owning: Mapped[bool] = mapped_column(Boolean, default=False)

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
