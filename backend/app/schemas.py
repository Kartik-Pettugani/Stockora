from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class SupplierBase(BaseModel):
	name: str = Field(min_length=1, max_length=150)
	contact_name: str = Field(default="", max_length=120)
	email: str = Field(default="", max_length=255)
	phone: str = Field(default="", max_length=40)
	address: str = ""


class SupplierCreate(SupplierBase):
	pass


class SupplierUpdate(BaseModel):
	name: str | None = Field(default=None, min_length=1, max_length=150)
	contact_name: str | None = Field(default=None, max_length=120)
	email: str | None = Field(default=None, max_length=255)
	phone: str | None = Field(default=None, max_length=40)
	address: str | None = None


class SupplierOut(SupplierBase):
	id: int
	created_at: datetime
	model_config = ConfigDict(from_attributes=True)


class ProductBase(BaseModel):
	sku: str = Field(min_length=1, max_length=80)
	name: str = Field(min_length=1, max_length=200)
	description: str = ""
	category: str = Field(default="", max_length=100)
	unit_price: float = Field(default=0, ge=0)
	quantity: int = Field(default=0, ge=0)
	reorder_level: int = Field(default=0, ge=0)
	supplier_id: int | None = Field(default=None, gt=0)


class ProductCreate(ProductBase):
	pass


class ProductUpdate(BaseModel):
	sku: str | None = Field(default=None, min_length=1, max_length=80)
	name: str | None = Field(default=None, min_length=1, max_length=200)
	description: str | None = None
	category: str | None = Field(default=None, max_length=100)
	unit_price: float | None = Field(default=None, ge=0)
	quantity: int | None = Field(default=None, ge=0)
	reorder_level: int | None = Field(default=None, ge=0)
	supplier_id: int | None = Field(default=None, gt=0)


class ProductOut(ProductBase):
	id: int
	created_at: datetime
	updated_at: datetime
	model_config = ConfigDict(from_attributes=True)


class StockMovementCreate(BaseModel):
	product_id: int = Field(gt=0)
	movement_type: Literal["IN", "OUT"]
	quantity: int = Field(gt=0)
	note: str = ""


class StockMovementOut(StockMovementCreate):
	id: int
	created_at: datetime
	model_config = ConfigDict(from_attributes=True)


class DashboardOut(BaseModel):
	total_products: int
	total_units: int
	low_stock_products: int
	total_inventory_value: float
	total_suppliers: int
