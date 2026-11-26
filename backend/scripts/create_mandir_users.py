import asyncio
from datetime import datetime, timezone

from app.database import database, connect_db, close_db
from app.auth import hash_password


async def create_accounts():
    await connect_db()

    try:
        temples = await database["temples"].find(
            {},
            {"_id": 0, "temple_id": 1, "name": 1}
        ).sort("temple_id", 1).to_list(length=100)

        if len(temples) != 9:
            print(f"Expected 9 temples, found {len(temples)}.")
            return

        updated = 0

        for temple in temples:
            temple_id = str(temple["temple_id"])
            temple_name = temple["name"]

            username_key = temple_name.strip().casefold()
            permanent_password = f"pedi@{temple_id}"

            await database["mandir_users"].update_one(
                {"temple_id": temple_id},
                {
                    "$set": {
                        "temple_name": temple_name,
                        "username": temple_name,
                        "username_key": username_key,
                        "password_hash": hash_password(permanent_password),
                        "must_change_password": False,
                        "password_updated_at": datetime.now(timezone.utc)
                    },
                    "$setOnInsert": {
                        "is_active": True,
                        "created_at": datetime.now(timezone.utc)
                    }
                },
                upsert=True
            )

            print(f"Temple {temple_id}: Permanent password configured.")
            updated += 1

        print(f"\nAccounts configured successfully: {updated}/9")

    finally:
        await close_db()


if __name__ == "__main__":
    asyncio.run(create_accounts())