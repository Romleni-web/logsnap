from fastapi import APIRouter, Header, HTTPException
from app.core.supabase_client import get_supabase
from app.models.schemas import DashboardStats

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=DashboardStats)
async def get_stats(x_user_id: str = Header(...)):
    supabase = get_supabase()
    user_res = supabase.table('users').select('*').eq('id', x_user_id).execute()

    if not user_res.data:
        raise HTTPException(status_code=404, detail="User not found")

    user = user_res.data[0]

    # Get total runs from debug_history
    history_res = supabase.table('debug_history').select('id', 'cached').eq('user_id', x_user_id).execute()
    total_runs = len(history_res.data)
    cached_hits = sum(1 for item in history_res.data if item['cached'])

    cached_percentage = (cached_hits / total_runs * 100) if total_runs > 0 else 0

    return {
        "total_runs": total_runs,
        "cached_hits": round(cached_percentage, 2),
        "remaining_runs": max(0, user['monthly_limit'] - user['usage_count']),
        "plan": user['plan']
    }

@router.get("/history")
async def get_history(x_user_id: str = Header(...)):
    supabase = get_supabase()
    res = supabase.table('debug_history').select('*').eq('user_id', x_user_id).order('created_at', desc=True).limit(50).execute()
    return res.data
