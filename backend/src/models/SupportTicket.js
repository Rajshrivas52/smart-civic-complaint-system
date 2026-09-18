import mongoose from 'mongoose';
import { SUPPORT_TICKET_STATUSES } from '../constants/civicConstants.js';

const supportTicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true,
    required: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  category: {
    type: String,
    default: 'General'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: SUPPORT_TICKET_STATUSES,
    default: 'Open'
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  supportResponse: {
    type: String,
    default: ''
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  submittedByName: {
    type: String,
    default: 'Admin User'
  }
}, {
  timestamps: true
});

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);
export default SupportTicket;
