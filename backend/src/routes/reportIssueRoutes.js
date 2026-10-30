import express from 'express';
import {
  createReportIssue,
  getReportIssues,
  getMyReportIssues,
  getReportIssueById
} from '../controllers/reportIssueController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { handleImageUpload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// GET /api/report-issues/my - Get logged in citizen's reports
router.get('/my', protect, getMyReportIssues);

// GET /api/report-issues - Get all reports
// POST /api/report-issues - Submit new report issue (with image saved to DB)
router.route('/')
  .get(protect, getReportIssues)
  .post(protect, authorize('citizen', 'admin'), handleImageUpload('image'), createReportIssue);

// GET /api/report-issues/:id - Get single report with stored image
router.get('/:id', protect, getReportIssueById);

export default router;
