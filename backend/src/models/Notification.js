import mongoose from 'mongoose';
import { NOTIFICATION_TYPES, NOTIFICATION_CATEGORIES } from '../constants/civicConstants.js';

const notificationSchema = new mongoose.Schema({
  notificationId: {
    type: String,
    unique: true,
    sparse: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  recipientRole: {
    type: String,
    enum: ['all', 'admin', 'department', 'citizen'],
    default: 'all',
    index: true
  },
  type: {
    type: String,
    enum: NOTIFICATION_TYPES,
    default: 'complaint'
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Notification message is required']
  },
  description: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  relatedEntity: {
    type: String,
    enum: ['complaint', 'department', 'user', 'system'],
    default: 'complaint'
  },
  relatedId: {
    type: String,
    default: ''
  },
  area: {
    type: String,
    default: ''
  },
  sender: {
    type: String,
    default: 'Smart Civic System'
  },
  category: {
    type: String,
    enum: NOTIFICATION_CATEGORIES,
    default: 'Complaint Updates'
  }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
