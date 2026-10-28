import mongoose from 'mongoose';
import SupportTicket from '../models/SupportTicket.js';
import { SUPPORT_TICKET_STATUSES } from '../constants/civicConstants.js';

/**
 * Escape special regex characters
 */
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Generate unique support ticket ID (e.g. SUP-1042)
 */
const generateTicketId = async () => {
  const count = await SupportTicket.countDocuments();
  let candidateId = `SUP-${1000 + count + 1}`;
  let exists = await SupportTicket.findOne({ ticketId: candidateId });
  let counter = 1;

  while (exists) {
    candidateId = `SUP-${1000 + count + 1 + counter}`;
    exists = await SupportTicket.findOne({ ticketId: candidateId });
    counter++;
  }

  return candidateId;
};

/**
 * @desc    Submit a new support ticket
 * @route   POST /api/support-tickets
 * @access  Private
 */
export const createTicket = async (req, res, next) => {
  try {
    const { subject, description, category, priority } = req.body;

    if (!subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both subject and description for your support ticket.'
      });
    }

    const ticketId = await generateTicketId();

    const ticket = await SupportTicket.create({
      ticketId,
      subject: subject.trim(),
      description: description.trim(),
      category: category ? category.trim() : 'General',
      priority: ['Low', 'Medium', 'High'].includes(priority) ? priority : 'Medium',
      status: 'Open',
      submittedBy: req.user._id,
      submittedByName: req.user.name || 'User'
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket submitted successfully.',
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get support tickets with role-based scoping and filtering
 * @route   GET /api/support-tickets
 * @access  Private
 */
export const getTickets = async (req, res, next) => {
  try {
    const role = (req.user.role || 'citizen').toLowerCase();
    const filter = {};

    // Citizens and department staff view only their own tickets; admins see all
    if (role !== 'admin') {
      filter.submittedBy = req.user._id;
    }

    const { status, priority, category, search } = req.query;

    if (status && status.toLowerCase() !== 'all') {
      filter.status = status;
    }

    if (priority && priority.toLowerCase() !== 'all') {
      filter.priority = priority;
    }

    if (category && category.toLowerCase() !== 'all') {
      filter.category = category;
    }

    if (search && search.trim()) {
      const term = escapeRegex(search.trim());
      filter.$or = [
        { ticketId: new RegExp(term, 'i') },
        { subject: new RegExp(term, 'i') },
        { description: new RegExp(term, 'i') }
      ];
    }

    const tickets = await SupportTicket.find(filter)
      .sort({ createdAt: -1 })
      .populate('submittedBy', 'name email role avatar');

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single support ticket by ID or ticketId
 * @route   GET /api/support-tickets/:id
 * @access  Private
 */
export const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let ticket = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      ticket = await SupportTicket.findById(id).populate('submittedBy', 'name email role avatar');
    }

    if (!ticket) {
      ticket = await SupportTicket.findOne({ ticketId: id }).populate('submittedBy', 'name email role avatar');
    }

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `Support ticket '${id}' not found.`
      });
    }

    // Role access check: non-admins can only view their own tickets
    const role = (req.user.role || 'citizen').toLowerCase();
    if (role !== 'admin' && ticket.submittedBy && ticket.submittedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this support ticket.'
      });
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update support ticket status and/or support response
 * @route   PUT /api/support-tickets/:id
 * @access  Private (Admin or Ticket Owner closing)
 */
export const updateTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, supportResponse, priority } = req.body;
    const role = (req.user.role || 'citizen').toLowerCase();

    let ticket = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      ticket = await SupportTicket.findById(id);
    }
    if (!ticket) {
      ticket = await SupportTicket.findOne({ ticketId: id });
    }

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `Support ticket '${id}' not found.`
      });
    }

    // Non-admin can only close their own ticket
    if (role !== 'admin') {
      const isOwner = ticket.submittedBy && ticket.submittedBy.toString() === req.user._id.toString();
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this support ticket.'
        });
      }
      if (status && status !== 'Closed') {
        return res.status(403).json({
          success: false,
          message: 'Citizens can only mark their tickets as Closed.'
        });
      }
    }

    if (status) {
      if (!SUPPORT_TICKET_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status '${status}'. Allowed statuses: ${SUPPORT_TICKET_STATUSES.join(', ')}`
        });
      }
      ticket.status = status;
    }

    if (supportResponse !== undefined) {
      ticket.supportResponse = String(supportResponse).trim();
    }

    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      ticket.priority = priority;
    }

    await ticket.save();

    res.status(200).json({
      success: true,
      message: 'Support ticket updated successfully.',
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};
