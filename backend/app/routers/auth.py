from fastapi import APIRouter, HTTPException, Request
from app.models.schemas import UserCreate, User
from app.core.supabase_client import get_supabase
from app.core.mpesa_client import initiate_stk_push
from app.core.cache import r as redis_client

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/stk-push")
async def mpesa_stk_push(payload: dict):
    phone = payload.get("phone")
    user_id = payload.get("user_id")

    print(f"STK Push Request: phone={phone}, user_id={user_id}")

    if not phone or not user_id:
        raise HTTPException(status_code=400, detail=f"Phone ({phone}) and User ID ({user_id}) required")

    # Clean phone number (must be 254...)
    phone = phone.strip()
    if phone.startswith("0"):
        phone = "254" + phone[1:]
    elif phone.startswith("+"):
        phone = phone[1:]
    elif phone.startswith("7") or phone.startswith("1"):
        phone = "254" + phone

    if not phone.isdigit() or len(phone) < 10:
         raise HTTPException(status_code=400, detail="Invalid phone number format")

    try:
        response = initiate_stk_push(phone, 2900, user_id)

        # If successful, save CheckoutRequestID to Redis to match in callback
        if response.get("ResponseCode") == "0":
            checkout_id = response.get("CheckoutRequestID")
            if redis_client and checkout_id:
                # Store for 1 hour
                redis_client.setex(f"mpesa_checkout:{checkout_id}", 3600, user_id)

        return response
    except Exception as e:
        print(f"MPESA Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"M-Pesa initialization failed. Ensure credentials are correct.")

@router.post("/mpesa-callback")
async def mpesa_callback(request: Request):
    data = await request.json()
    stk_callback = data.get('Body', {}).get('stkCallback', {})
    result_code = stk_callback.get('ResultCode')
    checkout_id = stk_callback.get('CheckoutRequestID')

    if result_code == 0:
        # Success! Lookup user_id from Redis
        user_id = None
        if redis_client and checkout_id:
            user_id = redis_client.get(f"mpesa_checkout:{checkout_id}")

        if user_id:
            supabase = get_supabase()
            supabase.table('users').update({
                "plan": "pro",
                "monthly_limit": 1000
            }).eq('id', user_id).execute()
            print(f"User {user_id} upgraded to PRO via M-Pesa")

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
