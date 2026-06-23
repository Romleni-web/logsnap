from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import debug, dashboard, auth, health, admin

app = FastAPI(title="LogSnap API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://logsnap-kpp8.vercel.app",
        "https://logsnap-frontend.vercel.app",
        "https://logsnap-kpp8-romleni-webs-projects.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(debug.router)
app.include_router(dashboard.router)
app.include_router(auth.router)
app.include_router(health.router)
app.include_router(admin.router)

@app.get("/")
async def root():
    return {"message": "Welcome to LogSnap API"}
