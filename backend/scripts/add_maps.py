import asyncio

from app.database import database, connect_db, close_db


async def main():
    await connect_db()

    collection = database["temples"]

    temples = await collection.find(
        {},
        {
            "_id": 0,
            "temple_id": 1,
            "name": 1,
            "maps_url": 1
        }
    ).sort("temple_id", 1).to_list(length=100)

    print("\nTEMPLE DATABASE VERIFICATION\n")

    for temple in temples:
        print(
            f"{temple['temple_id']} | "
            f"{temple['name']} | "
            f"Maps: {'Available' if temple.get('maps_url') else 'Missing'}"
        )

    print("\nTotal temples:", len(temples))

    await close_db()


if __name__ == "__main__":
    asyncio.run(main())