from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.routers.chatbot import router as chatbot_router
from app.routers.auth import router as auth_router
from app.routers.pets import router as pets_router
from app.routers.vets import router as vets_router
from app.routers.appointments import router as appointments_router
from app.routers.shop import router as shop_router
from app.routers.health_records import router as health_records_router
from app.routers.reminders import router as reminders_router
from app.routers.community import router as community_router
from app.routers.video import router as video_router
import os
import time

for d in ["uploads/users", "uploads/pets", "uploads/health_records"]:
    os.makedirs(d, exist_ok=True)

app = FastAPI(title=settings.APP_NAME, version=settings.API_VERSION, docs_url="/docs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

api_prefix = settings.API_PREFIX

app.include_router(chatbot_router, prefix=f"{api_prefix}/peto", tags=["Peto"])
app.include_router(auth_router, prefix=f"{api_prefix}/auth", tags=["Auth"])
app.include_router(pets_router, prefix=f"{api_prefix}/pets", tags=["Pets"])
app.include_router(vets_router, prefix=f"{api_prefix}/vets", tags=["Vets"])
app.include_router(appointments_router, prefix=f"{api_prefix}/appointments", tags=["Appointments"])
app.include_router(shop_router, prefix=f"{api_prefix}/shop", tags=["Shop"])
app.include_router(health_records_router, prefix=f"{api_prefix}/health-records", tags=["Health Records"])
app.include_router(reminders_router, prefix=f"{api_prefix}/reminders", tags=["Reminders"])
app.include_router(community_router, prefix=f"{api_prefix}/community", tags=["Community"])
app.include_router(video_router, prefix=f"{api_prefix}/video", tags=["Video"])

@app.get("/")
def root():
    return {"name": settings.APP_NAME, "version": settings.API_VERSION}

@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": time.time()}

@app.on_event("startup")
async def startup():
    print(f"Starting {settings.APP_NAME} v{settings.API_VERSION}")
