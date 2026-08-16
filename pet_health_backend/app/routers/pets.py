from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class PetCreate(BaseModel):
    name: str
    animal_type: str
    breed: Optional[str] = None
    age: Optional[float] = None
    weight: Optional[float] = None
    gender: Optional[str] = None
    vaccination_status: Optional[str] = None
    date_of_birth: Optional[str] = None
    photo: Optional[str] = None

pets_db = [
    {
        "id": 1,
        "name": "Bruno",
        "animal_type": "Dog",
        "breed": "Golden Retriever",
        "age": 3,
        "weight": 28,
        "gender": "Male",
        "vaccination_status": "Up to date",
        "date_of_birth": "2023-04-12",
        "photo": "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400"
    }
]

@router.get("")
@router.get("/")
def list_pets():
    return {"pets": pets_db}

@router.post("")
@router.post("/")
def create_pet(pet: PetCreate):
    new_pet = {"id": len(pets_db) + 1, **pet.dict()}
    pets_db.append(new_pet)
    return new_pet

@router.get("/{pet_id}")
def get_pet(pet_id: int):
    for pet in pets_db:
        if pet["id"] == pet_id:
            return pet
    return {"error": "Pet not found"}
