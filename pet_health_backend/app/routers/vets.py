from fastapi import APIRouter, Query
from math import radians, cos, sin, asin, sqrt

router = APIRouter()

def haversine(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371
    return c * r

vets = [
    {
        "id": 1,
        "name": "Dr. Pardesi",
        "clinic": "Pune Small Animal Clinic",
        "specialization": "Surgery Specialist",
        "experience": "14 years",
        "rating": 4.9,
        "reviews": 320,
        "fee": 500,
        "available": True,
        "emergency": True,
        "address": "7/A, Tadiwala Rd, Rakshalekha Society, Pune, Maharashtra 411001",
        "city": "Pune",
        "lat": 18.5344,
        "lng": 73.8984,
        "phone": "+91 20 2567 8900",
        "timings": "Mon-Sat: 10am-8pm",
        "services": ["Surgery", "Laparoscopy", "Dental", "Ultrasound", "X-Ray"],
        "maps_link": "https://www.google.com/maps/dir//Raksha+Lekha+Cooperative+Housing+Society,+Pune"
    },
    {
        "id": 2,
        "name": "Dr. Leila Fernandez & Dr. Phiroz Khambatta",
        "clinic": "Raintree Veterinary Clinic & Rehabilitation Centre",
        "specialization": "Emergency & Rehabilitation",
        "experience": "20 years",
        "rating": 4.9,
        "reviews": 450,
        "fee": 800,
        "available": True,
        "emergency": True,
        "address": "Uday Baug, Ghorpadi, Pune, Maharashtra 411001",
        "city": "Pune",
        "lat": 18.5130,
        "lng": 73.9052,
        "phone": "+91 98765 43210",
        "timings": "24/7 Emergency",
        "services": ["Emergency Care", "Rehabilitation", "Surgery", "ICU", "Vaccination"],
        "maps_link": "https://www.google.com/maps/dir//Raintree+Veterinary+Clinic+Pune"
    },
    {
        "id": 3,
        "name": "Dr. Gorhe",
        "clinic": "Dr. Gorhe Pet Cover Clinic",
        "specialization": "General Veterinarian",
        "experience": "15 years",
        "rating": 4.8,
        "reviews": 280,
        "fee": 400,
        "available": True,
        "emergency": True,
        "address": "Kothrud Bus Stand Rd, near Sutar Bus Stand, Pune, Maharashtra 411038",
        "city": "Pune",
        "lat": 18.5070,
        "lng": 73.8077,
        "phone": "+91 98234 56789",
        "timings": "Mon-Sun: 9am-9pm",
        "services": ["General Checkup", "Vaccination", "Boarding", "Emergency"],
        "maps_link": "https://www.google.com/maps?q=Dr+Gorhe+Pet+Clinic+Kothrud"
    }
]

@router.get("")
@router.get("/")
def list_vets():
    return {"vets": vets}

@router.get("/{vet_id}")
def get_vet(vet_id: int):
    for vet in vets:
        if vet["id"] == vet_id:
            return vet
    return {"error": "Vet not found"}

@router.get("/nearby/")
def nearby_vets(lat: float = Query(...), lng: float = Query(...)):
    results = []
    for vet in vets:
        distance = haversine(lat, lng, vet["lat"], vet["lng"])
        vet_copy = vet.copy()
        vet_copy["distance_km"] = round(distance, 2)
        results.append(vet_copy)
    results.sort(key=lambda x: x["distance_km"])
    return {"vets": results}

@router.get("/emergency/")
def emergency_vets():
    return {"vets": [v for v in vets if v["emergency"] and v["available"]]}

@router.get("/service/{service_name}")
def vets_by_service(service_name: str):
    return {"vets": [v for v in vets if service_name.lower() in [s.lower() for s in v["services"]]]}

@router.get("/top-rated/")
def top_rated(min_rating: float = 4.5):
    return {"vets": [v for v in vets if v["rating"] >= min_rating]}

