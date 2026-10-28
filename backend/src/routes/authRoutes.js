import express from 'express';
import {
  register,
  login,
  googleAuth,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);

export default router;

