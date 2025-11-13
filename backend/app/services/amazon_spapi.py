# backend/app/services/amazon_spapi.py
import os
import httpx
from typing import Optional, Dict, Any
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

try:
    from sp_api.api import Orders, Reports, Feeds, ListingsItems, CatalogItems, Products
    from sp_api.base import SellingApiException, Marketplaces
    SPAPI_AVAILABLE = True
except ImportError as e:
    logger.warning(f"SP-API package not properly installed: {e}")
    SPAPI_AVAILABLE = False

class AmazonSPAPIClient:
    """Amazon SP-API client for RepriceLab"""
    
    def __init__(self, client_id: str, client_secret: str, refresh_token: str, region: str = "NA"):
        """
        Initialize SP-API client
        
        Args:
            client_id: Amazon SP-API client ID (LWA App ID)
            client_secret: Amazon SP-API client secret  
            refresh_token: LWA refresh token from OAuth flow
            region: Region (NA, EU, FE)
        """
        if not SPAPI_AVAILABLE:
            raise RuntimeError("SP-API package not available")
            
        self.client_id = client_id
        self.client_secret = client_secret
        self.refresh_token = refresh_token
        self.region = region
        
        # Credentials dictionary format for python-amazon-sp-api
        self.credentials = {
            'refresh_token': refresh_token,
            'lwa_app_id': client_id,
            'lwa_client_secret': client_secret,
            # For simplified OAuth flow, AWS credentials can be optional
            # Add these if using full AWS IAM role-based auth:
            # 'aws_secret_key': 'your_aws_secret_key',
            # 'aws_access_key': 'your_aws_access_key', 
            # 'role_arn': 'arn:aws:iam::123456789012:role/YourSPAPIRole'
        }
        
        # Initialize API clients
        try:
            self.orders_api = Orders(credentials=self.credentials)
            self.reports_api = Reports(credentials=self.credentials)
            self.feeds_api = Feeds(credentials=self.credentials)
            self.listings_api = ListingsItems(credentials=self.credentials)
            self.catalog_api = CatalogItems(credentials=self.credentials)
            self.products_api = Products(credentials=self.credentials)
        except Exception as e:
            logger.error(f"Failed to initialize SP-API clients: {e}")
            raise
    
    async def test_connection(self) -> Dict[str, Any]:
        """Test the SP-API connection"""
        if not SPAPI_AVAILABLE:
            return {
                "success": False,
                "message": "SP-API package not available"
            }
            
        try:
            # Try to fetch orders to test connection (simplified for demo)
            response = self.orders_api.get_orders(
                marketplace_ids=["ATVPDKIKX0DER"],  # US marketplace
                created_after="2024-01-01T00:00:00"
            )
            
            # Check if we got a response
            if hasattr(response, 'payload') and response.payload:
                return {
                    "success": True,
                    "message": "SP-API connection successful",
                    "orders_count": len(response.payload.get("Orders", []))
                }
            else:
                return {
                    "success": True,
                    "message": "SP-API connection successful (no orders found)",
                    "orders_count": 0
                }
                
        except Exception as e:
            logger.error(f"SP-API connection test failed: {e}")
            return {
                "success": False,
                "message": f"SP-API connection failed: {str(e)}"
            }
    
    async def get_seller_listings(self, marketplace_id: str, seller_id: str, sku: str = None) -> Dict[str, Any]:
        """Get seller's product listings from Amazon SP-API"""
        if not SPAPI_AVAILABLE:
            return {
                "success": False,
                "error": "SP-API package not available"
            }
            
        try:
            if sku:
                # Get specific listing by SKU
                response = self.listings_api.get_listings_item(
                    seller_id=seller_id,
                    sku=sku,
                    marketplace_ids=[marketplace_id],
                    included_data=["summaries", "attributes", "issues", "offers", "fulfillmentAvailability"]
                )
                
                if hasattr(response, 'payload') and response.payload:
                    return {
                        "success": True,
                        "listing": response.payload,
                        "message": f"Retrieved listing for SKU: {sku}"
                    }
                else:
                    return {
                        "success": False,
                        "error": f"No listing found for SKU: {sku}"
                    }
            else:
                # For demo purposes, return success with message about bulk listing
                # In production, you'd use Reports API or iterate through known SKUs
                return {
                    "success": True,
                    "listings": [],
                    "message": "Bulk listing retrieval requires Reports API integration or SKU iteration"
                }
                
        except Exception as e:
            logger.error(f"Failed to get listings: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_product_pricing(self, asin: str, marketplace_id: str, item_condition: str = "New") -> Dict[str, Any]:
        """Get competitive pricing for a product"""
        if not SPAPI_AVAILABLE:
            return {
                "success": False,
                "error": "SP-API package not available"
            }
            
        try:
            response = self.products_api.get_product_pricing_for_asins(
                asin_list=[asin],
                item_condition=item_condition,
                MarketplaceId=marketplace_id
            )
            
            if hasattr(response, 'payload') and response.payload:
                return {
                    "success": True,
                    "pricing": response.payload,
                    "message": f"Retrieved pricing for ASIN: {asin}"
                }
            else:
                return {
                    "success": False,
                    "error": f"No pricing found for ASIN: {asin}"
                }
                
        except Exception as e:
            logger.error(f"Failed to get pricing for {asin}: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_product_details(self, asin: str, marketplace_id: str) -> Dict[str, Any]:
        """Get product catalog details"""
        if not SPAPI_AVAILABLE:
            return {
                "success": False,
                "error": "SP-API package not available"
            }
            
        try:
            response = self.catalog_api.get_catalog_item(
                marketplace_ids=[marketplace_id],
                asin=asin
            )
            
            if hasattr(response, 'payload') and response.payload:
                return {
                    "success": True,
                    "product": response.payload,
                    "message": f"Retrieved catalog details for ASIN: {asin}"
                }
            else:
                return {
                    "success": False,
                    "error": f"No catalog details found for ASIN: {asin}"
                }
                
        except Exception as e:
            logger.error(f"Failed to get product details for {asin}: {e}")
            return {
                "success": False,
                "error": str(e)
            }

class AmazonOAuthFlow:
    """Handle Amazon OAuth flow for SP-API"""
    
    def __init__(self, client_id: str, client_secret: str, redirect_uri: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri
        
    def generate_authorization_url(self, state: str) -> str:
        """Generate Amazon authorization URL"""
        base_url = "https://sellercentral.amazon.com/apps/authorize/consent"
        params = {
            "application_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "state": state
        }
        
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"{base_url}?{query_string}"
    
    async def exchange_code_for_tokens(self, code: str) -> Dict[str, Any]:
        """Exchange authorization code for tokens"""
        token_url = "https://api.amazon.com/auth/o2/token"
        
        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": self.redirect_uri,
            "client_id": self.client_id,
            "client_secret": self.client_secret
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(token_url, data=data)
                response.raise_for_status()
                
                tokens = response.json()
                return {
                    "success": True,
                    "refresh_token": tokens.get("refresh_token"),
                    "access_token": tokens.get("access_token"),
                    "expires_in": tokens.get("expires_in")
                }
        except Exception as e:
            logger.error(f"Token exchange failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def refresh_access_token(self, refresh_token: str) -> Dict[str, Any]:
        """Refresh access token using refresh token"""
        token_url = "https://api.amazon.com/auth/o2/token"
        
        data = {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": self.client_id,
            "client_secret": self.client_secret
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(token_url, data=data)
                response.raise_for_status()
                
                tokens = response.json()
                return {
                    "success": True,
                    "access_token": tokens.get("access_token"),
                    "expires_in": tokens.get("expires_in")
                }
        except Exception as e:
            logger.error(f"Token refresh failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }

# Environment-based configuration
def get_spapi_config():
    """Get SP-API configuration from environment"""
    return {
        "client_id": os.getenv("AMAZON_SP_API_CLIENT_ID"),
        "client_secret": os.getenv("AMAZON_SP_API_CLIENT_SECRET"),
        "redirect_uri": os.getenv("AMAZON_SP_API_REDIRECT_URI", "http://localhost:5000/api/auth/amazon/callback")
    }

def create_spapi_client(refresh_token: str, region: str = "NA") -> Optional[AmazonSPAPIClient]:
    """Create SP-API client with stored credentials"""
    config = get_spapi_config()
    
    if not all([config["client_id"], config["client_secret"]]):
        logger.error("Missing SP-API credentials in environment")
        return None
    
    return AmazonSPAPIClient(
        client_id=config["client_id"],
        client_secret=config["client_secret"], 
        refresh_token=refresh_token,
        region=region
    )