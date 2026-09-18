import mongoose from 'mongoose';
import { DEPARTMENT_STATUSES } from '../constants/civicConstants.js';

const staffMemberSchema = new mongoose.Schema({
  staffId: { type: String },
  name: { type: String, required: true },
  designation: { type: String, default: 'Field Staff' },
  phone: { type: String }
}, { _id: true });

const departmentSchema = new mongoose.Schema({
  departmentId: {
    type: String,
    unique: true,
    sparse: true
  },
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Department code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  head: {
    type: String,
    required: [true, 'Department head name is required']
  },
  phone: {
    type: String,
    required: [true, 'Contact phone is required']
  },
  email: {
    type: String,
    required: [true, 'Contact email is required'],
    lowercase: true,
    trim: true
  },
  officeLocation: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: DEPARTMENT_STATUSES,
    default: 'Active'
  },
  iconName: {
    type: String,
    default: 'Building2'
  },
  categories: [{
    type: String
  }],
  staffCount: {
    type: Number,
    default: 0
  },
  totalComplaints: {
    type: Number,
    default: 0
  },
  pendingComplaints: {
    type: Number,
    default: 0
  },
  inProgressComplaints: {
    type: Number,
    default: 0
  },
  resolvedComplaints: {
    type: Number,
    default: 0
  },
  resolutionRate: {
    type: Number,
    default: 0
  },
  averageResolutionTime: {
    type: String,
    default: '0 days'
  },
  staff: [staffMemberSchema]
}, {
  timestamps: true
});

const Department = mongoose.model('Department', departmentSchema);
export default Department;
