import Citizen from '../models/Citizen.js';
import Admin from '../models/Admin.js';
import Department from '../models/Department.js';

/**
 * Get all users across collections (Admin action)
 * GET /api/users
 */
export const getUsers = async (req, res, next) => {
  try {
    const citizens = await Citizen.find({}).lean();
    const admins = await Admin.find({}).lean();
    const departments = await Department.find({}).lean();

    const formattedCitizens = citizens.map(c => ({
      _id: c._id,
      userId: c.userId || `CIT-${c._id.toString().slice(-4)}`,
      name: c.name,
      email: c.email,
      phone: c.phone || '',
      role: 'citizen',
      status: c.status || 'Active',
      createdAt: c.createdAt
    }));

    const formattedAdmins = admins.map(a => ({
      _id: a._id,
      userId: a.adminId || `ADM-${a._id.toString().slice(-4)}`,
      name: a.name,
      email: a.email,
      phone: a.phone || '',
      role: 'admin',
      status: a.status || 'Active',
      createdAt: a.createdAt
    }));

    const formattedDepts = departments.map(d => ({
      _id: d._id,
      userId: d.departmentId || `DEPT-${d._id.toString().slice(-4)}`,
      name: d.name,
      email: d.email,
      phone: d.phone || '',
      role: 'department',
      status: d.status || 'Active',
      createdAt: d.createdAt
    }));

    const allUsers = [...formattedCitizens, ...formattedAdmins, ...formattedDepts];

    return res.status(200).json({
      success: true,
      count: allUsers.length,
      data: allUsers
    });
  } catch (error) {
    console.error('[getUsers Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users.'
    });
  }
};

/**
 * Create a new user (Admin action)
 * POST /api/users
 */
export const createUser = async (req, res, next) => {
  try {
    const { name, email, phone, role, password, area, ward } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const assignedRole = (role || 'citizen').toLowerCase().trim();
    let newUser = null;

    if (assignedRole === 'citizen') {
      const existing = await Citizen.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(400).json({ success: false, message: 'User with this email already exists.' });
      }
      newUser = await Citizen.create({
        userId: `CIT-${Date.now().toString().slice(-4)}`,
        name: name.trim(),
        email: normalizedEmail,
        phone: (phone || '').trim(),
        password: password || 'Default@123',
        role: 'citizen',
        area: area || 'City Center',
        ward: ward || 'Ward 12',
        status: 'Active'
      });
    } else if (assignedRole === 'admin') {
      const existing = await Admin.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Admin with this email already exists.' });
      }
      newUser = await Admin.create({
        adminId: `ADM-${Date.now().toString().slice(-4)}`,
        name: name.trim(),
        email: normalizedEmail,
        phone: (phone || '').trim(),
        password: password || 'Admin@123',
        role: 'admin',
        status: 'Active'
      });
    } else if (assignedRole === 'department') {
      const existing = await Department.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Department with this email already exists.' });
      }
      const deptCode = (name.substring(0, 4) || 'DEPT').toUpperCase();
      newUser = await Department.create({
        departmentId: `DEPT-${Date.now().toString().slice(-4)}`,
        name: name.trim(),
        code: deptCode,
        email: normalizedEmail,
        phone: (phone || '').trim(),
        password: password || 'Dept@123',
        role: 'department',
        status: 'Active'
      });
    }

    return res.status(201).json({
      success: true,
      message: 'User created successfully!',
      data: newUser
    });
  } catch (error) {
    console.error('[createUser Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create user.'
    });
  }
};
