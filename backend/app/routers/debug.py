from fastapi import APIRouter, Header, HTTPException, Depends
from ..models.schemas import DebugRequest, DebugResponse
from ..core.cache import get_cache_key, get_cached_fix, set_cached_fix
from ..core.ai_client import generate_fix
from ..core.github_client import create_pull_request
from ..core.supabase_client import get_supabase
from ..middleware.usage_tracker import check_usage_limit

router = APIRouter(prefix="/api", tags=["debug"])

@router.post("/debug", response_model=DebugResponse, dependencies=[Depends(check_usage_limit)])
async def debug_log(request: DebugRequest, x_user_id: str = Header(...)):
    supabase = get_supabase()

    # 1. Generate hash and check cache
    cache_key = get_cache_key(request.log, request.code)
    cached_fix = get_cached_fix(cache_key)

    fix_generated = ""
    is_cached = False

    if cached_fix:
        fix_generated = cached_fix
        is_cached = True
    else:
        # 2. Call Gemini
        try:
            fix_generated = await generate_fix(request.log, request.code)
            # 3. Cache the result
            set_cached_fix(cache_key, fix_generated)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    # 4. Create GitHub PR
    pr_url = None
    try:
        # Get user's github token from DB
        user_res = supabase.table('users').select('github_token').eq('id', x_user_id).execute()
        token = user_res.data[0].get('github_token') if user_res.data else None

        pr_url = create_pull_request(request.repo_url, request.file_path, fix_generated, token)
    except Exception as e:
        # Don't fail the whole request if PR creation fails, but log it
        print(f"PR Creation failed: {e}")

    # 5. Save history
    supabase.table('debug_history').insert({
        "user_id": x_user_id,
        "log_snippet": request.log[:500], # Truncate for DB
        "code_snippet": request.code[:1000],
        "fix_generated": fix_generated,
        "pr_url": pr_url,
        "cached": is_cached,
        "status": "success"
    }).execute()

    # 6. Increment usage
    supabase.table('users').update({
        "usage_count": supabase.table('users').select('usage_count').eq('id', x_user_id).execute().data[0]['usage_count'] + 1
    }).eq('id', x_user_id).execute()

    return {
        "status": "fixed",
        "pr_url": pr_url,
        "fix_generated": fix_generated,
        "cached": is_cached
    }
