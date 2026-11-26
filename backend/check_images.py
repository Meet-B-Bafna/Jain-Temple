import asyncio

from app.database import database


async def main():
    temples = await database["temples"].find({}).sort("temple_id", 1).to_list(length=100)
    for t in temples:
        print(t["temple_id"], "|", t.get("name"), "|", t.get("image_url"))


asyncio.run(main())