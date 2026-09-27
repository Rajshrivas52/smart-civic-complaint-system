import express from 'express';
import { getMe, updateProfile } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/users/me - Get current authenticated user profile
router.get('/me', protect, getMe);

// PUT /api/users/me - Update current authenticated user profile
router.put('/me', protect, updateProfile);

// Also alias /profile for backward/flexible compatibility
router.get('/profile', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
