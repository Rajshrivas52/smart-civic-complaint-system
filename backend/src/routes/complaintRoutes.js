import express from 'express';
import {
  createComplaint,
  getComplaints,
  getMyComplaints,
  searchComplaints,
  getComplaintStats,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  submitFeedback
} from '../controllers/complaintController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { handleImageUpload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// ---------------------------------------------------------------------------
// Static Sub-routes (Must be declared before /:id)
// ---------------------------------------------------------------------------

// GET /api/complaints/search - Search complaints with role-based scoping
router.get('/search', protect, searchComplaints);

// GET /api/complaints/stats - Aggregated counts and resolution rate
router.get('/stats', protect, getComplaintStats);

// GET /api/complaints/my - Current citizen's complaints + status breakdown
router.get('/my', protect, getMyComplaints);

// ---------------------------------------------------------------------------
// Root / List & Create
// ---------------------------------------------------------------------------

// GET /api/complaints - Paginated, filtered list scoped by role
// POST /api/complaints - Submit new civic issue (with optional photo upload)
router.route('/')
  .get(protect, getComplaints)
  .post(protect, handleImageUpload('image'), createComplaint);

// ---------------------------------------------------------------------------
// Individual Complaint Actions
// ---------------------------------------------------------------------------

// GET /api/complaints/:id - View complaint details by complaintId or ObjectId
router.get('/:id', protect, getComplaintById);

// PUT /api/complaints/:id/status - Update status & add progress notes/photos (Dept/Admin)
router.put(
  '/:id/status',
  protect,
  authorize('admin', 'department'),
  handleImageUpload('resolutionImage'),
  updateComplaintStatus
);

// PUT /api/complaints/:id/assign - Reassign complaint to another department (Admin only)
router.put(
  '/:id/assign',
  protect,
  authorize('admin'),
  assignComplaint
);

// POST /api/complaints/:id/feedback - Citizen ratings & reviews for resolved issue
router.post(
  '/:id/feedback',
  protect,
  submitFeedback
);

export default router;
