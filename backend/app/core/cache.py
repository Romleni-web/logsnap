import os
import redis
import hashlib
from dotenv import load_dotenv

load_dotenv()

redis_url = os.environ.get("REDIS_URL")
# Using decode_responses=True so we get strings back from Redis
r = redis.from_url(redis_url, decode_responses=True) if redis_url else None

def get_cache_key(log: str, code: str) -> str:
    combined = f"{log}:{code}"
    return hashlib.sha256(combined.encode()).hexdigest()

def get_cached_fix(key: str):
    if not r:
        return None
    return r.get(key)

def set_cached_fix(key: str, fix: str, ttl: int = 604800): # 7 days
    if not r:
        return
    r.setex(key, ttl, fix)
