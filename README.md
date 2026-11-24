# Lonavala Jain Darshan

A full-stack web app for discovering Jain temples in Lonavala, Maharashtra. Visitors can browse temples with addresses, photos and map links, plan a darshan journey, and learn about seva (service) opportunities.

## Features

- Temple listing with address, photo and Google Maps link
- Pages: **Home**, **Temples**, **Journey**, **Seva**, **About**
- FastAPI backend serving temple data from MongoDB
- Data seeded from a publicly sourced starter dataset (Excel)

## Tech Stack

| Layer    | Technology                                                  |
|----------|-------------------------------------------------------------|
| Frontend | React 19, Vite, Tailwind CSS 4, React Router, Lucide icons  |
| Backend  | Python, FastAPI, Uvicorn                                    |
| Database | MongoDB (via Motor async driver)                            |
| Data     | Excel starter dataset loaded with openpyxl                  |

## Project Structure

```
Jain-Temple/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app and routes
│   │   └── database.py      # MongoDB connection (reads .env)
│   ├── data/                # Starter dataset (.xlsx)
│   ├── scripts/             # Data import / enrichment scripts
│   ├── check_db.py          # Prints database name and temple count
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/      # Navbar, Footer, TempleSection
    │   ├── pages/           # Home, Temples, Journey, Seva, About
    │   └── services/api.js  # API client
    └── package.json
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- A MongoDB database (free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or a local install)

### 1. Clone the repository

```bash
git clone https://github.com/Meet-B-Bafna/Jain-Temple.git
cd Jain-Temple
```

### 2. Backend

```powershell
cd backend
python -m venv venv
venv\Scripts\Activate.ps1          # Windows PowerShell
# source venv/bin/activate          # macOS / Linux
pip install -r requirements.txt
pip install openpyxl                # needed by the import script
```

Create a `backend/.env` file (it is git-ignored, so never commit it):

```env
MONGODB_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/
DATABASE_NAME=jain_darshan
```

Load the temple data (run from the `backend` folder):

```bash
python -m scripts.import_temples     # import temples from the Excel file
python -m scripts.enrich_temples     # add addresses, images, map data
python -m scripts.add_temple_images  # attach photos
python -m scripts.add_maps           # set map links
python check_db.py                   # verify: prints temple count
```

Start the API:

```bash
uvicorn app.main:app --reload
```

The API runs at http://127.0.0.1:8000 and interactive docs are at http://127.0.0.1:8000/docs.

### 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## API Endpoints

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| GET    | `/`                   | API status message             |
| GET    | `/health`             | Health check                   |
| GET    | `/temples`            | List all temples               |
| GET    | `/temples/{temple_id}`| Get a single temple by ID      |

## Notes on Data

Temple details were compiled from public sources. Some records are marked in the data as needing address, pin or photo confirmation, so please verify details before relying on them. Photo links point to third-party sites and may change or break.

## Roadmap

- [ ] Return proper 404 responses for unknown temples
- [ ] Move the API URL and CORS origins to environment variables for deployment
- [ ] Search and filter on the Temples page
- [ ] Seva page connected to verified donation details
- [ ] Deploy backend and frontend

## Author

<<<<<<< HEAD
**Meet Bafna** · [GitHub](https://github.com/Meet-B-Bafna)
=======
**Meet Bafna** · [GitHub](https://github.com/Meet-B-Bafna)
>>>>>>> 896459f (Add README, add openpyxl dependency, remove empty PROJECT_STATE)
