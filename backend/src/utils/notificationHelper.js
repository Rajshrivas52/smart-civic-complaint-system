import Notification from '../models/Notification.js';

/**
 * Helper to dispatch in-app notifications
 */
export const sendNotification = async ({
  recipient = null,
  recipientRole = 'all',
  type = 'complaint',
  title,
  message,
  description = '',
  priority = 'Medium',
  relatedEntity = 'complaint',
  relatedId = '',
  area = '',
  sender = 'Smart Civic System',
  category = 'Complaint Updates'
}) => {
  try {
    const notificationId = `NOTIF-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
    const notification = await Notification.create({
      notificationId,
      recipient,
      recipientRole,
      type,
      title,
      message,
      description,
      priority,
      relatedEntity,
      relatedId,
      area,
      sender,
      category,
      read: false
    });
    return notification;
  } catch (error) {
    console.error('[Notification Helper] Failed to send notification:', error.message);
    return null;
  }
};
