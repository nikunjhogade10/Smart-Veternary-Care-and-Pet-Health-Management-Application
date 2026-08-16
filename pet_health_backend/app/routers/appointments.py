from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class AppointmentCreate(BaseModel):
    vet_id: int
    pet_id: int
    date: str
    time: str
    type: Optional[str] = "consultation"

from app.routers.vets import vets
from app.routers.pets import pets_db

appointments_db = [
    {
        "id": 1,
        "vet_id": 1,
        "vet_name": "Dr. Pardesi",
        "vet_image": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
        "pet_id": 1,
        "pet_name": "Bruno",
        "date": "2026-04-22",
        "time": "10:00 AM",
        "type": "video",
        "status": "confirmed"
    },
    {
        "id": 2,
        "vet_id": 2,
        "vet_name": "Dr. Leila Fernandez & Dr. Phiroz Khambatta",
        "vet_image": "https://images.unsplash.com/photo-1594824813571-215f05353108?w=400",
        "pet_id": 1,
        "pet_name": "Bruno",
        "date": "2026-03-10",
        "time": "02:30 PM",
        "type": "home",
        "status": "completed"
    }
]

@router.get("")
@router.get("/")
def list_appointments():
    return {"appointments": appointments_db}

@router.post("")
@router.post("/")
def create_appointment(apt: AppointmentCreate):
    vet_name = "Dr. Pardesi"
    vet_image = None
    for v in vets:
        if v["id"] == apt.vet_id:
            vet_name = v["name"]
            vet_image = v.get("image")
            break
            
    pet_name = "Bruno"
    for p in pets_db:
        if p["id"] == apt.pet_id:
            pet_name = p["name"]
            break

    new_apt = {
        "id": len(appointments_db) + 1,
        "vet_id": apt.vet_id,
        "vet_name": vet_name,
        "vet_image": vet_image,
        "pet_id": apt.pet_id,
        "pet_name": pet_name,
        "date": apt.date,
        "time": apt.time,
        "type": apt.type or "video",
        "status": "confirmed"
    }
    appointments_db.append(new_apt)
    return new_apt

@router.get("/{appointment_id}")
def get_appointment(appointment_id: int):
    for apt in appointments_db:
        if apt["id"] == appointment_id:
            return apt
    return {"error": "Not found"}
