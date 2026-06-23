import os
import redis
import hashlib
import logging
from dotenv import load_dotenv

load_dotenv()

# Set up logging
logger = logging.getLogger(__name__)

redis_url = os.environ.get("REDIS_URL")
# Using decode_responses=True so we get strings back from Redis
# We use a try block for initialization to handle malformed URLs
try:
    if redis_url:
        r = redis.from_url(redis_url, decode_responses=True, socket_timeout=2)
    else:
        r = None
except Exception as e:
    logger.error(f"Redis initialization failed: {e}")
    r = None

def get_cache_key(log: str, code: str) -> str:
    combined = f"{log}:{code}"
    return hashlib.sha256(combined.encode()).hexdigest()

def get_cached_fix(key: str):
    if not r:
        return None
    try:
        return r.get(key)
    except Exception as e:
        logger.warning(f"Redis get failed (skipping cache): {e}")
        return None

def set_cached_fix(key: str, fix: str, ttl: int = 604800): # 7 days
    if not r:
        return
    try:
        r.setex(key, ttl, fix)
    except Exception as e:
        logger.warning(f"Redis set failed: {e}")
