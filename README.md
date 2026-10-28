# 🏙️ Smart Civic Complaint & Issue Management System

> **A modern, AI-enabled municipal grievance reporting and resolution platform.**  
> Smart Civic bridges the gap between citizens and municipal authorities by combining intelligent complaint triage, automated department routing, real-time geolocation tracking, and comprehensive service-level auditing into a unified digital ecosystem.

---

[![Node.js](https://img.shields.io/badge/Node.js-18.x%20%7C%2020.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%20%7C%2019-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0%2B-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 📌 Table of Contents

- [Key Features](#-key-features)
- [Screenshots & UI Previews](#-screenshots--ui-previews)
- [System Architecture](#-system-architecture)
- [Project Directory Structure](#-project-directory-structure)
- [Quick Start Guide](#-quick-start-guide)
  - [Option A: Docker Compose (One-Click)](#option-a-docker-compose-one-click)
  - [Option B: Local Bare-Metal Setup](#option-b-local-bare-metal-setup)
- [Default Test Credentials](#-default-test-credentials)
- [API Overview](#-api-overview)
- [Documentation Links](#-documentation-links)
- [Contributing](#-contributing)
- [License](#-license)
- [Credits & Acknowledgments](#-credits--acknowledgments)

---

## ✨ Key Features

- [x] **Citizen Reporting Portal**: Intuitive multi-step grievance submission with GPS map pin-drop, landmark address entry, and high-resolution photo attachments.
- [x] **AI-Powered Triage & Classification**: NLP models classify complaints into appropriate categories (*Roads*, *Sanitation*, *Electricity*, *Water*, *Drainage*) with high confidence.
- [x] **Dynamic Urgency & Hazard Scoring**: Automated sentiment and hazard keyword extraction elevates public safety emergencies to *High* or *Critical* priority.
- [x] **Duplicate Detection**: Spatial geofence matching (within 150m) and cosine text similarity flags redundant submissions to eliminate duplicate work.
- [x] **Department Workflow Engine**: Dedicated consoles for field officers to claim tasks, dispatch repair teams, record notes, and upload resolution proof photos.
- [x] **Interactive Audit Timelines**: Transparent, step-by-step progress history visible to citizens throughout every phase of resolution.
- [x] **Citizen Feedback & Star Ratings**: Citizens can rate service quality (1–5 stars) and submit qualitative reviews upon issue closure.
- [x] **Administrative Analytics & Heatmaps**: City-wide dashboards displaying real-time resolution SLAs, category breakdowns, ward metrics, and heatmaps.
- [x] **Support Ticketing & System Settings**: Built-in helpdesk ticketing for platform inquiries and configurable notification triggers.

---

## 📸 Screenshots & UI Previews

> *High-fidelity mockups of key application modules:*

| Citizen Issue Reporting & Map | Admin Dashboard & Analytics |
| :---: | :---: |
| ![Citizen Portal Mockup](https://raw.githubusercontent.com/udits/smart-civic-complaint-system/main/docs/assets/citizen_preview.png) | ![Admin Dashboard Mockup](https://raw.githubusercontent.com/udits/smart-civic-complaint-system/main/docs/assets/admin_preview.png) |

| Department Task Management | Real-Time Issue Resolution Timeline |
| :---: | :---: |
| ![Department View Mockup](https://raw.githubusercontent.com/udits/smart-civic-complaint-system/main/docs/assets/dept_preview.png) | ![Timeline View Mockup](https://raw.githubusercontent.com/udits/smart-civic-complaint-system/main/docs/assets/timeline_preview.png) |

---

## 🏛️ System Architecture

```text
                                  +-----------------------+
                                  |   React 18 + Vite     |
                                  |   Frontend Client     |
                                  +-----------+-----------+
                                              |
                                              | HTTPS / JSON / Multipart
                                              v
                                  +-----------------------+
                                  |   Node.js + Express   |
                                  |   REST API Gateway    |
                                  +-----+-----------+-----+
                                        |           |
                        Internal HTTP   |           | Mongoose ODM
                                        v           v
                            +---------------+   +-------------------+
                            | Python FastAPI|   | MongoDB Database  |
                            | AI/ML Service |   | (smart_civic_db)  |
                            +---------------+   +-------------------+
```

Detailed architecture diagrams and sequence charts are available in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 📂 Project Directory Structure

```text
smart-civic-complaint-system/
├── backend/                  # Node.js + Express backend service (Port 5000)
│   ├── src/
│   │   ├── config/           # Database and third-party service connections
│   │   ├── constants/        # System-wide enums and configurations
│   │   ├── controllers/      # Route request/response controller logic
│   │   ├── middlewares/      # Auth (JWT), role guard, uploads, error handling
│   │   ├── models/           # Mongoose schemas (User, Complaint, Notification, etc.)
│   │   ├── routes/           # Express router endpoints
│   │   └── utils/            # Notification helpers, database seeder
│   ├── uploads/              # Citizen and resolution photo attachments
│   ├── Dockerfile            # Production Node Alpine container definition
│   └── package.json
├── frontend/                 # React 18 + Vite SPA client (Port 5173)
│   ├── src/                  # Components, pages, hooks, contexts, CSS
│   ├── nginx.conf            # Production Nginx reverse proxy configuration
│   ├── Dockerfile            # Multi-stage Nginx build definition
│   └── package.json
├── ai-service/               # Python 3.11+ FastAPI ML service (Port 8000)
│   ├── app/                  # Classification, priority, deduplication endpoints
│   ├── models/               # Serialized TF-IDF vectorizers & ML models
│   ├── requirements.txt      # Python dependencies
│   └── train.py              # ML training and evaluation script
├── database/                 # Database initialization and schemas
│   ├── schemas.md            # MongoDB collection and index specifications
│   ├── seed.js               # Executable reference database seed runner
│   └── seed.md               # Seeder documentation and mock data breakdown
├── docs/                     # Technical documentation
│   ├── API.md                # Comprehensive REST API specifications
│   ├── SETUP.md              # Installation, local dev, and troubleshooting guide
│   └── ARCHITECTURE.md       # Component topology and security design
├── docker-compose.yml        # Orchestration for MongoDB, Backend, Frontend, & AI
├── .gitignore                # Root gitignore rules
└── README.md                 # Primary project overview
```

---

## 🚀 Quick Start Guide

### Option A: Docker Compose (One-Click)

The easiest way to spin up the entire multi-service stack:

```bash
# 1. Clone repository
git clone https://github.com/udits/smart-civic-complaint-system.git
cd smart-civic-complaint-system

# 2. Build and launch all containers
docker-compose up --build
```

- **Frontend Portal**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **AI Microservice Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

To seed initial mock data inside Docker:
```bash
docker-compose exec backend npm run seed
```

---

### Option B: Local Bare-Metal Setup

#### 1. Start MongoDB
Ensure MongoDB is running locally on port `27017` or obtain a MongoDB Atlas URI.

#### 2. Configure & Run Backend
```bash
cd backend
npm install
cp .env.example .env     # Update MONGO_URI if necessary
npm run seed             # Seed administrative and sample records
npm run dev              # Starts on http://localhost:5000
```

#### 3. Configure & Run Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev              # Starts on http://localhost:5173
```

#### 4. Configure & Run AI Service
```bash
cd ai-service
python -m venv venv
# Activate virtualenv (Windows: .\venv\Scripts\activate | Linux/Mac: source venv/bin/activate)
pip install -r requirements.txt
python train.py
uvicorn app:app --reload --port 8000
```

---

## 🔑 Default Test Credentials

The database seeder pre-configures test credentials for all system roles:

| Role | Portal / Department | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | System Administrator | `admin@civis.gov` | `Admin@123` | Full city-wide administrative control |
| **Department** | Road Maintenance | `road@smartcivic.gov.in` | `Dept@123` | Road damage triage and repairs |
| **Department** | Sanitation | `sanitation@smartcivic.gov.in` | `Dept@123` | Waste management & drainage |
| **Department** | Electricity | `electricity@smartcivic.gov.in` | `Dept@123` | Streetlights and electrical hazards |
| **Citizen** | Raj Kumar | `raj@example.com` | `Citizen@123` | Resident of Thatipur |
| **Citizen** | Priya Sharma | `priya@example.com` | `Citizen@123` | Resident of City Center |

---

## 📡 API Overview

A quick reference of major REST endpoints. For complete request and response schemas, see [docs/API.md](docs/API.md).

| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | Public | Register new citizen account |
| `POST` | `/api/auth/login` | Public | Unified login (Citizen, Dept, Admin) |
| `POST` | `/api/auth/google` | Public | Google OAuth 2.0 Sign-In |
| `GET` | `/api/auth/me` | Protected | Fetch current user session profile |
| `POST` | `/api/complaints` | Citizen / Staff | Submit new grievance with photo |
| `GET` | `/api/complaints` | Protected | List complaints (scoped by role) |
| `GET` | `/api/complaints/stats` | Protected | Aggregated complaint counts & KPIs |
| `PUT` | `/api/complaints/:id/status`| Dept / Admin | Update lifecycle status & upload proof |
| `PUT` | `/api/complaints/:id/assign`| Admin | Reassign complaint to a department |
| `POST` | `/api/complaints/:id/feedback`| Citizen | Submit 1–5 star resolution review |
| `GET` | `/api/departments` | Protected | List all municipal departments |
| `GET` | `/api/notifications` | Protected | Retrieve user notifications inbox |
| `POST` | `http://localhost:8000/classify` | Internal | AI category classification |
| `POST` | `http://localhost:8000/analyze-priority`| Internal | AI urgency & priority scoring |

---

## 📚 Documentation Links

- 📖 [Complete REST API Specification](docs/API.md)
- 🛠️ [Installation, Environment & Setup Guide](docs/SETUP.md)
- 🏗️ [System Architecture & Security Design](docs/ARCHITECTURE.md)
- 🗄️ [Database Schemas & Data Dictionary](database/schemas.md)
- 🌱 [Database Seeder Guide](database/seed.md)

---

## 🤝 Contributing

We welcome community contributions, bug reports, and pull requests!

1. **Fork the Repository**
2. **Create a Feature Branch** (`git checkout -b feature/AmazingCivicFeature`)
3. **Commit your Changes** (`git commit -m 'Add AmazingCivicFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingCivicFeature`)
5. **Open a Pull Request**

Please ensure your code conforms to ES module standards, passes linting checks, and includes relevant documentation.

---

## 📄 License

This project is open-source and distributed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🌟 Credits & Acknowledgments

- **Contributors**: Built with dedication as a Computer Science & Data Science Major Project.
- **Inspiration**: Designed to empower municipal corporations and citizens toward clean, transparent, and responsive governance.
- **Libraries**: Thanks to the open-source communities behind Express, React, Vite, FastAPI, Mongoose, and Scikit-learn.
