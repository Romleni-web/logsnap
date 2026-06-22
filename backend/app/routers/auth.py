from fastapi import APIRouter, HTTPException
from ..models.schemas import UserCreate, User
from ..core.supabase_client import get_supabase

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register")
async def register(user: UserCreate):
    supabase = get_supabase()
    # Using Supabase Auth
    res = supabase.auth.sign_up({
        "email": user.email,
        "password": user.password
    })

    if res.user:
        # Create user record in our public users table
        supabase.table('users').insert({
            "id": res.user.id,
            "email": user.email,
            "plan": "free",
            "usage_count": 0,
            "monthly_limit": 10
        }).execute()
        return {"message": "User registered successfully"}
    else:
        raise HTTPException(status_code=400, detail="Registration failed")

@router.post("/subscribe")
async def subscribe(user_id: str, plan: str):
    supabase = get_supabase()
    supabase.table('users').update({"plan": plan}).eq("id", user_id).execute()
    return {"message": f"Subscribed to {plan} plan"}
