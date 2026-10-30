# Smart Civic Database Architecture & Collections

This directory contains schemas and documentation for the MongoDB database (`smart_civic_db`).

## Database Collections ("Pages in the Database")

In MongoDB, each collection represents a separate logical table or "page" in database management tools like MongoDB Atlas or MongoDB Compass:

1. **`reportissues`** (Dedicated Collection for Report Issue Submissions)
   - **Purpose**: Stores all civic issue reports submitted directly by citizens from the "Report Issue" page (`/citizen/report`).
   - **Mongoose Model**: `backend/src/models/ReportIssue.js`
   - **Image Storage**: Images are stored **directly in the database** as Base64 Data URLs (`image` field) with complete file metadata (`imageMetadata`).
   - **Indexes**:
     - `reportId`: Unique index (e.g. `SC-2026-0001`)
     - Compound index: `{ status: 1, category: 1, priority: 1, departmentName: 1, area: 1 }`

2. **`complaints`**
   - Stores civic complaints tracked by municipal departments and administrative oversight. Synchronized with `reportissues`.

3. **`users`**, **`citizens`**, **`admins`**
   - User profiles and access controls.

4. **`departments`**
   - Municipal departments (Road Maintenance, Sanitation, Electricity, Water).

5. **`notifications`**
   - Real-time civic notifications and status update logs.

6. **`settings`**
   - System configuration and parameters.

---

## How Images are Stored in the Database

Unlike typical filesystem storage which only stores file paths (e.g., `/uploads/image.jpg`), this system converts uploaded images to a **Base64 Data URL** and writes them directly into the MongoDB document:

```json
{
  "_id": { "$oid": "6627f1..." },
  "reportId": "SC-2026-0001",
  "title": "Large pothole on main road",
  "description": "Severe road depression creating traffic risk.",
  "category": "Road Damage",
  "priority": "High",
  "status": "Assigned",
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...",
  "imageMetadata": {
    "contentType": "image/jpeg",
    "originalName": "pothole_evidence.jpg",
    "size": 245780,
    "uploadedAt": { "$date": "2026-10-27T17:30:00.000Z" }
  },
  "createdAt": { "$date": "2026-10-27T17:30:00.000Z" }
}
```

### Advantages of In-Database Image Storage:
- **Portability**: Database backups (`mongodump`) include all reported issue photos.
- **Independence**: Works across multiple server instances without needing shared file disks.
- **Immediate Rendering**: Frontend `<img src={report.image} />` displays instantly without requiring static asset routing or CORS configuration.
- **MongoDB Atlas / Compass**: You can view the document and its image directly when inspecting the `reportissues` collection in Atlas.
