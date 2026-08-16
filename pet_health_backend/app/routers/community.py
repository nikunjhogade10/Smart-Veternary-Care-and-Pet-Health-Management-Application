from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter()

class PostCreate(BaseModel):
    body: str
    pet_name: Optional[str] = None

posts_db = [
    {"id": 1, "author_label": "Rahul & Bruno", "body": "Bruno completed agility training! So proud!", "pet_name": "Bruno", "created_at": "2026-04-19T10:00:00"},
    {"id": 2, "author_label": "Priya & Whiskers", "body": "Looking for a good vet in Koregaon Park. Recommendations?", "pet_name": "Whiskers", "created_at": "2026-04-19T09:00:00"},
    {"id": 3, "author_label": "Amit & Max", "body": "Max turned 2 today! Planning birthday party at The Pet Cafe!", "pet_name": "Max", "created_at": "2026-04-19T08:00:00"},
]

events_db = [
    {"id": "1", "type": "birthday", "title": "Max's 2nd Birthday", "description": "Celebrate at The Pet Cafe!", "event_date": "2026-04-26", "time": "4:00 PM", "location": "The Pet Cafe, Koregaon Park", "lat": 18.5362, "lng": 73.8941},
    {"id": "2", "type": "meetup", "title": "Sunday Dog Meetup", "description": "Weekly meetup at Koregaon Park!", "event_date": "2026-04-20", "time": "7:00 AM", "location": "Koregaon Park", "lat": 18.5362, "lng": 73.8941},
    {"id": "3", "type": "birthday", "title": "Bella's Birthday Party", "description": "Bella turning 3!", "event_date": "2026-04-28", "time": "5:00 PM", "location": "Fat Labrador Cafe, Bavdhan", "lat": 18.5074, "lng": 73.7936},
]

cafes_db = [
    {"id": "1", "name": "The Pet Cafe", "area": "Koregaon Park", "address": "Plot No. 122, Lane 4, N Main Rd", "lat": 18.5362, "lng": 73.8941, "price_per_visit_paise": 90000, "description": "Leash-free zone, grooming, pet menu. Open 12pm-9pm"},
    {"id": "2", "name": "The Fat Labrador Cafe", "area": "Bavdhan", "address": "DSK Ranwara Pool, Shop No.4A", "lat": 18.5074, "lng": 73.7936, "price_per_visit_paise": 80000, "description": "In-house dogs, outdoor seating. Open 10am-10pm"},
    {"id": "3", "name": "The Rustle Nest", "area": "Baner", "address": "Plot No.5, Baner Rd", "lat": 18.5590, "lng": 73.7868, "price_per_visit_paise": 95000, "description": "Outdoor seating, dog-friendly treats. Open 8am-10:30pm"},
    {"id": "4", "name": "German Bakery", "area": "Koregaon Park", "address": "292, N Main Rd, Ragvilas Society", "lat": 18.5362, "lng": 73.8941, "price_per_visit_paise": 70000, "description": "Open seating, water bowls. Open 8am-11pm"},
    {"id": "5", "name": "Fat Cats Cafe", "area": "Kalyani Nagar", "address": "No 18, Nirvana Commercial 3", "lat": 18.5445, "lng": 73.9011, "price_per_visit_paise": 80000, "description": "Pet cupcakes, chew sticks. Open 11am-11pm"},
]

@router.get("/posts")
def list_posts():
    return {"posts": posts_db}

@router.post("/posts")
def create_post(post: PostCreate):
    new_post = {"id": len(posts_db) + 1, "author_label": "You", "body": post.body, "pet_name": post.pet_name, "created_at": datetime.now().isoformat()}
    posts_db.append(new_post)
    return new_post

@router.get("/events")
def list_events():
    return {"events": events_db}

@router.get("/cafes")
def list_cafes():
    return {"cafes": cafes_db}
