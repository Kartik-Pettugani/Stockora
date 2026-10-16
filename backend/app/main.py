from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from .config import settings
from .database import get_db
from .models import Product
from .routes import dashboard, products, stock, suppliers


app = FastAPI(title=settings.app_name, version="1.0.0")
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_methods=["*"],
	allow_headers=["*"],
)
Instrumentator().instrument(app).expose(app, endpoint="/metrics")

app.include_router(products.router)
app.include_router(suppliers.router)
app.include_router(stock.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
	return {"service": settings.app_name, "version": "1.0.0", "docs": "/docs"}


@app.get("/health")
def health():
	return {"status": "UP"}


@app.get("/ready")
def ready(db: Session = Depends(get_db)):
	db.execute(select(Product).limit(1))
	return {"status": "READY"}
