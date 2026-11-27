import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient(
        "mongodb://localhost:27017",
        serverSelectionTimeoutMS=5000
    )

    try:
        await client.admin.command("ping")
        print("Local MongoDB connected!")

        db = client["lonavala_jain_darshan"]

        collections = await db.list_collection_names()
        print("Collections:", collections)

        for name in collections:
            count = await db[name].count_documents({})
            print(f"{name}: {count} documents")

    finally:
        client.close()

asyncio.run(main())