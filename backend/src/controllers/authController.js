import jwt from 'jsonwebtoken';
import Citizen from '../models/Citizen.js';
import Admin from '../models/Admin.js';
import Department from '../models/Department.js';
import { USER_ROLES } from '../constants/civicConstants.js';

/**
 * Generate JWT signed token
 */
const generateToken = (account) => {
  return jwt.sign(
    { id: account._id, role: account.role || 'citizen', email: account.email },
    process.env.JWT_SECRET || 'dev_jwt_secret_smart_civic_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Clean user response payload (removes sensitive internals)
 */
const formatUserResponse = (account) => {
  const role = (account.role || 'citizen').toLowerCase();
  return {
    _id: account._id,
    userId: account.userId || account.adminId || account.departmentId || `ID-${account._id.toString().slice(-4).toUpperCase()}`,
    name: account.name,
    email: account.email,
    phone: account.phone || '',
    role: role,
    department: role === 'department' ? account._id : (account.department || null),
    departmentName: role === 'department' ? account.name : (account.departmentName || null),
    area: account.area || '',
    city: account.city || 'Gwalior',
    state: account.state || 'Madhya Pradesh',
    ward: account.ward || account.area || 'Ward 12 - Central Gwalior',
    language: account.language || 'English',
    status: account.status || 'Active',
    avatar: account.avatar || null,
    complaintCount: account.complaintCount || 0,
    resolvedComplaints: account.resolvedComplaints || 0,
    lastActive: account.lastActive,
    createdAt: account.createdAt
  };
};

/**
 * @desc    Register a new account (Citizen -> citizens, Admin -> admins, Department -> departments)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, departmentName } = req.body;

    // Validate required inputs
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const assignedRole = (role || 'citizen').toLowerCase();

    let newAccount = null;

    if (assignedRole === 'citizen') {
      const existingCitizen = await Citizen.findOne({ email: normalizedEmail });
      if (existingCitizen) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists in citizens.'
        });
      }

      newAccount = await Citizen.create({
        name: name.trim(),
        email: normalizedEmail,
        phone: (phone || '').trim(),
        password,
        role: 'citizen',
        area: 'City Center',
        status: 'Active',
        activity: [
          {
            desc: 'Citizen account created successfully',
            time: 'Just now',
            timestamp: new Date()
          }
        ]
      });

    } else if (assignedRole === 'admin') {
      const existingAdmin = await Admin.findOne({ email: normalizedEmail });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'An admin account with this email address already exists.'
        });
      }

      newAccount = await Admin.create({
        name: name.trim(),
        email: normalizedEmail,
        phone: (phone || '').trim(),
        password,
        role: 'admin',
        status: 'Active',
        activity: [
          {
            desc: 'Admin account created successfully',
            time: 'Just now',
            timestamp: new Date()
          }
        ]
      });

    } else if (assignedRole === 'department') {
      // Check if department exists by email or name in departments collection
      const existingDept = await Department.findOne({
        $or: [
          { email: normalizedEmail },
          { name: (departmentName || name).trim() }
        ]
      });

      if (existingDept) {
        existingDept.password = password;
        existingDept.email = normalizedEmail;
        existingDept.role = 'department';
        await existingDept.save();
        newAccount = existingDept;
      } else {
        const deptCode = (name.substring(0, 4) || 'DEPT').toUpperCase();
        newAccount = await Department.create({
          departmentId: `DEPT-${Date.now().toString().slice(-4)}`,
          name: name.trim(),
          code: deptCode,
          email: normalizedEmail,
          phone: (phone || '').trim(),
          password,
          role: 'department',
          status: 'Active',
          head: name.trim()
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid account role selected.'
      });
    }

    const token = generateToken(newAccount);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: formatUserResponse(newAccount)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user against citizens, admins, or departments collections
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

    let account = null;

    // 1. Check Citizen collection
    const citizen = await Citizen.findOne({ email: normalizedEmail }).select('+password');
    if (citizen && await citizen.comparePassword(password)) {
      account = citizen;
    }

    // 2. Check Admin collection if not found
    if (!account) {
      const admin = await Admin.findOne({ email: normalizedEmail }).select('+password');
      if (admin && await admin.comparePassword(password)) {
        account = admin;
      }
    }

    // 3. Check Department collection if not found
    if (!account) {
      const dept = await Department.findOne({ email: normalizedEmail }).select('+password');
      if (dept && await dept.comparePassword(password)) {
        account = dept;
      }
    }

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (account.status === 'Suspended') {
      return res.status(403).json({
        success: false,
        message: 'This account is suspended. Please contact municipal administration.'
      });
    }

    account.lastActive = new Date();
    await account.save({ validateBeforeSave: false });

    const token = generateToken(account);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: formatUserResponse(account)
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
    const { name, phone, area, city, state, ward, language, avatar } = req.body;
    const role = (req.user.role || 'citizen').toLowerCase();

    let account = null;
    if (role === 'citizen') {
      account = await Citizen.findById(req.user._id);
    } else if (role === 'admin') {
      account = await Admin.findById(req.user._id);
    } else if (role === 'department') {
      account = await Department.findById(req.user._id);
    }

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found.'
      });
    }

    if (name !== undefined && name !== null) account.name = String(name).trim();
    if (phone !== undefined && phone !== null) account.phone = String(phone).trim();
    if (area !== undefined && area !== null) account.area = String(area).trim();
    if (city !== undefined && city !== null) account.city = String(city).trim();
    if (state !== undefined && state !== null) account.state = String(state).trim();
    if (ward !== undefined && ward !== null) account.ward = String(ward).trim();
    if (language !== undefined && language !== null) account.language = String(language).trim();
    if (avatar !== undefined) account.avatar = avatar;

    if (account.activity) {
      account.activity.unshift({
        desc: 'Updated profile information',
        time: 'Just now',
        timestamp: new Date()
      });
    }

    await account.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: formatUserResponse(account)
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

    const role = (req.user.role || 'citizen').toLowerCase();
    let account = null;
    if (role === 'citizen') {
      account = await Citizen.findById(req.user._id).select('+password');
    } else if (role === 'admin') {
      account = await Admin.findById(req.user._id).select('+password');
    } else if (role === 'department') {
      account = await Department.findById(req.user._id).select('+password');
    }

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found.'
      });
    }

    const isMatch = await account.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    account.password = newPassword;
    if (account.activity) {
      account.activity.unshift({
        desc: 'Changed account password',
        time: 'Just now',
        timestamp: new Date()
      });
    }

    await account.save();

    const newToken = generateToken(account);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      token: newToken
    });
  } catch (error) {
    next(error);
  }
};
