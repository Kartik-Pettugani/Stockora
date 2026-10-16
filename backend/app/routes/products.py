from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Product
from ..schemas import ProductCreate, ProductOut, ProductUpdate


router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=list[ProductOut])
def list_products(db: Session = Depends(get_db)):
	return list(db.scalars(select(Product).order_by(Product.id.desc())))


@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
	product = db.get(Product, product_id)
	if product is None:
		raise HTTPException(status_code=404, detail="Product not found")
	return product


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
	product = Product(**payload.model_dump())
	db.add(product)
	try:
		db.commit()
	except IntegrityError:
		db.rollback()
		raise HTTPException(status_code=409, detail="SKU already exists") from None
	db.refresh(product)
	return product


@router.put("/{product_id}", response_model=ProductOut)
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db)):
	product = db.get(Product, product_id)
	if product is None:
		raise HTTPException(status_code=404, detail="Product not found")
	for key, value in payload.model_dump(exclude_unset=True).items():
		setattr(product, key, value)
	try:
		db.commit()
	except IntegrityError:
		db.rollback()
		raise HTTPException(status_code=409, detail="SKU already exists") from None
	db.refresh(product)
	return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
	product = db.get(Product, product_id)
	if product is None:
		raise HTTPException(status_code=404, detail="Product not found")
	db.delete(product)
	db.commit()
