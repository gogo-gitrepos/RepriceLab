RepriceLab



Amazon satıcıları için Buy Box takibi, rakip analizi ve otomatik repricing yapan SaaS uygulaması.Frontend: Next.js + Tailwind, Backend: FastAPI + SQLAlchemy (SQLite veya PostgreSQL).



🚀 Hızlı Başlangıç



Yöntem A — Lokal Geliştirme (SQLite ile)



Gereksinimler: Python 3.11+, Node 18+, Git



Backend kurulumu



cd backend

python -m venv .venv

. .venv\\Scripts\\Activate.ps1

pip install --upgrade pip

pip install -e .



\# .env dosyası (backend klasörü içinde)

@"

DATABASE\_URL=sqlite:///./app.db

CORS\_ORIGINS=http://localhost:3000

"@ | Set-Content -Encoding utf8 .env



\# Seed script (demo user+store)

@'

from app.database import SessionLocal, init\_db

from app import models



def main():

&nbsp;   init\_db()

&nbsp;   db = SessionLocal()

&nbsp;   try:

&nbsp;       u = models.User(email="demo@example.com"); db.add(u); db.flush()

&nbsp;       st = models.Store(user\_id=u.id, region="NA", selling\_partner\_id="A1000",

&nbsp;                         marketplace\_ids="ATVPDKIKX0DER", lwa\_refresh\_token="stub\_refresh\_token")

&nbsp;       db.add(st); db.commit()

&nbsp;       print("Seed OK -> user\_id=", u.id)

&nbsp;   finally:

&nbsp;       db.close()



if \_\_name\_\_ == "\_\_main\_\_":

&nbsp;   main()

'@ | Set-Content -Encoding utf8 seed\_db.py



python seed\_db.py

python -m uvicorn app.main:app --reload --port 8000



Frontend kurulumu



\# yeni terminal

cd frontend

npm install

$env:NEXT\_PUBLIC\_API\_URL="http://localhost:8000"

npm run dev



Test



Swagger: http://localhost:8000/docs → POST /products/sync → GET /products/



UI: http://localhost:3000 → Dashboard / Ürünler / Settings



Yöntem B — Docker Compose (Backend + Frontend birlikte)



docker-compose.yml (proje kökünde):



version: "3.9"

services:

&nbsp; backend:

&nbsp;   build: ./backend

&nbsp;   container\_name: repricelab-backend

&nbsp;   ports: \["8000:8000"]

&nbsp;   environment:

&nbsp;     - UVICORN\_HOST=0.0.0.0

&nbsp;     - UVICORN\_PORT=8000

&nbsp;   command: \["python","-m","uvicorn","app.main:app","--host","0.0.0.0","--port","8000"]

&nbsp;   working\_dir: /app



&nbsp; frontend:

&nbsp;   build: ./frontend

&nbsp;   container\_name: repricelab-frontend

&nbsp;   ports: \["3000:3000"]

&nbsp;   environment:

&nbsp;     - NEXT\_PUBLIC\_API\_URL=http://backend:8000

&nbsp;   depends\_on: \[backend]

&nbsp;   command: \["npm","run","dev"]



Çalıştırma:



docker-compose up --build



Backend: http://localhost:8000/docs



Frontend: http://localhost:3000



🐘 PostgreSQL Entegrasyonu



Docker ile hızlı başlatma



docker run --name repricelab-postgres -e POSTGRES\_USER=app -e POSTGRES\_PASSWORD=app -e POSTGRES\_DB=repricelab -p 5432:5432 -d postgres:16



.env güncelle:



DATABASE\_URL=postgresql+psycopg2://app:app@localhost:5432/repricelab

CORS\_ORIGINS=http://localhost:3000



Compose içine DB servisi eklemek



&nbsp; db:

&nbsp;   image: postgres:16

&nbsp;   container\_name: repricelab-postgres

&nbsp;   environment:

&nbsp;     - POSTGRES\_USER=app

&nbsp;     - POSTGRES\_PASSWORD=app

&nbsp;     - POSTGRES\_DB=repricelab

&nbsp;   ports: \["5432:5432"]

&nbsp;   volumes:

&nbsp;     - pgdata:/var/lib/postgresql/data

volumes:

&nbsp; pgdata:



Backend servisine DATABASE\_URL ekleyin:



postgresql+psycopg2://app:app@db:5432/repricelab



✨ Frontend Özellikleri



Toast bildirimleri



cd frontend

npm i react-hot-toast



src/app/layout.tsx:



import { Toaster } from 'react-hot-toast';

...

<body>

&nbsp; ...

&nbsp; <Toaster position="top-right" />

</body>



Kullanım:



import toast from 'react-hot-toast';

toast.success('Ürünler senkronize edildi');

toast.error('Bir hata oluştu');



Sparkline örneği



src/app/page.tsx içine:



function Spark({ points }:{ points: Array<\[string, number]> }) {

&nbsp; if (!points?.length) return <span>Veri yok</span>;

&nbsp; const w=160,h=48,pad=4;

&nbsp; const ys = points.map((\[,y])=>y);

&nbsp; const min = Math.min(...ys), max = Math.max(...ys)||1;

&nbsp; const step = (w-2\*pad)/(points.length-1);

&nbsp; const scaleY = (v:number)=> h-pad - ( (v-min)/(max-min||1) \* (h-2\*pad) );

&nbsp; const d = points.map((\[,y],i)=>`${i?'L':'M'} ${pad+i\*step} ${scaleY(y)}`).join(' ');

&nbsp; return (

&nbsp;   <svg width={w} height={h}>

&nbsp;     <path d={d} fill="none" stroke="currentColor" strokeWidth="2" />

&nbsp;   </svg>

&nbsp; );

}



🔌 API Kılavuzu



POST /products/sync → Demo ürün ekler



GET /products/ → Ürün listesi



GET /metrics/summary → Ürün sayısı, Buy Box yüzdesi



POST /pricing/rule → Yeni fiyatlama kuralı



GET /pricing/preview/{asin} → Önerilen fiyat



Swagger: http://localhost:8000/docs



🧪 CI (GitHub Actions)



.github/workflows/ci.yml:



backend-test: Python import smoke



frontend-build: Node build



docker-compose-test: Compose + curl check



⚙️ Ortam Değişkenleri



Backend .env:



DATABASE\_URL=sqlite:///./app.db

CORS\_ORIGINS=http://localhost:3000

\# PostgreSQL: postgresql+psycopg2://app:app@localhost:5432/repricelab



Frontend .env.local:



NEXT\_PUBLIC\_API\_URL=http://localhost:8000



🆘 Sık Sorunlar



PowerShell policy → Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass



uvicorn not found → venv aktif mi?



Postgres bağlantı hatası → DB container açık mı?



Frontend API 404 → NEXT\_PUBLIC\_API\_URL doğru mu?



Push hataları → git config --global http.version HTTP/1.1



📜 Lisans



MIT





