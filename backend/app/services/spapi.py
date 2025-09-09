from __future__ import annotations
import random
from typing import Any, Dict, List


class SPAPIClient:
    def __init__(self, region: str, refresh_token: str) -> None:
        self.region = region
        self.refresh_token = refresh_token

    async def list_listings(self) -> List[Dict[str, Any]]:
        return [
            {"sku": "SKU-1", "asin": "B000TEST01", "title": "Demo Product 1", "price": 12.99, "currency": "USD", "stock_qty": 23},
            {"sku": "SKU-2", "asin": "B000TEST02", "title": "Demo Product 2", "price": 7.49, "currency": "USD", "stock_qty": 5},
            {"sku": "SKU-3", "asin": "B000TEST03", "title": "Demo Product 3", "price": 19.99, "currency": "USD", "stock_qty": 100},
        ]

    async def get_competitive_pricing(self, asin: str) -> List[Dict[str, Any]]:
        base = random.choice([7.2, 8.5, 12.3, 15.9, 21.0])
        offers: List[Dict[str, Any]] = []
        for i in range(4):
            offers.append({
                "seller_id": f"A{1000+i}",
                "price": round(base + i * 0.2, 2),
                "shipping": 0.0,
                "is_buybox": i == 0,
            })
        return offers

    async def update_price(self, sku: str, new_price: float) -> bool:
        return True
