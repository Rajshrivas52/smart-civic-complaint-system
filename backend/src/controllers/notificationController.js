import Notification from '../models/Notification.js';

/**
 * @desc    Get notifications for currently logged in user
 * @route   GET /api/notifications
 * @access  Private
 */
export const getNotifications = async (req, res, next) => {
  try {
    const user = req.user;
    const role = (user.role || 'citizen').toLowerCase();
    const { unreadOnly, limit = 30 } = req.query;

    const filter = {
      $or: [
        { recipient: user._id },
        { recipientRole: role },
        { recipientRole: 'all' }
      ]
    };

    if (unreadOnly === 'true') {
      filter.read = false;
    }

    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 30, 1), 100);

    const [notifications, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .limit(parsedLimit)
        .lean(),
      Notification.countDocuments({ ...filter, read: false })
    ]);

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark single notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
export const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark all user notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
export const markAllNotificationsRead = async (req, res, next) => {
  try {
    const user = req.user;
    const role = (user.role || 'citizen').toLowerCase();

    await Notification.updateMany(
      {
        $or: [
          { recipient: user._id },
          { recipientRole: role },
          { recipientRole: 'all' }
        ],
        read: false
      },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (error) {
    next(error);
  }
};
