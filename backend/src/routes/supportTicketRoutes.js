import express from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus
} from '../controllers/supportTicketController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

// POST /api/support-tickets - Submit ticket
// GET /api/support-tickets - List tickets (scoped by role)
router.route('/')
  .post(createTicket)
  .get(getTickets);

// GET /api/support-tickets/:id - Get ticket detail
// PUT /api/support-tickets/:id - Update status / respond
router.route('/:id')
  .get(getTicketById)
  .put(updateTicketStatus);

export default router;
