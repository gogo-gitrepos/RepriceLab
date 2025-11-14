# Stripe Subscription Setup Guide

This guide explains how to configure Stripe for RepriceLab's subscription system.

## Overview

RepriceLab uses Stripe for managing subscriptions across 4 tiers:
- **Free**: Trial/basic tier (1 store, 50 products)
- **Plus**: $99/month (3 stores, 5000 products)
- **Pro**: $199/month (10 stores, 10000 products)  
- **Enterprise**: $299/month (unlimited stores & products)

## Setup Steps

### 1. Create Stripe Account
1. Sign up at https://dashboard.stripe.com/register
2. Complete account verification
3. Enable test mode for development

### 2. Create Subscription Products

For each tier, create a product with recurring pricing:

**Plus Plan**
- Product name: "RepriceLab Plus"
- Billing: Monthly recurring
- Price: $99
- Copy the Price ID (starts with `price_`)

**Pro Plan**
- Product name: "RepriceLab Pro"
- Billing: Monthly recurring
- Price: $199
- Copy the Price ID

**Enterprise Plan**
- Product name: "RepriceLab Enterprise"
- Billing: Monthly recurring
- Price: $299
- Copy the Price ID

### 3. Configure Environment Variables

Add these to your Replit Secrets:

```bash
STRIPE_SECRET_KEY=sk_test_... # From Stripe Dashboard > Developers > API Keys
STRIPE_PUBLISHABLE_KEY=pk_test_... # From same location
STRIPE_WEBHOOK_SECRET=whsec_... # Created in step 4
```

Add these to `backend/app/config.py` or as environment variables:

```bash
stripe_price_id_plus=price_... # Plus plan Price ID
stripe_price_id_pro=price_... # Pro plan Price ID  
stripe_price_id_enterprise=price_... # Enterprise plan Price ID
```

### 4. Configure Webhook

1. Go to Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-replit-app.repl.co/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret (starts with `whsec_`)
6. Add it as `STRIPE_WEBHOOK_SECRET` environment variable

### 5. Test the Integration

#### Test Checkout Flow
```bash
# Create checkout session
curl -X POST https://your-app.repl.co/api/subscriptions/checkout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan": "plus"}'
```

#### Test Webhook Locally
Use Stripe CLI for local webhook testing:
```bash
stripe listen --forward-to localhost:8000/api/stripe/webhook
```

#### Test Subscription Status
```bash
# Get current subscription
curl https://your-app.repl.co/api/subscriptions/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Production Setup

Before going live:
1. Switch to live mode in Stripe Dashboard
2. Create production products and prices
3. Update environment variables with live keys
4. Update webhook endpoint URL to production domain
5. Test with real payment methods

## API Endpoints

### Create Checkout Session
```
POST /api/subscriptions/checkout
Body: {"plan": "plus" | "pro" | "enterprise"}
Returns: {"checkout_url": "https://checkout.stripe.com/..."}
```

### Get Subscription Status
```
GET /api/subscriptions/status
Returns: User subscription details
```

### Cancel Subscription
```
POST /api/subscriptions/cancel
Cancels at period end
```

### Customer Portal
```
GET /api/subscriptions/portal
Returns: {"portal_url": "https://billing.stripe.com/..."}
```

### Webhook Handler
```
POST /api/stripe/webhook
Handles Stripe events automatically
```

## Plan Limits Enforcement

Limits are automatically enforced at:
- **Store Creation**: `/api/auth/amazon/callback` checks store limit
- **Product Sync**: Amazon SP-API sync checks product limit

When limits are exceeded, API returns:
```json
{
  "detail": "Plan limit reached: Free plan allows 1 store. Upgrade to create more."
}
```

## Trial Period

New users automatically get:
- 14-day free trial on Free plan
- Full access to Free tier features
- Trial status shown in subscription response

After trial expires:
- Users must upgrade to continue using premium features
- Store/product limits remain enforced

## Troubleshooting

### Webhook Not Working
- Verify webhook URL is accessible publicly
- Check `STRIPE_WEBHOOK_SECRET` is correct
- Review Stripe webhook logs in dashboard

### Checkout Session Fails
- Verify price IDs match Stripe dashboard
- Ensure `STRIPE_SECRET_KEY` is set correctly
- Check user is authenticated (valid JWT)

### Plan Limits Not Enforcing
- Verify subscription status is updated via webhook
- Check database subscription fields are populated
- Review decorator usage on protected endpoints

## Security Notes

- Never expose `STRIPE_SECRET_KEY` in frontend code
- Always validate webhook signatures
- Use HTTPS for all Stripe communications
- Store customer IDs securely in database

## Support

For Stripe-specific issues:
- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
