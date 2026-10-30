import express from 'express';
import { getSettings, updateSetting } from '../controllers/settingsController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(protect);

// GET /api/settings - Read system settings
// PUT /api/settings - Admin update all / root settings
router.route('/')
  .get(getSettings)
  .put(authorize('admin'), updateSetting);

// GET /api/settings/:key - Read specific section (general, notifications, preferences)
// PUT /api/settings/:key - Admin update specific section
router.route('/:key')
  .get(getSettings)
  .put(authorize('admin'), updateSetting);

export default router;
