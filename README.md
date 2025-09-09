# RepriceLab

Amazon satıcıları için Buy Box takibi, rakip analizi ve otomatik repricing yapan SaaS.

Frontend: Next.js 14 + Tailwind · Backend: FastAPI + SQLAlchemy (SQLite/PostgreSQL)

🌟 Özellikler

📦 Buy Box sahiplik takibi ve geçmişi

🏷️ Rakip fiyat/kargo ve satıcı bilgileri

🤖 Repricing kuralları (min/max + strateji) ve fiyat önerisi

📊 Dashboard (toplam ürün, sahiplik yüzdesi, 7-gün trend)

🔔 Bildirim altyapısı (stub e‑posta/push)

🚀 Hızlı Başlangıç

Aşağıdaki iki yöntemden birini seçin.

Yöntem A — Lokal Geliştirme (SQLite ile)

Gereksinimler: Python 3.11+, Node 18+, Git

1) Backend
cd backend
python -m venv .venv
. .venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -e .


# backend/.env
@"
DATABASE_URL=sqlite:///./app.db
CORS_ORIGINS=http://localhost:3000
"@ | Set-Content -Encoding utf8 .env


# Demo seed (User + Store)
@'
from app.database import SessionLocal, init_db
from app import models


def main():
    init_db()
    db = SessionLocal()
    try:
        u = models.User(email="demo@example.com"); db.add(u); db.flush()
        st = models.Store(
            user_id=u.id, region="NA", selling_partner_id="A1000",
            marketplace_ids="ATVPDKIKX0DER", lwa_refresh_token="stub_refresh_token"
        )
        db.add(st); db.commit()
        print("Seed OK -> user_id=", u.id)
    finally:
        db.close()


if __name__ == "__main__":
    main()
'@ | Set-Content -Encoding utf8 seed_db.py


python seed_db.py
python -m uvicorn app.main:app --reload --port 8000
2) Frontend
# Yeni terminal
cd frontend
npm install
$env:NEXT_PUBLIC_API_URL="http://localhost:8000"
npm run dev

Test:

Swagger: http://localhost:8000/docs → POST /products/sync → GET /products/

UI: http://localhost:3000 → Dashboard / Ürünler / Settings

macOS/Linux (bash) kısayol: source backend/.venv/bin/activate ile benzer adımları uygulayın.

Yöntem B — Docker Compose (Backend + Frontend)

docker-compose.yml (repo kökü):

version: "3.9"
services:
  backend:
    build: ./backend
    container_name: repricelab-backend
    ports: ["8000:8000"]
    environment:
      - UVICORN_HOST=0.0.0.0
      - UVICORN_PORT=8000
    command: ["python","-m","uvicorn","app.main:app","--host","0.0.0.0","--port","8000"]
    working_dir: /app


  frontend:
    build: ./frontend
    container_name: repricelab-frontend
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on: [backend]
    command: ["npm","run","dev"]

Çalıştırma:

docker-compose up --build
# Backend:  http://localhost:8000/docs
# Frontend: http://localhost:3000
🐘 PostgreSQL’e Geçiş
Tek komutla Postgres (Docker)
docker run --name repricelab-postgres -e POSTGRES_USER=app -e POSTGRES_PASSWORD=app -e POSTGRES_DB=repricelab -p 5432:5432 -d postgres:16

backend/.env:

DATABASE_URL=postgresql+psycopg2://app:app@localhost:5432/repricelab
CORS_ORIGINS=http://localhost:3000
Compose’a DB eklemek
  db:
    image: postgres:16
    container_name: repricelab-postgres
    environment:
      - POSTGRES_USER=app
      - POSTGRES_PASSWORD=app
      - POSTGRES_DB=repricelab
    ports: ["5432:5432"]
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:

Backend için DATABASE_URL:

postgresql+psycopg2://app:app@db:5432/repricelab
✨ Frontend İyileştirmeleri
Toast (react-hot-toast)
cd frontend
npm i react-hot-toast

src/app/layout.tsx içine:

import { Toaster } from 'react-hot-toast';
...
<body>
  ...
  <Toaster position="top-right" />
</body>

Kullanım:

import toast from 'react-hot-toast';
toast.success('Ürünler senkronize edildi');
toast.error('Bir hata oluştu');
Basit Sparkline (paketsiz)

src/app/page.tsx içine:

function Spark({ points }:{ points: Array<[string, number]> }) {
  if (!points?.length) return <span>Veri yok</span>;
  const w=160,h=48,pad=4;
  const ys = points.map(([,y])=>y);
  const min = Math.min(...ys), max = Math.max(...ys)||1;
  const step = (w-2*pad)/(points.length-1);
  const scaleY = (v:number)=> h-pad - ( (v-min)/(max-min||1) * (h-2*pad) );
  const d = points.map(([,y],i)=>`${i?'L':'M'} ${pad+i*step} ${scaleY(y)}`).join(' ');
  return (
    <svg width={w} height={h}>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
🔌 API Kılavuzu (Özet)

POST /products/sync → Demo ürün ekler (3 kayıt)

GET /products/ → Ürün listesi

GET /metrics/summary → Toplam ürün / Buy Box yüzdesi

POST /pricing/rule → {min_price, max_price_formula, strategy}

GET /pricing/preview/{asin} → Önerilen fiyat

Swagger: http://localhost:8000/docs

🧱 Proje Yapısı
RepriceLab/
├─ backend/
│  ├─ app/
│  │  ├─ services/ (spapi, repricing, buybox, notify, scheduler)
│  │  ├─ routers/  (auth, products, pricing, notifications, metrics)
│  │  ├─ main.py, models.py, schemas.py, config.py, database.py
│  ├─ pyproject.toml, Dockerfile
├─ frontend/
│  ├─ src/app (Dashboard, Products, Settings, Product Detail)
│  ├─ public/, Dockerfile, package.json, tailwind
├─ scripts/ (normalize_whitespace.py, smoke_backend.py)
└─ docker-compose.yml
🧪 CI (GitHub Actions)

.github/workflows/ci.yml içerir:

backend-test (Python 3.11 → bağımlılıklar → import smoke)

frontend-build (Node 20 → npm ci → build)

docker-compose-test (Compose ile ayağa kaldır, curl ile doğrula)

⚙️ Ortam Değişkenleri

Backend .env:

DATABASE_URL=sqlite:///./app.db
CORS_ORIGINS=http://localhost:3000
# PostgreSQL: postgresql+psycopg2://app:app@localhost:5432/repricelab

Frontend .env.local:

NEXT_PUBLIC_API_URL=http://localhost:8000
🆘 Sık Sorunlar

PowerShell script izni: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

uvicorn not found: venv aktif mi?

Postgres bağlantısı: container/URL doğru mu?

Frontend 404: NEXT_PUBLIC_API_URL backend’i işaret etmeli

Push ağ hataları: git config --global http.version HTTP/1.1

📜 Lisans

MIT
