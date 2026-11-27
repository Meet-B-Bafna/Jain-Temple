import os
import asyncio
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

LOCAL_URL = "mongodb://localhost:27017"
ATLAS_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = "lonavala_jain_darshan"

COLLECTIONS = ["temples", "mandir_users"]


async def main():
    if not ATLAS_URL:
        raise ValueError("MONGODB_URL is missing from .env")

    local_client = AsyncIOMotorClient(LOCAL_URL)
    atlas_client = AsyncIOMotorClient(ATLAS_URL)

    try:
        await local_client.admin.command("ping")
        await atlas_client.admin.command("ping")

        print("Local MongoDB connected!")
        print("MongoDB Atlas connected!")

        local_db = local_client[DATABASE_NAME]
        atlas_db = atlas_client[DATABASE_NAME]

        for collection_name in COLLECTIONS:
            source = local_db[collection_name]
            destination = atlas_db[collection_name]

            documents = await source.find({}).to_list(length=None)

            existing_count = await destination.count_documents({})

            if existing_count > 0:
                raise Exception(
                    f"Atlas collection '{collection_name}' "
                    f"already contains {existing_count} documents. "
                    "Migration stopped to prevent overwriting."
                )

            if documents:
                await destination.insert_many(documents)

            final_count = await destination.count_documents({})

            print(
                f"{collection_name}: "
                f"{len(documents)} copied, "
                f"{final_count} verified"
            )

        print("\nMigration completed successfully!")

    finally:
        local_client.close()
        atlas_client.close()


asyncio.run(main())