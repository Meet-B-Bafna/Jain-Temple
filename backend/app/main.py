from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import connect_db, close_db, database


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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def home():
    return {"message": "Lonavala Jain Darshan API is running!"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


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
        return {"error": "Temple not found"}

    return temple