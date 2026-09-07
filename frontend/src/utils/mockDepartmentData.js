// Mock Departments Data for Smart Civic Issue & Complaint Management System
// Admin Department Management Module

export const initialDepartments = [
  {
    id: "DEPT-001",
    name: "Road Maintenance",
    code: "ROAD",
    description: "Handles potholes, damaged roads, asphalt resurfacing, curb repairs, and road infrastructure.",
    head: "Rajesh Verma",
    phone: "+91 98765 43210",
    email: "road@smartcivic.gov.in",
    officeLocation: "Zone 1 Municipal Workshop, Thatipur, Gwalior",
    status: "Active",
    staffCount: 14,
    totalComplaints: 42,
    pendingComplaints: 10,
    inProgressComplaints: 12,
    resolvedComplaints: 20,
    resolutionRate: 82,
    averageResolutionTime: "3.2 days",
    createdDate: "2025-01-10",
    iconName: "Construction",
    recentComplaints: [
      { id: "CMP-1024", title: "Large pothole on main road", priority: "High", status: "Assigned", area: "Thatipur", date: "Sep 02, 2026" },
      { id: "CMP-1030", title: "Broken divider curbing on avenue", priority: "Medium", status: "Assigned", area: "University Road", date: "Aug 30, 2026" },
      { id: "CMP-1040", title: "Road asphalt peeling after rain", priority: "Medium", status: "Pending", area: "University Road", date: "Sep 04, 2026" },
      { id: "CMP-1011", title: "Cave-in crater near junction", priority: "High", status: "Resolved", area: "Lashkar", date: "Aug 26, 2026" }
    ],
    staff: [
      { id: "STF-101", name: "Rajesh Verma", designation: "Department Head", phone: "+91 98765 43210" },
      { id: "STF-102", name: "Amit Sharma", designation: "Senior Field Officer", phone: "+91 98234 11223" },
      { id: "STF-103", name: "Vikas Singh", designation: "Field Supervisor", phone: "+91 97455 33445" },
      { id: "STF-104", name: "Neeraj Patel", designation: "Heavy Machine Operator", phone: "+91 94250 55667" }
    ]
  },
  {
    id: "DEPT-002",
    name: "Sanitation",
    code: "SANI",
    description: "Responsible for municipal waste management, daily garbage collection, street sweeping, and dumpsters.",
    head: "Pooja Deshmukh",
    phone: "+91 98221 54321",
    email: "sanitation@smartcivic.gov.in",
    officeLocation: "Solid Waste Management Center, City Centre, Gwalior",
    status: "Active",
    staffCount: 16,
    totalComplaints: 35,
    pendingComplaints: 5,
    inProgressComplaints: 8,
    resolvedComplaints: 22,
    resolutionRate: 91,
    averageResolutionTime: "2.1 days",
    createdDate: "2025-01-12",
    iconName: "Trash2",
    recentComplaints: [
      { id: "CMP-1025", title: "Overflowing community dumpster", priority: "Medium", status: "In Progress", area: "City Centre", date: "Sep 03, 2026" },
      { id: "CMP-1032", title: "Industrial waste dumped in canal", priority: "High", status: "Pending", area: "Hazira", date: "Sep 01, 2026" },
      { id: "CMP-1039", title: "Stray cattle litter and garbage block", priority: "Low", status: "Resolved", area: "Phool Bagh", date: "Aug 29, 2026" }
    ],
    staff: [
      { id: "STF-201", name: "Pooja Deshmukh", designation: "Department Head", phone: "+91 98221 54321" },
      { id: "STF-202", name: "Sunil Jatav", designation: "Sanitation Inspector", phone: "+91 98930 22114" },
      { id: "STF-203", name: "Gopal Kushwah", designation: "Route Coordinator", phone: "+91 94257 66778" },
      { id: "STF-204", name: "Harish Ahirwar", designation: "Fleet Driver", phone: "+91 98263 99001" }
    ]
  },
  {
    id: "DEPT-003",
    name: "Electrical",
    code: "ELEC",
    description: "Oversees streetlights, municipal transformers, public utility cables, and nocturnal illumination.",
    head: "Vikram Malhotra",
    phone: "+91 94250 88991",
    email: "electrical@smartcivic.gov.in",
    officeLocation: "Power Distribution Office, Lashkar, Gwalior",
    status: "Active",
    staffCount: 11,
    totalComplaints: 28,
    pendingComplaints: 6,
    inProgressComplaints: 6,
    resolvedComplaints: 16,
    resolutionRate: 78,
    averageResolutionTime: "3.5 days",
    createdDate: "2025-01-15",
    iconName: "Lightbulb",
    recentComplaints: [
      { id: "CMP-1026", title: "High-voltage cable sparking in rain", priority: "High", status: "Pending", area: "Lashkar", date: "Sep 04, 2026" },
      { id: "CMP-1031", title: "Streetlights remaining off at night", priority: "Low", status: "Resolved", area: "Madhav Nagar", date: "Aug 28, 2026" },
      { id: "CMP-1038", title: "Fallen electric post after squall", priority: "High", status: "Assigned", area: "Gola Ka Mandir", date: "Sep 05, 2026" }
    ],
    staff: [
      { id: "STF-301", name: "Vikram Malhotra", designation: "Department Head", phone: "+91 94250 88991" },
      { id: "STF-302", name: "Suresh Bhargava", designation: "Assistant Engineer", phone: "+91 94254 33221" },
      { id: "STF-303", name: "Dinesh Rathore", designation: "Lineman Specialist", phone: "+91 97551 44332" }
    ]
  },
  {
    id: "DEPT-004",
    name: "Water Supply",
    code: "WATR",
    description: "Manages drinking water distribution pipelines, reservoir pressure, water tanks, and quality monitoring.",
    head: "Dr. Aniruddh Sen",
    phone: "+91 98110 99887",
    email: "water@smartcivic.gov.in",
    officeLocation: "Jal Bhawan, Morar, Gwalior",
    status: "Active",
    staffCount: 12,
    totalComplaints: 38,
    pendingComplaints: 8,
    inProgressComplaints: 11,
    resolvedComplaints: 19,
    resolutionRate: 76,
    averageResolutionTime: "2.9 days",
    createdDate: "2025-01-18",
    iconName: "Droplets",
    recentComplaints: [
      { id: "CMP-1027", title: "Drinking water pipeline fracture", priority: "High", status: "Assigned", area: "Morar", date: "Sep 01, 2026" },
      { id: "CMP-1035", title: "Low water pressure in municipal line", priority: "Medium", status: "In Progress", area: "DD Nagar", date: "Aug 25, 2026" },
      { id: "CMP-1014", title: "Muddy tap water supplied in colony", priority: "High", status: "Resolved", area: "Thatipur", date: "Aug 20, 2026" }
    ],
    staff: [
      { id: "STF-401", name: "Dr. Aniruddh Sen", designation: "Department Head", phone: "+91 98110 99887" },
      { id: "STF-402", name: "Manoj Tiwari", designation: "Quality Analyst", phone: "+91 98112 88776" },
      { id: "STF-403", name: "Rameshwar Dayal", designation: "Pipeline Supervisor", phone: "+91 93011 77665" }
    ]
  },
  {
    id: "DEPT-005",
    name: "Drainage",
    code: "DRAN",
    description: "Manages storm-water drains, underground sewer networks, desilting operations, and chamber covers.",
    head: "Devendra Tomar",
    phone: "+91 94251 22334",
    email: "drainage@smartcivic.gov.in",
    officeLocation: "Sewerage Engineering Complex, Hazira, Gwalior",
    status: "Active",
    staffCount: 10,
    totalComplaints: 31,
    pendingComplaints: 9,
    inProgressComplaints: 7,
    resolvedComplaints: 15,
    resolutionRate: 71,
    averageResolutionTime: "4.1 days",
    createdDate: "2025-01-20",
    iconName: "Waves",
    recentComplaints: [
      { id: "CMP-1028", title: "Open manhole cover on footpath", priority: "High", status: "In Progress", area: "Gola Ka Mandir", date: "Sep 03, 2026" },
      { id: "CMP-1042", title: "Sewage leakage into open ground", priority: "High", status: "In Progress", area: "Hazira", date: "Sep 01, 2026" },
      { id: "CMP-1019", title: "Clogged stormwater runoff drain", priority: "Medium", status: "Resolved", area: "Phool Bagh", date: "Aug 22, 2026" }
    ],
    staff: [
      { id: "STF-501", name: "Devendra Tomar", designation: "Department Head", phone: "+91 94251 22334" },
      { id: "STF-502", name: "Sanjay Dixit", designation: "Drainage Engineer", phone: "+91 98260 33441" },
      { id: "STF-503", name: "Kamal Kishor", designation: "Desilting Crew Lead", phone: "+91 97550 88992" }
    ]
  },
  {
    id: "DEPT-006",
    name: "Traffic Management",
    code: "TRAF",
    description: "Maintains traffic signaling electronics, road safety signage, pedestrian zebra crossings, and junction flow.",
    head: "Karan Mehra",
    phone: "+91 99887 76655",
    email: "traffic@smartcivic.gov.in",
    officeLocation: "Traffic Command Center, Phool Bagh, Gwalior",
    status: "Active",
    staffCount: 9,
    totalComplaints: 18,
    pendingComplaints: 3,
    inProgressComplaints: 4,
    resolvedComplaints: 11,
    resolutionRate: 88,
    averageResolutionTime: "1.8 days",
    createdDate: "2025-01-25",
    iconName: "TrafficCone",
    recentComplaints: [
      { id: "CMP-1029", title: "Broken traffic signal at junction", priority: "High", status: "Pending", area: "Phool Bagh", date: "Sep 05, 2026" },
      { id: "CMP-1037", title: "Illegal parking clogging arterial lane", priority: "Medium", status: "In Progress", area: "Morar", date: "Sep 02, 2026" },
      { id: "CMP-1008", title: "Missing pedestrian crossing paint", priority: "Low", status: "Resolved", area: "City Centre", date: "Aug 18, 2026" }
    ],
    staff: [
      { id: "STF-601", name: "Karan Mehra", designation: "Department Head", phone: "+91 99887 76655" },
      { id: "STF-602", name: "Deepak Soni", designation: "Signaling Technician", phone: "+91 98261 77665" },
      { id: "STF-603", name: "Nitin Chouhan", designation: "Field Traffic Warden", phone: "+91 94065 11223" }
    ]
  }
];

// Workload Classifier
export const getWorkloadClass = (totalComplaints) => {
  if (totalComplaints <= 20) {
    return { label: "Low Workload", badgeClass: "workload-low", level: "Low" };
  }
  if (totalComplaints <= 40) {
    return { label: "Medium Workload", badgeClass: "workload-medium", level: "Medium" };
  }
  return { label: "High Workload", badgeClass: "workload-high", level: "High" };
};

// Performance Classifier (90%+ = Excellent, 75%-89% = Good, <75% = Needs Attention)
export const getPerformanceClass = (rate) => {
  if (rate >= 90) {
    return { label: "Excellent", badgeClass: "perf-excellent" };
  }
  if (rate >= 75) {
    return { label: "Good", badgeClass: "perf-good" };
  }
  return { label: "Needs Attention", badgeClass: "perf-attention" };
};
