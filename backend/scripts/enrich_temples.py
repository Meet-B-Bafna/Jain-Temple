import asyncio
from urllib.parse import quote_plus

from app.database import database, connect_db, close_db


TEMPLE_DATA = {
    "01": {
        "address": "Rachna Garden, Bhangarwadi, Lonavala, Maharashtra",
        "location_status": "Needs address confirmation"
    },

    "02": {
        "address": "Varsoli, Lonavala, Maharashtra 410405",
        "location_status": "Address available; pin needs confirmation"
    },

    "03": {
        "address": "Valvan, Lonavala, Maharashtra 410401",
        "location_status": "Address available; pin needs confirmation"
    },

    "04": {
        "address": "Plot 10, Jay Jyot Housing Society, near Toll Plaza, Varsoli, Lonavala 410403",
        "location_status": "Address available; pin needs confirmation"
    },

    "05": {
        "address": "6, Old Mumbai-Pune Highway, Tungarli, Lonavala 410401",
        "location_status": "Needs photo confirmation"
    },

    "06": {
        "address": "Sector E, Plot 17BC, Gold Valley, Lonavala 410403",
        "location_status": "Address available; pin needs confirmation"
    },

    "08": {
        "address": "Gavliwada, Lonavala 410403",
        "location_status": "Address available; pin needs confirmation"
    },

    "09": {
        "address": "61, Old Mumbai-Pune Highway, near Gharkul Society, Valvan, Lonavala 410401",
        "location_status": "Needs photo confirmation"
    },

    "10": {
        "address": "Near Mirage Bungalow, Parshwapuram, Lonavala 410403",
        "location_status": "Needs photo confirmation"
    }
}


async def enrich_temples():
    await connect_db()

    collection = database["temples"]

    for temple_id, details in TEMPLE_DATA.items():

        temple = await collection.find_one(
            {"temple_id": temple_id}
        )

        if not temple:
            print(f"Temple {temple_id} not found")
            continue

        update_fields = {
            "address": details["address"],
            "location_status": details["location_status"]
        }

        # Generate a Maps link only if one doesn't already exist.
        if not temple.get("maps_url"):
            maps_query = quote_plus(
                f"{temple['name']}, {details['address']}"
            )

            update_fields["maps_url"] = (
                f"https://www.google.com/maps/search/?api=1&query={maps_query}"
            )

        await collection.update_one(
            {"temple_id": temple_id},
            {"$set": update_fields}
        )

        print(f"Updated: {temple['name']}")

    print("\nTemple enrichment completed.")

    await close_db()


if __name__ == "__main__":
    asyncio.run(enrich_temples())