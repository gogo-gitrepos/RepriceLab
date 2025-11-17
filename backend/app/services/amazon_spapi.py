# backend/app/services/amazon_spapi.py
"""
Amazon SP-API Service for RepriceLab

This project uses SP-API as a PUBLIC APP with OAuth consent flow.
Users connect their Amazon Seller Central accounts via OAuth authorization.

Authentication flow:
1. User clicks "Connect Amazon Store" in RepriceLab
2. User is redirected to Amazon OAuth consent page
3. User authorizes RepriceLab to access their selling data
4. Amazon redirects back with authorization code
5. We exchange code for refresh_token and access_token
6. Refresh token is stored in database for ongoing API access
"""
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

# Marketplace ID to currency mapping
MARKETPLACE_CURRENCY = {
    "ATVPDKIKX0DER": "USD",  # US
    "A2EUQ1WTGCTBG2": "CAD",  # CA
    "A1AM78C64UM0Y8": "MXN",  # MX
    "A2Q3Y263D00KWC": "BRL",  # BR
    "A1F83G8C2ARO7P": "GBP",  # UK
    "A13V1IB3VIYZZH": "EUR",  # FR
    "A1PA6795UKMFR9": "EUR",  # DE
    "APJ6JRA9NG5V4": "EUR",  # IT
    "A1RKKUPIHCS9HS": "EUR",  # ES
    "AMEN7PMS3EDWL": "EUR",  # BE
    "A1805IZSGTT6HS": "EUR",  # NL
    "A2NODRKZP88ZB9": "SEK",  # SE
    "A1C3SOZRARQ6R3": "PLN",  # PL
    "ARBP9OOSHTCHU": "EGP",  # EG
    "A33AVAJ2PDY3EV": "TRY",  # TR
    "A17E79C6D8DWNP": "SAR",  # SA
    "A2VIGQ35RCS4UG": "AED",  # AE
    "A21TJRUUN4KGV": "INR",  # IN
    "A19VAU5U5O7RUS": "SGD",  # SG
    "A39IBJ37TRP1C6": "AUD",  # AU
    "A1VC38T7YXB528": "JPY",  # JP
}

def get_marketplace_currency(marketplace_id: str) -> str:
    """Get currency code for a marketplace ID"""
    return MARKETPLACE_CURRENCY.get(marketplace_id, "USD")


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
        # AWS credentials are REQUIRED for production SP-API calls
        # Without them, SP-API will fail authentication
        aws_access_key = os.getenv('AWS_ACCESS_KEY_ID')
        aws_secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')
        role_arn = os.getenv('AWS_ROLE_ARN')
        
        self.credentials = {
            'refresh_token': refresh_token,
            'lwa_app_id': client_id,
            'lwa_client_secret': client_secret,
        }
        
        # Add AWS credentials if available (required for production)
        if aws_access_key and aws_secret_key:
            self.credentials['aws_access_key'] = aws_access_key
            self.credentials['aws_secret_key'] = aws_secret_key
            if role_arn:
                self.credentials['role_arn'] = role_arn
            logger.info("AWS IAM credentials loaded for SP-API authentication")
        else:
            logger.warning(
                "AWS credentials not found! SP-API calls will fail. "
                "Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_ROLE_ARN for production. "
                "Falling back to mock client for demo mode."
            )
            # Raise exception to trigger fallback to mock client
            raise RuntimeError("AWS credentials required for real SP-API calls")
        
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
    
    async def update_price(self, sku: str, seller_id: str, marketplace_id: str, new_price: float) -> Dict[str, Any]:
        """
        Update product price using Listings API
        
        Args:
            sku: Product SKU
            seller_id: Seller Partner ID
            marketplace_id: Amazon marketplace ID
            new_price: New price to set
            
        Returns:
            Dict with success status and message
        """
        if not SPAPI_AVAILABLE:
            logger.warning(f"SP-API not available, simulating price update for SKU {sku} to ${new_price:.2f}")
            return {
                "success": True,
                "message": f"Simulated price update (SP-API not configured)",
                "sku": sku,
                "new_price": new_price
            }
        
        try:
            # Use Listings API to update price
            # Correct format per Amazon SP-API documentation
            # Derive correct currency from marketplace ID
            currency = get_marketplace_currency(marketplace_id)
            
            body = {
                "productType": "PRODUCT",
                "patches": [
                    {
                        "op": "replace",
                        "path": "/attributes/purchasableOffer",  # camelCase per Amazon SP-API spec
                        "value": [
                            {
                                "audience": "ALL",  # B2C offer (standard customers)
                                "marketplaceId": marketplace_id,  # camelCase
                                "currency": currency,
                                "ourPrice": [  # camelCase
                                    {
                                        "schedule": [
                                            {
                                                "valueWithTax": new_price  # camelCase
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
            
            response = self.listings_api.patch_listings_item(
                sellerId=seller_id,
                sku=sku,
                marketplaceIds=[marketplace_id],
                body=body
            )
            
            # python-amazon-sp-api returns ApiResponse with payload
            # Check response.payload for status (not top-level response.status)
            payload = getattr(response, 'payload', {})
            errors = getattr(response, 'errors', [])
            
            if not payload and not errors:
                logger.warning(f"Empty response from SP-API for SKU {sku}")
                return {
                    "success": False,
                    "error": "Empty response from Amazon SP-API",
                    "sku": sku
                }
            
            # Check if errors present
            if errors:
                error_msg = '; '.join([str(e) for e in errors])
                logger.error(f"SP-API errors for SKU {sku}: {error_msg}")
                return {
                    "success": False,
                    "error": error_msg,
                    "sku": sku,
                    "errors": errors
                }
            
            # Extract status from payload
            status = payload.get('status') if isinstance(payload, dict) else None
            submission_id = payload.get('submissionId') if isinstance(payload, dict) else None
            issues = payload.get('issues', []) if isinstance(payload, dict) else []
            
            if status == 'ACCEPTED':
                logger.info(f"Successfully updated price for SKU {sku} to ${new_price:.2f} ({currency}) | Submission ID: {submission_id}")
                return {
                    "success": True,
                    "message": f"Price updated successfully",
                    "sku": sku,
                    "new_price": new_price,
                    "submission_id": submission_id
                }
            else:
                # Build error message from issues
                error_msg = f"Status: {status}"
                if issues:
                    error_details = [f"{issue.get('severity', 'ERROR')}: {issue.get('message', 'Unknown')}" for issue in issues]
                    error_msg = f"{error_msg} | Issues: {'; '.join(error_details)}"
                
                logger.error(f"Failed to update price for SKU {sku}: {error_msg}")
                return {
                    "success": False,
                    "error": error_msg,
                    "sku": sku,
                    "status": status,
                    "issues": issues
                }
                
        except Exception as e:
            logger.error(f"Failed to update price for SKU {sku}: {e}")
            # Don't fail hard - log and continue
            return {
                "success": False,
                "error": str(e),
                "sku": sku
            }

class AmazonOAuthFlow:
    """Handle Amazon OAuth flow for SP-API"""
    
    def __init__(self, client_id: str, client_secret: str, redirect_uri: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri
        
    def generate_authorization_url(self, state: str) -> str:
        """Generate Amazon authorization URL with proper encoding"""
        from urllib.parse import urlencode
        
        base_url = "https://sellercentral.amazon.com/apps/authorize/consent"
        params = {
            "application_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "state": state,
            "version": "beta"
        }
        
        # Properly URL-encode all parameters
        query_string = urlencode(params)
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
    from ..config import settings
    return {
        "client_id": settings.lwa_client_id,
        "client_secret": settings.lwa_client_secret,
        "redirect_uri": settings.amazon_sp_api_redirect_uri
    }

def create_spapi_client(refresh_token: str, region: str = "NA") -> Optional[AmazonSPAPIClient]:
    """Create SP-API client with stored credentials"""
    try:
        config = get_spapi_config()
        
        if not all([config["client_id"], config["client_secret"]]):
            logger.warning("Missing SP-API credentials in environment")
            return None
        
        if not SPAPI_AVAILABLE:
            logger.warning("SP-API package not available")
            return None
        
        return AmazonSPAPIClient(
            client_id=config["client_id"],
            client_secret=config["client_secret"], 
            refresh_token=refresh_token,
            region=region
        )
    except Exception as e:
        logger.error(f"Failed to create SP-API client: {e}")
        return None