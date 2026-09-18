/**
 * Application Constants for Smart Civic Complaint System
 * Aligned with frontend schemas and form options
 */

export const USER_ROLES = ['citizen', 'department', 'admin'];

export const USER_STATUSES = ['Active', 'Inactive', 'Suspended'];

export const COMPLAINT_STATUSES = [
  'Pending',
  'Assigned',
  'In Progress',
  'Resolved',
  'Rejected'
];

export const COMPLAINT_CATEGORIES = [
  'Road Damage',
  'Garbage',
  'Streetlight',
  'Water',
  'Drainage',
  'Traffic',
  'Environment',
  'Other'
];

export const COMPLAINT_PRIORITIES = ['Low', 'Medium', 'High'];

export const COMPLAINT_SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];

export const COMPLAINT_AREAS = [
  'City Center',
  'Main Market',
  'Railway Road',
  'College Area',
  'Residential Area',
  'Thatipur',
  'Morar',
  'Lashkar',
  'Hazira',
  'Phool Bagh',
  'Gola Ka Mandir'
];

export const NOTIFICATION_TYPES = ['complaint', 'department', 'user', 'system'];

export const NOTIFICATION_CATEGORIES = [
  'Complaint Updates',
  'Department Updates',
  'User Accounts',
  'System Operations'
];

export const DEPARTMENT_STATUSES = ['Active', 'Inactive'];

export const SUPPORT_TICKET_STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];
