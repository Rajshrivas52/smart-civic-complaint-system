import jwt from 'jsonwebtoken';
import Citizen from '../models/Citizen.js';
import Admin from '../models/Admin.js';
import Department from '../models/Department.js';

/**
 * Protect routes - Verifies JWT from Authorization Bearer header
 * Attaches authenticated user object from Citizen, Admin, or Department collection to req.user
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret_smart_civic_2026');

    let user = null;
    const role = (decoded.role || '').toLowerCase();

    if (role === 'citizen') {
      user = await Citizen.findById(decoded.id).select('-password');
    } else if (role === 'admin') {
      user = await Admin.findById(decoded.id).select('-password');
    } else if (role === 'department') {
      user = await Department.findById(decoded.id).select('-password');
    }

    // Fallback sequential search if role-based lookup did not find document
    if (!user) {
      user = await Citizen.findById(decoded.id).select('-password');
    }
    if (!user) {
      user = await Admin.findById(decoded.id).select('-password');
    }
    if (!user) {
      user = await Department.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    if (user.status === 'Suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact municipal support.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session has expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token.'
    });
  }
};
