import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import Citizen from '../models/Citizen.js';
import Admin from '../models/Admin.js';
import Department from '../models/Department.js';
import { USER_ROLES } from '../constants/civicConstants.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
    createdAt: account.createdAt,
    authProvider: account.authProvider || 'local',
    googleId: account.googleId || null
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
 * @desc    Authenticate or register Citizen using verified Google Identity Services ID Token
 * @route   POST /api/auth/google
 * @access  Public
 */
/**
 * @desc    Authenticate or register user (Citizen, Admin, or Department) using verified Google Identity Services ID Token
 * @route   POST /api/auth/google
 * @access  Public
 */
export const googleAuth = async (req, res, next) => {
  try {
    const { credential, role } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential / ID token is required.'
      });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;

    // 1. Cryptographically verify Google ID Token using official Google Auth Library
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: clientId || undefined
      });
      payload = ticket.getPayload();
    } catch (verifyError) {
      console.error('[Google Auth] Verification error:', verifyError.message);
      return res.status(401).json({
        success: false,
        message: `Google authentication failed: ${verifyError.message || 'Invalid or expired ID token'}`
      });
    }

    if (!payload || !payload.sub || !payload.email) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google identity token. Missing required identity claims.'
      });
    }

    const googleSub = payload.sub; // Verified unique permanent Google user ID
    const googleEmail = payload.email.toLowerCase().trim();
    const googleName = payload.name ? payload.name.trim() : (payload.given_name || 'User');
    const googlePicture = payload.picture || null;

    // 2. Search for existing account across collections (Admin -> Department -> Citizen)
    let account = null;

    // Check Admin collection
    const admin = await Admin.findOne({
      $or: [{ googleId: googleSub }, { email: googleEmail }]
    });
    if (admin) {
      account = admin;
    }

    // Check Department collection if not found in Admin
    if (!account) {
      const dept = await Department.findOne({
        $or: [{ googleId: googleSub }, { email: googleEmail }]
      });
      if (dept) {
        account = dept;
      }
    }

    // Check Citizen collection if not found in Admin or Department
    if (!account) {
      const citizen = await Citizen.findOne({
        $or: [{ googleId: googleSub }, { email: googleEmail }]
      });
      if (citizen) {
        account = citizen;
      }
    }

    // 3. Handle existing account
    if (account) {
      if (account.status === 'Suspended') {
        return res.status(403).json({
          success: false,
          message: `Your ${account.role || 'account'} has been suspended. Please contact municipal administration.`
        });
      }

      // Role conflict check: If target role was specified and conflicts with existing account role
      const targetRole = role ? (role || '').toLowerCase() : null;
      const existingRole = (account.role || 'citizen').toLowerCase();

      if (targetRole && targetRole !== existingRole) {
        const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
        return res.status(400).json({
          success: false,
          message: `This Google account is already registered as a ${capitalize(existingRole)}. Cannot log in as ${capitalize(targetRole)}.`
        });
      }

      let needsSave = false;
      if (!account.googleId) {
        account.googleId = googleSub;
        account.authProvider = 'google';
        needsSave = true;
      }
      if (!account.avatar && googlePicture) {
        account.avatar = googlePicture;
        needsSave = true;
      }
      account.lastActive = new Date();
      needsSave = true;

      if (needsSave) {
        await account.save({ validateBeforeSave: false });
      }

      const token = generateToken(account);

      return res.status(200).json({
        success: true,
        message: 'Google authentication successful',
        token,
        user: formatUserResponse(account)
      });
    }

    // 4. Handle new Google registration according to selected role
    const requestedRole = (role || 'citizen').toLowerCase();
    let newAccount = null;

    if (requestedRole === 'citizen') {
      const citizenUserId = `CITIZEN-${Date.now().toString().slice(-6)}`;
      newAccount = await Citizen.create({
        userId: citizenUserId,
        name: googleName,
        email: googleEmail,
        googleId: googleSub,
        authProvider: 'google',
        role: 'citizen',
        avatar: googlePicture,
        phone: '',
        area: 'City Center',
        city: 'Gwalior',
        state: 'Madhya Pradesh',
        ward: 'Ward 12 - Central Gwalior',
        status: 'Active',
        activity: [
          {
            desc: 'Citizen registered via Google Authentication',
            time: 'Just now',
            timestamp: new Date()
          }
        ]
      });
    } else if (requestedRole === 'admin') {
      const adminId = `ADM-${Date.now().toString().slice(-6)}`;
      newAccount = await Admin.create({
        adminId,
        name: googleName,
        email: googleEmail,
        googleId: googleSub,
        authProvider: 'google',
        role: 'admin',
        avatar: googlePicture,
        phone: '',
        status: 'Active',
        activity: [
          {
            desc: 'Admin registered via Google Authentication',
            time: 'Just now',
            timestamp: new Date()
          }
        ]
      });
    } else if (requestedRole === 'department') {
      const deptId = `DEPT-${Date.now().toString().slice(-6)}`;
      const baseName = googleName && googleName !== 'User' ? googleName : googleEmail.split('@')[0];
      const deptName = `${baseName} Department`;
      const deptCode = (baseName.substring(0, 4) || 'DEPT').toUpperCase();

      let finalDeptName = deptName;
      let finalDeptCode = deptCode;

      const existingName = await Department.findOne({ name: finalDeptName });
      if (existingName) {
        finalDeptName = `${deptName} ${Date.now().toString().slice(-4)}`;
      }
      const existingCode = await Department.findOne({ code: finalDeptCode });
      if (existingCode) {
        finalDeptCode = `${deptCode}${Date.now().toString().slice(-2)}`;
      }

      newAccount = await Department.create({
        departmentId: deptId,
        name: finalDeptName,
        code: finalDeptCode,
        email: googleEmail,
        googleId: googleSub,
        authProvider: 'google',
        role: 'department',
        head: googleName,
        phone: '',
        status: 'Active'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid account role selected.'
      });
    }

    const token = generateToken(newAccount);

    return res.status(201).json({
      success: true,
      message: 'Google registration successful',
      token,
      user: formatUserResponse(newAccount)
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
