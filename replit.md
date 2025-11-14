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

### Data Architecture
- **Product Management**: SKU/ASIN tracking, pricing history, inventory.
- **Competitor Tracking**: Real-time monitoring of competitor offers via SP-API.
- **Metrics Collection**: Dashboard KPIs for Buy Box ownership and trends.

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