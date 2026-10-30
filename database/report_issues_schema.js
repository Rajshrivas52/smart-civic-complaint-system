/**
 * MongoDB Schema & Index Script for 'reportissues' collection
 * Database: smart_civic_db
 * Collection: reportissues
 */

export const reportIssueDbSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["reportId", "title", "description", "address", "citizen"],
      properties: {
        reportId: {
          bsonType: "string",
          description: "Unique human-readable report identifier (e.g. SC-2026-0001)"
        },
        complaintId: {
          bsonType: "string",
          description: "Cross-reference complaint identifier"
        },
        title: {
          bsonType: "string",
          description: "Brief summary of civic issue"
        },
        description: {
          bsonType: "string",
          description: "Detailed description of problem"
        },
        category: {
          bsonType: "string",
          description: "Civic category (Road Damage, Garbage, Streetlight, Water, etc.)"
        },
        severity: {
          enum: ["Low", "Medium", "High", "Critical"],
          description: "Severity level of civic hazard"
        },
        priority: {
          enum: ["Low", "Medium", "High", "Critical"],
          description: "Resolution priority level"
        },
        status: {
          enum: ["Pending", "Assigned", "In Progress", "Resolved", "Rejected"],
          description: "Current resolution status"
        },
        citizen: {
          bsonType: "objectId",
          description: "Reference to citizen User ID"
        },
        citizenName: {
          bsonType: "string"
        },
        citizenPhone: {
          bsonType: "string"
        },
        citizenEmail: {
          bsonType: "string"
        },
        department: {
          bsonType: ["objectId", "null"],
          description: "Assigned municipal department ID"
        },
        departmentName: {
          bsonType: "string"
        },
        location: {
          bsonType: "object",
          required: ["lat", "lng"],
          properties: {
            lat: { bsonType: "double" },
            lng: { bsonType: "double" }
          }
        },
        area: {
          bsonType: "string",
          description: "City area / ward"
        },
        address: {
          bsonType: "string",
          description: "Specific landmark or street address"
        },
        image: {
          bsonType: ["string", "null"],
          description: "Base64 encoded data URI stored directly in MongoDB document"
        },
        imageMetadata: {
          bsonType: "object",
          properties: {
            contentType: { bsonType: "string" },
            originalName: { bsonType: ["string", "null"] },
            size: { bsonType: "number" },
            uploadedAt: { bsonType: "date" }
          }
        },
        timeline: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["status", "date"],
            properties: {
              status: { bsonType: "string" },
              date: { bsonType: "date" },
              note: { bsonType: "string" },
              updatedByName: { bsonType: "string" }
            }
          }
        }
      }
    }
  }
};
