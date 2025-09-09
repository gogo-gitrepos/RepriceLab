from __future__ import annotations
import sys, traceback, importlib, compileall
from pathlib import Path

BASE = Path(__file__).resolve().parents[1] / "backend"
APP = BASE / "app"

print("== compileall ==")
ok = compileall.compile_dir(str(APP), force=True, quiet=1)
print("compileall ok?", ok)

MODULES = [
    "app.config",
    "app.database",
    "app.models",
    "app.schemas",
    "app.services.spapi",
    "app.services.repricing",
    "app.services.buybox",
    "app.services.notify",
    "app.services.scheduler",
    "app.routers.auth",
    "app.routers.products",
    "app.routers.pricing",
    "app.routers.notifications",
    "app.routers.metrics",
]

print("\n== import test ==")
failed = False
for m in MODULES:
    try:
        importlib.import_module(m)
        print("OK:", m)
    except Exception:
        failed = True
        print("FAIL:", m)
        traceback.print_exc()
        break

if failed:
    sys.exit(1)

print("\n== app factory ==")
from app.main import app, create_app  # type: ignore
print("has app:", bool(app))
print("has create_app:", callable(create_app))
print("✅ smoke passed")
