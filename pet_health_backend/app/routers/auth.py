from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    phone: str

class OTPRequest(BaseModel):
    phone: str
    otp: str

@router.post("/send-otp")
def send_otp(request: LoginRequest):
    print(f"\n{'='*50}")
    print(f"DEV MODE OTP for {request.phone}: 123456")
    print(f"{'='*50}\n")
    return {"message": "OTP sent", "phone": request.phone}

@router.post("/verify-otp")
def verify_otp(request: OTPRequest):
    if request.otp != "123456":
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Invalid OTP. Use 123456 in dev mode")
    return {
        "access_token": "dev_token_123",
        "token_type": "bearer",
        "user": {
            "id": 1,
            "phone": request.phone,
            "full_name": "Pet Parent",
            "profile_image": None,
            "is_profile_complete": True
        }
    }

@router.get("/me")
def get_me():
    return {
        "id": 1,
        "phone": "+91 9876543210",
        "full_name": "Pet Parent",
        "email": "user@pashvik.com",
        "profile_image": None,
        "is_profile_complete": True
    }
