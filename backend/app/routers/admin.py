from fastapi import APIRouter, Header, HTTPException
from app.core.supabase_client import get_supabase
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/stats")
async def get_admin_stats(x_user_id: str = Header(...)):
    supabase = get_supabase()

    # Simple Admin Check: In production, check a 'role' column in DB
    # user = supabase.table('users').select('role').eq('id', x_user_id).execute()

    # Get all users
    users_res = supabase.table('users').select('*').execute()
    users = users_res.data

    # Get all history
    history_res = supabase.table('debug_history').select('*').execute()
    history = history_res.data

    # Calculate stats
    total_users = len(users)
    total_runs = len(history)
    pro_users = len([u for u in users if u['plan'] == 'pro'])

    # Group runs by day for the graph
    today = datetime.now()
    daily_stats = []
    for i in range(7):
        date = (today - timedelta(days=i)).strftime('%Y-%m-%d')
        count = len([h for h in history if h['created_at'].startswith(date)])
        daily_stats.append({"date": date, "runs": count})

    daily_stats.reverse()

    return {
        "total_users": total_users,
        "total_runs": total_runs,
        "pro_users": pro_users,
        "conversion_rate": round((pro_users / total_users * 100), 2) if total_users > 0 else 0,
        "daily_activity": daily_stats,
        "users_list": users[:10] # Top 10 users for the table
    }
