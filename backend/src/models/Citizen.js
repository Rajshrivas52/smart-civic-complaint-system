import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { USER_STATUSES } from '../constants/civicConstants.js';

const citizenActivitySchema = new mongoose.Schema({
  desc: { type: String, required: true },
  time: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { _id: true });

const citizenSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    sparse: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    default: 'citizen',
    lowercase: true
  },
  area: {
    type: String,
    default: 'City Center'
  },
  city: {
    type: String,
    default: 'Gwalior'
  },
  state: {
    type: String,
    default: 'Madhya Pradesh'
  },
  ward: {
    type: String,
    default: 'Ward 12 - Central Gwalior'
  },
  language: {
    type: String,
    default: 'English'
  },
  status: {
    type: String,
    enum: USER_STATUSES,
    default: 'Active'
  },
  avatar: {
    type: String,
    default: null
  },
  complaintCount: {
    type: Number,
    default: 0
  },
  resolvedComplaints: {
    type: Number,
    default: 0
  },
  activity: [citizenActivitySchema],
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'citizens'
});

// Pre-save hook: Hash password before saving if modified
citizenSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method: Compare password
citizenSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const Citizen = mongoose.model('Citizen', citizenSchema);
export default Citizen;
