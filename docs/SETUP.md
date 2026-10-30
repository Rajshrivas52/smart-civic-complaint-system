# Smart Civic Complaint & Issue Management System — Complete Setup Guide

This guide provides end-to-end instructions for installing, configuring, running, and troubleshooting the complete Smart Civic Complaint Management platform.

---

## 1. Prerequisites

Ensure your system meets the following software requirements before starting:

- **Node.js**: `v18.0.0` or higher (tested on Node 18, 20, and 22). Verify with `node -v`.
- **npm**: `v9.0.0` or higher. Verify with `npm -v`.
- **Python**: `3.11.x` or higher (with `pip` and `venv`). Verify with `python --version` or `py --version`.
- **MongoDB**: MongoDB Server `v7.0+` locally, OR a free [MongoDB Atlas Cluster](https://www.mongodb.com/cloud/atlas).
- **Git**: Installed and configured on your operating system.
- *(Optional)* **Docker & Docker Compose**: If you prefer containerized deployment.

---

## 2. Cloning the Repository

Open a terminal (PowerShell, Command Prompt, or bash) and clone the repository:

```bash
git clone https://github.com/udits/smart-civic-complaint-system.git
cd smart-civic-complaint-system
```

The repository structure is organized as:
```text
smart-civic-complaint-system/
├── backend/       # Node.js + Express API server
├── frontend/      # React 18 + Vite SPA
├── ai-service/    # Python FastAPI ML microservice
├── database/      # Schemas and database seed utility
├── docs/          # Technical specifications and guides
├── docker-compose.yml
└── README.md
```

---

## 3. Backend Setup

The backend runs on **Node.js + Express** and communicates with MongoDB.

### Step 3.1: Install Dependencies
```bash
cd backend
npm install
```

### Step 3.2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env    # On Windows PowerShell: Copy-Item .env.example .env
```

Open `backend/.env` in your editor and configure the following variables:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/smart_civic_db
JWT_SECRET=super_secret_jwt_key_smart_civic_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Optional: Google OAuth 2.0 Web Client ID
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com

# AI Microservice URL (defaults to http://localhost:8000)
AI_SERVICE_URL=http://localhost:8000
```

> [!NOTE]
> If using **MongoDB Atlas**, set `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smart_civic_db?retryWrites=true&w=majority`.

### Step 3.3: Start the Backend Server
```bash
# In backend/ directory:
npm run dev
```

The backend server starts on `http://localhost:5000`. You can verify health at:
```http
GET http://localhost:5000/api/health
```

---

## 4. Frontend Setup

The frontend is a single-page application built with **React 18**, **Vite**, **React Router 6**, **Lucide Icons**, and **Recharts**.

### Step 4.1: Install Dependencies
In a new terminal window:
```bash
cd frontend
npm install
```

### Step 4.2: Configure Frontend Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env    # On Windows PowerShell: Copy-Item .env.example .env
```

Edit `frontend/.env`:
```env
# Google Maps JavaScript API Key (Optional for map view)
VITE_GOOGLE_MAPS_API_KEY=

# Google OAuth 2.0 Web Client ID (Optional for Google Sign-In)
VITE_GOOGLE_CLIENT_ID=

# Backend API Base URL
VITE_API_URL=http://localhost:5000/api
```

### Step 4.3: Start Frontend Dev Server
```bash
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

## 5. AI Microservice Setup

The AI microservice is built using **Python 3.11+**, **FastAPI**, **Uvicorn**, and **Scikit-learn** for automated complaint category triage, urgency scoring, and duplicate detection.

### Step 5.1: Create & Activate Virtual Environment
In a new terminal window:
```bash
cd ai-service

# Create virtual environment
python -m venv venv

# Activate on Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Or on Windows Command Prompt:
.\venv\Scripts\activate.bat
# Or on Linux/macOS:
source venv/bin/activate
```

### Step 5.2: Install Python Dependencies
```bash
pip install -r requirements.txt
```

*(If requirements.txt is not yet installed: `pip install fastapi uvicorn scikit-learn pydantic numpy requests joblib`)*

### Step 5.3: Train Baseline Models
```bash
python train.py
```
This trains the TF-IDF vectorizer and category classifier on the civic grievance dataset, outputting serialized `.joblib` model files to the `models/` directory.

### Step 5.4: Start the AI FastAPI Server
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```
Verify the AI service is live by opening `http://localhost:8000/docs` in your browser (interactive Swagger UI).

---

## 6. Database Seeding

To quickly populate the system with pre-configured departments, admin accounts, citizens, and realistic test complaints, run the database seeder:

```bash
# From backend directory:
cd backend
npm run seed

# OR from project root:
node database/seed.js
```

Upon completion, you will see confirmation logs:
```text
[Seeder] Seeded department: Road Maintenance (ROAD)
[Seeder] Seeded department: Sanitation (SANI)
[Seeder] Seeded department: Electricity (ELEC)
[Seeder] Seeded admin: System Admin (admin@civis.gov)
[Seeder] Seeded citizen: Raj Kumar (raj@example.com)
[Seeder] Seeded complaint: CMP-1024 - Large pothole on main road
[Seeder] Seeding completed successfully.
```

---

## 7. Default Credentials Reference

Use these credentials to sign in to the platform at `http://localhost:5173/login`:

| Portal Role | Name / Department | Email | Password | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **System Admin** | System Admin | `admin@civis.gov` | `Admin@123` | City-wide dashboard, department assignments, settings, analytics |
| **Department** | Road Maintenance | `road@smartcivic.gov.in` | `Dept@123` | Road Damage complaints, field dispatch, status updates |
| **Department** | Sanitation | `sanitation@smartcivic.gov.in` | `Dept@123` | Waste & drainage complaints, cleaning crews |
| **Department** | Electricity | `electricity@smartcivic.gov.in` | `Dept@123` | Streetlights, power hazard issues |
| **Citizen** | Raj Kumar | `raj@example.com` | `Citizen@123` | Issue submission, tracking, reviews |
| **Citizen** | Priya Sharma | `priya@example.com` | `Citizen@123` | Issue submission, tracking, reviews |
| **Citizen** | Ramu | `ramu@gmail.com` | `Citizen@123` | Issue submission, tracking, reviews |

---

## 8. Docker Deployment Option

To run all 4 components (MongoDB, Backend, Frontend, AI Service) in isolated containers with zero manual installation:

```bash
docker-compose up --build
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- AI Service: `http://localhost:8000`
- MongoDB: `mongodb://localhost:27017`

To run database seeding in Docker:
```bash
docker-compose exec backend npm run seed
```

---

## 9. Troubleshooting Common Issues

### Issue 1: MongoDB Connection Error (`MongooseServerSelectionError`)
- **Cause**: Local MongoDB daemon is stopped or `MONGO_URI` is incorrect.
- **Fix**:
  - Windows: Run `net start MongoDB` or verify the service in `services.msc`.
  - Mac/Linux: Run `brew services start mongodb-community` or `sudo systemctl start mongod`.
  - If using Atlas: Whitelist your current IP address under **Network Access** in the Atlas dashboard.

### Issue 2: CORS Header 'Access-Control-Allow-Origin' Missing
- **Cause**: Frontend origin does not match `CLIENT_URL` in `backend/.env`.
- **Fix**: Check `backend/.env` and verify `CLIENT_URL=http://localhost:5173`. Ensure backend is restarted after changing `.env`.

### Issue 3: Missing Uploads Directory or Image Upload Failure
- **Cause**: The `backend/uploads/` directory does not exist or has restricted write permissions.
- **Fix**: Create `backend/uploads` directory. Backend auto-creates it upon startup, but ensure Windows/Linux user has write permissions.

### Issue 4: Python Virtual Environment Script Execution Restricted (Windows PowerShell)
- **Cause**: PowerShell `ExecutionPolicy` is set to `Restricted`.
- **Fix**: Run PowerShell as Administrator and run:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
  Or activate using the Command Prompt (`.\venv\Scripts\activate.bat`).

### Issue 5: Port Conflicts (`EADDRINUSE 5000` or `5173`)
- **Cause**: A previous process is still running on port 5000 or 5173.
- **Fix**:
  - Windows: Run `netstat -ano | findstr :5000` followed by `taskkill /PID <PID> /F`.
  - Linux/Mac: `lsof -ti :5000 | xargs kill -9`.
