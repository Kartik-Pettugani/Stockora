import os

os.environ["DATABASE_URL"] = "sqlite:///./test.db"

import pytest
from fastapi.testclient import TestClient

from app.database import Base, engine
from app.main import app
from app import models  # noqa: F401


@pytest.fixture(autouse=True)
def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


client = TestClient(app)


def test_health_and_readiness():
    assert client.get("/health").json() == {"status": "UP"}
    assert client.get("/ready").json() == {"status": "READY"}


def test_create_list_update_and_delete_product():
    response = client.post(
        "/api/products",
        json={
            "sku": "STK-001",
            "name": "Wireless Scanner",
            "category": "Equipment",
            "unit_price": 75.5,
            "quantity": 10,
            "reorder_level": 3,
        },
    )
    assert response.status_code == 201
    product = response.json()
    assert product["sku"] == "STK-001"
    product_id = product["id"]

    assert client.get("/api/products").json()[0]["id"] == product_id
    update = client.put(f"/api/products/{product_id}", json={"name": "Barcode Scanner"})
    assert update.status_code == 200
    assert update.json()["name"] == "Barcode Scanner"

    assert client.delete(f"/api/products/{product_id}").status_code == 204
    assert client.get(f"/api/products/{product_id}").status_code == 404


def test_duplicate_sku_is_rejected():
    payload = {"sku": "DUP-001", "name": "First Product"}
    assert client.post("/api/products", json=payload).status_code == 201
    duplicate = client.post("/api/products", json=payload)
    assert duplicate.status_code == 409
    assert duplicate.json()["detail"] == "SKU already exists"


def test_stock_movements_update_inventory_and_reject_overselling():
    product = client.post(
        "/api/products",
        json={"sku": "STK-002", "name": "Packing Boxes", "quantity": 5},
    ).json()

    stock_in = client.post(
        "/api/stock",
        json={"product_id": product["id"], "movement_type": "IN", "quantity": 4},
    )
    assert stock_in.status_code == 201
    assert client.get(f"/api/products/{product['id']}").json()["quantity"] == 9

    stock_out = client.post(
        "/api/stock",
        json={"product_id": product["id"], "movement_type": "OUT", "quantity": 3},
    )
    assert stock_out.status_code == 201
    assert client.get(f"/api/products/{product['id']}").json()["quantity"] == 6

    oversell = client.post(
        "/api/stock",
        json={"product_id": product["id"], "movement_type": "OUT", "quantity": 7},
    )
    assert oversell.status_code == 400
    assert oversell.json()["detail"] == "Stock-out exceeds available inventory"


def test_supplier_and_dashboard():
    supplier = client.post("/api/suppliers", json={"name": "Acme Supply"})
    assert supplier.status_code == 201
    supplier_id = supplier.json()["id"]

    product = client.post(
        "/api/products",
        json={
            "sku": "DASH-001",
            "name": "Low Stock Item",
            "unit_price": 12.5,
            "quantity": 2,
            "reorder_level": 5,
            "supplier_id": supplier_id,
        },
    )
    assert product.status_code == 201

    dashboard = client.get("/api/dashboard")
    assert dashboard.status_code == 200
    assert dashboard.json() == {
        "total_products": 1,
        "total_units": 2,
        "low_stock_products": 1,
        "total_inventory_value": 25.0,
        "total_suppliers": 1,
    }
