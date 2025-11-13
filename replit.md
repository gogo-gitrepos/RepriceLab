# RepriceLab

## Overview

RepriceLab is a SaaS platform designed for Amazon sellers to track Buy Box ownership, analyze competitors, and implement automatic repricing strategies. The system provides comprehensive dashboard analytics, competitor monitoring, and intelligent repricing rules to help sellers optimize their Amazon marketplace performance.

The application consists of a Next.js frontend with TypeScript and Tailwind CSS, paired with a FastAPI backend using SQLAlchemy for data management. The system is designed to integrate with Amazon's SP-API for real-time marketplace data and automated price adjustments.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### Phase 6 Complete: Real Marketplace Data Integration (November 2025)
- ✅ **Real SP-API Integration**: Scheduler now uses real Amazon SP-API client when credentials available
- ✅ **Hybrid Client System**: Automatically falls back to mock client when SP-API credentials not configured
- ✅ **Competitive Pricing Data**: Fetches real marketplace pricing from Amazon every 10 minutes
- ✅ **Price Update API**: Integrated Listings API for sending price updates back to Amazon
- ✅ **SP-API Parser**: Added parser to convert SP-API pricing response to internal format
- ✅ **Logging Enhancement**: Added detailed logging for SP-API operations (real vs mock client usage)

**Technical Implementation:**
- `scheduler.py`: Uses `AmazonSPAPIClient` when available, falls back to `MockSPAPIClient`
- `amazon_spapi.py`: Added `update_price()` method using Listings API
- `_parse_sp_api_pricing_to_offers()`: Converts SP-API competitive pricing to offer format
- Real client requires: `AMAZON_SP_API_CLIENT_ID`, `AMAZON_SP_API_CLIENT_SECRET`, store refresh_token
- Scheduler runs every 10 minutes, fetches pricing, detects Buy Box changes, triggers repricing

### Phase 5 Complete: Navigation & Settings Restructure (October 2025)
- ✅ **Navigation Cleanup**: Removed Feedback section entirely (Overview, Negative Feedback pages)
- ✅ **Settings Streamlined**: Removed Channels and Company Settings from Settings dropdown
- ✅ **Account Settings Redesign**: 
  - Removed Amazon Store Connections (moved to Multichannel page)
  - Added Personal Information section (Email, First Name, Last Name)
  - Added Change Password functionality
  - Integrated Company Information (from removed Company Settings)
- ✅ **Products Page Enhancement**:
  - Bulk Actions dropdown with Assign Strategy, Download CSV, Delete Selected
  - Repricing Status filter (All Products / Active / Paused)
  - Premium checkbox styling (gray unchecked → green checked)
- ✅ **Database Schema**: Added missing User model columns (name, google_id, picture, created_at)

**Navigation Structure:**
- REPRICING: Products, Multichannel, Repricing Rules, Automations, Import
- INSIGHTS: Orders, Repricing Activity, Competitors, Reports
- SYSTEM: Settings (Account, Users, Subscription), App Store

### Phase 4 Complete: Premium Landing Page & Marketing Pages (September 2025)
- ✅ **Landing Page**: Created premium landing/login page with repricer.com-inspired design
- ✅ **Logo Enhancement**: Upgraded to FlaskConical icon with 3D gradient effects, rock-solid appearance
- ✅ **Comprehensive Footer**: Added Product, Resources, Company sections with newsletter subscription
- ✅ **Marketing Pages**: Created Features, Pricing, and Contact placeholder pages
- ✅ **Conditional Layout**: Landing page displays without navigation/sidebar for clean first impression
- ✅ **Social Media Integration**: Facebook, Twitter, YouTube, LinkedIn, Instagram icons in footer
- ✅ **Professional README**: Complete documentation with badges, deployment instructions, and features

**Landing Page Features:**
- Hero section with trust badges and statistics (5B+ price changes, 99.9% uptime, 24/7 automation)
- Login form with Google OAuth option
- Feature showcase cards with icons
- CTA sections for trial signup and demo booking
- Animated background gradients
- Footer with comprehensive site navigation

### Phase 3 Complete: Product Management & Security Enhancements (September 2025)
- ✅ **Database Security**: Added proper unique constraints for multi-tenancy - (store_id, sku) and (store_id, asin, marketplace_id)
- ✅ **Authentication & Authorization**: Implemented proper user authentication on all API routes, eliminated IDOR vulnerabilities
- ✅ **Product Sync Service**: Enhanced sync with demo product creation fallback when SP-API unavailable
- ✅ **Frontend Interface**: Complete product management dashboard with stats, sync controls, and professional table UI
- ✅ **Refresh Token Encryption**: Implemented encryption service for LWA refresh tokens at rest
- ✅ **Branding Update**: Complete rebrand from "BuyBox SaaS" to "RepriceLab"
- ✅ **API Contract Alignment**: Fixed response structures between frontend and backend

**Security Enhancements Completed:**
- Multi-tenant database constraints preventing cross-user data access
- Encrypted refresh token storage with automatic migration
- Authentication dependencies on all product and store endpoints  
- Proper error handling and API response standardization

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15.5.4 with App Router and TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design with shadcn/ui component patterns
- **State Management**: Client-side state with React hooks and API integration
- **API Communication**: Custom API client with fetch-based requests and error handling
- **Routing**: File-based routing with dynamic product detail pages
- **Internationalization**: Complete Turkish/English language switching system

### Backend Architecture
- **Framework**: FastAPI for high-performance API development with automatic OpenAPI documentation
- **Database**: SQLAlchemy ORM with support for both SQLite (development) and PostgreSQL (production)
- **Amazon Integration**: Complete SP-API OAuth flow with token management and multi-store support
- **Background Processing**: APScheduler for periodic tasks like price monitoring and Buy Box tracking
- **Data Models**: Enhanced models for Users, Stores, Products with Amazon SP-API integration
- **API Security**: Rate limiting, error handling, and structured API responses
- **Hybrid SP-API Client**: Real Amazon SP-API client with mock fallback for development

### Core Services
- **SP-API Integration**: Amazon Seller Partner API client for listing management and competitive pricing data
- **Repricing Engine**: Rule-based pricing strategy with configurable parameters (min/max prices, aggressive/defensive strategies)
- **Buy Box Analysis**: Logic to determine Buy Box ownership and track ownership changes
- **Notification System**: Email and push notification infrastructure for alerts
- **Scheduler**: Background task management for automated repricing cycles (runs every 10 minutes)
- **Real Marketplace Data**: Fetches competitive pricing from Amazon and updates prices via Listings API

### Data Architecture
- **Product Management**: SKU/ASIN tracking with pricing history and inventory levels
- **Competitor Tracking**: Real-time monitoring of competitor offers and pricing changes via SP-API
- **Rules Engine**: Flexible pricing rules with formula-based maximum price calculations
- **Metrics Collection**: Dashboard KPIs including Buy Box ownership percentages and trends
- **CompetitorOffer Table**: Populated by scheduler with real Amazon marketplace data every 10 minutes

## External Dependencies

### Core Technologies
- **Next.js 15.5.4**: React framework for frontend development
- **React 19.x**: UI library with latest features
- **FastAPI**: Python web framework for backend API
- **SQLAlchemy**: Database ORM with PostgreSQL/SQLite support
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript development

### Amazon Integration
- **Amazon SP-API**: Seller Partner API for marketplace data access (real + mock client)
- **LWA (Login with Amazon)**: OAuth authentication for seller accounts
- **Marketplace APIs**: Listings, offers, inventory, and order data retrieval
- **Products API**: Competitive pricing data (replacing deprecated ProductPricing API)
- **Listings API**: Price updates sent back to Amazon marketplace

### Background Processing
- **APScheduler**: Python task scheduling for repricing cycles (10-minute intervals)
- **BullMQ** (planned): Queue management for background job processing
- **Redis** (planned): Caching and rate limiting infrastructure

### Notification Services
- **SMTP**: Email notification delivery
- **Web Push API**: Browser push notifications with VAPID keys
- **PyWebPush**: Python library for push notification handling

### Development Tools
- **Uvicorn**: ASGI server for FastAPI development
- **Psycopg2**: PostgreSQL database adapter
- **Pydantic**: Data validation and settings management
- **HTTPx**: Async HTTP client for external API calls

The architecture is designed for scalability with clear separation between frontend presentation, backend business logic, and external service integrations. The system supports both development (SQLite + mock SP-API) and production (PostgreSQL + real SP-API) database configurations.

## Repricing Strategies

RepriceLab offers 3 intelligent repricing strategies:

1. **Win Buy Box** - Aggressive Buy Box winning with $0.01 below competitor pricing
2. **Maximize Profit** - Balance profit margins (15% minimum) with Buy Box wins
3. **Boost Sales** - Drive high sales velocity with competitive pricing (8% minimum profit)

Each strategy considers:
- Current Buy Box holder pricing
- Lowest competitor price (including shipping)
- Minimum/maximum safe price boundaries
- Amazon Buy Box algorithm weights (price 25%, seller rating 40%, fulfillment 35%)
