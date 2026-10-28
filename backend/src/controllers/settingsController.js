import Setting from '../models/Setting.js';

/**
 * Helper to get or initialize default system settings
 */
const getOrCreateDefaultSettings = async () => {
  let setting = await Setting.findOne();
  if (!setting) {
    setting = await Setting.create({
      orgName: 'Smart Civic Complaint System',
      adminEmail: 'admin@civis.gov',
      phone: '+91 98765 43210',
      timeZone: 'Asia/Kolkata (IST)',
      language: 'English',
      notifications: {
        newComplaint: true,
        highPriority: true,
        statusUpdates: true,
        newUserReg: false,
        deptAssignment: true,
        emailNotifs: true
      },
      preferences: {
        defaultStatus: 'Pending',
        complaintsPerPage: 10,
        autoRefresh: true,
        refreshInterval: '30 seconds',
        dateFormat: 'DD/MM/YYYY',
        maintenanceMode: false
      }
    });
  }
  return setting;
};

/**
 * @desc    Get system settings (all or by key/section)
 * @route   GET /api/settings or GET /api/settings/:key
 * @access  Private (Authenticated users)
 */
export const getSettings = async (req, res, next) => {
  try {
    const setting = await getOrCreateDefaultSettings();
    const key = req.params.key || req.query.key;

    if (!key) {
      return res.status(200).json({
        success: true,
        data: setting
      });
    }

    const keyLower = key.toLowerCase();

    if (keyLower === 'general') {
      return res.status(200).json({
        success: true,
        data: {
          orgName: setting.orgName,
          adminEmail: setting.adminEmail,
          phone: setting.phone,
          timeZone: setting.timeZone,
          language: setting.language
        }
      });
    }

    if (keyLower === 'notifications') {
      return res.status(200).json({
        success: true,
        data: setting.notifications
      });
    }

    if (keyLower === 'preferences') {
      return res.status(200).json({
        success: true,
        data: setting.preferences
      });
    }

    if (setting[key] !== undefined) {
      return res.status(200).json({
        success: true,
        data: { [key]: setting[key] }
      });
    }

    return res.status(200).json({
      success: true,
      data: setting
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update system settings by key / section
 * @route   PUT /api/settings/:key or PUT /api/settings
 * @access  Private (Admin only)
 */
export const updateSetting = async (req, res, next) => {
  try {
    const setting = await getOrCreateDefaultSettings();
    const key = req.params.key || req.body.key;
    const body = req.body;

    if (!key) {
      // General update directly to root setting fields
      Object.assign(setting, body);
      await setting.save();
      return res.status(200).json({
        success: true,
        message: 'Settings updated successfully',
        data: setting
      });
    }

    const keyLower = key.toLowerCase();

    if (keyLower === 'general') {
      if (body.orgName !== undefined) setting.orgName = body.orgName;
      if (body.adminEmail !== undefined) setting.adminEmail = body.adminEmail;
      if (body.phone !== undefined) setting.phone = body.phone;
      if (body.timeZone !== undefined) setting.timeZone = body.timeZone;
      if (body.language !== undefined) setting.language = body.language;
    } else if (keyLower === 'notifications') {
      setting.notifications = {
        ...(setting.notifications ? setting.notifications.toObject() : {}),
        ...body
      };
    } else if (keyLower === 'preferences') {
      setting.preferences = {
        ...(setting.preferences ? setting.preferences.toObject() : {}),
        ...body
      };
    } else if (setting[key] !== undefined) {
      setting[key] = body.value !== undefined ? body.value : (body[key] !== undefined ? body[key] : body);
    } else {
      // Fallback for custom or nested properties
      setting.set(key, body.value !== undefined ? body.value : body);
    }

    await setting.save();

    res.status(200).json({
      success: true,
      message: `Settings for '${key}' updated successfully`,
      data: setting
    });
  } catch (error) {
    next(error);
  }
};
