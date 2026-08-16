from fastapi import APIRouter

router = APIRouter()

products = [
    {"id": 1, "name": "Heartgard Plus", "category": "Dog", "price": 850, "rating": 4.8, "image": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400", "description": "Deworming tablet for dogs"},
    {"id": 2, "name": "NexGard", "category": "Dog", "price": 1200, "rating": 4.7, "image": "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400", "description": "Tick & flea treatment"},
    {"id": 3, "name": "Pedigree Multivitamin", "category": "Dog", "price": 450, "rating": 4.6, "image": "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400", "description": "Daily vitamins for dogs"},
    {"id": 4, "name": "Revolution Cat", "category": "Cat", "price": 950, "rating": 4.9, "image": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400", "description": "Flea treatment for cats"},
    {"id": 5, "name": "Drontal Cat", "category": "Cat", "price": 380, "rating": 4.7, "image": "https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=400", "description": "Deworming for cats"},
    {"id": 6, "name": "Pet First Aid Kit", "category": "All", "price": 599, "rating": 4.8, "image": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400", "description": "Emergency first aid kit"},
]

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OrderItem(BaseModel):
    id: int
    name: str
    price: int
    quantity: int
    image: Optional[str] = None

class OrderCreate(BaseModel):
    items: List[OrderItem]
    total_amount: int

orders_db = [
    {
        "id": "ORD-9821",
        "items": [
            {
                "name": "NexGard Tick & Flea Treatment",
                "quantity": 1,
                "image": "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400"
            }
        ],
        "totalAmount": 1250,
        "orderDate": "2026-04-10",
        "estimatedDelivery": "Arriving Tomorrow",
        "status": "shipped",
        "trackingNumber": "TRK-771829"
    },
    {
        "id": "ORD-8712",
        "items": [
            {
                "name": "Heartgard Plus Deworming",
                "quantity": 2,
                "image": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400"
            }
        ],
        "totalAmount": 1750,
        "orderDate": "2026-03-28",
        "deliveredDate": "2026-03-30",
        "status": "delivered"
    }
]

@router.get("/products")
def list_products(category: str = None):
    if category:
        return {"products": [p for p in products if p["category"] == category or p["category"] == "All"]}
    return {"products": products}

@router.get("/products/{product_id}")
def get_product(product_id: int):
    for p in products:
        if p["id"] == product_id:
            return p
    return {"error": "Product not found"}

@router.get("/orders")
def list_orders():
    return {"orders": orders_db}

@router.post("/orders")
def create_order(order: OrderCreate):
    new_order = {
        "id": f"ORD-{len(orders_db) + 8800}",
        "items": [i.dict() for i in order.items],
        "totalAmount": order.total_amount,
        "orderDate": datetime.now().strftime("%Y-%m-%d"),
        "status": "processing"
    }
    orders_db.insert(0, new_order)
    return new_order

