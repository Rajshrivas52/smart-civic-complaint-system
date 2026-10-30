import mongoose from 'mongoose';
import {
  COMPLAINT_STATUSES,
  COMPLAINT_CATEGORIES,
  COMPLAINT_PRIORITIES,
  COMPLAINT_SEVERITIES
} from '../constants/civicConstants.js';

const timelineEntrySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    default: ''
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedByName: {
    type: String,
    default: 'System'
  }
}, { _id: true });

const reportIssueSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  complaintId: {
    type: String,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Issue title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Issue description is required']
  },
  category: {
    type: String,
    enum: COMPLAINT_CATEGORIES,
    default: 'Other',
    index: true
  },
  priority: {
    type: String,
    enum: COMPLAINT_PRIORITIES,
    default: 'Medium',
    index: true
  },
  severity: {
    type: String,
    enum: COMPLAINT_SEVERITIES,
    default: 'Medium'
  },
  status: {
    type: String,
    enum: COMPLAINT_STATUSES,
    default: 'Pending',
    index: true
  },
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Citizen',
    required: true,
    index: true
  },
  citizenName: {
    type: String,
    required: true
  },
  citizenPhone: {
    type: String,
    default: 'Not Provided'
  },
  citizenEmail: {
    type: String,
    default: 'Not Provided'
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    default: null,
    index: true
  },
  departmentName: {
    type: String,
    default: 'Unassigned',
    index: true
  },
  location: {
    lat: {
      type: Number,
      required: [true, 'Latitude coordinate is required']
    },
    lng: {
      type: Number,
      required: [true, 'Longitude coordinate is required']
    }
  },
  area: {
    type: String,
    required: [true, 'Area or neighborhood is required'],
    index: true
  },
  address: {
    type: String,
    required: [true, 'Specific address/landmark is required']
  },
  // Image stored directly in the database as a Base64 data URL
  image: {
    type: String,
    default: null
  },
  // Detailed metadata for the database-stored image
  imageMetadata: {
    contentType: { type: String, default: 'image/jpeg' },
    originalName: { type: String, default: null },
    size: { type: Number, default: 0 },
    uploadedAt: { type: Date, default: Date.now }
  },
  timeline: [timelineEntrySchema],
  feedback: {
    rating: { type: Number, min: 1, max: 5, default: null },
    comment: { type: String, default: null },
    submittedAt: { type: Date, default: null }
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  aiAnalysis: {
    detectedCategory: { type: String, default: null },
    detectedPriority: { type: String, default: null },
    confidence: { type: Number, default: null },
    processed: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
  collection: 'reportissues' // Explicitly sets the collection name / separate page in the database
});

// Compound index for frequent queries and filtering
reportIssueSchema.index({ status: 1, category: 1, priority: 1, departmentName: 1, area: 1 });

const ReportIssue = mongoose.model('ReportIssue', reportIssueSchema, 'reportissues');
export default ReportIssue;
