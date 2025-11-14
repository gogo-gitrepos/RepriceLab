# Amazon SP-API Testing Guide for RepriceLab

## Overview

RepriceLab uses Amazon's Selling Partner API (SP-API) to fetch competitive pricing data and update product prices on Amazon marketplace. The system has a hybrid architecture - it works with **mock data in development** and seamlessly switches to **real Amazon SP-API** when credentials are configured.

## Current System Status

✅ **Scheduler**: Running every 10 minutes  
✅ **Hybrid Client**: Automatically uses real SP-API when available, falls back to mock  
✅ **Repricing Engine**: 3 intelligent strategies (Win Buy Box, Maximize Profit, Boost Sales)  
✅ **Price Updates**: Listings API integration for sending price changes back to Amazon

## Required Credentials

To test with real Amazon SP-API, you need the following environment secrets:

### 1. SP-API Application Credentials
- `AMAZON_SP_API_CLIENT_ID` - Your LWA Client ID
- `AMAZON_SP_API_CLIENT_SECRET` - Your LWA Client Secret  
- `AMAZON_SP_API_REDIRECT_URI` - OAuth redirect URI (default: http://localhost:8000/auth/amazon/callback)

### 2. AWS IAM Credentials
- `AWS_ACCESS_KEY_ID` - AWS IAM user access key
- `AWS_SECRET_ACCESS_KEY` - AWS IAM user secret key
- `AWS_ROLE_ARN` - ARN of the IAM role for SP-API access

### 3. Store-Specific Data (stored in database)
- `refresh_token` - LWA refresh token obtained during seller authorization
- `region` - Marketplace region (na, eu, fe)
- `marketplace_ids` - Comma-separated marketplace IDs (e.g., "ATVPDKIKX0DER" for US)
- `selling_partner_id` - Your Amazon Seller ID

## How to Get SP-API Credentials

### Step 1: Register as a Developer
1. Go to [Amazon Seller Central](https://sellercentral.amazon.com/)
2. Navigate to **Apps & Services** → **Develop Apps**
3. Create a new developer profile (if not already done)

### Step 2: Create SP-API Application
1. Click **Add new app client**
2. Fill in application details:
   - **App name**: RepriceLab
   - **OAuth Redirect URI**: `http://localhost:8000/auth/amazon/callback` (or your production domain)
   - **API Type**: Choose SP-API
3. Save and note down:
   - LWA Client ID → `AMAZON_SP_API_CLIENT_ID`
   - LWA Client Secret → `AMAZON_SP_API_CLIENT_SECRET`

### Step 3: Set Up AWS IAM Role
1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Create a new IAM role for SP-API
3. Attach the policy with SP-API permissions
4. Create an IAM user for programmatic access
5. Generate access keys → `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
6. Note the role ARN → `AWS_ROLE_ARN`

### Step 4: Authorize Your Application
1. Sellers must authorize your application through the OAuth flow
2. RepriceLab provides the `/auth/amazon/authorize` endpoint
3. After authorization, the `refresh_token` is stored encrypted in the database

## Testing with Real SP-API

### Step 1: Set Environment Secrets

In your Replit project:
```bash
# Set SP-API credentials
Replit Secrets:
- AMAZON_SP_API_CLIENT_ID = "amzn1.application-oa2-client.xxxxx"
- AMAZON_SP_API_CLIENT_SECRET = "your-secret-here"
- AMAZON_SP_API_REDIRECT_URI = "http://localhost:8000/auth/amazon/callback"

# Set AWS credentials
- AWS_ACCESS_KEY_ID = "AKIA..."
- AWS_SECRET_ACCESS_KEY = "your-secret-key"
- AWS_ROLE_ARN = "arn:aws:iam::123456789012:role/YourSPAPIRole"
```

### Step 2: Connect an Amazon Store

Use the Amazon OAuth flow to get a refresh token:

```bash
# 1. Navigate to Amazon authorization endpoint
GET http://localhost:8000/auth/amazon/authorize

# 2. User authorizes the app on Amazon Seller Central

# 3. Amazon redirects back with authorization code
GET http://localhost:8000/auth/amazon/callback?code=xxx&selling_partner_id=xxx

# 4. RepriceLab exchanges code for refresh_token and stores it encrypted
```

### Step 3: Verify SP-API Client is Active

Check the logs when scheduler runs:

```bash
# Backend workflow logs will show:
INFO: Using real SP-API client for store 1
```

If credentials are missing:
```bash
INFO: Using mock SP-API client for store 1 (real credentials not available)
```

### Step 4: Monitor Scheduler Activity

Use the new monitoring endpoints:

```bash
# Check scheduler status
curl http://localhost:8000/admin/scheduler/status

# Response:
{
  "status": "running",
  "cycle_interval_minutes": 10,
  "last_activity": "2025-11-14T04:30:00",
  "statistics_24h": {
    "price_changes": 12,
    "notifications": 5,
    "buybox_ownership_rate": 65.0
  },
  "products": {
    "total": 5,
    "repricing_active": 5,
    "buybox_owned": 3
  },
  "strategies": {
    "win_buybox": 2,
    "maximize_profit": 2,
    "boost_sales": 1
  }
}
```

### Step 5: Watch Scheduler Logs

Monitor the backend logs for detailed repricing activity:

```
================================================================================
🔄 REPRICING CYCLE STARTED at 2025-11-14 04:30:00 UTC
================================================================================
📊 Processing 1 store(s)
INFO: Using real SP-API client for store 1
  📦 Store 1 (My Amazon Store): 5 products
  ✅ GAINED Buy Box: DEMO-1-001 (Wireless Bluetooth Headphones - Noise C...)
  💰 REPRICED DEMO-1-002: $149.99 → $141.11 (-5.9%) | Strategy: MAXIMIZE_PROFIT | Buy Box: 75%
  💰 REPRICED DEMO-1-003: $34.99 → $32.89 (-6.0%) | Strategy: BOOST_SALES | Buy Box: 85%
================================================================================
✅ REPRICING CYCLE COMPLETED in 3.2s
   📦 Products Processed: 5
   💰 Products Repriced: 2
   🎯 Buy Box Changes: 1
================================================================================
```

## API Endpoints Used

### Products API (Competitive Pricing)
**Endpoint**: `GET /products/pricing/v0/items/{asin}/offers`  
**Purpose**: Fetch current competitive pricing for an ASIN  
**Response**: List of competitor offers with prices, shipping, Buy Box winner

### Listings API (Price Updates)
**Endpoint**: `PATCH /listings/2021-08-01/items/{sellerId}/{sku}`  
**Purpose**: Update product listing price on Amazon  
**Request Body**: New price in marketplace currency

## Troubleshooting

### "Using mock SP-API client"
**Cause**: Missing SP-API credentials or refresh token  
**Solution**: Verify all environment secrets are set and store has refresh_token

### "SP-API rate limit exceeded"
**Cause**: Too many API requests  
**Solution**: Scheduler runs every 10 minutes by default - increase interval if needed

### "Invalid refresh token"
**Cause**: Token expired or revoked  
**Solution**: Re-authorize the seller account through OAuth flow

### "Price update failed"
**Cause**: Price outside min/max bounds or API error  
**Solution**: Check product min_price/max_price configuration and API response

## Production Deployment

### Before Going Live:
1. ✅ Configure all environment secrets
2. ✅ Test with at least one real Amazon store
3. ✅ Verify scheduler logging shows "Using real SP-API client"
4. ✅ Test all 3 repricing strategies (Win Buy Box, Maximize Profit, Boost Sales)
5. ✅ Monitor for 24 hours to ensure stable operation
6. ✅ Set up email/push notifications for Buy Box changes
7. ✅ Configure product min/max prices to prevent erroneous price updates

### Monitoring in Production:
- Use `/admin/scheduler/status` endpoint to monitor repricing activity
- Check backend logs for cycle summaries every 10 minutes
- Set up alerts for API errors or rate limiting
- Track Buy Box ownership percentage over time

## Support & Resources

- [Amazon SP-API Documentation](https://developer-docs.amazon.com/sp-api/)
- [SP-API Authorization Guide](https://developer-docs.amazon.com/sp-api/docs/authorizing-selling-partner-api-applications)
- [Products API Reference](https://developer-docs.amazon.com/sp-api/docs/product-pricing-api-v0-reference)
- [Listings API Reference](https://developer-docs.amazon.com/sp-api/docs/listings-items-api-v2021-08-01-reference)

---

**Last Updated**: November 2025  
**RepriceLab Version**: 1.0.0 (Production-Ready)
