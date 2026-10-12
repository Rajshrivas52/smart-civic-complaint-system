import express from 'express';
import { getMe, updateProfile } from '../controllers/authController.js';
import { getUsers, createUser } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// GET /api/users - List all users (Admin only)
router.get('/', protect, authorize('admin'), getUsers);

// POST /api/users - Create new user (Admin only)
router.post('/', protect, authorize('admin'), createUser);

// GET /api/users/me - Get current authenticated user profile
router.get('/me', protect, getMe);

// PUT /api/users/me - Update current authenticated user profile
router.put('/me', protect, updateProfile);

// Also alias /profile for backward/flexible compatibility
router.get('/profile', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;

