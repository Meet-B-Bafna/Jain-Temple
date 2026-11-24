import asyncio
from urllib.parse import quote_plus

from app.database import database, connect_db, close_db


TEMPLE_DATA = {
    "01": {
        "address": "Rachna Garden, Bhangarwadi, Lonavala, Maharashtra",
        "image_url": None,
        "image_source": None,
        "location_status": "Needs address confirmation"
    },

    "02": {
        "address": "Varsoli, Lonavala, Maharashtra 410405",
        "image_url": "https://cdn-2.matterport.com/apifs/models/zJjQc2s1r3L/images/ujxR5wK9rei/02.26.2024_12.38.45.jpg?disable=upscale&fit=crop&height=1080&k=apifs%2Fmodels%2FzJjQc2s1r3L%2Fimages%2FujxR5wK9rei%2F02.26.2024_12.38.45.jpg&t=2-3e2f5bd88cc0c05b73f807b8038dcdff81dc7401-1771447038-1&width=1920",
        "image_source": "Jayanand Dham / Matterport",
        "location_status": "Address available; pin needs confirmation"
    },

    "03": {
        "address": "Valvan, Lonavala, Maharashtra 410401",
        "image_url": "https://d3gw4aml0lneeh.cloudfront.net/assets/locations/YinvnTHI8rfC.jpg",
        "image_source": "Tripopola",
        "location_status": "Address available; pin needs confirmation"
    },

    "04": {
        "address": "Plot 10, Jay Jyot Housing Society, near Toll Plaza, Varsoli, Lonavala 410403",
        "image_url": "https://pub-d3a00d85e9c34cc0b1db1cfc0b808417.r2.dev/App_Themes/Temple/gallery/image_17745_KundKund-Lonavala-Pune-11.JPG",
        "image_source": "JainStavan",
        "location_status": "Address available; pin needs confirmation"
    },

    "05": {
        "address": "6, Old Mumbai-Pune Highway, Tungarli, Lonavala 410401",
        "image_url": None,
        "image_source": None,
        "location_status": "Needs photo confirmation"
    },

    "06": {
        "address": "Sector E, Plot 17BC, Gold Valley, Lonavala 410403",
        "image_url": "https://pub-d3a00d85e9c34cc0b1db1cfc0b808417.r2.dev/App_Themes/Temple/gallery/image_18483_MuniSuvratNath-GoldValleyE-Lonavala-Pune-14.JPG",
        "image_source": "JainStavan",
        "location_status": "Address available; pin needs confirmation"
    },

    "07": {
        "address": "Priyadarshini Sankul, near Gaothan, Lonavala 410401",
        "image_url": "https://d3gw4aml0lneeh.cloudfront.net/assets/locations/13995/5tJgpXGT4XF7.jpg",
        "image_source": "Tripopola",
        "location_status": "Address available; pin needs confirmation"
    },

    "08": {
        "address": "Gavliwada, Lonavala 410403",
        "image_url": "https://d3gw4aml0lneeh.cloudfront.net/assets/locations/13997/p7cotshfQ7Q5.jpg",
        "image_source": "Tripopola",
        "location_status": "Address available; pin needs confirmation"
    },

    "09": {
        "address": "61, Old Mumbai-Pune Highway, near Gharkul Society, Valvan, Lonavala 410401",
        "image_url": None,
        "image_source": None,
        "location_status": "Needs photo confirmation"
    },

    "10": {
        "address": "Near Mirage Bungalow, Parshwapuram, Lonavala 410403",
        "image_url": None,
        "image_source": None,
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

        maps_query = quote_plus(
            f"{temple['name']}, {details['address']}"
        )

        maps_url = (
            f"https://www.google.com/maps/search/?api=1&query={maps_query}"
        )

        await collection.update_one(
            {"temple_id": temple_id},
            {
                "$set": {
                    "address": details["address"],
                    "image_url": details["image_url"],
                    "image_source": details["image_source"],
                    "maps_url": maps_url,
                    "location_status": details["location_status"]
                }
            }
        )

        print(f"Updated: {temple['name']}")

    print("\nAll temple records processed.")

    await close_db()


if __name__ == "__main__":
    asyncio.run(enrich_temples())