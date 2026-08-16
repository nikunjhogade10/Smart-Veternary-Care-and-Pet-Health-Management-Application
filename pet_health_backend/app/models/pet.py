from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Pet(Base):
    __tablename__ = "pets"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    animal_type = Column(String(50), nullable=False)
    breed = Column(String(100), nullable=True)
    age = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)
    gender = Column(String(20), nullable=True)
    vaccination_status = Column(String(50), nullable=True)
    date_of_birth = Column(String(32), nullable=True)
    photo = Column(String(500), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
