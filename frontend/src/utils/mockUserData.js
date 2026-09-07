// Mock User Data for Smart Civic Issue & Complaint Management System
// Admin User Management Module

export const USER_ROLES = ['All', 'Citizen', 'Department Staff', 'Admin'];

export const USER_STATUSES = ['All', 'Active', 'Inactive', 'Suspended'];

export const USER_DEPARTMENTS = [
  'All',
  'Road Maintenance',
  'Sanitation',
  'Electrical',
  'Water Supply',
  'Drainage',
  'Traffic'
];

export const USER_AREAS = [
  'All',
  'Thatipur',
  'City Centre',
  'Lashkar',
  'Morar',
  'Gola Ka Mandir',
  'Phool Bagh',
  'Madhav Nagar',
  'Hazira',
  'DD Nagar',
  'University Road'
];

export const REGISTRATION_PERIODS = [
  'All',
  'Today',
  'Last 7 Days',
  'Last 30 Days',
  'Last 6 Months',
  'This Year'
];

export const initialUsers = [
  {
    id: 'USR-1001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    role: 'Citizen',
    department: null,
    area: 'Thatipur',
    status: 'Active',
    complaintCount: 8,
    resolvedComplaints: 6,
    registeredDate: '2026-01-15',
    lastActive: '2 hours ago',
    lastActiveTimestamp: '2026-09-06T19:30:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Today, 2:15 PM', desc: 'Submitted complaint CMP-1024 (Pothole)' },
      { id: 'act-2', time: 'Yesterday', desc: 'Upvoted drainage issue in Thatipur' },
      { id: 'act-3', time: 'Sep 02, 2026', desc: 'Complaint CMP-1011 marked Resolved' }
    ]
  },
  {
    id: 'USR-1002',
    name: 'Priya Verma',
    email: 'priya.verma@example.com',
    phone: '+91 98234 56781',
    role: 'Citizen',
    department: null,
    area: 'City Centre',
    status: 'Active',
    complaintCount: 5,
    resolvedComplaints: 4,
    registeredDate: '2026-02-10',
    lastActive: '1 day ago',
    lastActiveTimestamp: '2026-09-05T14:10:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Yesterday', desc: 'Submitted complaint CMP-1025 (Garbage)' },
      { id: 'act-2', time: 'Aug 28, 2026', desc: 'Updated account phone number' }
    ]
  },
  {
    id: 'USR-1003',
    name: 'Rajesh Nair',
    email: 'rajesh.nair@civis.gov.in',
    phone: '+91 97455 66778',
    role: 'Department Staff',
    department: 'Road Maintenance',
    area: 'Morar',
    status: 'Active',
    complaintCount: 14,
    resolvedComplaints: 11,
    registeredDate: '2025-11-04',
    lastActive: '30 mins ago',
    lastActiveTimestamp: '2026-09-06T21:15:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Today, 8:45 PM', desc: 'Assigned crew to road resurfacing at Morar' },
      { id: 'act-2', time: 'Today, 11:20 AM', desc: 'Closed complaint CMP-1019 with resolution photos' }
    ]
  },
  {
    id: 'USR-1004',
    name: 'Neha Gupta',
    email: 'neha.admin@civis.gov.in',
    phone: '+91 98112 33445',
    role: 'Admin',
    department: null,
    area: 'City Centre',
    status: 'Active',
    complaintCount: 0,
    resolvedComplaints: 0,
    registeredDate: '2025-08-15',
    lastActive: 'Just now',
    lastActiveTimestamp: '2026-09-06T22:40:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Just now', desc: 'Reviewed municipal daily analytics report' },
      { id: 'act-2', time: 'Today, 4:00 PM', desc: 'Modified department escalations policy' },
      { id: 'act-3', time: 'Sep 04, 2026', desc: 'Approved 3 staff account registrations' }
    ]
  },
  {
    id: 'USR-1005',
    name: 'Vikram Malhotra',
    email: 'vikram.m@civis.gov.in',
    phone: '+91 94250 88991',
    role: 'Department Staff',
    department: 'Electrical',
    area: 'Lashkar',
    status: 'Active',
    complaintCount: 19,
    resolvedComplaints: 16,
    registeredDate: '2025-12-01',
    lastActive: '4 hours ago',
    lastActiveTimestamp: '2026-09-06T18:00:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Today, 5:30 PM', desc: 'Dispatched emergency repair for transformer spark' },
      { id: 'act-2', time: 'Sep 03, 2026', desc: 'Updated streetlight circuit status in Lashkar' }
    ]
  },
  {
    id: 'USR-1006',
    name: 'Ananya Sen',
    email: 'ananya.sen@example.com',
    phone: '+91 96544 33221',
    role: 'Citizen',
    area: 'Phool Bagh',
    department: null,
    status: 'Inactive',
    complaintCount: 2,
    resolvedComplaints: 2,
    registeredDate: '2026-03-20',
    lastActive: '2 weeks ago',
    lastActiveTimestamp: '2026-08-22T10:00:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Aug 22, 2026', desc: 'Logged in via mobile verification' },
      { id: 'act-2', time: 'Jul 15, 2026', desc: 'Submitted park cleanliness feedback' }
    ]
  },
  {
    id: 'USR-1007',
    name: 'Amit Kumar',
    email: 'amit.kumar@civis.gov.in',
    phone: '+91 98930 11223',
    role: 'Department Staff',
    department: 'Sanitation',
    area: 'Gola Ka Mandir',
    status: 'Active',
    complaintCount: 24,
    resolvedComplaints: 21,
    registeredDate: '2026-01-05',
    lastActive: '1 hour ago',
    lastActiveTimestamp: '2026-09-06T21:00:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Today, 8:15 PM', desc: 'Confirmed clearance of dumpster at Sector 4' },
      { id: 'act-2', time: 'Sep 05, 2026', desc: 'Scheduled night sanitization vehicle' }
    ]
  },
  {
    id: 'USR-1008',
    name: 'Sunita Rao',
    email: 'sunita.rao@example.com',
    phone: '+91 97114 55667',
    role: 'Citizen',
    department: null,
    area: 'Morar',
    status: 'Active',
    complaintCount: 6,
    resolvedComplaints: 4,
    registeredDate: '2026-04-12',
    lastActive: '3 days ago',
    lastActiveTimestamp: '2026-09-03T09:45:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Sep 03, 2026', desc: 'Reported water supply pipeline leak CMP-1027' },
      { id: 'act-2', time: 'Aug 14, 2026', desc: 'Submitted municipal feedback rating 5/5' }
    ]
  },
  {
    id: 'USR-1009',
    name: 'Manoj Tiwari',
    email: 'manoj.tiwari@civis.gov.in',
    phone: '+91 98110 99887',
    role: 'Department Staff',
    department: 'Water Supply',
    area: 'DD Nagar',
    status: 'Active',
    complaintCount: 16,
    resolvedComplaints: 13,
    registeredDate: '2026-02-18',
    lastActive: '5 hours ago',
    lastActiveTimestamp: '2026-09-06T17:15:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Today, 4:45 PM', desc: 'Supervised pipeline valve pressure test' },
      { id: 'act-2', time: 'Sep 04, 2026', desc: 'Resolved water contamination report at DD Nagar' }
    ]
  },
  {
    id: 'USR-1010',
    name: 'Pooja Bhatia',
    email: 'pooja.bhatia@example.com',
    phone: '+91 99102 33441',
    role: 'Citizen',
    department: null,
    area: 'University Road',
    status: 'Active',
    complaintCount: 4,
    resolvedComplaints: 3,
    registeredDate: '2026-05-02',
    lastActive: 'Yesterday',
    lastActiveTimestamp: '2026-09-05T16:20:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Yesterday', desc: 'Reported loose gravel road damage CMP-1040' },
      { id: 'act-2', time: 'Jun 19, 2026', desc: 'Resolved complaint confirmed' }
    ]
  },
  {
    id: 'USR-1011',
    name: 'Karan Mehra',
    email: 'karan.mehra@civis.gov.in',
    phone: '+91 99887 76655',
    role: 'Department Staff',
    department: 'Traffic',
    area: 'Phool Bagh',
    status: 'Active',
    complaintCount: 12,
    resolvedComplaints: 9,
    registeredDate: '2026-03-01',
    lastActive: '3 hours ago',
    lastActiveTimestamp: '2026-09-06T19:00:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Today, 6:30 PM', desc: 'Traffic light synchronized at Phool Bagh crossing' },
      { id: 'act-2', time: 'Sep 02, 2026', desc: 'Cleared unauthorized commercial trucks' }
    ]
  },
  {
    id: 'USR-1012',
    name: 'Sneha Kulkarni',
    email: 'sneha.kulkarni@example.com',
    phone: '+91 97654 32109',
    role: 'Citizen',
    department: null,
    area: 'Madhav Nagar',
    status: 'Active',
    complaintCount: 7,
    resolvedComplaints: 5,
    registeredDate: '2026-01-28',
    lastActive: '1 day ago',
    lastActiveTimestamp: '2026-09-05T12:00:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Yesterday', desc: 'Submitted streetlight outage alert CMP-1031' },
      { id: 'act-2', time: 'Aug 10, 2026', desc: 'Upvoted 2 local issues' }
    ]
  },
  {
    id: 'USR-1013',
    name: 'Devendra Tomar',
    email: 'devendra.tomar@civis.gov.in',
    phone: '+91 94251 22334',
    role: 'Department Staff',
    department: 'Drainage',
    area: 'Hazira',
    status: 'Active',
    complaintCount: 15,
    resolvedComplaints: 12,
    registeredDate: '2025-10-15',
    lastActive: '45 mins ago',
    lastActiveTimestamp: '2026-09-06T21:45:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Today, 9:00 PM', desc: 'Drainage blockage desilting team dispatched' },
      { id: 'act-2', time: 'Sep 04, 2026', desc: 'Underground chamber cover installed' }
    ]
  },
  {
    id: 'USR-1014',
    name: 'Ritu Saxena',
    email: 'ritu.saxena@example.com',
    phone: '+91 98260 44556',
    role: 'Citizen',
    department: null,
    area: 'Lashkar',
    status: 'Suspended',
    complaintCount: 11,
    resolvedComplaints: 2,
    registeredDate: '2026-02-14',
    lastActive: '1 week ago',
    lastActiveTimestamp: '2026-08-30T11:00:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Aug 30, 2026', desc: 'Account suspended due to repetitive false reporting' },
      { id: 'act-2', time: 'Aug 29, 2026', desc: 'Submitted flag review request' }
    ]
  },
  {
    id: 'USR-1015',
    name: 'Deepak Jain',
    email: 'deepak.jain@example.com',
    phone: '+91 93011 55667',
    role: 'Citizen',
    department: null,
    area: 'Thatipur',
    status: 'Active',
    complaintCount: 3,
    resolvedComplaints: 3,
    registeredDate: '2026-06-10',
    lastActive: '4 days ago',
    lastActiveTimestamp: '2026-09-02T15:30:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Sep 02, 2026', desc: 'Feedback submitted for completed pothole repair' }
    ]
  },
  {
    id: 'USR-1016',
    name: 'Kavita Chouhan',
    email: 'kavita.admin@civis.gov.in',
    phone: '+91 98270 99112',
    role: 'Admin',
    department: null,
    area: 'City Centre',
    status: 'Active',
    complaintCount: 0,
    resolvedComplaints: 0,
    registeredDate: '2025-09-01',
    lastActive: '10 mins ago',
    lastActiveTimestamp: '2026-09-06T22:35:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Today, 10:15 PM', desc: 'Created new municipal staff account' },
      { id: 'act-2', time: 'Today, 3:30 PM', desc: 'Reviewed pending departmental reassignments' }
    ]
  },
  {
    id: 'USR-1017',
    name: 'Sanjay Agarwal',
    email: 'sanjay.agarwal@example.com',
    phone: '+91 94065 77889',
    role: 'Citizen',
    department: null,
    area: 'DD Nagar',
    status: 'Inactive',
    complaintCount: 1,
    resolvedComplaints: 1,
    registeredDate: '2026-07-04',
    lastActive: '3 weeks ago',
    lastActiveTimestamp: '2026-08-16T14:00:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Aug 16, 2026', desc: 'Completed mobile verification' }
    ]
  },
  {
    id: 'USR-1018',
    name: 'Meenakshi Joshi',
    email: 'meenakshi.j@civis.gov.in',
    phone: '+91 98935 66778',
    role: 'Department Staff',
    department: 'Road Maintenance',
    area: 'University Road',
    status: 'Active',
    complaintCount: 10,
    resolvedComplaints: 8,
    registeredDate: '2026-01-20',
    lastActive: '2 hours ago',
    lastActiveTimestamp: '2026-09-06T20:10:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Today, 7:50 PM', desc: 'Updated road curb reconstruction progress' },
      { id: 'act-2', time: 'Sep 03, 2026', desc: 'Uploaded road completion certificate' }
    ]
  },
  {
    id: 'USR-1019',
    name: 'Tarun Singhal',
    email: 'tarun.singhal@example.com',
    phone: '+91 97551 23456',
    role: 'Citizen',
    department: null,
    area: 'Gola Ka Mandir',
    status: 'Active',
    complaintCount: 5,
    resolvedComplaints: 4,
    registeredDate: '2026-08-15',
    lastActive: 'Today, 11 AM',
    lastActiveTimestamp: '2026-09-06T11:00:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Today, 11:00 AM', desc: 'Reported fallen electrical pole threat' },
      { id: 'act-2', time: 'Aug 20, 2026', desc: 'Profile created' }
    ]
  },
  {
    id: 'USR-1020',
    name: 'Swati Pandey',
    email: 'swati.pandey@example.com',
    phone: '+91 98262 11229',
    role: 'Citizen',
    department: null,
    area: 'Hazira',
    status: 'Active',
    complaintCount: 9,
    resolvedComplaints: 7,
    registeredDate: '2026-02-28',
    lastActive: '6 hours ago',
    lastActiveTimestamp: '2026-09-06T16:30:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Today, 3:30 PM', desc: 'Logged sewage overflow in Hazira CMP-1042' },
      { id: 'act-2', time: 'Sep 01, 2026', desc: 'Voted on neighborhood sanitation poll' }
    ]
  },
  {
    id: 'USR-1021',
    name: 'Harsh Vardhan',
    email: 'harsh.v@civis.gov.in',
    phone: '+91 94257 88990',
    role: 'Department Staff',
    department: 'Sanitation',
    area: 'City Centre',
    status: 'Active',
    complaintCount: 18,
    resolvedComplaints: 15,
    registeredDate: '2025-11-25',
    lastActive: '1 hour ago',
    lastActiveTimestamp: '2026-09-06T21:20:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Today, 8:40 PM', desc: 'Cleaned solid waste disposal point Sector 7' },
      { id: 'act-2', time: 'Sep 04, 2026', desc: 'Resolved community bin report' }
    ]
  },
  {
    id: 'USR-1022',
    name: 'Alok Rathore',
    email: 'alok.rathore@example.com',
    phone: '+91 98263 77881',
    role: 'Citizen',
    department: null,
    area: 'Madhav Nagar',
    status: 'Suspended',
    complaintCount: 6,
    resolvedComplaints: 1,
    registeredDate: '2026-04-18',
    lastActive: '5 days ago',
    lastActiveTimestamp: '2026-09-01T10:00:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Sep 01, 2026', desc: 'Account suspended for policy violations' }
    ]
  },
  {
    id: 'USR-1023',
    name: 'Vandana Mishra',
    email: 'vandana.mishra@example.com',
    phone: '+91 96850 44552',
    role: 'Citizen',
    department: null,
    area: 'Phool Bagh',
    status: 'Active',
    complaintCount: 4,
    resolvedComplaints: 3,
    registeredDate: '2026-08-31',
    lastActive: 'Yesterday',
    lastActiveTimestamp: '2026-09-05T18:45:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Yesterday', desc: 'Upvoted stray cattle hazard alert CMP-1039' },
      { id: 'act-2', time: 'Aug 31, 2026', desc: 'User registered via Citizen Portal' }
    ]
  },
  {
    id: 'USR-1024',
    name: 'Suresh Bhargava',
    email: 'suresh.b@civis.gov.in',
    phone: '+91 94254 33221',
    role: 'Department Staff',
    department: 'Electrical',
    area: 'Morar',
    status: 'Active',
    complaintCount: 13,
    resolvedComplaints: 11,
    registeredDate: '2026-01-10',
    lastActive: '3 hours ago',
    lastActiveTimestamp: '2026-09-06T19:30:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Today, 6:15 PM', desc: 'Installed 8 LED fixtures on Morar Main Link' },
      { id: 'act-2', time: 'Sep 02, 2026', desc: 'Restored substation feeder breaker' }
    ]
  },
  {
    id: 'USR-1025',
    name: 'Gaurav Shrivastava',
    email: 'gaurav.shrivastava@example.com',
    phone: '+91 98261 99003',
    role: 'Citizen',
    department: null,
    area: 'Thatipur',
    status: 'Active',
    complaintCount: 7,
    resolvedComplaints: 5,
    registeredDate: '2026-09-05',
    lastActive: 'Today, 9 AM',
    lastActiveTimestamp: '2026-09-06T09:00:00Z',
    avatar: null,
    activity: [
      { id: 'act-1', time: 'Today, 9:00 AM', desc: 'Logged complaint regarding overflowing sewer' },
      { id: 'act-2', time: 'Sep 05, 2026', desc: 'New user registration completed' }
    ]
  }
];
