import asyncio
from datetime import datetime, timezone
from pathlib import Path

import openpyxl

from app.database import database, connect_db, close_db

EXCEL_FILE = Path("data/Lonavala_Jain_Darshan_Real_Data_Starter_Dataset.xlsx")


async def import_temples():
    await connect_db()

    workbook = openpyxl.load_workbook(
        EXCEL_FILE,
        read_only=True,
        data_only=True
    )

    sheet = workbook["Temple Dataset"]

    rows = list(sheet.iter_rows(values_only=True))

    header_row = next(
        i for i, row in enumerate(rows)
        if row and row[0] == "Temple ID"
    )

    headers = list(rows[header_row])

    collection = database["temples"]

    imported = 0

    for row in rows[header_row + 1:]:

        if not row or not row[0]:
            continue

        values = dict(zip(headers, row))

        temple = {
            "temple_id": str(values.get("Temple ID", "")).strip(),
            "name": values.get("Temple Name"),
            "tradition": values.get("Type / Tradition"),
            "address": values.get("Area / Address"),
            "main_deity": values.get("Moolnayak / Main Deity"),
            "morning_timings": values.get("Morning Timings"),
            "evening_timings": values.get("Evening Timings"),
            "contact": values.get("Public Contact"),
            "history": values.get("History / Consecration"),
            "facilities": values.get("Facilities / Notes"),
            "maps_search": values.get("Google Maps Search"),
            "verification_status": values.get("Verification Status"),
            "source": values.get("Source"),
            "updated_at": datetime.now(timezone.utc)
        }

        await collection.update_one(
            {"temple_id": temple["temple_id"]},
            {"$set": temple},
            upsert=True
        )

        imported += 1

    workbook.close()

    print(f"Successfully imported/updated {imported} temples!")

    print("Total temples in MongoDB:", await collection.count_documents({}))

    await close_db()


if __name__ == "__main__":
    asyncio.run(import_temples())