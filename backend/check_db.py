import asyncio
from app.database import database

async def main():
    print("Database:", database.name)
    count = await database["temples"].count_documents({})
    print("Temple count:", count)

asyncio.run(main())
