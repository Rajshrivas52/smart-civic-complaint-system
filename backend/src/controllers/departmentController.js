import Department from '../models/Department.js';

/**
 * Get all departments
 * GET /api/departments
 */
export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({}).sort({ name: 1 }).lean();
    return res.status(200).json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    console.error('[getDepartments Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve departments.'
    });
  }
};

/**
 * Get department by ID
 * GET /api/departments/:id
 */
export const getDepartmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dept = await Department.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { departmentId: id }]
    }).lean();

    if (!dept) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: dept
    });
  } catch (error) {
    console.error('[getDepartmentById Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve department.'
    });
  }
};

/**
 * Create a department (Admin action)
 * POST /api/departments
 */
export const createDepartment = async (req, res, next) => {
  try {
    const { name, code, head, email, phone, description, officeLocation, categories } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Department name and contact email are required.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const deptCode = (code || name.substring(0, 4) || 'DEPT').toUpperCase().trim();

    const existingDept = await Department.findOne({
      $or: [{ email: normalizedEmail }, { name: name.trim() }, { code: deptCode }]
    });

    if (existingDept) {
      return res.status(400).json({
        success: false,
        message: 'A department with this name, code, or email already exists.'
      });
    }

    const deptId = `DEPT-${Date.now().toString().slice(-4)}`;

    const newDepartment = await Department.create({
      departmentId: deptId,
      name: name.trim(),
      code: deptCode,
      email: normalizedEmail,
      phone: (phone || '').trim(),
      head: (head || 'Department Head').trim(),
      description: description || '',
      officeLocation: officeLocation || 'Municipal Administrative Complex',
      role: 'department',
      status: 'Active',
      categories: categories || ['General Civic Issues']
    });

    return res.status(201).json({
      success: true,
      message: 'Department created successfully!',
      data: newDepartment
    });
  } catch (error) {
    console.error('[createDepartment Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create department.'
    });
  }
};

/**
 * Update department
 * PUT /api/departments/:id
 */
export const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const dept = await Department.findOneAndUpdate(
      { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { departmentId: id }] },
      { $set: updates },
      { new: true }
    );

    if (!dept) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: dept
    });
  } catch (error) {
    console.error('[updateDepartment Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update department.'
    });
  }
};
