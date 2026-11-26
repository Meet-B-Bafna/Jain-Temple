import asyncio

from app.database import database, connect_db, close_db


IMAGES = {
    "01": {
        "url": "/01.webp",
        "source": "Own Photo"
    },
    "02": {
        "url": "https://files.yappe.in/place/small/jayanand-dham-derasar-7589008.webp",
        "source": "Yappe"
    },
    "03": {
        "url": "https://files.yappe.in/place/small/shri-sahasrafana-parasnath-arogyadham-7589117.webp",
        "source": "Yappe"
    },
    "04": {
        "url": "https://files.yappe.in/place/small/shree-1008-mahavir-swami-digambar-jain-mandir-lonavla-11170060.webp",
        "source": "Yappe"
    },
    "05": {
        "url": "https://files.yappe.in/place/small/shantinath-jain-temple-7590121.webp",
        "source": "Yappe"
    },
    "06": {
        "url": "/06.webp",
        "source": "Own Photo"
    },
    "08": {
        "url": "/08.webp",
        "source": "Own Photo"
    },
    "09": {
        "url": "/09.webp",
        "source": "Own Photo"
    }
}


async def main():
    await connect_db()

    collection = database["temples"]

    for temple_id, image in IMAGES.items():

        result = await collection.update_one(
            {"temple_id": temple_id},
            {
                "$set": {
                    "image_url": image["url"],
                    "image_source": image["source"]
                }
            }
        )

        if result.matched_count:
            print(f"Image updated for Temple {temple_id}")
        else:
            print(f"Temple {temple_id} not found")

    print("\nImage updates completed.")

    await close_db()


if __name__ == "__main__":
    asyncio.run(main())