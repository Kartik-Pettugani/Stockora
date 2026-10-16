from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Product, Supplier
from ..schemas import DashboardOut


router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardOut)
def dashboard(db: Session = Depends(get_db)):
	products = list(db.scalars(select(Product)))
	return DashboardOut(
		total_products=len(products),
		total_units=sum(product.quantity for product in products),
		low_stock_products=sum(product.quantity <= product.reorder_level for product in products),
		total_inventory_value=sum(product.quantity * product.unit_price for product in products),
		total_suppliers=db.scalar(select(func.count(Supplier.id))) or 0,
	)
