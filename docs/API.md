# Smart Civic Complaint & Issue Management System — REST API Specification

This document provides complete, production-grade documentation for all REST API endpoints across the **Smart Civic Backend** (`http://localhost:5000/api`) and the **AI ML Microservice** (`http://localhost:8000`).

---

## 1. Global Conventions & Standards

### Base URLs
- **Backend API**: `http://localhost:5000/api` (Production: `/api` via reverse proxy)
- **AI Microservice**: `http://localhost:8000`

### Response Format
All backend endpoints return responses in the standard JSON structure:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

On errors (`4xx` / `5xx`):
```json
{
  "success": false,
  "message": "Detailed error description",
  "error": "Error details or validation array"
}
```

### Authentication
Protected endpoints require an HTTP `Authorization` header containing a JSON Web Token (JWT):
```http
Authorization: Bearer <your_jwt_token>
```
Tokens are issued upon login or registration and are valid for **7 days**.

---

## 2. Authentication & User Management Endpoints (`/api/auth` & `/api/users`)

### 2.1 Register New Citizen
- **Method & Path**: `POST /api/auth/register`
- **Auth Required**: No
- **Role Restrictions**: Public (Registers citizen accounts)
- **Description**: Registers a new citizen in the system and issues a JWT token.

#### Request Body
```json
{
  "name": "Raj Kumar",
  "email": "raj@example.com",
  "password": "Citizen@123",
  "phone": "+91 98111 22334",
  "area": "Thatipur",
  "ward": "Ward 12 - Central Gwalior",
  "city": "Gwalior",
  "state": "Madhya Pradesh"
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "6710a1b2c3d4e5f6a7b8c9d0",
      "name": "Raj Kumar",
      "email": "raj@example.com",
      "phone": "+91 98111 22334",
      "role": "citizen",
      "area": "Thatipur",
      "ward": "Ward 12 - Central Gwalior",
      "status": "Active"
    }
  }
}
```

---

### 2.2 User Login (Polymorphic: Citizen, Admin, Department)
- **Method & Path**: `POST /api/auth/login`
- **Auth Required**: No
- **Role Restrictions**: Public
- **Description**: Authenticates a user by email and password. Searches across citizens, departments, and admins, returning the role-scoped token and profile.

#### Request Body
```json
{
  "email": "admin@civis.gov",
  "password": "Admin@123"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "6710a1b2c3d4e5f6a7b8c9d1",
      "name": "System Admin",
      "email": "admin@civis.gov",
      "role": "admin",
      "status": "Active"
    }
  }
}
```

---

### 2.3 Google OAuth 2.0 Single Sign-On
- **Method & Path**: `POST /api/auth/google`
- **Auth Required**: No
- **Role Restrictions**: Public
- **Description**: Verifies Google ID Token (JWT) sent from Google Identity Services frontend, logs in existing citizen/admin or creates a new citizen account.

#### Request Body
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFhMmIzY..."
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Google authentication successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "6710a1b2c3d4e5f6a7b8c9d2",
      "name": "Priya Sharma",
      "email": "priya@gmail.com",
      "role": "citizen",
      "avatar": "https://lh3.googleusercontent.com/a/...",
      "authProvider": "google"
    }
  }
}
```

---

### 2.4 Get Current User Profile
- **Method & Path**: `GET /api/auth/me` (alias: `GET /api/users/me`)
- **Auth Required**: Yes (`Bearer <token>`)
- **Role Restrictions**: Any authenticated user
- **Description**: Returns full profile of the currently logged-in user.

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "_id": "6710a1b2c3d4e5f6a7b8c9d0",
    "name": "Raj Kumar",
    "email": "raj@example.com",
    "phone": "+91 98111 22334",
    "role": "citizen",
    "area": "Thatipur",
    "ward": "Ward 12 - Central Gwalior",
    "complaintCount": 4,
    "resolvedComplaints": 2,
    "status": "Active",
    "activity": [
      {
        "_id": "6710a1b2c3d4e5f6a7b8c9d3",
        "desc": "Submitted complaint CMP-1024",
        "time": "Yesterday",
        "timestamp": "2026-10-27T10:00:00.000Z"
      }
    ]
  }
}
```

---

### 2.5 Request Password Reset (Forgot Password)
- **Method & Path**: `POST /api/auth/forgot-password`
- **Auth Required**: No
- **Role Restrictions**: Public
- **Description**: Generates a secure, time-limited reset token and sends an email with the reset link.

#### Request Body
```json
{
  "email": "raj@example.com"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Password reset email sent if an account was found"
}
```

---

### 2.6 Reset Password With Token
- **Method & Path**: `POST /api/auth/reset-password`
- **Auth Required**: No
- **Role Restrictions**: Public
- **Description**: Validates the reset token and updates the user's password.

#### Request Body
```json
{
  "token": "4f8a9e1d2c3b4a5f6e7d8c9b0a1f2e3d",
  "newPassword": "NewStrongPassword@2026"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Password has been successfully reset"
}
```

---

### 2.7 Update Profile
- **Method & Path**: `PUT /api/auth/profile` (alias: `PUT /api/users/me`)
- **Auth Required**: Yes
- **Role Restrictions**: Any authenticated user
- **Description**: Updates profile details (phone, area, ward, language, etc.).

#### Request Body
```json
{
  "phone": "+91 98111 55667",
  "area": "Morar",
  "language": "Hindi"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "6710a1b2c3d4e5f6a7b8c9d0",
    "name": "Raj Kumar",
    "phone": "+91 98111 55667",
    "area": "Morar",
    "language": "Hindi"
  }
}
```

---

### 2.8 Update Password (Authenticated)
- **Method & Path**: `PUT /api/auth/password`
- **Auth Required**: Yes
- **Role Restrictions**: Any authenticated user

#### Request Body
```json
{
  "currentPassword": "Citizen@123",
  "newPassword": "CitizenNew@456"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

## 3. Complaints Endpoints (`/api/complaints`)

### 3.1 Submit New Complaint
- **Method & Path**: `POST /api/complaints`
- **Auth Required**: Yes
- **Role Restrictions**: Any authenticated citizen or staff
- **Content-Type**: `multipart/form-data` or `application/json`
- **Description**: Logs a new civic grievance. If an image is provided, it is stored in `/uploads`. Triggers automated AI categorization, priority assignment, and department routing.

#### Request (Form-Data or JSON)
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `title` | `String` | Yes | Title of complaint |
| `description` | `String` | Yes | Comprehensive description |
| `category` | `String` | No | Category (e.g. 'Road Damage', or inferred by AI) |
| `priority` | `String` | No | Priority ('Low', 'Medium', 'High') |
| `lat` | `Number` | Yes | Latitude coordinate |
| `lng` | `Number` | Yes | Longitude coordinate |
| `area` | `String` | Yes | Neighborhood name |
| `address` | `String` | Yes | Specific address / landmark |
| `image` | `File` | No | Image attachment (JPG, PNG, WebP <= 5MB) |

#### Response (`201 Created`)
```json
{
  "success": true,
  "message": "Complaint submitted successfully",
  "data": {
    "_id": "6710b2c3d4e5f6a7b8c9d011",
    "complaintId": "CMP-1035",
    "title": "Severe pothole on Thatipur main road",
    "description": "Deep hole near petrol pump causing tire damages",
    "category": "Road Damage",
    "priority": "High",
    "severity": "High",
    "status": "Pending",
    "citizen": "6710a1b2c3d4e5f6a7b8c9d0",
    "citizenName": "Raj Kumar",
    "citizenPhone": "+91 98111 22334",
    "department": "6710a1b2c3d4e5f6a7b8c9e1",
    "departmentName": "Road Maintenance",
    "location": { "lat": 26.2124, "lng": 78.2045 },
    "area": "Thatipur",
    "address": "Opposite Indian Oil Pump, Thatipur",
    "image": "/uploads/complaint-1730101234567.jpg",
    "aiAnalysis": {
      "detectedCategory": "Road Damage",
      "detectedPriority": "High",
      "confidence": 0.94,
      "processed": true
    },
    "timeline": [
      {
        "status": "Pending",
        "date": "2026-10-28T06:30:00.000Z",
        "note": "Complaint submitted by citizen",
        "updatedByName": "Raj Kumar"
      }
    ],
    "createdAt": "2026-10-28T06:30:00.000Z"
  }
}
```

---

### 3.2 List Complaints (Paginated & Filtered)
- **Method & Path**: `GET /api/complaints`
- **Auth Required**: Yes
- **Role Restrictions**:
  - `admin`: Can see all complaints across the city.
  - `department`: Automatically scoped to their department's assigned complaints.
  - `citizen`: Scoped to complaints in their vicinity or filed by them.
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `status`: Filter by status (`Pending`, `Assigned`, `In Progress`, `Resolved`, `Rejected`)
  - `category`: Filter by category (`Road Damage`, `Garbage`, `Water`, etc.)
  - `priority`: Filter by priority (`Low`, `Medium`, `High`)
  - `area`: Filter by area (`Thatipur`, `City Center`, `Morar`, etc.)
  - `search`: Keyword query matching `complaintId`, `title`, `description`, or `address`

#### Response (`200 OK`)
```json
{
  "success": true,
  "count": 45,
  "total": 45,
  "totalPages": 5,
  "currentPage": 1,
  "data": [
    {
      "_id": "6710b2c3d4e5f6a7b8c9d011",
      "complaintId": "CMP-1035",
      "title": "Severe pothole on Thatipur main road",
      "category": "Road Damage",
      "priority": "High",
      "status": "Pending",
      "area": "Thatipur",
      "createdAt": "2026-10-28T06:30:00.000Z"
    }
  ]
}
```

---

### 3.3 Get My Complaints (Citizen Portal)
- **Method & Path**: `GET /api/complaints/my`
- **Auth Required**: Yes
- **Role Restrictions**: Authenticated Citizen
- **Description**: Returns all complaints submitted by the requesting user, with aggregated status counts.

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "complaints": [ ... ],
    "stats": {
      "total": 5,
      "pending": 2,
      "inProgress": 1,
      "resolved": 2
    }
  }
}
```

---

### 3.4 Search Complaints
- **Method & Path**: `GET /api/complaints/search?q=pothole`
- **Auth Required**: Yes
- **Role Restrictions**: Any authenticated user
- **Description**: Full-text and regex search across title, description, and ID.

---

### 3.5 Aggregated Complaint Statistics
- **Method & Path**: `GET /api/complaints/stats`
- **Auth Required**: Yes
- **Role Restrictions**: Any authenticated user (Admin/Dept view system-wide stats; Citizen views local stats)

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "total": 128,
    "pending": 34,
    "assigned": 28,
    "inProgress": 22,
    "resolved": 44,
    "resolutionRate": 34.37,
    "byCategory": {
      "Road Damage": 48,
      "Garbage": 32,
      "Streetlight": 24,
      "Water": 14,
      "Drainage": 10
    },
    "byPriority": {
      "High": 40,
      "Medium": 65,
      "Low": 23
    }
  }
}
```

---

### 3.6 Get Complaint by ID
- **Method & Path**: `GET /api/complaints/:id`
- **Auth Required**: Yes
- **Role Restrictions**: Any authenticated user (access checked by scope)
- **Parameters**: `:id` can be either the MongoDB `_id` or the unique `complaintId` (e.g. `CMP-1024`).

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "_id": "6710b2c3d4e5f6a7b8c9d011",
    "complaintId": "CMP-1024",
    "title": "Large pothole on main road",
    "description": "Deep pothole causing severe traffic slowdown",
    "category": "Road Damage",
    "priority": "High",
    "status": "Assigned",
    "citizenName": "Raj Kumar",
    "departmentName": "Road Maintenance",
    "timeline": [ ... ],
    "feedback": null
  }
}
```

---

### 3.7 Update Complaint Status
- **Method & Path**: `PUT /api/complaints/:id/status`
- **Auth Required**: Yes
- **Role Restrictions**: `admin`, `department`
- **Content-Type**: `multipart/form-data` or `application/json`
- **Description**: Updates the lifecycle status of a complaint, records an audit timeline step, and optionally accepts an image (`resolutionImage`) proving completion.

#### Request Body
```json
{
  "status": "Resolved",
  "note": "Pothole filled with quick-setting bituminous concrete"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Complaint status updated to Resolved",
  "data": {
    "complaintId": "CMP-1024",
    "status": "Resolved",
    "resolvedAt": "2026-10-28T09:15:00.000Z",
    "resolutionImage": "/uploads/resolution-1730104500.jpg"
  }
}
```

---

### 3.8 Assign Complaint to Department
- **Method & Path**: `PUT /api/complaints/:id/assign`
- **Auth Required**: Yes
- **Role Restrictions**: `admin` only
- **Description**: Manually assigns or re-routes an issue to a specific municipal department.

#### Request Body
```json
{
  "departmentId": "6710a1b2c3d4e5f6a7b8c9e1",
  "departmentName": "Road Maintenance",
  "note": "Reassigned following site triage"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Complaint assigned to Road Maintenance",
  "data": {
    "complaintId": "CMP-1024",
    "department": "6710a1b2c3d4e5f6a7b8c9e1",
    "departmentName": "Road Maintenance",
    "status": "Assigned"
  }
}
```

---

### 3.9 Submit Citizen Feedback
- **Method & Path**: `POST /api/complaints/:id/feedback`
- **Auth Required**: Yes
- **Role Restrictions**: Citizen owner of the complaint
- **Description**: Allows the citizen who filed the issue to rate the resolution quality (1 to 5 stars) and leave comments once resolved.

#### Request Body
```json
{
  "rating": 5,
  "comment": "Quick turnaround! Repaired cleanly within 24 hours."
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "data": {
    "complaintId": "CMP-1019",
    "feedback": {
      "rating": 5,
      "comment": "Quick turnaround! Repaired cleanly within 24 hours.",
      "submittedAt": "2026-10-28T10:00:00.000Z"
    }
  }
}
```

---

## 4. Notifications Endpoints (`/api/notifications`)

### 4.1 Get User Notifications
- **Method & Path**: `GET /api/notifications`
- **Auth Required**: Yes
- **Role Restrictions**: Any authenticated user
- **Description**: Returns all unread and recent notifications targeted to the requesting user or their role.

#### Response (`200 OK`)
```json
{
  "success": true,
  "unreadCount": 3,
  "data": [
    {
      "_id": "6710c3d4e5f6a7b8c9d01234",
      "title": "Complaint Status Update",
      "message": "Your complaint CMP-1024 has been marked as In Progress.",
      "type": "complaint",
      "priority": "Medium",
      "read": false,
      "relatedEntity": "complaint",
      "relatedId": "CMP-1024",
      "createdAt": "2026-10-28T07:00:00.000Z"
    }
  ]
}
```

---

### 4.2 Mark Notification as Read
- **Method & Path**: `PUT /api/notifications/:id/read`
- **Auth Required**: Yes
- **Role Restrictions**: Notification recipient

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

### 4.3 Mark All Notifications as Read
- **Method & Path**: `PUT /api/notifications/read-all`
- **Auth Required**: Yes
- **Role Restrictions**: Current user

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## 5. Departments Endpoints (`/api/departments`)

### 5.1 List All Departments
- **Method & Path**: `GET /api/departments`
- **Auth Required**: Yes
- **Role Restrictions**: Any authenticated user
- **Description**: Lists all active civic departments along with their categories, head of department, contact info, and operational metrics.

#### Response (`200 OK`)
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "6710a1b2c3d4e5f6a7b8c9e1",
      "departmentId": "DEPT-001",
      "name": "Road Maintenance",
      "code": "ROAD",
      "head": "Rajesh Verma",
      "phone": "+91 98765 43210",
      "email": "road@smartcivic.gov.in",
      "categories": ["Road Damage", "Pothole"],
      "totalComplaints": 42,
      "pendingComplaints": 12,
      "resolvedComplaints": 30,
      "resolutionRate": 71.4,
      "status": "Active"
    }
  ]
}
```

---

### 5.2 Get Department by ID
- **Method & Path**: `GET /api/departments/:id`
- **Auth Required**: Yes
- **Role Restrictions**: Any authenticated user

---

### 5.3 Create Department
- **Method & Path**: `POST /api/departments`
- **Auth Required**: Yes
- **Role Restrictions**: `admin` only

#### Request Body
```json
{
  "name": "Water Supply & Sewage",
  "code": "WATR",
  "head": "Sunil Mehta",
  "email": "water@smartcivic.gov.in",
  "password": "Dept@123",
  "phone": "+91 98333 44556",
  "officeLocation": "Zone 2 Jal Bhawan",
  "categories": ["Water", "Drainage"]
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "message": "Department created successfully",
  "data": { ... }
}
```

---

### 5.4 Update Department Details
- **Method & Path**: `PUT /api/departments/:id`
- **Auth Required**: Yes
- **Role Restrictions**: `admin` only

---

## 6. Analytics Endpoints (`/api/analytics`)

### 6.1 Get City-Wide Analytics Dashboard Metrics
- **Method & Path**: `GET /api/analytics`
- **Auth Required**: Yes
- **Role Restrictions**: `admin`, `department`
- **Description**: Aggregates comprehensive civic data for charts, category distributions, monthly resolution trends, area heatmaps, and department SLAs.

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalComplaints": 340,
      "resolvedComplaints": 275,
      "resolutionRate": 80.88,
      "averageResolutionHours": 32.4
    },
    "byCategory": [
      { "category": "Road Damage", "count": 120, "resolved": 95 },
      { "category": "Garbage", "count": 105, "resolved": 90 },
      { "category": "Streetlight", "count": 65, "resolved": 52 },
      { "category": "Water", "count": 50, "resolved": 38 }
    ],
    "monthlyTrend": [
      { "month": "Jun", "submitted": 45, "resolved": 40 },
      { "month": "Jul", "submitted": 78, "resolved": 65 },
      { "month": "Aug", "submitted": 110, "resolved": 85 },
      { "month": "Sep", "submitted": 62, "resolved": 50 }
    ],
    "areaBreakdown": [
      { "area": "Thatipur", "count": 85 },
      { "area": "City Center", "count": 72 },
      { "area": "Morar", "count": 64 },
      { "area": "Lashkar", "count": 60 }
    ]
  }
}
```

---

## 7. System Settings Endpoints (`/api/settings`)

### 7.1 Get System Settings
- **Method & Path**: `GET /api/settings`
- **Auth Required**: Yes
- **Role Restrictions**: `admin`
- **Description**: Retrieves system organization info, notification preferences, and UI options.

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "orgName": "Smart Civic Complaint System",
    "adminEmail": "admin@civis.gov",
    "phone": "+91 98765 43210",
    "timeZone": "Asia/Kolkata (IST)",
    "language": "English",
    "notifications": {
      "newComplaint": true,
      "highPriority": true,
      "statusUpdates": true,
      "emailNotifs": true
    },
    "preferences": {
      "defaultStatus": "Pending",
      "complaintsPerPage": 10,
      "autoRefresh": true,
      "refreshInterval": "30 seconds"
    }
  }
}
```

---

### 7.2 Update Setting Key or Configuration
- **Method & Path**: `PUT /api/settings/:key` (or `PUT /api/settings`)
- **Auth Required**: Yes
- **Role Restrictions**: `admin` only

#### Request Body
```json
{
  "value": {
    "orgName": "Municipal Corporation of Gwalior - Grievance Portal",
    "notifications": {
      "newComplaint": true,
      "highPriority": true,
      "statusUpdates": true,
      "emailNotifs": true
    }
  }
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Settings updated successfully"
}
```

---

## 8. Support Tickets Endpoints (`/api/support-tickets`)

### 8.1 Create Support Ticket
- **Method & Path**: `POST /api/support-tickets`
- **Auth Required**: Yes
- **Role Restrictions**: Any authenticated user
- **Description**: Submits an administrative or platform support inquiry.

#### Request Body
```json
{
  "subject": "Unable to upload resolution photos larger than 4MB",
  "category": "Bug Report",
  "priority": "High",
  "description": "Getting error payload too large on department field tablet"
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "message": "Support ticket created successfully",
  "data": {
    "_id": "6710d4e5f6a7b8c9d0123456",
    "ticketId": "TKT-1008",
    "subject": "Unable to upload resolution photos larger than 4MB",
    "category": "Bug Report",
    "priority": "High",
    "status": "Open",
    "description": "Getting error payload too large on department field tablet",
    "submittedByName": "Rajesh Verma",
    "createdAt": "2026-10-28T09:00:00.000Z"
  }
}
```

---

### 8.2 List Support Tickets
- **Method & Path**: `GET /api/support-tickets`
- **Auth Required**: Yes
- **Role Restrictions**: `admin` sees all tickets; other roles see their own tickets.

---

### 8.3 Get Support Ticket by ID
- **Method & Path**: `GET /api/support-tickets/:id`
- **Auth Required**: Yes
- **Role Restrictions**: Creator or `admin`

---

### 8.4 Update Support Ticket / Add Response
- **Method & Path**: `PUT /api/support-tickets/:id`
- **Auth Required**: Yes
- **Role Restrictions**: `admin`

#### Request Body
```json
{
  "status": "Resolved",
  "supportResponse": "Increased file upload limit to 10MB in express json parser and multer config."
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Support ticket updated successfully",
  "data": {
    "ticketId": "TKT-1008",
    "status": "Resolved",
    "supportResponse": "Increased file upload limit to 10MB in express json parser and multer config."
  }
}
```

---

## 9. AI Microservice Endpoints (`http://localhost:8000`)

The Python FastAPI microservice leverages NLP and machine learning models for civic complaint classification, automated priority assessment, and duplicate detection.

### 9.1 Classify Complaint Category
- **Method & Path**: `POST /classify`
- **Auth Required**: Optional / Internal service key
- **Description**: Classifies text description into one of the official municipal categories with confidence score.

#### Request Body
```json
{
  "title": "Severe sewage water overflowing into residential driveway",
  "description": "Dark foul-smelling dirty drain water backing up from manhole"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "category": "Drainage",
  "confidence": 0.96,
  "suggestedDepartment": "Sanitation",
  "keywords": ["sewage", "foul-smelling", "drain", "manhole"]
}
```

---

### 9.2 Analyze Complaint Priority & Severity
- **Method & Path**: `POST /analyze-priority`
- **Auth Required**: Optional / Internal
- **Description**: Computes urgency score based on hazard keywords, public safety impacts, and location vulnerability.

#### Request Body
```json
{
  "title": "Exposed high voltage electrical wire hanging over primary school gate",
  "description": "Sparking wire hanging low, children walking directly underneath",
  "category": "Streetlight"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "priority": "High",
  "severity": "Critical",
  "urgencyScore": 0.98,
  "hazardKeywords": ["high voltage", "sparking", "school gate", "children"],
  "recommendedSLA": "2 hours"
}
```

---

### 9.3 Detect Duplicate Civic Complaints
- **Method & Path**: `POST /detect-duplicates`
- **Auth Required**: Optional / Internal
- **Description**: Performs TF-IDF cosine similarity and Haversine distance geofence matching to detect duplicate reports within 150 meters.

#### Request Body
```json
{
  "title": "Huge pothole near Thatipur crossing",
  "description": "Dangerous pothole near the intersection",
  "category": "Road Damage",
  "lat": 26.2124,
  "lng": 78.2045,
  "existingComplaints": [
    {
      "complaintId": "CMP-1024",
      "title": "Large pothole on main road",
      "description": "Deep pothole causing severe traffic slowdown near Thatipur crossing",
      "lat": 26.2125,
      "lng": 78.2044
    }
  ]
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "isDuplicate": true,
  "similarityScore": 0.89,
  "distanceMeters": 14.8,
  "duplicateComplaintId": "CMP-1024",
  "action": "MERGE_OR_LINK"
}
```
