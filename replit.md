# RepriceLab

## Overview

RepriceLab is a SaaS platform for Amazon sellers, providing tools to track Buy Box ownership, analyze competitors, and automate repricing strategies. It features dashboard analytics, competitor monitoring, and intelligent repricing rules to optimize Amazon marketplace performance. The platform aims to enhance sellers' profitability and market share through strategic price adjustments and real-time data integration with Amazon's SP-API.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15.5.4 (App Router, TypeScript)
- **Styling**: Tailwind CSS with shadcn/ui patterns
- **State Management**: React hooks
- **API Communication**: Custom fetch-based client
- **Internationalization**: Turkish/English language support

### Backend Architecture
- **Framework**: FastAPI (Python)
- **Database**: SQLAlchemy ORM (PostgreSQL/SQLite)
- **Amazon Integration**: SP-API OAuth with multi-store support
- **Background Processing**: APScheduler for periodic tasks
- **API Security**: Rate limiting, error handling
- **Hybrid SP-API Client**: Real Amazon SP-API client with mock fallback

### Core Services
- **SP-API Integration**: Manages Amazon Seller Partner API interactions.
- **Repricing Engine**: Advanced 3-strategy system (Win Buy Box, Maximize Profit, Boost Sales) considering Buy Box win chance and algorithm weights.
- **Buy Box Analysis**: Determines ownership and tracks changes.
- **Scheduler**: Manages automated repricing cycles (every 10 minutes).
- **Price History Tracking**: Logs all price changes with strategy attribution.
- **Subscription Management**: Stripe-integrated subscription system with 4-tier plan limiting (Free, Plus, Pro, Enterprise).
- **Authentication**: Dual authentication (Google OAuth + email/password) with secure JWT tokens.
- **Feature Limiting**: Per-user plan enforcement with @check_plan_limit decorator on store/product creation.

### Data Architecture
- **Product Management**: SKU/ASIN tracking, pricing history, inventory.
- **Competitor Tracking**: Real-time monitoring of competitor offers via SP-API.
- **Metrics Collection**: Dashboard KPIs for Buy Box ownership and trends.
- **User Management**: Email/password and Google OAuth authentication with subscription tracking.
- **Subscription Tracking**: User plan, status, trial period, and Stripe customer/subscription IDs.

## External Dependencies

### Core Technologies
- **Next.js 15.5.4**: Frontend framework.
- **React 19.x**: UI library.
- **FastAPI**: Backend API framework.
- **SQLAlchemy**: Database ORM.
- **Tailwind CSS**: Styling.
- **TypeScript**: Type-safe development.

### Amazon Integration
- **Amazon SP-API**: Seller Partner API for marketplace data and price updates.
- **LWA (Login with Amazon)**: OAuth for seller accounts.
- **Marketplace APIs**: Listings, offers, inventory, orders.

### Payment Processing
- **Stripe**: Subscription billing, checkout sessions, webhooks, customer portal.
- **Stripe Price IDs**: Plus ($99/mo), Pro ($199/mo), Enterprise ($299/mo).
- **Plan Limits**: Free (1 store, 50 products), Plus (3 stores, 5000 products), Pro (10 stores, 10000 products), Enterprise (unlimited).

### Background Processing
- **APScheduler**: Python task scheduling.

### Notification Services
- **SMTP**: Email notifications.
- **Web Push API / PyWebPush**: Browser push notifications.

### Development Tools
- **Uvicorn**: ASGI server.
- **Psycopg2**: PostgreSQL adapter.
- **Pydantic**: Data validation.
- **HTTPx**: Async HTTP client.

## Security & Authentication

### JWT Authentication
- **Production Mode**: Secure by default (development_mode=False)
- **Token Validation**: All protected endpoints require valid JWT bearer tokens
- **Error Handling**: Invalid/expired tokens return 401 with proper headers
- **Development Override**: Requires explicit DEVELOPMENT_MODE=true environment variable

### Subscription Plan Enforcement
- **Store Creation**: Limited by plan at `/api/auth/amazon/callback`
- **Product Sync**: Limited by plan during Amazon SP-API sync
- **Trial Period**: New users get 14-day free trial on Free plan
- **Upgrade Flow**: Stripe checkout sessions for plan upgrades

### Environment Variables Required
- `JWT_SECRET_KEY`: Token signing secret
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `STRIPE_PUBLISHABLE_KEY`: Stripe public key
- `STRIPE_WEBHOOK_SECRET`: Webhook signature verification
- `stripe_price_id_plus`: Plus plan Stripe price ID
- `stripe_price_id_pro`: Pro plan Stripe price ID
- `stripe_price_id_enterprise`: Enterprise plan Stripe price ID
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth secret
- `AMAZON_SP_API_CLIENT_ID`: Amazon seller API client
- `AMAZON_SP_API_CLIENT_SECRET`: Amazon seller API secret
- `DATABASE_URL`: PostgreSQL connection string

## Recent Changes

### November 14, 2025 - Subscription System Implementation
- Added subscription fields to User model (plan, status, trial_ends_at, stripe_customer_id, stripe_subscription_id)
- Implemented Stripe service for checkout sessions, customer management, and webhooks
- Created plan limits configuration (Free/Plus/Pro/Enterprise tiers)
- Built feature limiting middleware with @check_plan_limit decorator
- Added subscription API endpoints (checkout, status, cancel, portal)
- Integrated 14-day trial initialization on user registration
- Secured authentication with JWT tokens (production-safe by default)
- Created STRIPE_SETUP.md documentation for Stripe configuration