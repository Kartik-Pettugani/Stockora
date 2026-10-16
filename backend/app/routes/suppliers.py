from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Supplier
from ..schemas import SupplierCreate, SupplierOut, SupplierUpdate


router = APIRouter(prefix="/api/suppliers", tags=["suppliers"])


@router.get("", response_model=list[SupplierOut])
def list_suppliers(db: Session = Depends(get_db)):
	return list(db.scalars(select(Supplier).order_by(Supplier.name)))


@router.get("/{supplier_id}", response_model=SupplierOut)
def get_supplier(supplier_id: int, db: Session = Depends(get_db)):
	supplier = db.get(Supplier, supplier_id)
	if supplier is None:
		raise HTTPException(status_code=404, detail="Supplier not found")
	return supplier


@router.post("", response_model=SupplierOut, status_code=status.HTTP_201_CREATED)
def create_supplier(payload: SupplierCreate, db: Session = Depends(get_db)):
	supplier = Supplier(**payload.model_dump())
	db.add(supplier)
	try:
		db.commit()
	except IntegrityError:
		db.rollback()
		raise HTTPException(status_code=409, detail="Supplier name already exists") from None
	db.refresh(supplier)
	return supplier


@router.put("/{supplier_id}", response_model=SupplierOut)
def update_supplier(supplier_id: int, payload: SupplierUpdate, db: Session = Depends(get_db)):
	supplier = db.get(Supplier, supplier_id)
	if supplier is None:
		raise HTTPException(status_code=404, detail="Supplier not found")
	for key, value in payload.model_dump(exclude_unset=True).items():
		setattr(supplier, key, value)
	try:
		db.commit()
	except IntegrityError:
		db.rollback()
		raise HTTPException(status_code=409, detail="Supplier name already exists") from None
	db.refresh(supplier)
	return supplier
