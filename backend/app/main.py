from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import init_db
from .routers import auth, pricing, notifications, metrics, amazon_auth, products
from .services.scheduler import start_scheduler

def create_app() -> FastAPI:
    app = FastAPI(title="BuyBox SaaS API")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[o.strip() for o in settings.cors_origins.split(",")],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    init_db()
    app.include_router(auth.router)
    app.include_router(pricing.router)
    app.include_router(notifications.router)
    app.include_router(metrics.router)
    app.include_router(amazon_auth.router)
    app.include_router(products.router)
    if settings.scheduler_enabled:
        start_scheduler()
    return app

app = create_app()
