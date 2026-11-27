import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Optional

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.database import connect_db, close_db, database

from app.auth import (
    verify_password,
    create_access_token,
    get_current_user
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
    photos: Optional[list[TemplePhoto]] = None
    seva_options: Optional[list[SevaOption]] = None
    donation_details: Optional[DonationDetails] = None

    class Config:
        extra = "forbid"


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
    ).sort("temple_id", 1).to_list(length=100)

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
