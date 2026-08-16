from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.sql import func

from app.core.database import Base


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    pet_id = Column(Integer, ForeignKey("pets.id", ondelete="CASCADE"), nullable=False, index=True)
    vet_id = Column(Integer, nullable=False)
    date = Column(String(64), nullable=False)
    time = Column(String(32), nullable=False)
    type = Column(String(32), nullable=False, default="consultation")
    status = Column(String(32), nullable=False, default="scheduled")
    created_at = Column(DateTime, server_default=func.now())
