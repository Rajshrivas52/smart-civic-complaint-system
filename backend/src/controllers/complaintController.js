import Complaint from '../models/Complaint.js';
import Citizen from '../models/Citizen.js';
import Department from '../models/Department.js';
import Admin from '../models/Admin.js';
import { sendNotification } from '../utils/notificationHelper.js';
import {
  COMPLAINT_STATUSES,
  COMPLAINT_CATEGORIES,
  COMPLAINT_PRIORITIES,
  COMPLAINT_SEVERITIES
} from '../constants/civicConstants.js';

/**
 * Escape special regex characters
 */
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Map flexible / frontend category strings to standard canonical categories
 */
const normalizeCategory = (categoryInput) => {
  if (!categoryInput) return 'Other';
  const c = String(categoryInput).toLowerCase().trim();

  if (c.includes('pothole') || c.includes('road') || c.includes('footpath') || c.includes('speed breaker')) {
    return 'Road Damage';
  }
  if (c.includes('garbage') || c.includes('waste') || c.includes('sanitat') || c.includes('trash') || c.includes('debris') || c.includes('dump')) {
    return 'Garbage';
  }
  if (c.includes('light') || c.includes('electric') || c.includes('power') || c.includes('wire') || c.includes('pole')) {
    return 'Streetlight';
  }
  if (c.includes('water') || c.includes('pipeline') || c.includes('tap') || c.includes('leak')) {
    return 'Water';
  }
  if (c.includes('drain') || c.includes('sewer') || c.includes('gutter') || c.includes('manhole')) {
    return 'Drainage';
  }
  if (c.includes('traffic') || c.includes('signal') || c.includes('parking') || c.includes('jam')) {
    return 'Traffic';
  }
  if (c.includes('tree') || c.includes('park') || c.includes('pollution') || c.includes('air') || c.includes('environ') || c.includes('noise')) {
    return 'Environment';
  }

  // Exact match against allowed categories if available
  const exact = COMPLAINT_CATEGORIES.find(cat => cat.toLowerCase() === c);
  return exact || 'Other';
};

/**
 * Auto-route complaint to matching active municipal department
 */
const findTargetDepartment = async (category) => {
  try {
    // 1. Direct search by matching categories array or code
    let dept = await Department.findOne({
      status: 'Active',
      categories: { $regex: new RegExp(category, 'i') }
    });

    if (dept) return dept;

    // 2. Intelligent keyword match based on canonical category
    if (category === 'Road Damage') {
      dept = await Department.findOne({ code: 'ROAD', status: 'Active' }) ||
             await Department.findOne({ name: /Road/i, status: 'Active' });
    } else if (category === 'Garbage' || category === 'Drainage') {
      dept = await Department.findOne({ code: 'SANI', status: 'Active' }) ||
             await Department.findOne({ name: /Sanitat/i, status: 'Active' });
    } else if (category === 'Streetlight') {
      dept = await Department.findOne({ code: 'ELEC', status: 'Active' }) ||
             await Department.findOne({ name: /Electr/i, status: 'Active' });
    } else if (category === 'Water') {
      dept = await Department.findOne({ name: /Water/i, status: 'Active' }) ||
             await Department.findOne({ code: 'SANI', status: 'Active' });
    }

    return dept;
  } catch (err) {
    console.warn('[Routing] Failed to find target department:', err.message);
    return null;
  }
};

/**
 * Auto-generate sequential or unique complaint ID (e.g., SC-2026-0015)
 */
const generateComplaintId = async () => {
  const currentYear = new Date().getFullYear();
  const count = await Complaint.countDocuments();
  let sequenceNumber = count + 1;
  let candidateId = `SC-${currentYear}-${String(sequenceNumber).padStart(4, '0')}`;

  let exists = await Complaint.findOne({ complaintId: candidateId });
  while (exists) {
    sequenceNumber++;
    candidateId = `SC-${currentYear}-${String(sequenceNumber).padStart(4, '0')}`;
    exists = await Complaint.findOne({ complaintId: candidateId });
  }

  return candidateId;
};

// ============================================================================
// COMPLAINT CONTROLLERS
// ============================================================================

/**
 * @desc    Submit a new complaint
 * @route   POST /api/complaints
 * @access  Private (Citizen, Admin)
 */
export const createComplaint = async (req, res, next) => {
  try {
    const user = req.user;
    const {
      title,
      description,
      category,
      severity,
      priority,
      area,
      address,
      latitude,
      longitude,
      location
    } = req.body;

    // 1. Validate required fields
    if (!title || !description || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide issue title, detailed description, and specific address/landmark.'
      });
    }

    // 2. Parse coordinates (support object, stringified JSON, or separate lat/lng fields)
    let lat = 26.2183; // Default Gwalior central latitude
    let lng = 78.1828; // Default Gwalior central longitude

    if (latitude && longitude) {
      lat = parseFloat(latitude);
      lng = parseFloat(longitude);
    } else if (location) {
      if (typeof location === 'string') {
        try {
          const parsed = JSON.parse(location);
          if (parsed.lat !== undefined && parsed.lng !== undefined) {
            lat = parseFloat(parsed.lat);
            lng = parseFloat(parsed.lng);
          }
        } catch {
          // fallback defaults remain
        }
      } else if (location.lat !== undefined && location.lng !== undefined) {
        lat = parseFloat(location.lat);
        lng = parseFloat(location.lng);
      }
    }

    // 3. Process image (from Multer upload or direct URL string)
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.image && typeof req.body.image === 'string' && req.body.image.trim()) {
      imageUrl = req.body.image.trim();
    }

    // 4. Normalize category & auto-assign department
    const canonicalCategory = normalizeCategory(category);
    const targetDept = await findTargetDepartment(canonicalCategory);

    // Initial status: 'Assigned' if department matched, otherwise 'Pending'
    const initialStatus = targetDept ? 'Assigned' : 'Pending';
    const deptName = targetDept ? targetDept.name : 'Unassigned';
    const complaintId = await generateComplaintId();

    const normalizedSeverity = COMPLAINT_SEVERITIES.includes(severity) ? severity : 'Medium';
    const normalizedPriority = COMPLAINT_PRIORITIES.includes(priority) ? priority : (
      normalizedSeverity === 'Critical' || normalizedSeverity === 'High' ? 'High' : 'Medium'
    );
    const assignedArea = area || user.ward || user.area || 'City Center';

    // 5. Initial timeline events
    const timeline = [
      {
        status: 'Pending',
        date: new Date(),
        note: 'Complaint submitted by citizen',
        updatedBy: user._id,
        updatedByName: user.name
      }
    ];

    if (targetDept) {
      timeline.push({
        status: 'Assigned',
        date: new Date(),
        note: `Auto-assigned to ${deptName} based on category '${canonicalCategory}'`,
        updatedBy: null,
        updatedByName: 'Civic AI Routing System'
      });
    }

    // 6. Create complaint document
    const complaint = await Complaint.create({
      complaintId,
      title: title.trim(),
      description: description.trim(),
      category: canonicalCategory,
      priority: normalizedPriority,
      severity: normalizedSeverity,
      status: initialStatus,
      citizen: user._id,
      citizenName: user.name,
      citizenPhone: user.phone || 'Not Provided',
      department: targetDept ? targetDept._id : null,
      departmentName: deptName,
      location: { lat, lng },
      area: assignedArea,
      address: address.trim(),
      image: imageUrl,
      timeline,
      aiAnalysis: {
        detectedCategory: canonicalCategory,
        detectedPriority: normalizedPriority,
        confidence: 0.92,
        processed: true
      }
    });

    // 7. Update citizen's complaint counter & activity
    try {
      await Citizen.findByIdAndUpdate(user._id, {
        $inc: { complaintCount: 1 },
        $push: {
          activity: {
            $each: [{
              desc: `Reported civic issue: ${complaint.title} (${complaint.complaintId})`,
              time: 'Just now',
              timestamp: new Date()
            }],
            $position: 0
          }
        }
      });
    } catch (citizenUpdateErr) {
      console.warn('[Complaint Seeding] Citizen count update skipped:', citizenUpdateErr.message);
    }

    // 8. Update Department complaint counts
    if (targetDept) {
      try {
        await Department.findByIdAndUpdate(targetDept._id, {
          $inc: { totalComplaints: 1, pendingComplaints: 1 }
        });
      } catch (deptErr) {
        console.warn('[Department Count Update] Skipped:', deptErr.message);
      }
    }

    // 9. Dispatch in-app notifications
    // Notify department if assigned
    if (targetDept) {
      sendNotification({
        recipient: targetDept._id,
        recipientRole: 'department',
        title: `New Issue Assigned: ${complaint.complaintId}`,
        message: `A new complaint "${complaint.title}" has been assigned to ${deptName}.`,
        description: complaint.description,
        priority: complaint.priority,
        relatedEntity: 'complaint',
        relatedId: complaint.complaintId,
        area: complaint.area
      });
    }

    // Notify citizen confirmation
    sendNotification({
      recipient: user._id,
      recipientRole: 'citizen',
      title: 'Complaint Registered Successfully',
      message: `Your complaint (${complaint.complaintId}) has been registered and assigned to ${deptName}.`,
      description: `Track status anytime using Complaint ID: ${complaint.complaintId}`,
      priority: 'Low',
      relatedEntity: 'complaint',
      relatedId: complaint.complaintId,
      area: complaint.area
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully and routed to responsible department.',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get complaints list with role-based visibility, pagination, and multi-filters
 * @route   GET /api/complaints
 * @access  Private (Citizen, Department, Admin)
 */
export const getComplaints = async (req, res, next) => {
  try {
    const user = req.user;
    const role = (user.role || 'citizen').toLowerCase();

    const {
      status,
      category,
      priority,
      severity,
      area,
      departmentId,
      departmentName,
      search,
      q,
      dateFilter,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // 1. Role-based scoping
    const filter = {};

    if (role === 'citizen') {
      filter.citizen = user._id;
    } else if (role === 'department') {
      filter.$or = [
        { department: user._id },
        { departmentName: new RegExp(`^${escapeRegex(user.name)}$`, 'i') },
        { departmentName: new RegExp(escapeRegex(user.name.split(' ')[0]), 'i') }
      ];
    }
    // Admin has global visibility, no initial constraint

    // 2. Query Filters
    if (status && status !== 'All') {
      filter.status = status;
    }

    if (category && category !== 'All') {
      filter.category = normalizeCategory(category);
    }

    if (priority && priority !== 'All') {
      filter.priority = priority;
    }

    if (severity && severity !== 'All') {
      filter.severity = severity;
    }

    if (area && area !== 'All') {
      filter.area = new RegExp(escapeRegex(area), 'i');
    }

    if (departmentId && departmentId !== 'All') {
      filter.department = departmentId;
    } else if (departmentName && departmentName !== 'All') {
      filter.departmentName = new RegExp(escapeRegex(departmentName), 'i');
    }

    // 3. Search text query
    const searchQuery = (search || q || '').trim();
    if (searchQuery) {
      const searchRegex = new RegExp(escapeRegex(searchQuery), 'i');
      const searchConditions = [
        { complaintId: searchRegex },
        { title: searchRegex },
        { description: searchRegex },
        { area: searchRegex },
        { address: searchRegex },
        { category: searchRegex }
      ];

      if (role === 'admin' || role === 'department') {
        searchConditions.push({ citizenName: searchRegex }, { departmentName: searchRegex });
      }

      if (filter.$or) {
        // Combine role filter with search filter
        filter.$and = [
          { $or: filter.$or },
          { $or: searchConditions }
        ];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }

    // 4. Date filtering
    if (dateFilter && dateFilter !== 'All') {
      const now = new Date();
      let fromDate = null;

      if (dateFilter === 'Today') {
        fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (dateFilter === 'Last 7 Days') {
        fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateFilter === 'Last 30 Days') {
        fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      } else if (dateFilter === 'This Year') {
        fromDate = new Date(now.getFullYear(), 0, 1);
      }

      if (fromDate) {
        filter.createdAt = { $gte: fromDate };
      }
    }

    // 5. Pagination & Sorting
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const skip = (parsedPage - 1) * parsedLimit;

    const sortDirection = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortDirection };

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Complaint.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: complaints.length,
      total,
      totalPages: Math.ceil(total / parsedLimit),
      currentPage: parsedPage,
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged in citizen's complaints with summary status counters
 * @route   GET /api/complaints/my
 * @access  Private (Citizen)
 */
export const getMyComplaints = async (req, res, next) => {
  try {
    const user = req.user;

    const [complaints, total, pending, inProgress, resolved, rejected] = await Promise.all([
      Complaint.find({ citizen: user._id }).sort({ createdAt: -1 }).lean(),
      Complaint.countDocuments({ citizen: user._id }),
      Complaint.countDocuments({ citizen: user._id, status: 'Pending' }),
      Complaint.countDocuments({ citizen: user._id, status: { $in: ['Assigned', 'In Progress'] } }),
      Complaint.countDocuments({ citizen: user._id, status: 'Resolved' }),
      Complaint.countDocuments({ citizen: user._id, status: 'Rejected' })
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        resolved,
        rejected
      },
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search complaints with role-based scoping and regex matching
 * @route   GET /api/complaints/search?q=pothole
 * @access  Private
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
    const role = (user.role || 'citizen').toLowerCase();

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
      roleFilter = {};
    } else {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized role for complaint search.'
      });
    }

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

    if (role === 'admin' || role === 'department') {
      searchFields.push({ citizenName: searchRegex });
    }

    const finalFilter = Object.keys(roleFilter).length > 0
      ? { $and: [roleFilter, { $or: searchFields }] }
      : { $or: searchFields };

    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 30);

    const complaints = await Complaint.find(finalFilter)
      .select('complaintId title description category priority severity status departmentName area address createdAt citizenName image')
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .lean();

    return res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single complaint details by ID or complaintId
 * @route   GET /api/complaints/:id
 * @access  Private
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

    // Role-based authorization check
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
    next(error);
  }
};

/**
 * @desc    Update complaint status & timeline (Department Officers, Admins)
 * @route   PUT /api/complaints/:id/status
 * @access  Private (Department, Admin)
 */
export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const { status, note, assignedOfficer } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required.'
      });
    }

    if (!COMPLAINT_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${COMPLAINT_STATUSES.join(', ')}`
      });
    }

    const query = id.match(/^[0-9a-fA-F]{24}$/)
      ? { $or: [{ _id: id }, { complaintId: id }] }
      : { complaintId: id };

    const complaint = await Complaint.findOne(query);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint '${id}' not found.`
      });
    }

    // Authorization: Department officers can update complaints assigned to their department or unassigned complaints
    const role = (user.role || '').toLowerCase();
    if (role === 'department') {
      const isDeptMatch =
        !complaint.department ||
        complaint.departmentName === 'Unassigned' ||
        (complaint.department && complaint.department.toString() === user._id.toString()) ||
        (complaint.departmentName && complaint.departmentName.toLowerCase().includes((user.name || '').toLowerCase())) ||
        (user.name && user.name.toLowerCase().includes((complaint.departmentName || '').toLowerCase()));

      if (!isDeptMatch) {
        // Also allow if department user name matches or if they are taking over
        complaint.department = user._id;
        complaint.departmentName = user.name;
      } else if (!complaint.department) {
        complaint.department = user._id;
        complaint.departmentName = user.name;
      }
    }

    // Process resolution proof image if uploaded
    if (req.file) {
      complaint.resolutionImage = `/uploads/${req.file.filename}`;
    } else if (req.body.resolutionImage) {
      complaint.resolutionImage = req.body.resolutionImage;
    }

    const prevStatus = complaint.status;
    complaint.status = status;

    if (status === 'Resolved') {
      complaint.resolvedAt = new Date();
    }

    const officerLabel = assignedOfficer || user.name || (role === 'admin' ? 'Municipal Admin' : 'Field Supervisor');

    complaint.timeline.push({
      status,
      date: new Date(),
      note: note || `Status updated from ${prevStatus} to ${status}`,
      updatedBy: user._id,
      updatedByName: officerLabel
    });

    await complaint.save();

    // If resolved, update Citizen & Department stats counters
    if (status === 'Resolved' && prevStatus !== 'Resolved') {
      try {
        await Citizen.findByIdAndUpdate(complaint.citizen, {
          $inc: { resolvedComplaints: 1 }
        });

        if (complaint.department) {
          await Department.findByIdAndUpdate(complaint.department, {
            $inc: { resolvedComplaints: 1, pendingComplaints: -1 }
          });
        }
      } catch (statErr) {
        console.warn('[Stats Counter Update] Skipped:', statErr.message);
      }
    }

    // Send in-app notification to Citizen
    sendNotification({
      recipient: complaint.citizen,
      recipientRole: 'citizen',
      title: `Complaint Status Updated: ${status}`,
      message: `Your complaint (${complaint.complaintId}) has been updated to "${status}".`,
      description: note || `Action taken by ${officerLabel}`,
      priority: status === 'Resolved' ? 'High' : 'Medium',
      relatedEntity: 'complaint',
      relatedId: complaint.complaintId,
      area: complaint.area
    });

    res.status(200).json({
      success: true,
      message: `Complaint status successfully updated to ${status}.`,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reassign complaint to another department (Admin only)
 * @route   PUT /api/complaints/:id/assign
 * @access  Private (Admin)
 */
export const assignComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { departmentId, departmentName, note } = req.body;

    if (!departmentId && !departmentName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide departmentId or departmentName to assign.'
      });
    }

    let targetDept = null;
    if (departmentId) {
      targetDept = await Department.findById(departmentId);
    }
    if (!targetDept && departmentName) {
      targetDept = await Department.findOne({
        name: new RegExp(`^${escapeRegex(departmentName.trim())}$`, 'i')
      });
    }

    if (!targetDept) {
      return res.status(404).json({
        success: false,
        message: 'Target department not found.'
      });
    }

    const query = id.match(/^[0-9a-fA-F]{24}$/)
      ? { $or: [{ _id: id }, { complaintId: id }] }
      : { complaintId: id };

    const complaint = await Complaint.findOne(query);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint '${id}' not found.`
      });
    }

    const prevDept = complaint.departmentName;
    complaint.department = targetDept._id;
    complaint.departmentName = targetDept.name;
    complaint.status = 'Assigned';

    complaint.timeline.push({
      status: 'Assigned',
      date: new Date(),
      note: note || `Reassigned from ${prevDept} to ${targetDept.name} by Administrator`,
      updatedBy: req.user._id,
      updatedByName: req.user.name || 'System Admin'
    });

    await complaint.save();

    // Notify newly assigned department
    sendNotification({
      recipient: targetDept._id,
      recipientRole: 'department',
      title: `Complaint Reassigned: ${complaint.complaintId}`,
      message: `Complaint "${complaint.title}" has been assigned to your department.`,
      description: note || 'Reassigned by Municipal Administration',
      priority: complaint.priority,
      relatedEntity: 'complaint',
      relatedId: complaint.complaintId,
      area: complaint.area
    });

    res.status(200).json({
      success: true,
      message: `Complaint reassigned to ${targetDept.name} successfully.`,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit citizen satisfaction rating & review
 * @route   POST /api/complaints/:id/feedback
 * @access  Private (Citizen)
 */
export const submitFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const { rating, comment } = req.body;

    const numRating = parseInt(rating, 10);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5 stars.'
      });
    }

    const query = id.match(/^[0-9a-fA-F]{24}$/)
      ? { $or: [{ _id: id }, { complaintId: id }] }
      : { complaintId: id };

    const complaint = await Complaint.findOne(query);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint '${id}' not found.`
      });
    }

    // Check ownership
    if (complaint.citizen.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only provide feedback on your own complaints.'
      });
    }

    complaint.feedback = {
      rating: numRating,
      comment: (comment || '').trim(),
      submittedAt: new Date()
    };

    complaint.timeline.push({
      status: complaint.status,
      date: new Date(),
      note: `Citizen submitted feedback (${numRating} ★): "${comment || 'No additional comment'}"`,
      updatedBy: user._id,
      updatedByName: user.name
    });

    await complaint.save();

    res.status(200).json({
      success: true,
      message: 'Thank you for your feedback! It helps improve civic operations.',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get aggregated stats for dashboard counters
 * @route   GET /api/complaints/stats
 * @access  Private
 */
export const getComplaintStats = async (req, res, next) => {
  try {
    const user = req.user;
    const role = (user.role || 'citizen').toLowerCase();

    let scopeFilter = {};
    if (role === 'citizen') {
      scopeFilter = { citizen: user._id };
    } else if (role === 'department') {
      scopeFilter = {
        $or: [
          { department: user._id },
          { departmentName: new RegExp(`^${escapeRegex(user.name)}$`, 'i') },
          { departmentName: new RegExp(escapeRegex(user.name.split(' ')[0]), 'i') }
        ]
      };
    }

    const [
      total,
      pending,
      assigned,
      inProgress,
      resolved,
      rejected,
      highPriority
    ] = await Promise.all([
      Complaint.countDocuments(scopeFilter),
      Complaint.countDocuments({ ...scopeFilter, status: 'Pending' }),
      Complaint.countDocuments({ ...scopeFilter, status: 'Assigned' }),
      Complaint.countDocuments({ ...scopeFilter, status: 'In Progress' }),
      Complaint.countDocuments({ ...scopeFilter, status: 'Resolved' }),
      Complaint.countDocuments({ ...scopeFilter, status: 'Rejected' }),
      Complaint.countDocuments({ ...scopeFilter, priority: 'High' })
    ]);

    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        assigned,
        inProgress,
        active: pending + assigned + inProgress,
        resolved,
        rejected,
        highPriority,
        resolutionRate: `${resolutionRate}%`
      }
    });
  } catch (error) {
    next(error);
  }
};

