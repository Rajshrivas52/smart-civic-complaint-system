import Complaint from '../models/Complaint.js';

/**
 * Escape special regex characters
 */
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Search complaints with role-based access control and case-insensitive matching
 * GET /api/complaints/search?q=pothole
 */
export const searchComplaints = async (req, res, next) => {
  try {
    const { q = '', limit = 10 } = req.query;
    const trimmedQuery = q.trim();

    if (!trimmedQuery) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to search complaints.'
      });
    }

    const role = (user.role || 'citizen').toLowerCase();

    // 1. Role-based scoping filter
    let roleFilter = {};
    if (role === 'citizen') {
      roleFilter = { citizen: user._id };
    } else if (role === 'department') {
      roleFilter = {
        $or: [
          { department: user._id },
          { departmentName: new RegExp(`^${escapeRegex(user.name)}$`, 'i') },
          { departmentName: new RegExp(escapeRegex(user.name.split(' ')[0]), 'i') }
        ]
      };
    } else if (role === 'admin') {
      // Admins have global visibility
      roleFilter = {};
    } else {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized role for complaint search.'
      });
    }

    // 2. Case-insensitive search regex across complaint fields
    const searchRegex = new RegExp(escapeRegex(trimmedQuery), 'i');

    const searchFields = [
      { complaintId: searchRegex },
      { title: searchRegex },
      { description: searchRegex },
      { category: searchRegex },
      { departmentName: searchRegex },
      { status: searchRegex },
      { priority: searchRegex },
      { severity: searchRegex },
      { area: searchRegex },
      { address: searchRegex }
    ];

    // For admin or department, also allow searching by citizenName
    if (role === 'admin' || role === 'department') {
      searchFields.push({ citizenName: searchRegex });
    }

    // Combine role filter and search conditions
    const finalFilter = Object.keys(roleFilter).length > 0
      ? { $and: [roleFilter, { $or: searchFields }] }
      : { $or: searchFields };

    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 30);

    const complaints = await Complaint.find(finalFilter)
      .select('complaintId title description category priority severity status departmentName area address createdAt citizenName')
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .lean();

    return res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    console.error('[searchComplaints Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search complaints.'
    });
  }
};

/**
 * Get complaint details by ID (complaintId or _id) with role validation
 * GET /api/complaints/:id
 */
export const getComplaintById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Complaint identifier is required.'
      });
    }

    // Find by complaintId or MongoDB ObjectId
    const query = id.match(/^[0-9a-fA-F]{24}$/)
      ? { $or: [{ _id: id }, { complaintId: id }] }
      : { complaintId: id };

    const complaint = await Complaint.findOne(query).lean();

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint '${id}' not found.`
      });
    }

    // Role-based permission check
    const role = (user.role || 'citizen').toLowerCase();
    if (role === 'citizen') {
      if (complaint.citizen && complaint.citizen.toString() !== user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You do not have permission to view this complaint.'
        });
      }
    } else if (role === 'department') {
      const isDeptMatch =
        (complaint.department && complaint.department.toString() === user._id.toString()) ||
        (complaint.departmentName && complaint.departmentName.toLowerCase().includes((user.name || '').toLowerCase())) ||
        (user.name && user.name.toLowerCase().includes((complaint.departmentName || '').toLowerCase()));

      if (!isDeptMatch) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: This complaint is not assigned to your department.'
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    console.error('[getComplaintById Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve complaint.'
    });
  }
};
