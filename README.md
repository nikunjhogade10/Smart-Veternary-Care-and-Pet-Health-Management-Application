# Pashvik - Luxury Pet Health Application

![Pashvik Banner](https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&auto=format&fit=crop&q=80)

**Pashvik** is a premium, full-stack pet healthcare & telemedicine mobile-first web application. Designed for modern pet parents, Pashvik provides seamless access to expert veterinary care, AI-driven health triage, electronic health records, medication reminders, curated pet supplies, and local pet community events.

---

## Key Features

### Pet Profile Management
- **Multi-Pet Management**: Register and switch between multiple pet profiles (Dogs, Cats, Birds, and Exotic pets).
- **Photo Uploads**: Interactive photo picker supporting instant preview and base64 storage.
- **Health Snapshot**: Tracks breed, age, weight, gender, date of birth, and vaccination status.

### Veterinary Consultations & Telemedicine
- **Flexible Consultation Modes**: Book **Video Calls**, **Live Chat**, **Home Visits**, or trigger **Emergency SOS**.
- **Specialist Directory**: Filter veterinarians by specialization (General Surgery, Emergency & Rehab, Dental, Nutrition, Exotics).
- **Detailed Vet Profiles**: View clinic details, years of experience, ratings, reviews, fees, working hours, and ETA for home visits.
- **Slot Booking**: Select preferred dates and times with instant confirmation popups.

### Interactive Maps & Directions
- **Interactive Leaflet Maps**: View nearby clinics and pet-friendly venues on a custom map with interactive markers.
- **Google Maps Integration**: Direct links to open turn-by-turn driving directions to clinics and pet cafes.

### Peto — AI Pet Health Assistant
- **AI-Powered Triage**: Powered by LLM (Groq Llama 3.3 70B) to deliver instant first-aid guidance and triage advice.
- **Emergency Warnings**: Automatically detects life-threatening symptoms and highlights red-flag emergency alerts (`EMERGENCY`).

### Digital Electronic Health Records (EHR)
- **Centralized Health History**: Timeline of medical records, vaccination logs, prescription histories, and wellness physical exams per pet.
- **Downloadable Reports**: One-click option to access and download PDF/digital health reports.

### Smart Health & Medication Reminders
- **Custom Care Alerts**: Set up reminders for Rabies boosters, monthly deworming, grooming, or check-ups.
- **Interactive Completion**: Mark reminders complete with real-time API state persistence (`PATCH /reminders/{id}`).

### Pet Shop & Order Tracking
- **Curated E-Commerce Store**: Browse essential health products, flea/tick treatments (NexGard, Heartgard), and first-aid kits.
- **Live Cart System**: Add items, adjust quantities, calculate delivery fees, and complete simulated checkouts.
- **Order History**: Track active and completed orders with tracking numbers and delivery estimates.

### Pet Parent Community & Venues
- **Community Feed**: Share training updates, ask for local recommendations, and post pet milestones.
- **Pune Pet Cafes & Meetups**: Discover top pet-friendly cafes (The Pet Cafe, German Bakery, Fat Cats Cafe) and RSVP for pet birthday parties or Sunday meetups.

---

## Technology Stack

### **Frontend**
- **Framework**: React 18 with Vite 6
- **Routing**: React Router 7
- **Language**: TypeScript
- **Styling**: TailwindCSS 4, Custom CSS Design System
- **Animations**: Motion (`framer-motion`)
- **Icons**: Lucide React
- **Maps**: Leaflet & React-Leaflet

### **Backend**
- **Framework**: FastAPI (Python 3.11+)
- **Server**: Uvicorn
- **AI Engine**: Groq API (`llama-3.3-70b-versatile`)
- **Validation**: Pydantic v2
- **CORS**: FastAPI CORSMiddleware

---

## Project Structure

```
Luxury Pet Health App UI/
├── index.html
├── package.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.ts
│   │   ├── components/
│   │   │   ├── BottomNav.tsx
│   │   │   ├── MobileContainer.tsx
│   │   │   ├── PetoButton.tsx
│   │   │   ├── VetsMap.tsx
│   │   │   └── figma/
│   │   └── screens/
│   │       ├── Splash.tsx
│   │       ├── Login.tsx
│   │       ├── AddPet.tsx
│   │       ├── Dashboard.tsx
│   │       ├── Pets.tsx
│   │       ├── Consultation.tsx
│   │       ├── VetDetail.tsx
│   │       ├── BookAppointment.tsx
│   │       ├── VideoCall.tsx
│   │       ├── ChatConsultation.tsx
│   │       ├── Shop.tsx
│   │       ├── Cart.tsx
│   │       ├── OrderHistory.tsx
│   │       ├── Records.tsx
│   │       ├── Reminders.tsx
│   │       ├── Peto.tsx
│   │       ├── Community.tsx
│   │       ├── NearbyVets.tsx
│   │       ├── Telemedicine.tsx
│   │       ├── Premium.tsx
│   │       ├── Profile.tsx
│   │       ├── Settings.tsx
│   │       ├── HelpSupport.tsx
│   │       ├── PaymentMethods.tsx
│   │       └── About.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── cartStore.ts
│   │   ├── config.ts
│   │   ├── maps.ts
│   │   ├── session.ts
│   │   └── vetAdapters.ts
│   └── styles/
└── pet_health_backend/
    ├── app/
    │   ├── main.py
    │   ├── core/
    │   ├── routers/
    │   │   ├── auth.py
    │   │   ├── pets.py
    │   │   ├── vets.py
    │   │   ├── appointments.py
    │   │   ├── shop.py
    │   │   ├── health_records.py
    │   │   ├── reminders.py
    │   │   ├── community.py
    │   │   ├── chatbot.py
    │   │   ├── video.py
    │   │   └── payments.py
    │   ├── schemas/
    │   └── models/
    ├── requirements.txt
    └── .env.example
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18+ and `npm`
- **Python**: 3.11+ and `pip`

---

### 1. Frontend Setup

Install dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
> The frontend app will run at `http://localhost:5173` (or `http://localhost:5174`).

---

### 2. Backend Setup

Navigate to the backend folder:
```bash
cd pet_health_backend
```

Create a virtual environment and activate it:
```bash
# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate

# Windows
python -m venv .venv
.venv\Scripts\activate
```

Install Python dependencies:
```bash
pip install -r requirements.txt
```

Run the FastAPI backend server:
```bash
python -m uvicorn app.main:app --port 8000 --reload
```
> The backend server will run at `http://127.0.0.1:8000`. API Swagger Documentation is available at `http://127.0.0.1:8000/docs`.

---

### 3. Running Both Concurrently

You can run both the frontend dev server and FastAPI backend together using:
```bash
npm run start
```

---

## Authentication (Dev Mode)

- Enter any valid 10-digit mobile number (e.g. `9876543210`).
- Use the development OTP: **`123456`**.

---

## API Endpoints Overview

| Service | Method | Path | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/v1/auth/send-otp` | Request OTP for mobile number |
| **Auth** | `POST` | `/api/v1/auth/verify-otp` | Verify OTP & receive bearer token |
| **Auth** | `GET` | `/api/v1/auth/me` | Fetch active user session profile |
| **Pets** | `GET` | `/api/v1/pets` | List user pets |
| **Pets** | `POST` | `/api/v1/pets` | Create a new pet profile |
| **Vets** | `GET` | `/api/v1/vets` | List all veterinarians & search |
| **Vets** | `GET` | `/api/v1/vets/{id}` | Get veterinarian profile by ID |
| **Appointments** | `GET` | `/api/v1/appointments` | List booked appointments |
| **Appointments** | `POST` | `/api/v1/appointments` | Book new vet appointment |
| **Reminders** | `GET` | `/api/v1/reminders` | List pet health reminders |
| **Reminders** | `POST` | `/api/v1/reminders` | Create custom reminder |
| **Reminders** | `PATCH` | `/api/v1/reminders/{id}` | Mark reminder as completed |
| **Health Records** | `GET` | `/api/v1/health-records` | Fetch pet medical records |
| **Shop** | `GET` | `/api/v1/shop/products` | Browse pet shop products |
| **Shop** | `GET` | `/api/v1/shop/orders` | Fetch user order history |
| **Shop** | `POST` | `/api/v1/shop/orders` | Checkout and place new order |
| **Peto AI** | `POST` | `/api/v1/peto/chat` | Send message to Peto AI bot |
| **Community** | `GET` | `/api/v1/community/posts` | List community posts |
| **Community** | `POST` | `/api/v1/community/posts` | Create new community post |

---
