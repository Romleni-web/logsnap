from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    plan: Optional[str] = None
    usage_count: Optional[int] = None
    github_token: Optional[str] = None

class User(UserBase):
    id: str
    plan: str
    usage_count: int
    monthly_limit: int
    created_at: datetime

    class Config:
        from_attributes = True

class DebugRequest(BaseModel):
    log: str
    code: str
    repo_url: str
    file_path: str

class DebugResponse(BaseModel):
    status: str
    pr_url: Optional[str] = None
    fix_generated: Optional[str] = None
    cached: bool

class HistoryEntry(BaseModel):
    id: str
    log_snippet: str
    code_snippet: str
    fix_generated: str
    pr_url: Optional[str]
    cached: bool
    status: str
    created_at: datetime

class DashboardStats(BaseModel):
    total_runs: int
    cached_hits: float
    remaining_runs: int
    plan: str
