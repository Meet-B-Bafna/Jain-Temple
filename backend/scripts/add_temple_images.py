import asyncio

from app.database import database, connect_db, close_db


IMAGES = {
    "01": {
    "url": "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9QxvXyS47tVEsVkm--mRx4jXWGmeWatsOdl4SgGE-SZUqeqkfPYQnPTCdI0rgWuOCY4iyfsCyLyD5I8N2rW4lAdJlWNVCvIKHD2jVmrDXKh09Q_EZJaoDy-ocahkGqzopDbC1aR=w1080-h1920-k-no",
    "source": "Google Maps"
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
        "url": "https://lh5.googleusercontent.com/p/AF1QipPuxjCtUFgu0svL--GYKpbCzadyobBtoPESf3x5=w1080-k-no",
        "source": "Google Maps photo listing"
    },
    "08": {
        "url": "https://files.yappe.in/place/small/shree-shatrunjay-adinath-jain-mandir-7589156.webp",
        "source": "Yappe"
    }
}


async def main():
    await connect_db()

    collection = database["temples"]

    # Update Temple 01 location and Google Maps link
    await collection.update_one(
        {"temple_id": "01"},
        {
            "$set": {
                "address": "Siddharth Nagar, near Shivaji Chowk, Lonavala, Maharashtra 410401",
                "latitude": 18.7486065,
                "longitude": 73.4058353,
                "maps_url": "https://maps.app.goo.gl/oYFfDHKEw14iZNT86"
            }
        }
    )

    print("Temple 01 location updated.")

    # Update temple images
    for temple_id, image in IMAGES.items():
        await collection.update_one(
            {"temple_id": temple_id},
            {
                "$set": {
                    "image_url": image["url"],
                    "image_source": image["source"]
                }
            }
        )

        print(f"Image added for temple {temple_id}")

    print("Temple image and location updates completed!")

    await close_db()


if __name__ == "__main__":
    asyncio.run(main())