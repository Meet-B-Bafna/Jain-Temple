import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone, timedelta
from typing import Optional

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.database import connect_db, close_db, database

from app.auth import (
    verify_password,
    create_access_token,
    create_admin_access_token,
    get_current_user,
    get_current_admin
)


# -------------------- APPLICATION --------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="Lonavala Jain Darshan API",
    description="Backend API for the Jain Temple Darshan platform",
    version="1.0.0",
    lifespan=lifespan
)


# -------------------- CORS CONFIGURATION --------------------

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------- REQUEST MODELS --------------------

class LoginRequest(BaseModel):
    username: str
    password: str


class TemplePhoto(BaseModel):
    image_url: str
    caption: Optional[str] = None


class SevaOption(BaseModel):
    name: str
    description: Optional[str] = None


class DonationDetails(BaseModel):
    beneficiary_name: Optional[str] = None
    payment_details: Optional[str] = None
    instructions: Optional[str] = None


# Only fields that Mandir Representatives can update.
class TempleUpdateRequest(BaseModel):
    address: Optional[str] = Field(None, max_length=500)
    contact: Optional[str] = Field(None, max_length=200)
    morning_timings: Optional[str] = Field(None, max_length=200)
    evening_timings: Optional[str] = Field(None, max_length=200)
    facilities: Optional[str] = Field(None, max_length=2000)
    history: Optional[str] = Field(None, max_length=5000)
    main_deity: Optional[str] = Field(None, max_length=300)
    tradition: Optional[str] = Field(None, max_length=200)
    establishment_details: Optional[str] = Field(None, max_length=2000)
    pratishtha_details: Optional[str] = Field(None, max_length=2000)

    class Config:
        extra = "forbid"


# Admin can create complete temple records.
class AdminTempleCreateRequest(BaseModel):
    temple_id: str = Field(..., min_length=1, max_length=20)
    name: str = Field(..., min_length=1, max_length=300)

    address: Optional[str] = None
    contact: Optional[str] = None
    morning_timings: Optional[str] = None
    evening_timings: Optional[str] = None

    main_deity: Optional[str] = None
    tradition: Optional[str] = None
    history: Optional[str] = None
    establishment_details: Optional[str] = None
    pratishtha_details: Optional[str] = None
    facilities: Optional[str] = None

    maps_url: Optional[str] = None
    maps_search: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    image_url: Optional[str] = None
    image_source: Optional[str] = None

    photos: list[TemplePhoto] = Field(default_factory=list)
    seva_options: list[SevaOption] = Field(default_factory=list)
    donation_details: Optional[DonationDetails] = None

    class Config:
        extra = "forbid"


# Admin can update all temple information except temple_id.
class AdminTempleUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, max_length=300)

    address: Optional[str] = None
    contact: Optional[str] = None
    morning_timings: Optional[str] = None
    evening_timings: Optional[str] = None

    main_deity: Optional[str] = None
    tradition: Optional[str] = None
    history: Optional[str] = None
    establishment_details: Optional[str] = None
    pratishtha_details: Optional[str] = None
    facilities: Optional[str] = None

    maps_url: Optional[str] = None
    maps_search: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    image_url: Optional[str] = None
    image_source: Optional[str] = None

    photos: Optional[list[TemplePhoto]] = None
    seva_options: Optional[list[SevaOption]] = None
    donation_details: Optional[DonationDetails] = None

    class Config:
        extra = "forbid"


# -------------------- ADMIN LOGIN SECURITY --------------------

ADMIN_MAX_ATTEMPTS = 5
ADMIN_LOCKOUT_MINUTES = 15


def get_admin_attempt_key(request: Request, username: str):
    ip_address = (
        request.client.host
        if request.client
        else "unknown"
    )

    normalized_username = username.strip().casefold()

    return f"{ip_address}:{normalized_username}"


def utc_now_naive():
    return datetime.now(timezone.utc).replace(tzinfo=None)


async def check_admin_lock(attempt_key: str):

    attempt = await database["login_attempts"].find_one(
        {"_id": attempt_key}
    )

    if not attempt:
        return False

    locked_until = attempt.get("locked_until")

    if locked_until and locked_until > utc_now_naive():
        return True

    return False


async def record_admin_failure(attempt_key: str):

    now = utc_now_naive()

    attempt = await database["login_attempts"].find_one(
        {"_id": attempt_key}
    )

    if attempt and attempt.get("locked_until"):
        if attempt["locked_until"] <= now:
            await database["login_attempts"].delete_one(
                {"_id": attempt_key}
            )

    await database["login_attempts"].update_one(
        {"_id": attempt_key},
        {
            "$inc": {"failed_attempts": 1},
            "$setOnInsert": {"created_at": now}
        },
        upsert=True
    )

    attempt = await database["login_attempts"].find_one(
        {"_id": attempt_key}
    )

    if attempt and attempt.get("failed_attempts", 0) >= ADMIN_MAX_ATTEMPTS:
        await database["login_attempts"].update_one(
            {"_id": attempt_key},
            {
                "$set": {
                    "locked_until": now + timedelta(
                        minutes=ADMIN_LOCKOUT_MINUTES
                    )
                }
            }
        )


# -------------------- BASIC APIs --------------------

@app.get("/")
async def home():
    return {
        "message": "Lonavala Jain Darshan API is running!"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }


# -------------------- PUBLIC TEMPLE APIs --------------------

@app.get("/temples")
async def get_temples():

    temples = await database["temples"].find(
        {},
        {"_id": 0}
    ).sort("temple_id", 1).to_list(length=500)

    return {
        "total": len(temples),
        "temples": temples
    }


@app.get("/temples/{temple_id}")
async def get_temple(temple_id: str):

    temple = await database["temples"].find_one(
        {"temple_id": temple_id},
        {"_id": 0}
    )

    if not temple:
        raise HTTPException(
            status_code=404,
            detail="Temple not found"
        )

    return temple


# -------------------- AUTHENTICATION APIs --------------------

@app.post("/admin/login")
async def admin_login(
    data: LoginRequest,
    request: Request
):

    admin_username = os.getenv("ADMIN_USERNAME")
    admin_password_hash = os.getenv("ADMIN_PASSWORD_HASH")

    if not admin_username or not admin_password_hash:
        raise HTTPException(
            status_code=500,
            detail="Admin credentials are not configured"
        )

    attempt_key = get_admin_attempt_key(
        request,
        data.username
    )

    if await check_admin_lock(attempt_key):
        raise HTTPException(
            status_code=429,
            detail="Too many failed attempts. Try again after 15 minutes."
        )

    if (
        data.username.strip() != admin_username
        or not verify_password(
            data.password,
            admin_password_hash
        )
    ):
        await record_admin_failure(attempt_key)

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    await database["login_attempts"].delete_one(
        {"_id": attempt_key}
    )

    token = create_admin_access_token(admin_username)

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": admin_username,
        "role": "admin"
    }


@app.post("/auth/login")
async def mandir_login(data: LoginRequest):

    username_key = data.username.strip().casefold()

    user = await database["mandir_users"].find_one({
        "username_key": username_key,
        "is_active": True
    })

    if not user or not verify_password(
        data.password,
        user["password_hash"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    token = create_access_token(user["temple_id"])

    return {
        "access_token": token,
        "token_type": "bearer",
        "temple_id": user["temple_id"],
        "temple_name": user["temple_name"]
    }


@app.get("/auth/me")
async def get_logged_in_representative(
    current_user: dict = Depends(get_current_user)
):
    return current_user


@app.get("/admin/me")
async def get_logged_in_admin(
    admin: dict = Depends(get_current_admin)
):
    return admin


# -------------------- MANDIR MANAGEMENT API --------------------

@app.patch("/mandir/temple")
async def update_my_temple(
    data: TempleUpdateRequest,
    current_user: dict = Depends(get_current_user)
):

    updates = data.model_dump(
        exclude_unset=True,
        exclude_none=True
    )

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="No changes provided"
        )

    updates["updated_at"] = datetime.now(timezone.utc)

    result = await database["temples"].update_one(
        {
            "temple_id": current_user["temple_id"]
        },
        {
            "$set": updates
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Temple not found"
        )

    updated_temple = await database["temples"].find_one(
        {
            "temple_id": current_user["temple_id"]
        },
        {
            "_id": 0
        }
    )

    return {
        "message": "Temple information updated successfully",
        "temple": updated_temple
    }


# -------------------- ADMIN TEMPLE MANAGEMENT --------------------

@app.get("/admin/temples")
async def admin_get_all_temples(
    admin: dict = Depends(get_current_admin)
):

    temples = await database["temples"].find(
        {},
        {"_id": 0}
    ).sort("temple_id", 1).to_list(length=500)

    return {
        "total": len(temples),
        "temples": temples
    }


@app.get("/admin/temples/{temple_id}")
async def admin_get_temple(
    temple_id: str,
    admin: dict = Depends(get_current_admin)
):

    temple = await database["temples"].find_one(
        {"temple_id": temple_id},
        {"_id": 0}
    )

    if not temple:
        raise HTTPException(
            status_code=404,
            detail="Temple not found"
        )

    return temple


@app.post("/admin/temples")
async def admin_add_temple(
    data: AdminTempleCreateRequest,
    admin: dict = Depends(get_current_admin)
):

    temple_id = data.temple_id.strip()

    existing = await database["temples"].find_one(
        {"temple_id": temple_id}
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Temple ID already exists"
        )

    temple = data.model_dump()

    temple["temple_id"] = temple_id
    temple["name"] = temple["name"].strip()
    temple["created_at"] = datetime.now(timezone.utc)
    temple["updated_at"] = datetime.now(timezone.utc)

    await database["temples"].insert_one(temple)

    return {
        "message": "Temple added successfully",
        "temple_id": temple_id
    }


@app.patch("/admin/temples/{temple_id}")
async def admin_update_temple(
    temple_id: str,
    data: AdminTempleUpdateRequest,
    admin: dict = Depends(get_current_admin)
):

    updates = data.model_dump(
        exclude_unset=True
    )

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="No changes provided"
        )

    if "name" in updates and updates["name"] is not None:
        updates["name"] = updates["name"].strip()

    updates["updated_at"] = datetime.now(timezone.utc)

    result = await database["temples"].update_one(
        {"temple_id": temple_id},
        {"$set": updates}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Temple not found"
        )

    return {
        "message": "Temple updated successfully",
        "temple_id": temple_id
    }


@app.delete("/admin/temples/{temple_id}")
async def admin_delete_temple(
    temple_id: str,
    admin: dict = Depends(get_current_admin)
):

    result = await database["temples"].delete_one(
        {"temple_id": temple_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Temple not found"
        )

    await database["mandir_users"].update_many(
        {"temple_id": temple_id},
        {
            "$set": {
                "is_active": False
            }
        }
    )

    return {
        "message": "Temple deleted successfully",
        "temple_id": temple_id
    }