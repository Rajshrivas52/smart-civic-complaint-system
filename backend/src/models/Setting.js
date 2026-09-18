import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  // General Configuration
  orgName: {
    type: String,
    default: 'Smart Civic Complaint System',
    trim: true
  },
  adminEmail: {
    type: String,
    default: 'admin@civis.gov',
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    default: '+91 98765 43210'
  },
  timeZone: {
    type: String,
    default: 'Asia/Kolkata (IST)'
  },
  language: {
    type: String,
    default: 'English'
  },

  // Notification Alerts Configuration
  notifications: {
    newComplaint: { type: Boolean, default: true },
    highPriority: { type: Boolean, default: true },
    statusUpdates: { type: Boolean, default: true },
    newUserReg: { type: Boolean, default: false },
    deptAssignment: { type: Boolean, default: true },
    emailNotifs: { type: Boolean, default: true }
  },

  // Security and Workflow Preferences
  preferences: {
    defaultStatus: { type: String, default: 'Pending' },
    complaintsPerPage: { type: Number, default: 10 },
    autoRefresh: { type: Boolean, default: true },
    refreshInterval: { type: String, default: '30 seconds' },
    dateFormat: { type: String, default: 'DD/MM/YYYY' },
    maintenanceMode: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
