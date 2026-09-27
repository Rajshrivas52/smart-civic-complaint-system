import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { USER_STATUSES } from '../constants/civicConstants.js';

const adminActivitySchema = new mongoose.Schema({
  desc: { type: String, required: true },
  time: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { _id: true });

const adminSchema = new mongoose.Schema({
  adminId: {
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
    default: '',
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
    default: 'admin',
    lowercase: true
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
  activity: [adminActivitySchema],
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'admins'
});

// Pre-save hook: Hash password before saving if modified
adminSchema.pre('save', async function (next) {
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
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
