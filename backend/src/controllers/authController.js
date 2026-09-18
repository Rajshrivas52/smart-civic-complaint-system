import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { USER_ROLES } from '../constants/civicConstants.js';

/**
 * Generate JWT signed token
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'dev_jwt_secret_smart_civic_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Clean user response payload (removes sensitive internals)
 */
const formatUserResponse = (user) => {
  return {
    _id: user._id,
    userId: user.userId || `USR-${user._id.toString().slice(-4).toUpperCase()}`,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    department: user.department,
    departmentName: user.departmentName,
    area: user.area,
    status: user.status,
    avatar: user.avatar,
    complaintCount: user.complaintCount,
    resolvedComplaints: user.resolvedComplaints,
    lastActive: user.lastActive,
    createdAt: user.createdAt
  };
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, department, departmentName, area } = req.body;

    // Validate required inputs
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, phone number, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check if email is already taken
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Validate role
    let assignedRole = 'citizen';
    if (role && USER_ROLES.includes(role.toLowerCase())) {
      assignedRole = role.toLowerCase();
    }

    // Create user
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password,
      role: assignedRole,
      department: department || null,
      departmentName: departmentName || null,
      area: area || 'City Center',
      status: 'Active',
      activity: [
        {
          desc: 'Account created successfully',
          time: 'Just now',
          timestamp: new Date()
        }
      ]
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: formatUserResponse(newUser)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user and return token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Must explicitly select password because select: false in schema
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (user.status === 'Suspended') {
      return res.status(403).json({
        success: false,
        message: 'This account is suspended. Please contact municipal administration.'
      });
    }

    // Update lastActive timestamp and log activity
    user.lastActive = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: formatUserResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private (Requires token)
 */
export const getMe = async (req, res, next) => {
  try {
    // req.user is attached by authMiddleware.protect
    res.status(200).json({
      success: true,
      user: formatUserResponse(req.user)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile details
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, area, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();
    if (area) user.area = area.trim();
    if (avatar !== undefined) user.avatar = avatar;

    user.activity.unshift({
      desc: 'Updated profile information',
      time: 'Just now',
      timestamp: new Date()
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: formatUserResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/password
 * @access  Private
 */
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    user.password = newPassword;
    user.activity.unshift({
      desc: 'Changed account password',
      time: 'Just now',
      timestamp: new Date()
    });

    await user.save();

    const newToken = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      token: newToken
    });
  } catch (error) {
    next(error);
  }
};
