from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class DailyRoomBody(BaseModel):
    appointment_id: int

@router.post("/room")
def create_daily_room(body: DailyRoomBody):
    return {
        "url": f"https://pashvik.daily.co/room-{body.appointment_id}",
        "room_name": f"room-{body.appointment_id}"
    }
