import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
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
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: [true, 'Contact email is required'],
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 6,
    select: false
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  role: {
    type: String,
    default: 'department',
    lowercase: true
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
  timestamps: true,
  collection: 'departments'
});

// Pre-save hook: Hash password before saving if modified
departmentSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method: Compare password
departmentSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

const Department = mongoose.model('Department', departmentSchema);
export default Department;
