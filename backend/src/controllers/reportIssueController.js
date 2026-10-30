import ReportIssue from '../models/ReportIssue.js';
import Complaint from '../models/Complaint.js';
import Citizen from '../models/Citizen.js';
import Department from '../models/Department.js';
import {
  COMPLAINT_CATEGORIES,
  COMPLAINT_PRIORITIES,
  COMPLAINT_SEVERITIES
} from '../constants/civicConstants.js';

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

  const exact = COMPLAINT_CATEGORIES.find(cat => cat.toLowerCase() === c);
  return exact || 'Other';
};

/**
 * Auto-route complaint to matching active municipal department
 */
const findTargetDepartment = async (category) => {
  try {
    let dept = await Department.findOne({
      status: 'Active',
      categories: { $regex: new RegExp(category, 'i') }
    });

    if (dept) return dept;

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
 * Auto-generate unique report ID (e.g. SC-2026-0001)
 */
const generateReportId = async () => {
  const currentYear = new Date().getFullYear();
  const count = await ReportIssue.countDocuments();
  let sequenceNumber = count + 1;
  let candidateId = `SC-${currentYear}-${String(sequenceNumber).padStart(4, '0')}`;

  let exists = await ReportIssue.findOne({ reportId: candidateId });
  while (exists) {
    sequenceNumber++;
    candidateId = `SC-${currentYear}-${String(sequenceNumber).padStart(4, '0')}`;
    exists = await ReportIssue.findOne({ reportId: candidateId });
  }

  return candidateId;
};

/**
 * @desc    Submit a new issue report (Stores in dedicated 'reportissues' database collection with Base64 image)
 * @route   POST /api/report-issues
 * @access  Private (Citizen, Admin)
 */
export const createReportIssue = async (req, res, next) => {
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

    if (!title || !description || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide issue title, detailed description, and specific address/landmark.'
      });
    }

    let lat = 26.2183;
    let lng = 78.1828;

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
          // fallback remains
        }
      } else if (location.lat !== undefined && location.lng !== undefined) {
        lat = parseFloat(location.lat);
        lng = parseFloat(location.lng);
      }
    }

    // Process image: Store full Base64 Data URL directly inside MongoDB
    let imageBase64 = null;
    let imageMetadata = {
      contentType: 'image/jpeg',
      originalName: null,
      size: 0,
      uploadedAt: new Date()
    };

    if (req.file) {
      if (req.file.dataUrl) {
        imageBase64 = req.file.dataUrl;
      } else if (req.file.buffer) {
        const mime = req.file.mimetype || 'image/jpeg';
        imageBase64 = `data:${mime};base64,${req.file.buffer.toString('base64')}`;
      } else if (req.file.diskPath) {
        imageBase64 = req.file.diskPath;
      }

      imageMetadata = {
        contentType: req.file.mimetype || 'image/jpeg',
        originalName: req.file.originalname || req.file.filename,
        size: req.file.size || (req.file.buffer ? req.file.buffer.length : 0),
        uploadedAt: new Date()
      };
    } else if (req.body.image && typeof req.body.image === 'string' && req.body.image.trim()) {
      imageBase64 = req.body.image.trim();
      imageMetadata = {
        contentType: imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
        originalName: 'uploaded_image',
        size: imageBase64.length,
        uploadedAt: new Date()
      };
    }

    const canonicalCategory = normalizeCategory(category);
    const targetDept = await findTargetDepartment(canonicalCategory);

    const initialStatus = targetDept ? 'Assigned' : 'Pending';
    const deptName = targetDept ? targetDept.name : 'Unassigned';
    const reportId = await generateReportId();

    const normalizedSeverity = COMPLAINT_SEVERITIES.includes(severity) ? severity : 'Medium';
    const normalizedPriority = COMPLAINT_PRIORITIES.includes(priority) ? priority : (
      normalizedSeverity === 'Critical' || normalizedSeverity === 'High' ? 'High' : 'Medium'
    );
    const assignedArea = area || user.ward || user.area || 'City Center';

    const timeline = [
      {
        status: 'Pending',
        date: new Date(),
        note: 'Issue reported by citizen and stored in database',
        updatedBy: user._id,
        updatedByName: user.name
      }
    ];

    if (targetDept) {
      timeline.push({
        status: 'Assigned',
        date: new Date(),
        note: `Auto-routed to ${deptName} based on category '${canonicalCategory}'`,
        updatedBy: null,
        updatedByName: 'Civic AI Routing System'
      });
    }

    // 1. Create document in dedicated 'reportissues' collection in MongoDB
    const reportIssue = await ReportIssue.create({
      reportId,
      complaintId: reportId,
      title: title.trim(),
      description: description.trim(),
      category: canonicalCategory,
      priority: normalizedPriority,
      severity: normalizedSeverity,
      status: initialStatus,
      citizen: user._id,
      citizenName: user.name,
      citizenPhone: user.phone || 'Not Provided',
      citizenEmail: user.email || 'Not Provided',
      department: targetDept ? targetDept._id : null,
      departmentName: deptName,
      location: { lat, lng },
      area: assignedArea,
      address: address.trim(),
      image: imageBase64,
      imageMetadata,
      timeline,
      aiAnalysis: {
        detectedCategory: canonicalCategory,
        detectedPriority: normalizedPriority,
        confidence: 0.92,
        processed: true
      }
    });

    // 2. Dual-save to 'complaints' collection so all existing complaints views stay synchronized
    try {
      await Complaint.create({
        complaintId: reportId,
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
        image: imageBase64,
        imageMetadata,
        timeline,
        aiAnalysis: {
          detectedCategory: canonicalCategory,
          detectedPriority: normalizedPriority,
          confidence: 0.92,
          processed: true
        }
      });
    } catch (syncErr) {
      console.warn('[Sync] Complaint synchronization skipped:', syncErr.message);
    }

    // 3. Update citizen's counter
    try {
      await Citizen.findByIdAndUpdate(user._id, {
        $inc: { complaintCount: 1 },
        $push: {
          activity: {
            $each: [{
              desc: `Reported civic issue: ${reportIssue.title} (${reportIssue.reportId})`,
              time: 'Just now',
              timestamp: new Date()
            }],
            $position: 0
          }
        }
      });
    } catch (citErr) {
      console.warn('[Activity] Citizen activity update skipped:', citErr.message);
    }

    // 4. Update department counter
    if (targetDept) {
      try {
        await Department.findByIdAndUpdate(targetDept._id, {
          $inc: { totalComplaints: 1, pendingComplaints: 1 }
        });
      } catch (deptErr) {
        console.warn('[Department] Count update skipped:', deptErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Civic issue reported successfully and stored in the database with image.',
      data: reportIssue
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reported issues from database ('reportissues' collection)
 * @route   GET /api/report-issues
 * @access  Private
 */
export const getReportIssues = async (req, res, next) => {
  try {
    const { status, category, area, priority, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status && status !== 'All') query.status = status;
    if (category && category !== 'All') query.category = category;
    if (area && area !== 'All') query.area = area;
    if (priority && priority !== 'All') query.priority = priority;

    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { reportId: { $regex: q, $options: 'i' } },
        { citizenName: { $regex: q, $options: 'i' } },
        { address: { $regex: q, $options: 'i' } }
      ];
    }

    // Scope by citizen if caller is a citizen
    if (req.user && req.user.role === 'citizen') {
      query.citizen = req.user._id;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [reports, total] = await Promise.all([
      ReportIssue.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      ReportIssue.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: reports.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current citizen's reported issues from database
 * @route   GET /api/report-issues/my
 * @access  Private (Citizen)
 */
export const getMyReportIssues = async (req, res, next) => {
  try {
    const reports = await ReportIssue.find({ citizen: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single reported issue by reportId or ObjectId
 * @route   GET /api/report-issues/:id
 * @access  Private
 */
export const getReportIssueById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let report = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      report = await ReportIssue.findById(id);
    }
    if (!report) {
      report = await ReportIssue.findOne({ $or: [{ reportId: id }, { complaintId: id }] });
    }

    if (!report) {
      return res.status(404).json({
        success: false,
        message: `Reported issue with ID '${id}' was not found in the database.`
      });
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};
