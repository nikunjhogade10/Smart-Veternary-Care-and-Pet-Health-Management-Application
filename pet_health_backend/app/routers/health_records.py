from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class RecordCreate(BaseModel):
    pet_id: int
    record_type: str
    title: str
    description: Optional[str] = None
    record_date: str

records_db = [
    {
        "id": 1,
        "pet_id": 1,
        "record_type": "Vaccination",
        "title": "Annual DHPP & Rabies Booster",
        "description": "Administered annual core vaccines. No adverse reactions observed.",
        "record_date": "2026-03-15"
    },
    {
        "id": 2,
        "pet_id": 1,
        "record_type": "Prescription",
        "title": "NexGard Flea & Tick Treatment",
        "description": "Monthly chewable tablet prescribed for 3 months.",
        "record_date": "2026-02-10"
    },
    {
        "id": 3,
        "pet_id": 1,
        "record_type": "Consultation",
        "title": "Routine Wellness Physical Exam",
        "description": "Heart rate and weight normal. Dental scale check clean.",
        "record_date": "2026-01-20"
    }
]

@router.get("")
@router.get("/")
def list_records(pet_id: Optional[int] = None):
    if pet_id is not None:
        matching = [r for r in records_db if r["pet_id"] == pet_id]
        return {"records": matching if matching else records_db}
    return {"records": records_db}

@router.post("")
@router.post("/")
def create_record(record: RecordCreate):
    new_record = {"id": len(records_db) + 1, **record.dict()}
    records_db.append(new_record)
    return new_record

@router.get("/{record_id}")
def get_record(record_id: int):
    for r in records_db:
        if r["id"] == record_id:
            return r
    return {"error": "Not found"}
