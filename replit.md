# RepriceLab

## Overview

RepriceLab is a SaaS platform designed for Amazon sellers to track Buy Box ownership, analyze competitors, and implement automatic repricing strategies. The system provides comprehensive dashboard analytics, competitor monitoring, and intelligent repricing rules to help sellers optimize their Amazon marketplace performance.

The application consists of a Next.js frontend with TypeScript and Tailwind CSS, paired with a FastAPI backend using SQLAlchemy for data management. The system is designed to integrate with Amazon's SP-API for real-time marketplace data and automated price adjustments.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

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
- **Framework**: Next.js 14 with App Router and TypeScript for type safety
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

### Core Services
- **SP-API Integration**: Amazon Seller Partner API client for listing management and competitive pricing data
- **Repricing Engine**: Rule-based pricing strategy with configurable parameters (min/max prices, aggressive/defensive strategies)
- **Buy Box Analysis**: Logic to determine Buy Box ownership and track ownership changes
- **Notification System**: Email and push notification infrastructure for alerts
- **Scheduler**: Background task management for automated repricing cycles

### Data Architecture
- **Product Management**: SKU/ASIN tracking with pricing history and inventory levels
- **Competitor Tracking**: Real-time monitoring of competitor offers and pricing changes
- **Rules Engine**: Flexible pricing rules with formula-based maximum price calculations
- **Metrics Collection**: Dashboard KPIs including Buy Box ownership percentages and trends

## External Dependencies

### Core Technologies
- **Next.js 14**: React framework for frontend development
- **FastAPI**: Python web framework for backend API
- **SQLAlchemy**: Database ORM with PostgreSQL/SQLite support
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript development

### Amazon Integration
- **Amazon SP-API**: Seller Partner API for marketplace data access
- **LWA (Login with Amazon)**: OAuth authentication for seller accounts
- **Marketplace APIs**: Listings, offers, inventory, and order data retrieval

### Background Processing
- **APScheduler**: Python task scheduling for repricing cycles
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

The architecture is designed for scalability with clear separation between frontend presentation, backend business logic, and external service integrations. The system supports both development (SQLite) and production (PostgreSQL) database configurations.