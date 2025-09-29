# 🧪 RepriceLab

> **Amazon Repricing SaaS** — Intelligent Buy Box tracking, competitor analysis, and automated repricing for Amazon sellers.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwind-css&logoColor=white)

---

## ✨ Features

- 📊 **Real-Time Dashboard** — Track total products, Buy Box ownership percentage, and 7-day trends
- 🏆 **Buy Box Monitoring** — Historical tracking and ownership analysis
- 💰 **Smart Repricing** — Configurable rules with min/max pricing and strategic algorithms
- 🔍 **Competitor Intelligence** — Track competitor prices, shipping costs, and seller information
- 📱 **Multi-Channel Support** — Manage multiple Amazon stores and marketplaces
- 🔔 **Notifications** — Email and push notification infrastructure
- 🎨 **Modern UI** — Premium design with gradient backgrounds and smooth animations

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **Git**

### 1️⃣ Clone & Setup Backend

```bash
# Clone repository
git clone <your-repo-url>
cd RepriceLab

# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install -e .

# Create environment file
echo "DATABASE_URL=sqlite:///./app.db" > .env
echo "CORS_ORIGINS=http://localhost:5000" >> .env

# Initialize database
python -c "from app.database import init_db; init_db()"

# Start backend server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2️⃣ Setup Frontend

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Set API URL
export NEXT_PUBLIC_API_URL=http://localhost:8000  # On Windows: set NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
```

### 3️⃣ Access the Application

- **Frontend**: [http://localhost:5000](http://localhost:5000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: React Query for server state management
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI
- **Database**: SQLAlchemy ORM (SQLite/PostgreSQL)
- **Authentication**: OAuth with Amazon SP-API
- **Background Jobs**: APScheduler
- **Validation**: Pydantic

---

## 📁 Project Structure

```
RepriceLab/
├── backend/
│   ├── app/
│   │   ├── services/          # Business logic (SP-API, repricing, notifications)
│   │   ├── routers/           # API endpoints
│   │   ├── models.py          # Database models
│   │   ├── schemas.py         # Pydantic schemas
│   │   └── main.py            # FastAPI application
│   └── pyproject.toml
│
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js pages (Dashboard, Products, Settings)
│   │   ├── components/        # Reusable UI components
│   │   └── lib/               # Utilities and helpers
│   ├── package.json
│   └── tailwind.config.ts
│
└── README.md
```

---

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=sqlite:///./app.db
CORS_ORIGINS=http://localhost:5000

# For PostgreSQL (production):
# DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/repricelab
```

### Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🐘 Using PostgreSQL

For production, switch to PostgreSQL:

```bash
# Start PostgreSQL with Docker
docker run --name repricelab-postgres \
  -e POSTGRES_USER=app \
  -e POSTGRES_PASSWORD=app \
  -e POSTGRES_DB=repricelab \
  -p 5432:5432 -d postgres:16

# Update backend/.env
DATABASE_URL=postgresql+psycopg2://app:app@localhost:5432/repricelab
```

---

## 📦 Key API Endpoints

- `POST /products/sync` — Sync products from Amazon SP-API
- `GET /products/` — List all products
- `GET /products/{product_id}` — Get product details
- `GET /metrics/summary` — Dashboard metrics
- `POST /pricing/rule` — Create/update repricing rules
- `GET /pricing/preview/{asin}` — Get suggested price

Full API documentation available at `/docs` when server is running.

---

## 🎨 Features Overview

### Dashboard
- Total product count with visual cards
- Buy Box ownership percentage tracking
- 7-day trend analysis
- Quick access to recent products
- Safe Mode banner for testing

### Product Management
- Searchable product table
- Stock and price monitoring
- Buy Box ownership status
- Competitor tracking
- Detailed product views

### Repricing Engine
- Min/Max price configuration
- Formula-based pricing (e.g., `competitor_min * 0.95`)
- Aggressive/Defensive strategies
- Real-time price suggestions

---

## 🛠️ Development

### Run Tests

```bash
# Backend tests
cd backend
pytest

# Frontend build check
cd frontend
npm run build
```

### Code Quality

```bash
# Frontend linting
npm run lint

# Type checking
npm run type-check
```

---

## 🚢 Deployment

RepriceLab is ready to deploy on Replit or any cloud platform supporting Python and Node.js.

### Replit Deployment
1. Click the "Publish" button in Replit
2. Configure environment variables
3. Your app will be live with a custom domain

### Manual Deployment
- Backend: Deploy FastAPI with Gunicorn/Uvicorn
- Frontend: Deploy Next.js with Vercel/Netlify
- Database: Use managed PostgreSQL (Railway, Supabase, etc.)

---

## 📝 License

MIT License - feel free to use this project for your own Amazon repricing needs!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 💡 Support

Need help? Check out:
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **GitHub Issues**: For bug reports and feature requests

---

Built with ❤️ for Amazon sellers worldwide
