from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class PaymentCreate(BaseModel):
    amount: int
    description: str

@router.post("/create")
def create_payment(payment: PaymentCreate):
    return {"status": "success", "amount": payment.amount, "description": payment.description}
