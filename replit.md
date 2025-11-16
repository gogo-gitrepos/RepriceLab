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

### November 16, 2025 - Production-Ready Updates
- **Updated Email Placeholders**: Changed all demo emails from `john@repricer.com` to `john@repricerlab.com` throughout the UI
  - Files: `frontend/src/app/page.tsx`, `frontend/src/app/login/page.tsx`, `frontend/src/app/top-header.tsx`
- **Implemented Dashboard Empty State**: Dashboard now shows proper empty state for new users without connected stores/products
  - Added `/api/auth/me` endpoint to check user's store and product status
  - Created `UserStatus` API type with `has_connected_stores` and `has_products` flags
  - Dashboard displays onboarding UI when no stores connected, guiding users through setup
  - Removed hardcoded demo data (84% profitability, 68,724 events, fake competitors) when no real data exists
  - Files: `frontend/src/app/dashboard/page.tsx`, `frontend/src/lib/api.ts`, `backend/app/routers/auth.py`
- **Disabled Demo Login**: Enforced real authentication for production security
  - Fixed landing page login form bypass - now calls `/auth/login` backend API
  - Validates credentials against database before allowing access
  - Shows proper error messages for invalid login attempts
  - Production mode enforced (development_mode=False by default)
  - Files: `frontend/src/app/page.tsx`, `backend/app/config.py`
- **Login Flow**: All login paths (email/password, Google OAuth, landing page) now require valid authentication tokens

### November 14, 2025 - Dashboard & Navigation E2E Tests
- **Created comprehensive Dashboard tests (8 tests - D1-D8)**:
  - D1: Dashboard loads successfully with Safe Mode banner
  - D2: KPI cards visible (Spent, Daily limit, Need Help)
  - D3: Need Help card actions (Send email, Schedule call buttons)
  - D4: Sales data widget with Settings button
  - D5: Insights + Profitability section (Categories A-E, 84% score)
  - D6: Repricing Insights + Activity History + Buy Box Ownership
  - D7: Top Competitors block (5 competitors with rankings)
  - D8: Responsiveness basic layout smoke test
- **Created comprehensive Navigation tests (17 tests - N1-N5)**:
  - N1: All menu items render correctly with proper sections
  - N2.1-N2.11: Navigation to 11 routes (Products, Multichannel, Repricing Rules, Automations, Import, Orders, Repricing Activity, Competitors, Reports, Settings, App Store)
  - N3: Return to Dashboard from any page
  - N4: Menu section titles visible (Repricing, Insights, System)
  - N5: Settings dropdown expand/collapse behavior
- **Created Page Objects**: DashboardPage and SideMenu with comprehensive locators and helper methods
- **Updated test commands**: Added `test:e2e:dashboard` and `test:e2e:navigation` scripts
- **Documentation**: Created DASHBOARD_TESTS.md with detailed test documentation

### November 14, 2025 - Subscription System Implementation
- Added subscription fields to User model (plan, status, trial_ends_at, stripe_customer_id, stripe_subscription_id)
- Implemented Stripe service for checkout sessions, customer management, and webhooks
- Created plan limits configuration (Free/Plus/Pro/Enterprise tiers)
- Built feature limiting middleware with @check_plan_limit decorator
- Added subscription API endpoints (checkout, status, cancel, portal)
- Integrated 14-day trial initialization on user registration
- Secured authentication with JWT tokens (production-safe by default)
- Created STRIPE_SETUP.md documentation for Stripe configuration