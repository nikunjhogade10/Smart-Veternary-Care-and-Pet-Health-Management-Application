from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ReminderCreate(BaseModel):
    pet_id: int
    title: str
    description: Optional[str] = None
    due_date: str

class ReminderUpdate(BaseModel):
    status: Optional[str] = None
    title: Optional[str] = None
    due_date: Optional[str] = None

reminders_db = [
    {"id": 1, "pet_id": 1, "title": "Rabies Vaccine", "due_date": "2026-04-22", "status": "pending"},
    {"id": 2, "pet_id": 1, "title": "Monthly Deworming", "due_date": "2026-04-25", "status": "pending"},
]

@router.get("")
@router.get("/")
def list_reminders():
    return {"reminders": reminders_db}

@router.post("")
@router.post("/")
def create_reminder(reminder: ReminderCreate):
    new_reminder = {"id": len(reminders_db) + 1, **reminder.dict(), "status": "pending"}
    reminders_db.append(new_reminder)
    return new_reminder

@router.patch("/{reminder_id}")
def update_reminder(reminder_id: int, reminder: ReminderUpdate):
    for r in reminders_db:
        if r["id"] == reminder_id:
            if reminder.status is not None:
                r["status"] = reminder.status
            if reminder.title is not None:
                r["title"] = reminder.title
            if reminder.due_date is not None:
                r["due_date"] = reminder.due_date
            return r
    return {"error": "Reminder not found"}

