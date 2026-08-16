import os
from fastapi import APIRouter
from pydantic import BaseModel
from app.core.config import settings

router = APIRouter()

PETO_SYSTEM_PROMPT = """You are Peto, a pet health assistant for the Pashvik app.
Rules:
- Never start with "I'm so sorry" or sympathy phrases
- Get straight to the point with practical advice
- Give clear first-aid steps immediately
- Keep responses under 100 words
- Use bullet points for steps
- Start with [EMERGENCY] only if life threatening
- Always end with "See a vet if symptoms worsen"
- Be friendly but direct"""

class ChatRequest(BaseModel):
    message: str
    pet_name: str = "your pet"
    pet_type: str = "pet"

class ChatResponse(BaseModel):
    response: str
    is_emergency: bool

@router.post("/chat", response_model=ChatResponse)
async def chat_with_peto(request: ChatRequest):
    api_key = os.getenv("GROQ_API_KEY", settings.GROQ_API_KEY).strip()
    if api_key and api_key != "YOUR_GROQ_API_KEY_HERE":
        try:
            from groq import Groq
            client = Groq(api_key=api_key)
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": PETO_SYSTEM_PROMPT},
                    {"role": "user", "content": f"My {request.pet_type} named {request.pet_name}: {request.message}"}
                ],
                max_tokens=200
            )
            response_text = response.choices[0].message.content
            is_emergency = "[EMERGENCY]" in response_text
            response_text = response_text.replace("[EMERGENCY]", "🚨 EMERGENCY: ")
            return ChatResponse(response=response_text, is_emergency=is_emergency)
        except Exception:
            pass

    # Intelligent local fallback when GROQ API key is not configured
    msg_lower = request.message.lower()
    is_emergency = any(kw in msg_lower for kw in ["bleeding", "unconscious", "poison", "choking", "seizure", "vomiting blood", "collapse"])
    
    if is_emergency:
        fallback = (
            "🚨 EMERGENCY: Please seek immediate veterinary attention!\n"
            "• Keep your pet calm and warm\n"
            "• Do not give any human medicines\n"
            "• Contact the nearest emergency vet clinic right away\n"
            "See a vet immediately."
        )
    else:
        fallback = (
            f"Here is some guidance for {request.pet_name}:\n"
            "• Ensure fresh drinking water is accessible at all times\n"
            "• Monitor appetite, energy level, and behavior closely\n"
            "• Rest and a quiet environment help recovery\n"
            "See a vet if symptoms worsen."
        )
    return ChatResponse(response=fallback, is_emergency=is_emergency)

@router.get("/health")
async def peto_health():
    api_key = os.getenv("GROQ_API_KEY", settings.GROQ_API_KEY).strip()
    return {"status": "ready", "model_configured": bool(api_key and api_key != "YOUR_GROQ_API_KEY_HERE")}
