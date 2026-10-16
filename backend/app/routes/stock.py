from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Product, StockMovement
from ..schemas import StockMovementCreate, StockMovementOut


router = APIRouter(prefix="/api/stock", tags=["stock"])


@router.get("", response_model=list[StockMovementOut])
def list_movements(db: Session = Depends(get_db)):
	return list(db.scalars(select(StockMovement).order_by(StockMovement.id.desc())))


@router.post("", response_model=StockMovementOut, status_code=status.HTTP_201_CREATED)
def create_movement(payload: StockMovementCreate, db: Session = Depends(get_db)):
	product = db.get(Product, payload.product_id)
	if product is None:
		raise HTTPException(status_code=404, detail="Product not found")
	if payload.movement_type == "OUT" and payload.quantity > product.quantity:
		raise HTTPException(status_code=400, detail="Stock-out exceeds available inventory")

	if payload.movement_type == "IN":
		product.quantity += payload.quantity
	else:
		product.quantity -= payload.quantity

	movement = StockMovement(**payload.model_dump())
	db.add(movement)
	db.commit()
	db.refresh(movement)
	return movement
