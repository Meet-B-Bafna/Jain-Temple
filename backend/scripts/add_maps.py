import asyncio

from app.database import database, connect_db, close_db


async def main():
    await connect_db()

    collection = database["temples"]

    await collection.delete_one({"temple_id": "07"})
    print("Duplicate Temple 07 removed.")

    await collection.update_one(
        {"temple_id": "01"},
        {
            "$set": {
                "maps_url": "https://maps.app.goo.gl/oYFfDHKEw14iZNT86"
            }
        }
    )

    print("Temple 01 Maps link updated.")

    print("Total temples:", await collection.count_documents({}))

    await close_db()


if __name__ == "__main__":
    asyncio.run(main())