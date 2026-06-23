from fastapi import APIRouter, HTTPException, Request
from app.models.schemas import UserCreate, User
from app.core.supabase_client import get_supabase
from app.core.mpesa_client import initiate_stk_push

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/stk-push")
async def mpesa_stk_push(payload: dict):
    phone = payload.get("phone")
    user_id = payload.get("user_id")

    if not phone or not user_id:
        raise HTTPException(status_code=400, detail="Phone number and User ID required")

    # Clean phone number (must be 254...)
    if phone.startswith("0"):
        phone = "254" + phone[1:]
    elif phone.startswith("+"):
        phone = phone[1:]

    # For Pro plan, we'll set a fixed amount, e.g., 2900 KES
    response = initiate_stk_push(phone, 2900)
    return response

@router.post("/mpesa-callback")
async def mpesa_callback(request: Request):
    data = await request.json()
    result_code = data['Body']['stkCallback']['ResultCode']

    if result_code == 0:
        # Success! Extract metadata
        meta = data['Body']['stkCallback']['CallbackMetadata']['Item']
        # The phone number is usually how we identify the user in simple flows
        # or we could have passed the user_id in the AccountReference
        phone = next(item['Value'] for item in meta if item['Name'] == 'PhoneNumber')

        supabase = get_supabase()
        # Upgrade user based on phone number (Simplified for MVP)
        supabase.table('users').update({
            "plan": "pro",
            "monthly_limit": 1000 # Near unlimited
        }).eq('phone', str(phone)).execute()

    return {"ResultCode": 0, "ResultDesc": "Success"}

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
