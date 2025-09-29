# backend/app/schemas.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class ProductOut(BaseModel):
    id: int
    user_id: int
    sku: str
    asin: str
    title: str
    price: float
    currency: str = "USD"
    stock_qty: int = 0
    buybox_owner: Optional[str] = None
    buybox_owning: bool = False

    class Config:
        from_attributes = True

class MetricsSummary(BaseModel):
    total_products: int
    buybox_ownership_pct: float
    last7days_ownership: List[tuple[str, float]] = []

class PricingRuleIn(BaseModel):
    min_price: float
    max_price_formula: str = "current_price * 1.9"
    strategy: str = "aggressive"

class PricingPreview(BaseModel):
    asin: str
    current_price: float
    suggested_price: float
    reason: str

class NotificationOut(BaseModel):
    id: int
    user_id: int
    type: str
    payload_json: str
    ts: datetime
    sent: bool

    class Config:
        from_attributes = True