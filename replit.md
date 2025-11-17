# RepriceLab

## Overview
RepriceLab is a SaaS platform designed for Amazon sellers. Its primary purpose is to enhance profitability and market share by providing tools for tracking Buy Box ownership, analyzing competitors, and automating repricing strategies. The platform offers dashboard analytics, real-time competitor monitoring, and intelligent repricing rules, integrating with Amazon's SP-API for data and strategic price adjustments.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
### Frontend
- **Framework**: Next.js 15.5.4 (App Router, TypeScript)
- **Styling**: Tailwind CSS with shadcn/ui
- **Internationalization**: Turkish/English language support

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLAlchemy ORM (PostgreSQL/SQLite)
- **Amazon Integration**: SP-API OAuth with multi-store support
- **Background Processing**: APScheduler for periodic tasks
- **API Security**: Rate limiting, error handling
- **Hybrid SP-API Client**: Real Amazon SP-API client with mock fallback

### Core Services
- **SP-API Integration**: Manages interactions with Amazon Seller Partner API.
- **Repricing Engine**: Utilizes three strategies (Win Buy Box, Maximize Profit, Boost Sales) with Buy Box win chance and algorithm weights.
- **Buy Box Analysis**: Tracks and determines Buy Box ownership.
- **Scheduler**: Automates repricing cycles every 10 minutes.
- **Price History Tracking**: Logs all price changes and strategy attributions.
- **Subscription Management**: Stripe-integrated system with Free, Plus, Pro, and Enterprise tiers.
- **Authentication**: Dual authentication (Google OAuth + email/password) with JWT tokens.
- **Feature Limiting**: Enforces plan-based limitations on store/product creation.

### Data Architecture
- **Product Management**: SKU/ASIN tracking, pricing history, inventory.
- **Competitor Tracking**: Real-time monitoring of competitor offers via SP-API.
- **Metrics Collection**: Dashboard KPIs for Buy Box ownership and trends.
- **User Management**: Authentication and subscription tracking.
- **Subscription Tracking**: User plan, status, trial period, and Stripe IDs.

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

### Payment Processing
- **Stripe**: Subscription billing, checkout sessions, webhooks, customer portal.
- **Stripe Price IDs**: Plus ($99/mo), Pro ($199/mo), Enterprise ($299/mo).
- **Plan Limits**: Free (1 store, 50 products), Plus (3 stores, 5000 products), Pro (10 stores, 10000 products), Enterprise (unlimited).

### Background Processing
- **APScheduler**: Python task scheduling.

### Notification Services
- **SMTP**: Email notifications.
- **Web Push API / PyWebPush**: Browser push notifications.

## Recent Changes

### November 17, 2025 - Legal Documentation for US Market (CCPA/CPRA Compliance)

**Created Comprehensive Legal Documentation for Amazon Public App Approval (US-Focused):**
- **Privacy Policy:** US privacy law compliance (CCPA/CPRA)
  - California consumer privacy rights (Right to Know, Delete, Correct, Portability, Opt-Out, Non-Discrimination)
  - Amazon seller data handling procedures (OAuth tokens, product data, orders)
  - Encryption standards (TLS 1.2+, AES-256)
  - Data retention and deletion policies (30-day grace period)
  - 45-day response time for CCPA requests
  - Authorized agent provision for California residents
  - Files: `frontend/src/app/legal/privacy/page.tsx`
- **Terms of Service:** US jurisdiction and Amazon seller requirements
  - Subscription plans and pricing (Free, Plus, Pro, Enterprise)
  - Amazon OAuth authorization scope
  - Repricing rules responsibility disclaimer
  - Limitation of liability for pricing errors and Buy Box loss
  - Governing law: State of Delaware, United States
  - Arbitration: American Arbitration Association (AAA)
  - Refund policy and cancellation terms
  - Files: `frontend/src/app/legal/terms/page.tsx`
- **Security Policy:** Technical security documentation for Amazon reviewers
  - Infrastructure security (AWS SOC 2, ISO 27001, CCPA/CPRA compliance)
  - Data encryption (in transit and at rest)
  - Amazon SP-API token security (encrypted refresh tokens)
  - Access control and authentication (JWT, bcrypt, MFA)
  - Incident response plan (24-hour Amazon notification, 72-hour user notification per CCPA)
  - Backup and disaster recovery (RTO: 4 hours, RPO: 6 hours)
  - Vulnerability management procedures
  - Files: `frontend/src/app/legal/security/page.tsx`
- **Footer Navigation:** Added Security Policy link to footer legal section
  - Files: `frontend/src/app/page.tsx`
- **Purpose:** Enable Amazon public app approval for US-based multi-tenant SaaS OAuth consent flow