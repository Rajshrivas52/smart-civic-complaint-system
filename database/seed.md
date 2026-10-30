# Database Seeding Guide & Documentation

This document describes the database initialization utility (`backend/src/utils/seed.js` and `database/seed.js`) for the **Smart Civic Complaint & Issue Management System**.

---

## 1. Purpose of the Seeder

The seeder populates a fresh or existing MongoDB database (`smart_civic_db`) with necessary initial system state:
- **Default System Settings**: Organization profile, emergency contact numbers, timezone, email alert preferences, and UI defaults.
- **Municipal Departments**: Pre-configured civic departments (`Road Maintenance`, `Sanitation`, `Electricity`) with staff rosters, handled categories, and contact info.
- **Default Administrator**: Master administrative account for managing users, triaging complaints, and configuring system parameters.
- **Test Citizen Accounts**: Realistically profiled citizen users located across distinct municipal areas.
- **Realistic Seed Complaints**: Pre-loaded civic complaints at various lifecycle stages (`Pending`, `Assigned`, `In Progress`, `Resolved`), complete with geolocation coordinates, audit timelines, and descriptions.

---

## 2. Default Seeded Accounts & Credentials

All test accounts use standardized credentials for development and QA testing:

### Administrator
| Name | Email | Password | Role | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| System Admin | `admin@civis.gov` | `Admin@123` | `admin` | Full system access, triage, settings, analytics |

### Municipal Departments
| Department Name | Code | Email | Password | Key Categories | Head |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **Road Maintenance** | `ROAD` | `road@smartcivic.gov.in` | `Dept@123` | Road Damage, Pothole | Rajesh Verma |
| **Sanitation** | `SANI` | `sanitation@smartcivic.gov.in` | `Dept@123` | Garbage, Drainage | Pooja Deshmukh |
| **Electricity** | `ELEC` | `electricity@smartcivic.gov.in` | `Dept@123` | Streetlight, Power Outage | Kunal Singhania |

### Citizens
| Name | Email | Password | Area | Phone |
| :--- | :--- | :--- | :--- | :--- |
| **Raj Kumar** | `raj@example.com` | `Citizen@123` | Thatipur | `+91 98111 22334` |
| **Priya Sharma** | `priya@example.com` | `Citizen@123` | City Center | `+91 98222 33445` |
| **Ramu** | `ramu@gmail.com` | `Citizen@123` | Morar | `+91 98999 88776` |

---

## 3. Seeded Complaints Breakdown

The seeder creates representative complaints showcasing all major statuses and categories:

1. **`CMP-1024`**: "Large pothole on main road"
   - Category: `Road Damage` | Priority: `High` | Status: `Assigned`
   - Area: `Thatipur` | Assigned Dept: `Road Maintenance`
   - Timeline: Submitted -> Assigned
2. **`CMP-1031`**: "Potholes near school entrance"
   - Category: `Road Damage` | Priority: `Medium` | Status: `Pending`
   - Area: `City Center` | Unassigned / Dept: `Road Maintenance`
3. **`CMP-1019`**: "Resurfacing work at Naya Bazar road"
   - Category: `Road Damage` | Priority: `Low` | Status: `Resolved`
   - Area: `Main Market` | Department: `Road Maintenance`
   - Full 4-step resolution timeline with dispatch notes
4. **`CMP-1025`**: "Overflowing community garbage container"
   - Category: `Garbage` | Priority: `High` | Status: `Pending`
   - Area: `Lashkar` | Department: `Sanitation`
5. **`CMP-1026`**: "Broken streetlights along main avenue"
   - Category: `Streetlight` | Priority: `Medium` | Status: `In Progress`
   - Area: `Thatipur` | Department: `Electricity`
6. **`CMP-1028`**: "Blocked storm drainage causing water logging"
   - Category: `Drainage` | Priority: `High` | Status: `Assigned`
   - Area: `Morar` | Department: `Sanitation`

---

## 4. How to Run the Seeder

### Option A: Via Backend npm script (Recommended)
Navigate to the `backend/` directory and execute:
```bash
cd backend
npm run seed
```

### Option B: From Project Root
```bash
node database/seed.js
```

### Option C: Inside Docker Container
If the stack is running via Docker Compose:
```bash
docker-compose exec backend npm run seed
```

---

## 5. Idempotency & Safety

The seeder is designed to be **safe and idempotent**:
- It checks for existing records using unique identifiers (`code` for departments, `email` for users/admins, and `complaintId` for complaints).
- If records already exist, it will NOT duplicate them.
- If department credentials are missing, it safely updates their authentication fields without destroying operational history.
