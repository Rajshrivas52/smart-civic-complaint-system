import express from 'express';
import { searchComplaints, getComplaintById } from '../controllers/complaintController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/complaints/search?q=pothole - Search complaints with role-based visibility
router.get('/search', protect, searchComplaints);

// GET /api/complaints/:id - Get complaint details by complaintId or _id
router.get('/:id', protect, getComplaintById);

export default router;
