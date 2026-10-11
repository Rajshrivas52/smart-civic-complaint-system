import Department from '../models/Department.js';
import Complaint from '../models/Complaint.js';

/**
 * @desc    Get all municipal departments with complaint counts
 * @route   GET /api/departments
 * @access  Private
 */
export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({}).sort({ name: 1 }).lean();

    // Dynamically calculate live complaint counts for each department
    const enrichedDepartments = await Promise.all(
      departments.map(async (dept) => {
        const [total, pending, inProgress, resolved] = await Promise.all([
          Complaint.countDocuments({
            $or: [{ department: dept._id }, { departmentName: dept.name }]
          }),
          Complaint.countDocuments({
            $or: [{ department: dept._id }, { departmentName: dept.name }],
            status: 'Pending'
          }),
          Complaint.countDocuments({
            $or: [{ department: dept._id }, { departmentName: dept.name }],
            status: { $in: ['Assigned', 'In Progress'] }
          }),
          Complaint.countDocuments({
            $or: [{ department: dept._id }, { departmentName: dept.name }],
            status: 'Resolved'
          })
        ]);

        const resolutionRate = total > 0 ? `${Math.round((resolved / total) * 100)}%` : '0%';

        return {
          ...dept,
          totalComplaints: total,
          pendingComplaints: pending,
          inProgressComplaints: inProgress,
          resolvedComplaints: resolved,
          resolutionRate
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enrichedDepartments.length,
      data: enrichedDepartments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single department details
 * @route   GET /api/departments/:id
 * @access  Private
 */
export const getDepartmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = id.match(/^[0-9a-fA-F]{24}$/)
      ? { $or: [{ _id: id }, { code: id.toUpperCase() }] }
      : { code: id.toUpperCase() };

    const dept = await Department.findOne(query).lean();
    if (!dept) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: dept
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new department (Admin only)
 * @route   POST /api/departments
 * @access  Private (Admin)
 */
export const createDepartment = async (req, res, next) => {
  try {
    const {
      name,
      code,
      description,
      head,
      phone,
      email,
      password,
      officeLocation,
      categories,
      staffCount,
      iconName
    } = req.body;

    if (!name || !code || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide department name, unique code, and email.'
      });
    }

    const existingCode = await Department.findOne({ code: code.toUpperCase() });
    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: `Department with code '${code}' already exists.`
      });
    }

    const dept = await Department.create({
      departmentId: `DEPT-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      code: code.toUpperCase().trim(),
      description: description || '',
      head: head || '',
      phone: phone || '',
      email: email.toLowerCase().trim(),
      password: password || 'Dept@123',
      officeLocation: officeLocation || '',
      categories: Array.isArray(categories) ? categories : [],
      staffCount: parseInt(staffCount, 10) || 0,
      iconName: iconName || 'Building2',
      status: 'Active'
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully.',
      data: dept
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update department details
 * @route   PUT /api/departments/:id
 * @access  Private (Admin)
 */
export const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    delete updates.password; // Do not allow password override through general update endpoint

    const dept = await Department.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!dept) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Department updated successfully.',
      data: dept
    });
  } catch (error) {
    next(error);
  }
};
