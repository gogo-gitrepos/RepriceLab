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