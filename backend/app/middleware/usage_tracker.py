from fastapi import Request, HTTPException
from ..core.supabase_client import get_supabase

async def check_usage_limit(request: Request):
    # This assumes we have a way to identify the user, e.g., from a JWT token
    # For now, let's look for a user-id header for simplicity,
    # but in production, this should come from the authenticated user context.
    user_id = request.headers.get("X-User-ID")
    if not user_id:
        # If no auth, we might want to skip or fail depending on route
        return

    supabase = get_supabase()
    user_resp = supabase.table('users').select('*').eq('id', user_id).execute()

    if not user_resp.data:
        raise HTTPException(status_code=404, detail="User not found")

    user = user_resp.data[0]

    if user['plan'] == 'free' and user['usage_count'] >= user['monthly_limit']:
        raise HTTPException(status_code=402, detail="Monthly limit reached. Upgrade to Pro.")
