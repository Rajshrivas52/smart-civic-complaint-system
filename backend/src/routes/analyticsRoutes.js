import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/analytics - Scoped by authenticated user role
router.get('/', protect, getAnalytics);

export default router;
