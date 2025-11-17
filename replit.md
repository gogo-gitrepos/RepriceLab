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

### November 17, 2025 - Amazon SP-API Public OAuth Flow Restoration

**Restored Public OAuth Flow for Multi-Tenant SaaS:**
- **Removed Private App Implementation**: Reverted private app self-authorization approach
  - Deleted `get_access_token()` function from amazon_spapi.py (was for single-account private apps)
  - Removed dev test endpoints `/dev/spapi-test/token` and `/dev/spapi-test/marketplace-participations`
  - Deleted `backend/app/routers/spapi_test.py` file entirely
  - Files: `backend/app/services/amazon_spapi.py`, `backend/app/main.py`
- **Restored Public OAuth Consent Flow**: Re-enabled multi-tenant store connections
  - Updated documentation to reflect public app OAuth flow
  - Removed "[LEGACY - NOT USED]" markers from `/auth/amazon/connect` and `/callback` endpoints
  - Each user can now connect their own Amazon Seller Central account via OAuth
  - Files: `backend/app/routers/amazon_auth.py`, `backend/app/services/amazon_spapi.py`
- **Verified OAuth Configuration**: 
  - Redirect URI: `https://69bcb19a-a003-4492-b392-01ab8e76d5d7-00-1oq2ou7777ks3.worf.replit.dev/api/auth/amazon/callback`
  - Frontend URL: `https://69bcb19a-a003-4492-b392-01ab8e76d5d7-00-1oq2ou7777ks3.worf.replit.dev`
  - OAuth flow tested successfully - generates proper authorization URLs with state parameter
- **Architecture Decision**: RepriceLab is a SaaS platform where multiple users need to connect their own Amazon accounts
  - Private app (single account) → NOT suitable for multi-tenant SaaS
  - Public OAuth (multiple accounts) → Correct approach for RepriceLab ✅

### November 16, 2025 - Contact Form with Email Privacy & Scheduler Bug Fix

**Contact Form Email Privacy:**
- **Removed Public Email Display**: Eliminated `support@repricelab.com` and `sales@repricelab.com` from public contact page
  - Email addresses no longer visible to website visitors
  - Contact page now shows only the message form
  - Files: `frontend/src/app/contact/page.tsx`
- **Backend Contact API**: Created `/api/contact` endpoint with SMTP email sending
  - Contact form submissions sent directly to `repricelab@gmail.com`
  - HTML formatted emails with sender info, subject, and message
  - Proper error handling for SMTP failures
  - Files: `backend/app/routers/contact.py`, `backend/app/main.py`
- **Frontend Form Integration**: Updated contact form with API integration
  - Success/error state handling with visual feedback
  - Loading state during submission
  - Form reset after successful submission
  - Network error handling with retry messaging
  - Files: `frontend/src/app/contact/page.tsx`
- **SMTP Configuration Required**: Environment variables needed for email functionality
  - `SMTP_HOST`: SMTP server hostname (e.g., smtp.gmail.com)
  - `SMTP_PORT`: SMTP server port (default: 587)
  - `SMTP_USER`: SMTP username/email
  - `SMTP_PASS`: SMTP password/app password
  - `FROM_EMAIL`: Sender email address for contact form emails

**Critical Scheduler Bug Fix:**
- **Fixed Product Loop Logic**: Repricing logic was outside product loop, only processing last product
  - Moved all repricing logic inside product-level try block (lines 124-257 in scheduler.py)
  - Each product now correctly processed with buybox analysis, competitor tracking, and repricing
  - `products_processed` counter increments per product
  - Product-level exception handling prevents store-level abort
  - Files: `backend/app/services/scheduler.py`

### November 16, 2025 - Production-Ready Updates & Amazon SP-API Error Fixes

**Production Authentication & Empty State:**
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
- **Robust Error Handling**: Added `redirecting` state flag to prevent UI flash during authentication failures
  - Authorization header automatically included in all API calls from localStorage
  - 401 errors redirect to login without flash
  - Network errors show retry UI
  - Files: `frontend/src/app/dashboard/page.tsx`, `frontend/src/lib/api.ts`

**Amazon SP-API Token Error Fixes:**
- **Database Cleanup**: Identified and deactivated demo store with invalid 28-character refresh token
  - SQL: `UPDATE stores SET is_active = false WHERE id = 1`
- **Scheduler Improvements**: Enhanced repricing scheduler with robust error handling
  - Only processes active stores (`Store.is_active == True`)
  - Store-level exception handling - errors skip to next store
  - Product-level exception handling - errors skip to next product
  - Auto-detection of `invalid_grant` errors - marks store as inactive automatically
  - Prevents continuous error logging for invalid tokens
  - File: `backend/app/services/scheduler.py`
- **Dependencies**: Added `gunicorn==21.2.0` to backend/requirements.txt for production deployment

**Production Deployment Configuration:**
- **Deployment Type**: Autoscale (stateless web app with external PostgreSQL database)
- **Build Command**: `pip install -r backend/requirements.txt && cd frontend && npm install && npm run build`
- **Run Command**: Backend (port 8000) + Frontend (port 5000) with Gunicorn + Next.js production server
- **Architecture**: Frontend serves on port 5000, proxies `/api/*` requests to backend on port 8000 via Next.js rewrites

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