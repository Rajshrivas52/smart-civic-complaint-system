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

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Complaint title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Complaint description is required']
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
    ref: 'User',
    required: true,
    index: true
  },
  citizenName: {
    type: String,
    required: true
  },
  citizenPhone: {
    type: String,
    required: true
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
  image: {
    type: String,
    default: null
  },
  resolutionImage: {
    type: String,
    default: null
  },
  timeline: [timelineEntrySchema],
  aiAnalysis: {
    detectedCategory: { type: String, default: null },
    detectedPriority: { type: String, default: null },
    confidence: { type: Number, default: null },
    processed: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Compound index for frequent admin dashboard filtering
complaintSchema.index({ status: 1, category: 1, priority: 1, departmentName: 1, area: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
