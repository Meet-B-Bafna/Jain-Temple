import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv
from pwdlib import PasswordHash
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.database import database

load_dotenv()

password_hash = PasswordHash.recommended()
security = HTTPBearer()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
TOKEN_EXPIRY_MINUTES = 60 * 8


def hash_password(password: str):
    return password_hash.hash(password)


def verify_password(password: str, hashed_password: str):
    return password_hash.verify(password, hashed_password)


def _create_token(subject: str, role: str):
    if not JWT_SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY is missing from .env")

    expiry = datetime.now(timezone.utc) + timedelta(
        minutes=TOKEN_EXPIRY_MINUTES
    )

    payload = {
        "sub": subject,
        "role": role,
        "exp": expiry
    }

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )


def create_access_token(temple_id: str):
    return _create_token(temple_id, "mandir")


def create_admin_access_token(username: str):
    return _create_token(username, "admin")


async def _get_token_payload(
    credentials: HTTPAuthorizationCredentials
):
    if not JWT_SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY is missing from .env")

    try:
        return jwt.decode(
            credentials.credentials,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    payload = await _get_token_payload(credentials)

    if payload.get("role") != "mandir":
        raise HTTPException(
            status_code=403,
            detail="Mandir representative access required"
        )

    temple_id = payload.get("sub")

    if not temple_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    user = await database["mandir_users"].find_one(
        {"temple_id": temple_id, "is_active": True},
        {"_id": 0, "password_hash": 0}
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Account not found or inactive"
        )

    user["role"] = "mandir"
    return user


async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    payload = await _get_token_payload(credentials)

    if payload.get("role") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Administrator access required"
        )

    username = payload.get("sub")

    if not username or username != os.getenv("ADMIN_USERNAME"):
        raise HTTPException(
            status_code=401,
            detail="Invalid administrator account"
        )

    return {
        "username": username,
        "role": "admin"
    }