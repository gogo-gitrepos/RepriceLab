from __future__ import annotations
from typing import List, Dict, Any
from urllib.parse import urlencode
import os, time, logging

import requests

from ..config import settings

LWA_AUTH_BASE = "https://www.amazon.com/ap/oa"
LWA_TOKEN_URL = "https://api.amazon.com/auth/o2/token"

log = logging.getLogger(__name__)

def _has_real_creds() -> bool:
    # LWA zorunlu; sp-api için AWS de gerekir (role_arn veya access/secret)
    return all([
        settings.lwa_client_id not in (None, "", "changeme"),
        settings.lwa_client_secret not in (None, "", "changeme"),
    ])

def _has_aws() -> bool:
    return any([
        bool(os.getenv("AWS_SELLING_PARTNER_ROLE") or settings.model_config.get("AWS_SELLING_PARTNER_ROLE", None)),
        all([os.getenv("AWS_ACCESS_KEY_ID"), os.getenv("AWS_SECRET_ACCESS_KEY")])
    ])

class SPAPIClient:
    def __init__(self, refresh_token: str | None, region: str = "NA", marketplace_ids: list[str] | None = None):
        self.refresh_token = refresh_token
        self.region = region
        self.marketplace_ids = marketplace_ids or ["ATVPDKIKX0DER"]  # US

    # ---------- OAuth ----------
    @staticmethod
    def build_authorization_url(state: str) -> str:
        params = {
            "client_id": settings.lwa_client_id,
            "scope": "sellingpartnerapi::notifications",
            "response_type": "code",
            "redirect_uri": f"{settings.app_base_url}/auth/callback",
            "state": state,
        }
        return f"{LWA_AUTH_BASE}?{urlencode(params)}"

    @staticmethod
    def exchange_code_for_refresh_token(code: str) -> str:
        # LWA token exchange
        data = {
            "grant_type": "authorization_code",
            "code": code,
            "client_id": settings.lwa_client_id,
            "client_secret": settings.lwa_client_secret,
            "redirect_uri": f"{settings.app_base_url}/auth/callback",
        }
        resp = requests.post(LWA_TOKEN_URL, data=data, timeout=20)
        resp.raise_for_status()
        j = resp.json()
        # j: { access_token, refresh_token, token_type, expires_in }
        return j.get("refresh_token") or ""

    # ---------- Helpers ----------
    def _sp_api_clients(self):
        """
        Hazırsa sp-api client setlerini döndür. Değilse None.
        """
        if not (_has_real_creds() and self.refresh_token and _has_aws()):
            return None

        try:
            from sp_api.api import CatalogItems, ProductPricing
            from sp_api.base import Marketplaces
        except Exception as e:
            log.warning("sp-api import failed: %s", e)
            return None

        creds = {
            "refresh_token": self.refresh_token,
            "lwa_app_id": settings.lwa_client_id,
            "lwa_client_secret": settings.lwa_client_secret,
            # AWS kimlikleri env’den okunur; role_arn opsiyonel
            "aws_access_key": os.getenv("AWS_ACCESS_KEY_ID"),
            "aws_secret_key": os.getenv("AWS_SECRET_ACCESS_KEY"),
            "role_arn": os.getenv("AWS_SELLING_PARTNER_ROLE"),
        }
        marketplace = Marketplaces.US  # marketplace_ids listesi birden fazla olabilir; burada US varsayıyoruz.

        return {
            "catalog": lambda: CatalogItems(credentials=creds, marketplace=marketplace),
            "pricing": lambda: ProductPricing(credentials=creds, marketplace=marketplace),
        }

    # ---------- Store & Data ----------
    def get_store_info(self) -> dict:
        if not (_has_real_creds() and self.refresh_token):
            return {
                "region": self.region,
                "marketplace_ids": self.marketplace_ids,
                "selling_partner_id": "A1000-DEMO",
            }
        # Gerçekte seller_id’yi çekmek için uygun endpoint gerekir; sade döndürüyoruz.
        return {
            "region": self.region,
            "marketplace_ids": self.marketplace_ids,
            "selling_partner_id": "A-REAL",
        }

    def list_inventory(self) -> List[Dict[str, Any]]:
        # Eğer sp-api hazırsa katalog üzerinden örnek akış:
        sp = self._sp_api_clients()
        if sp:
            try:
                # Basit örnek: envanterdeki birkaç ürünü toplayacak şekilde placeholder.
                # Üretimde: kendi SKU/ASIN listeni DB’den al; burada sadece iskelet bırakıyoruz.
                items: list[dict[str, Any]] = []
                # CatalogItems araması (örnek):
                # r = sp["catalog"]().search_catalog_items(keywords="demo", marketplaceIds=self.marketplace_ids)
                # parse r.payload ...
                # Not: Burayı canlı envanter akışına bağlamak için Listing/Inventory API’lerini kullanın.
                return items
            except Exception as e:
                log.warning("sp-api list_inventory failed, falling back to stub: %s", e)

        # Stub demo
        return [
            {"sku": "SKU-001", "asin": "B000TEST01", "title": "Demo Product 1", "price": 12.99, "currency": "USD", "stock_qty": 25, "buybox_owner": None, "buybox_owning": False},
            {"sku": "SKU-002", "asin": "B000TEST02", "title": "Demo Product 2", "price": 18.90, "currency": "USD", "stock_qty": 9,  "buybox_owner": "A-OTHER", "buybox_owning": False},
            {"sku": "SKU-003", "asin": "B000TEST03", "title": "Demo Product 3", "price": 9.49,  "currency": "USD", "stock_qty": 120, "buybox_owner": "A1000-DEMO", "buybox_owning": True},
        ]

    def get_competitive_offers(self, asin: str) -> List[Dict[str, Any]]:
        sp = self._sp_api_clients()
        if sp:
            try:
                # ProductPricing getCompetitivePricing iskeleti:
                # pr = sp["pricing"]().get_competitive_pricing_for_asins(asin)
                # offers = ... # pr.payload parse et
                offers = []  # TODO: gerçek parse
                return offers
            except Exception as e:
                log.warning("sp-api get_competitive_offers failed, falling back to stub: %s", e)

        demo = {
            "B000TEST01": [
                {"seller_id": "A-OTHER-1", "price": 10.99, "shipping": 0.0, "is_buybox": True},
                {"seller_id": "A-OTHER-2", "price": 11.49, "shipping": 0.0, "is_buybox": False},
            ],
            "B000TEST02": [
                {"seller_id": "A-OTHER-3", "price": 17.50, "shipping": 0.0, "is_buybox": True},
                {"seller_id": "A-OTHER-4", "price": 18.10, "shipping": 0.0, "is_buybox": False},
            ],
            "B000TEST03": [
                {"seller_id": "A1000-DEMO", "price": 9.49, "shipping": 0.0, "is_buybox": True},
                {"seller_id": "A-OTHER-5", "price": 9.99, "shipping": 0.0, "is_buybox": False},
            ],
        }
        return demo.get(asin, [])
