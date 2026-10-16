from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


def utc_now() -> datetime:
	return datetime.now(timezone.utc)


class Supplier(Base):
	__tablename__ = "suppliers"

	id: Mapped[int] = mapped_column(Integer, primary_key=True)
	name: Mapped[str] = mapped_column(String(150), nullable=False, unique=True, index=True)
	contact_name: Mapped[str] = mapped_column(String(120), default="")
	email: Mapped[str] = mapped_column(String(255), default="")
	phone: Mapped[str] = mapped_column(String(40), default="")
	address: Mapped[str] = mapped_column(Text, default="")
	created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)

	products: Mapped[list["Product"]] = relationship(back_populates="supplier")


class Product(Base):
	__tablename__ = "products"

	id: Mapped[int] = mapped_column(Integer, primary_key=True)
	sku: Mapped[str] = mapped_column(String(80), nullable=False, unique=True, index=True)
	name: Mapped[str] = mapped_column(String(200), nullable=False)
	description: Mapped[str] = mapped_column(Text, default="")
	category: Mapped[str] = mapped_column(String(100), default="")
	unit_price: Mapped[float] = mapped_column(Float, default=0.0)
	quantity: Mapped[int] = mapped_column(Integer, default=0)
	reorder_level: Mapped[int] = mapped_column(Integer, default=0)
	supplier_id: Mapped[int | None] = mapped_column(ForeignKey("suppliers.id"), nullable=True)
	created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)
	updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)

	supplier: Mapped[Supplier | None] = relationship(back_populates="products")
	stock_movements: Mapped[list["StockMovement"]] = relationship(
		back_populates="product", cascade="all, delete-orphan"
	)


class StockMovement(Base):
	__tablename__ = "stock_movements"

	id: Mapped[int] = mapped_column(Integer, primary_key=True)
	product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False, index=True)
	movement_type: Mapped[str] = mapped_column(String(3), nullable=False)
	quantity: Mapped[int] = mapped_column(Integer, nullable=False)
	note: Mapped[str] = mapped_column(Text, default="")
	created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)

	product: Mapped[Product] = relationship(back_populates="stock_movements")
