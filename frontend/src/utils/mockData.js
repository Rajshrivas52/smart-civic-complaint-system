// Mock Data for Smart Civic Complaint System

export const mockUsers = [
  { id: 'u1', name: 'Raj Kumar', email: 'raj@example.com', role: 'citizen', status: 'active', joinDate: '2023-10-15' },
  { id: 'u2', name: 'Priya Sharma', email: 'priya@example.com', role: 'citizen', status: 'active', joinDate: '2023-11-02' },
  { id: 'u3', name: 'Admin User', email: 'admin@civis.gov', role: 'admin', status: 'active', joinDate: '2023-01-01' },
  { id: 'u4', name: 'John Doe (Water)', email: 'john@water.civis.gov', role: 'department', status: 'active', joinDate: '2023-02-15', departmentId: 'd1' },
  { id: 'u5', name: 'Jane Smith (Roads)', email: 'jane@roads.civis.gov', role: 'department', status: 'active', joinDate: '2023-03-10', departmentId: 'd2' }
];

export const mockDepartments = [
  { id: 'd1', name: 'Water & Sanitation', categories: ['Water Leakage', 'Drainage', 'Garbage'], assignedCount: 45, resolutionRate: '88%' },
  { id: 'd2', name: 'Roads & Infrastructure', categories: ['Pothole', 'Streetlight', 'Road Damage'], assignedCount: 62, resolutionRate: '75%' },
  { id: 'd3', name: 'Public Health', categories: ['Pest Control', 'Public Toilets'], assignedCount: 28, resolutionRate: '92%' },
  { id: 'd4', name: 'Electricity', categories: ['Power Outage', 'Fallen Wires'], assignedCount: 15, resolutionRate: '95%' }
];

export const mockCategories = [
  'Water Leakage', 'Pothole', 'Streetlight', 'Garbage', 'Drainage', 'Power Outage', 'Public Nuisance', 'Other'
];

export const COMPLAINT_STATUSES = ['All', 'Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected'];
export const COMPLAINT_CATEGORIES = ['All', 'Road Damage', 'Garbage', 'Streetlight', 'Water', 'Drainage', 'Traffic', 'Environment', 'Other'];
export const COMPLAINT_PRIORITIES = ['All', 'Low', 'Medium', 'High'];
export const COMPLAINT_DEPARTMENTS = [
  'All',
  'Public Works',
  'Sanitation',
  'Water Supply',
  'Electricity',
  'Traffic Management',
  'Parks & Environment',
  'Unassigned'
];
export const COMPLAINT_AREAS = ['All', 'City Center', 'Main Market', 'Railway Road', 'College Area', 'Residential Area'];
export const COMPLAINT_DATE_FILTERS = ['All', 'Today', 'Last 7 Days', 'Last 30 Days', 'This Year'];

export const adminComplaintsStats = {
  total: '1,245',
  pending: '320',
  inProgress: '195',
  highPriority: '95'
};

export const mockComplaints = [
  {
    id: 'CMP1025',
    title: 'Large pothole near main gate',
    description: 'There is a very large pothole near the central junction that is causing traffic blocks and damaging vehicles.',
    citizenName: 'Rahul Sharma',
    citizenPhone: '+91 98765 43210',
    category: 'Road Damage',
    priority: 'High',
    location: { lat: 28.6139, lng: 77.2090 },
    area: 'College Area',
    address: 'Main Street, Central Junction near University Gate',
    submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    submittedText: '2 days ago',
    status: 'In Progress',
    department: 'Public Works',
    citizenId: 'u1',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400',
    timeline: [
      { status: 'Submitted', date: '2023-11-20T10:30:00Z' },
      { status: 'Assigned', date: '2023-11-21T09:00:00Z', note: 'Assigned to Public Works' },
      { status: 'In Progress', date: '2023-11-22T14:20:00Z', note: 'Crew dispatched to repair road surface' }
    ]
  },
  {
    id: 'CMP1024',
    title: 'Garbage accumulation near market',
    description: 'The community waste bins are overflowing and causing foul odor and health hazard across shops.',
    citizenName: 'Priya Singh',
    citizenPhone: '+91 98123 45678',
    category: 'Garbage',
    priority: 'Medium',
    location: { lat: 28.6180, lng: 77.2050 },
    area: 'Main Market',
    address: 'Sector 4 Central Market, Shop Row 3',
    submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    submittedText: '3 days ago',
    status: 'Pending',
    department: 'Sanitation',
    citizenId: 'u2',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400',
    timeline: [
      { status: 'Submitted', date: '2023-11-24T09:00:00Z' }
    ]
  },
  {
    id: 'CMP1021',
    title: 'Streetlight not working',
    description: 'The entire block has been in darkness for the last 5 days. Unsafe for pedestrians and vehicles at night.',
    citizenName: 'Amit Verma',
    citizenPhone: '+91 97234 56789',
    category: 'Streetlight',
    priority: 'Low',
    location: { lat: 28.6200, lng: 77.2100 },
    area: 'Residential Area',
    address: 'Sector 4, Block B, Avenue 2',
    submittedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    submittedText: '5 days ago',
    status: 'Resolved',
    department: 'Electricity',
    citizenId: 'u1',
    image: null,
    timeline: [
      { status: 'Submitted', date: '2023-11-23T18:45:00Z' },
      { status: 'Resolved', date: '2023-11-26T18:45:00Z', note: 'Replaced ballast and LED bulb' }
    ]
  },
  {
    id: 'CMP1032',
    title: 'Major water pipeline rupture',
    description: 'Main potable water supply pipe broke open creating high pressure geyser and street flooding.',
    citizenName: 'Sunita Rao',
    citizenPhone: '+91 98456 12345',
    category: 'Water',
    priority: 'High',
    location: { lat: 28.6250, lng: 77.2150 },
    area: 'Railway Road',
    address: 'Near Old Junction Crossing, Railway Road',
    submittedDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    submittedText: 'Today',
    status: 'Pending',
    department: 'Water Supply',
    citizenId: 'u3',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&q=80&w=400',
    timeline: [
      { status: 'Submitted', date: new Date().toISOString() }
    ]
  },
  {
    id: 'CMP1041',
    title: 'Traffic signal failure at city center',
    description: 'All 4 traffic lights are blinking yellow simultaneously leading to severe gridlock during rush hour.',
    citizenName: 'Vikram Patel',
    citizenPhone: '+91 99100 22334',
    category: 'Traffic',
    priority: 'High',
    location: { lat: 28.6110, lng: 77.2010 },
    area: 'City Center',
    address: 'Plaza Roundabout, City Center Hub',
    submittedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    submittedText: 'Today',
    status: 'Assigned',
    department: 'Traffic Management',
    citizenId: 'u4',
    image: null,
    timeline: [
      { status: 'Submitted', date: new Date().toISOString() },
      { status: 'Assigned', date: new Date().toISOString(), note: 'Technician dispatched' }
    ]
  },
  {
    id: 'CMP1044',
    title: 'Open drainage hazard near school',
    description: 'Concrete slab over deep sewer line collapsed. Severe risk to elementary schoolchildren.',
    citizenName: 'Sneha Kulkarni',
    citizenPhone: '+91 98333 44556',
    category: 'Drainage',
    priority: 'High',
    location: { lat: 28.6175, lng: 77.2085 },
    area: 'College Area',
    address: 'Opposite Model Secondary School Gate',
    submittedDate: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    submittedText: 'Yesterday',
    status: 'In Progress',
    department: 'Public Works',
    citizenId: 'u2',
    image: null,
    timeline: [
      { status: 'Submitted', date: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString() },
      { status: 'Assigned', date: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() },
      { status: 'In Progress', date: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), note: 'Barricades placed' }
    ]
  },
  {
    id: 'CMP1049',
    title: 'High tension wire hanging low',
    description: 'Electrical wire sagged to head height after overnight storm winds, sparking near tree branch.',
    citizenName: 'Rajesh Nair',
    citizenPhone: '+91 97455 66778',
    category: 'Electricity',
    priority: 'High',
    location: { lat: 28.6220, lng: 77.2140 },
    area: 'Residential Area',
    address: 'Lane 7, Krishna Enclave',
    submittedDate: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    submittedText: 'Yesterday',
    status: 'Assigned',
    department: 'Electricity',
    citizenId: 'u1',
    image: null,
    timeline: [
      { status: 'Submitted', date: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString() },
      { status: 'Assigned', date: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 'CMP1052',
    title: 'Illegal waste dumping in green belt',
    description: 'Commercial debris and plastic sacks dumped inside the botanical park boundary.',
    citizenName: 'Ananya Sen',
    citizenPhone: '+91 96544 33221',
    category: 'Environment',
    priority: 'Medium',
    location: { lat: 28.6080, lng: 77.2030 },
    area: 'City Center',
    address: 'East Gate Perimeter, Central Botanical Garden',
    submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    submittedText: '3 days ago',
    status: 'Pending',
    department: 'Parks & Environment',
    citizenId: 'u3',
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400',
    timeline: [
      { status: 'Submitted', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 'CMP1055',
    title: 'Contaminated tap water in block C',
    description: 'Brown murky water emitting chemical smell from household taps across 40 apartments.',
    citizenName: 'Karan Mehra',
    citizenPhone: '+91 99887 76655',
    category: 'Water',
    priority: 'High',
    location: { lat: 28.6190, lng: 77.2180 },
    area: 'Residential Area',
    address: 'Block C Apartments, Sector 12',
    submittedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    submittedText: '4 days ago',
    status: 'In Progress',
    department: 'Water Supply',
    citizenId: 'u4',
    image: null,
    timeline: [
      { status: 'Submitted', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { status: 'In Progress', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), note: 'Filter line flushed' }
    ]
  },
  {
    id: 'CMP1058',
    title: 'Fallen tree blocking lane 4',
    description: 'Old neem tree uprooted during storm, completely blocking vehicle movement and pedestrian sidewalk.',
    citizenName: 'Manoj Tiwari',
    citizenPhone: '+91 98112 23344',
    category: 'Environment',
    priority: 'Medium',
    location: { lat: 28.6270, lng: 77.2110 },
    area: 'Railway Road',
    address: 'Civil Lines Lane 4, Near Station Compound',
    submittedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    submittedText: '6 days ago',
    status: 'Resolved',
    department: 'Parks & Environment',
    citizenId: 'u1',
    image: null,
    timeline: [
      { status: 'Submitted', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
      { status: 'Resolved', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), note: 'Tree removed and road cleared' }
    ]
  },
  {
    id: 'CMP1062',
    title: 'Sewage overflow near market entrance',
    description: 'Manhole backed up resulting in sewage water pooling in front of food stalls.',
    citizenName: 'Deepak Gupta',
    citizenPhone: '+91 97123 99887',
    category: 'Drainage',
    priority: 'High',
    location: { lat: 28.6170, lng: 77.2060 },
    area: 'Main Market',
    address: 'Subzi Mandi Gate 2, Main Market',
    submittedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    submittedText: '7 days ago',
    status: 'In Progress',
    department: 'Sanitation',
    citizenId: 'u2',
    image: null,
    timeline: [
      { status: 'Submitted', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      { status: 'In Progress', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), note: 'Suction tanker deployed' }
    ]
  },
  {
    id: 'CMP1065',
    title: 'Repeated power surge damaging appliances',
    description: 'Frequent spikes in supply line caused refrigerator compressor failure inside private home.',
    citizenName: 'Kavita Das',
    citizenPhone: '+91 99345 67890',
    category: 'Electricity',
    priority: 'Low',
    location: { lat: 28.6150, lng: 77.2070 },
    area: 'College Area',
    address: 'Faculty Quarters B-12, University Campus',
    submittedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    submittedText: '10 days ago',
    status: 'Rejected',
    department: 'Electricity',
    citizenId: 'u3',
    image: null,
    timeline: [
      { status: 'Submitted', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
      { status: 'Rejected', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), note: 'Internal building wiring issue outside municipal jurisdiction' }
    ]
  },
  {
    id: 'CMP1070',
    title: 'Missing manhole cover near bus stop',
    description: 'Deep unshielded open manhole on active pedestrian path. Immediate hazard at night.',
    citizenName: 'Arjan Singh',
    citizenPhone: '+91 98777 88990',
    category: 'Road Damage',
    priority: 'High',
    location: { lat: 28.6160, lng: 77.2045 },
    area: 'Main Market',
    address: 'City Bus Stop 14, Main Market Terminal',
    submittedDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    submittedText: 'Today',
    status: 'Pending',
    department: 'Unassigned',
    citizenId: 'u4',
    image: null,
    timeline: [
      { status: 'Submitted', date: new Date().toISOString() }
    ]
  },
  {
    id: 'CMP1075',
    title: 'Stray dog menace near school ground',
    description: 'Pack of aggressive stray dogs chasing children and cyclists during morning school hours.',
    citizenName: 'Meera Joshi',
    citizenPhone: '+91 97665 43210',
    category: 'Other',
    priority: 'Medium',
    location: { lat: 28.6210, lng: 77.2120 },
    area: 'Residential Area',
    address: 'Greenwood Primary Playground, Sector 7',
    submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    submittedText: '2 days ago',
    status: 'Pending',
    department: 'Unassigned',
    citizenId: 'u1',
    image: null,
    timeline: [
      { status: 'Submitted', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  }
];

export const mockNotifications = [
  {
    id: 'n1',
    userId: 'u1',
    message: 'Your complaint CMP1025 has been assigned.',
    type: 'assignment',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false
  },
  {
    id: 'n2',
    userId: 'u1',
    message: 'Complaint CMP1021 has been resolved.',
    type: 'resolution',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    read: true
  },
  {
    id: 'n3',
    userId: 'u1',
    message: 'Your complaint CMP1024 is under review.',
    type: 'update',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    read: false
  }
];

export const mockActivities = [
  {
    id: 'a1',
    userId: 'u1',
    complaintId: 'CMP1021',
    action: 'CMP1021 was resolved',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    type: 'success'
  },
  {
    id: 'a2',
    userId: 'u1',
    complaintId: 'CMP1025',
    action: 'CMP1025 was assigned to Public Works',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // yesterday
    type: 'info'
  },
  {
    id: 'a3',
    userId: 'u1',
    complaintId: 'CMP1025',
    action: 'CMP1025 status changed to In Progress',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // yesterday
    type: 'warning'
  },
  {
    id: 'a4',
    userId: 'u1',
    complaintId: 'CMP1024',
    action: 'Complaint CMP1024 submitted successfully',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    type: 'success'
  }
];

export const mockAnalytics = {
  complaintsByStatus: [
    { name: 'Pending', value: 4 },
    { name: 'In Progress', value: 2 },
    { name: 'Resolved', value: 6 }
  ],
  kpis: {
    total: 12,
    resolved: 6,
    pending: 4,
    inProgress: 2
  }
};

// Admin Dashboard Specific Mock Data
export const adminKpis = [
  { id: 'kpi-1', title: 'Total Complaints', value: '1,245', change: '+12% this month', iconName: 'ClipboardList', color: 'primary' },
  { id: 'kpi-2', title: 'Pending', value: '320', change: 'Requires attention', iconName: 'Clock', color: 'warning' },
  { id: 'kpi-3', title: 'Assigned', value: '210', change: 'Awaiting department action', iconName: 'UserCheck', color: 'info' },
  { id: 'kpi-4', title: 'In Progress', value: '195', change: 'Currently being resolved', iconName: 'Activity', color: 'primary' },
  { id: 'kpi-5', title: 'Resolved', value: '520', change: '42% of total complaints', iconName: 'CheckCircle', color: 'success' },
  { id: 'kpi-6', title: 'High Priority', value: '95', change: 'Requires urgent attention', iconName: 'AlertTriangle', color: 'danger' }
];

export const complaintTrendsMonthly = [
  { month: 'Jan', total: 75, resolved: 62, pending: 13 },
  { month: 'Feb', total: 88, resolved: 74, pending: 14 },
  { month: 'Mar', total: 104, resolved: 88, pending: 16 },
  { month: 'Apr', total: 96, resolved: 82, pending: 14 },
  { month: 'May', total: 118, resolved: 98, pending: 20 },
  { month: 'Jun', total: 132, resolved: 112, pending: 20 },
  { month: 'Jul', total: 140, resolved: 119, pending: 21 },
  { month: 'Aug', total: 125, resolved: 106, pending: 19 },
  { month: 'Sep', total: 110, resolved: 94, pending: 16 },
  { month: 'Oct', total: 105, resolved: 90, pending: 15 },
  { month: 'Nov', total: 92, resolved: 78, pending: 14 },
  { month: 'Dec', total: 60, resolved: 52, pending: 8 }
];

export const complaintTrendsWeekly = [
  { week: 'Week 1', total: 32, resolved: 28, pending: 4 },
  { week: 'Week 2', total: 38, resolved: 33, pending: 5 },
  { week: 'Week 3', total: 45, resolved: 39, pending: 6 },
  { week: 'Week 4', total: 41, resolved: 36, pending: 5 }
];

export const complaintTrendsData = complaintTrendsMonthly;

export const categoryDistributionData = [
  { name: 'Road Damage', value: 310, percentage: '24.9%', color: '#4f46e5' },
  { name: 'Garbage', value: 280, percentage: '22.5%', color: '#10b981' },
  { name: 'Streetlight', value: 210, percentage: '16.9%', color: '#f59e0b' },
  { name: 'Water', value: 160, percentage: '12.8%', color: '#3b82f6' },
  { name: 'Drainage', value: 125, percentage: '10.0%', color: '#06b6d4' },
  { name: 'Traffic', value: 95, percentage: '7.6%', color: '#8b5cf6' },
  { name: 'Environment', value: 45, percentage: '3.6%', color: '#ec4899' },
  { name: 'Other', value: 20, percentage: '1.6%', color: '#64748b' }
];

export const statusDistributionData = [
  { name: 'Pending', count: 320, percentage: '25.7%', color: '#f59e0b' },
  { name: 'Assigned', count: 210, percentage: '16.9%', color: '#3b82f6' },
  { name: 'In Progress', count: 195, percentage: '15.7%', color: '#6366f1' },
  { name: 'Resolved', count: 480, percentage: '38.5%', color: '#10b981' },
  { name: 'Rejected', count: 40, percentage: '3.2%', color: '#ef4444' }
];

export const departmentPerformanceData = [
  { department: 'Public Works', total: 250, resolved: 190, pending: 60, rate: 76, avgTime: '3.2 days', rating: 'Good' },
  { department: 'Sanitation', total: 310, resolved: 285, pending: 25, rate: 92, avgTime: '1.8 days', rating: 'Excellent' },
  { department: 'Water Supply', total: 180, resolved: 145, pending: 35, rate: 81, avgTime: '2.5 days', rating: 'Good' },
  { department: 'Electricity', total: 150, resolved: 115, pending: 35, rate: 77, avgTime: '3.1 days', rating: 'Good' },
  { department: 'Traffic Management', total: 120, resolved: 95, pending: 25, rate: 79, avgTime: '2.8 days', rating: 'Good' },
  { department: 'Parks & Environment', total: 100, resolved: 88, pending: 12, rate: 88, avgTime: '2.1 days', rating: 'Excellent' }
];

export const areaAnalyticsData = [
  { area: 'City Center', count: 320, percentage: '25.7%', color: '#4f46e5' },
  { area: 'Main Market', count: 280, percentage: '22.5%', color: '#3b82f6' },
  { area: 'Railway Road', count: 245, percentage: '19.7%', color: '#06b6d4' },
  { area: 'College Area', count: 210, percentage: '16.9%', color: '#10b981' },
  { area: 'Residential Area', count: 190, percentage: '15.3%', color: '#f59e0b' }
];

export const priorityAnalyticsData = [
  { priority: 'High', count: 95, percentage: '7.6%', color: '#ef4444', desc: 'Urgent municipal attention required' },
  { priority: 'Medium', count: 530, percentage: '42.6%', color: '#f59e0b', desc: 'Standard turnaround workflow' },
  { priority: 'Low', count: 620, percentage: '49.8%', color: '#64748b', desc: 'Scheduled non-critical maintenance' }
];

export const analyticsKpisData = {
  totalComplaints: { value: '1,245', change: '+12% compared with previous period', isPositive: true },
  resolutionRate: { value: '84.6%', change: '+4.2% improvement', isPositive: true },
  avgResolutionTime: { value: '2.8 days', change: '-0.4 days improvement', isPositive: true },
  highPriorityIssues: { value: '95', change: '7.6% of total complaints', isNeutral: true },
  citizenSatisfaction: { value: '4.3 / 5', change: 'Based on demo feedback', isPositive: true }
};

export const highPriorityComplaints = [
  {
    id: 'CMP1025',
    title: 'Large pothole near main gate',
    category: 'Road Damage',
    priority: 'HIGH',
    status: 'In Progress',
    time: '2 hours ago',
    department: 'Public Works'
  },
  {
    id: 'CMP1032',
    title: 'Major water leakage at pipeline B',
    category: 'Water',
    priority: 'HIGH',
    status: 'Pending',
    time: '4 hours ago',
    department: 'Water Supply'
  },
  {
    id: 'CMP1041',
    title: 'Traffic signal failure at city center',
    category: 'Traffic',
    priority: 'HIGH',
    status: 'Assigned',
    time: 'Today',
    department: 'Traffic Management'
  },
  {
    id: 'CMP1044',
    title: 'Open drainage hazard near school',
    category: 'Drainage',
    priority: 'HIGH',
    status: 'Pending',
    time: 'Yesterday',
    department: 'Water Supply'
  },
  {
    id: 'CMP1049',
    title: 'High tension wire hanging low',
    category: 'Electricity',
    priority: 'HIGH',
    status: 'Assigned',
    time: 'Yesterday',
    department: 'Electricity'
  }
];

export const recentComplaintsAdmin = [
  {
    id: 'CMP1048',
    title: 'Garbage accumulation near market',
    category: 'Garbage',
    citizen: 'Rahul Sharma',
    priority: 'Medium',
    department: 'Sanitation',
    status: 'Pending',
    date: 'Today'
  },
  {
    id: 'CMP1047',
    title: 'Broken streetlight on MG Road',
    category: 'Streetlight',
    citizen: 'Amit Verma',
    priority: 'Low',
    department: 'Electricity',
    status: 'Resolved',
    date: 'Today'
  },
  {
    id: 'CMP1046',
    title: 'Sewage overflow in Sector 9',
    category: 'Drainage',
    citizen: 'Sonia Patel',
    priority: 'High',
    department: 'Sanitation',
    status: 'In Progress',
    date: 'Yesterday'
  },
  {
    id: 'CMP1045',
    title: 'Contaminated water supply block C',
    category: 'Water',
    citizen: 'Karan Mehra',
    priority: 'High',
    department: 'Water Supply',
    status: 'Assigned',
    date: 'Yesterday'
  },
  {
    id: 'CMP1043',
    title: 'Uncollected plastic waste in park',
    category: 'Garbage',
    citizen: 'Deepak Gupta',
    priority: 'Low',
    department: 'Sanitation',
    status: 'Resolved',
    date: '3 days ago'
  }
];

export const adminActivities = [
  {
    id: 'act-1',
    text: 'Admin assigned CMP1025 to Public Works',
    time: '5 minutes ago',
    type: 'assignment'
  },
  {
    id: 'act-2',
    text: 'Complaint CMP1031 marked as resolved',
    time: '25 minutes ago',
    type: 'resolution'
  },
  {
    id: 'act-3',
    text: 'New high-priority complaint CMP1041 received',
    time: '1 hour ago',
    type: 'urgent'
  },
  {
    id: 'act-4',
    text: 'Department Sanitation updated CMP1022',
    time: '2 hours ago',
    type: 'update'
  }
];

export const adminAttentionAlerts = [
  {
    id: 'alert-1',
    title: 'Pending Assignments',
    message: '12 complaints are waiting for department assignment.',
    severity: 'warning'
  },
  {
    id: 'alert-2',
    title: 'Unassigned High Priority',
    message: '5 high-priority complaints have not been assigned.',
    severity: 'danger'
  },
  {
    id: 'alert-3',
    title: 'SLA Exceeded',
    message: '3 complaints have exceeded their expected resolution time.',
    severity: 'info'
  }
];

export const civicHotspots = [
  { name: 'Central Market', count: 48, intensity: 'High', statusColor: '#ef4444' },
  { name: 'Main Gate', count: 36, intensity: 'High', statusColor: '#ef4444' },
  { name: 'Railway Road', count: 24, intensity: 'Medium', statusColor: '#f59e0b' },
  { name: 'City Center', count: 12, intensity: 'Low', statusColor: '#10b981' }
];

// Mock Complaints for Gwalior Complaint Map
export const GWALIOR_CENTER = {
  lat: 26.2183,
  lng: 78.1828
};

export const MAP_CATEGORIES = [
  'All',
  'Pothole',
  'Garbage',
  'Streetlight',
  'Water Leakage',
  'Drainage',
  'Road Damage',
  'Traffic',
  'Other'
];

export const MAP_PRIORITIES = ['All', 'High', 'Medium', 'Low'];

export const MAP_STATUSES = ['All', 'Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected'];

export const MAP_DEPARTMENTS = [
  'All',
  'Road Maintenance',
  'Sanitation',
  'Electrical',
  'Water Supply',
  'Drainage',
  'Traffic'
];

export const MAP_AREAS = [
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

export const mockMapComplaints = [
  {
    id: 'CMP-1024',
    title: 'Large pothole on main road',
    category: 'Pothole',
    description: 'Deep pothole causing severe traffic slowdown and two-wheeler hazard near Thatipur crossing.',
    latitude: 26.2124,
    longitude: 78.2045,
    area: 'Thatipur',
    priority: 'High',
    status: 'Assigned',
    department: 'Road Maintenance',
    reportedDate: '2026-09-02',
    citizenName: 'Rahul Sharma'
  },
  {
    id: 'CMP-1025',
    title: 'Overflowing community dumpster',
    category: 'Garbage',
    description: 'Municipal waste bin overflowing onto pavement with street animals scattering refuse.',
    latitude: 26.2052,
    longitude: 78.1925,
    area: 'City Centre',
    priority: 'Medium',
    status: 'In Progress',
    department: 'Sanitation',
    reportedDate: '2026-09-03',
    citizenName: 'Priya Singh'
  },
  {
    id: 'CMP-1026',
    title: 'High-voltage cable sparking in rain',
    category: 'Streetlight',
    description: 'Electrical pole wire touching tree branch and producing continuous spark noise.',
    latitude: 26.2025,
    longitude: 78.1585,
    area: 'Lashkar',
    priority: 'High',
    status: 'Pending',
    department: 'Electrical',
    reportedDate: '2026-09-04',
    citizenName: 'Amit Verma'
  },
  {
    id: 'CMP-1027',
    title: 'Drinking water pipeline fracture',
    category: 'Water Leakage',
    description: 'Subterranean supply pipe burst spraying clean water across the market entrance.',
    latitude: 26.2285,
    longitude: 78.2274,
    area: 'Morar',
    priority: 'High',
    status: 'Assigned',
    department: 'Water Supply',
    reportedDate: '2026-09-01',
    citizenName: 'Sunita Rao'
  },
  {
    id: 'CMP-1028',
    title: 'Open manhole cover on footpath',
    category: 'Drainage',
    description: 'Concrete cover collapsed into sewer chamber. Extreme risk for night pedestrians.',
    latitude: 26.2485,
    longitude: 78.2095,
    area: 'Gola Ka Mandir',
    priority: 'High',
    status: 'In Progress',
    department: 'Drainage',
    reportedDate: '2026-09-03',
    citizenName: 'Vikram Patel'
  },
  {
    id: 'CMP-1029',
    title: 'Broken traffic signal at junction',
    category: 'Traffic',
    description: 'Both red and green signals glowing simultaneously creating chaotic vehicle gridlock.',
    latitude: 26.2140,
    longitude: 78.1690,
    area: 'Phool Bagh',
    priority: 'High',
    status: 'Pending',
    department: 'Traffic',
    reportedDate: '2026-09-05',
    citizenName: 'Sneha Kulkarni'
  },
  {
    id: 'CMP-1030',
    title: 'Broken divider curbing on avenue',
    category: 'Road Damage',
    description: 'Cement road divider broken with concrete blocks scattered across driving lane.',
    latitude: 26.1950,
    longitude: 78.1850,
    area: 'University Road',
    priority: 'Medium',
    status: 'Assigned',
    department: 'Road Maintenance',
    reportedDate: '2026-08-30',
    citizenName: 'Rajesh Nair'
  },
  {
    id: 'CMP-1031',
    title: 'Streetlights remaining off at night',
    category: 'Streetlight',
    description: 'Series of 6 sodium lamps not turning on since last Tuesday in residential colony.',
    latitude: 26.2060,
    longitude: 78.1720,
    area: 'Madhav Nagar',
    priority: 'Low',
    status: 'Resolved',
    department: 'Electrical',
    reportedDate: '2026-08-28',
    citizenName: 'Ananya Sen'
  },
  {
    id: 'CMP-1032',
    title: 'Industrial waste dumped in canal',
    category: 'Garbage',
    description: 'Untreated plastic sacks and dye waste discarded near drainage bank.',
    latitude: 26.2340,
    longitude: 78.1780,
    area: 'Hazira',
    priority: 'Medium',
    status: 'Pending',
    department: 'Sanitation',
    reportedDate: '2026-09-02',
    citizenName: 'Deepak Gupta'
  },
  {
    id: 'CMP-1033',
    title: 'Low water pressure in residential block',
    category: 'Water Leakage',
    description: 'Inadequate pipeline pressure unable to reach first-floor municipal storage tanks.',
    latitude: 26.2520,
    longitude: 78.2150,
    area: 'DD Nagar',
    priority: 'Low',
    status: 'In Progress',
    department: 'Water Supply',
    reportedDate: '2026-09-01',
    citizenName: 'Manoj Tiwari'
  },
  {
    id: 'CMP-1034',
    title: 'Pothole series near school gate',
    category: 'Pothole',
    description: 'Three consecutive craters filled with muddy water causing bicycle slips.',
    latitude: 26.2160,
    longitude: 78.2010,
    area: 'Thatipur',
    priority: 'High',
    status: 'Assigned',
    department: 'Road Maintenance',
    reportedDate: '2026-09-04',
    citizenName: 'Kavita Das'
  },
  {
    id: 'CMP-1035',
    title: 'Clogged storm drain backing up',
    category: 'Drainage',
    description: 'Plastics and silt choking drain outlet resulting in dirty water pooling on street.',
    latitude: 26.2085,
    longitude: 78.1905,
    area: 'City Centre',
    priority: 'Medium',
    status: 'Pending',
    department: 'Drainage',
    reportedDate: '2026-09-03',
    citizenName: 'Arjan Singh'
  },
  {
    id: 'CMP-1036',
    title: 'Commercial hoardings blocking view',
    category: 'Other',
    description: 'Unauthorized advertising flex billboard obstructing intersection sightline.',
    latitude: 26.2005,
    longitude: 78.1550,
    area: 'Lashkar',
    priority: 'Low',
    status: 'Resolved',
    department: 'Road Maintenance',
    reportedDate: '2026-08-25',
    citizenName: 'Meera Joshi'
  },
  {
    id: 'CMP-1037',
    title: 'Illegal parking clogging arterial lane',
    category: 'Traffic',
    description: 'Delivery trucks parked on both sides leaving single lane for bidirectional traffic.',
    latitude: 26.2250,
    longitude: 78.2210,
    area: 'Morar',
    priority: 'Medium',
    status: 'In Progress',
    department: 'Traffic',
    reportedDate: '2026-09-02',
    citizenName: 'Karan Mehra'
  },
  {
    id: 'CMP-1038',
    title: 'Fallen electric post after squall',
    category: 'Streetlight',
    description: 'Old concrete utility post leaning at 45-degree angle threatening boundary wall.',
    latitude: 26.2440,
    longitude: 78.2060,
    area: 'Gola Ka Mandir',
    priority: 'High',
    status: 'Assigned',
    department: 'Electrical',
    reportedDate: '2026-09-05',
    citizenName: 'Sonia Patel'
  },
  {
    id: 'CMP-1039',
    title: 'Stray cattle causing traffic hazard',
    category: 'Other',
    description: 'Group of stray cows resting in the middle of active bypass roundabout.',
    latitude: 26.2110,
    longitude: 78.1660,
    area: 'Phool Bagh',
    priority: 'Low',
    status: 'Rejected',
    department: 'Sanitation',
    reportedDate: '2026-08-29',
    citizenName: 'Ramesh Chawla'
  },
  {
    id: 'CMP-1040',
    title: 'Road asphalt peeling after rain',
    category: 'Road Damage',
    description: 'Top tar layer peeled away leaving gravel and sharp stones hazardous for tires.',
    latitude: 26.1920,
    longitude: 78.1880,
    area: 'University Road',
    priority: 'Medium',
    status: 'Pending',
    department: 'Road Maintenance',
    reportedDate: '2026-09-04',
    citizenName: 'Pooja Bhatia'
  },
  {
    id: 'CMP-1042',
    title: 'Sewage leakage into open ground',
    category: 'Drainage',
    description: 'Underground chamber leaking untreated blackwater into municipal park walkway.',
    latitude: 26.2370,
    longitude: 78.1750,
    area: 'Hazira',
    priority: 'High',
    status: 'In Progress',
    department: 'Drainage',
    reportedDate: '2026-09-01',
    citizenName: 'Naveen Goyal'
  }
];


