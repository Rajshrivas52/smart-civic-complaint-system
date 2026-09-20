// Realistic Mock Data for Road Maintenance Department (Gwalior Region)

export const initialRoadComplaints = [
  {
    id: 'CIV-2026-00128',
    title: 'Large Pothole near Main Road Sector 14',
    category: 'Potholes',
    location: 'Main Road, Sector 14, Gwalior',
    coordinates: '26.2183° N, 78.1828° E',
    priority: 'High',
    submittedDate: '2026-09-16',
    status: 'Pending',
    assignedStaff: 'Rajesh Sharma',
    description: 'Deep pothole created after recent monsoon rains near Sector 14 bus stand. Poses severe traffic slowdown and vehicle wheel damage risks during peak hours.',
    citizenImage: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=60',
    timeline: [
      { step: 'Complaint Submitted', date: '2026-09-16 08:30 AM', by: 'Citizen (Raj Shrivas)' },
      { step: 'AI Severity Tagged: High', date: '2026-09-16 08:31 AM', by: 'CivicAI Engine' },
      { step: 'Assigned to Officer', date: '2026-09-16 09:15 AM', by: 'Eng. Suresh Sharma' }
    ]
  },
  {
    id: 'CIV-2026-00129',
    title: 'Caved-in Road Crust near Maharaj Bada',
    category: 'Damaged Roads',
    location: 'Maharaj Bada Market Circle, Gwalior',
    coordinates: '26.2125° N, 78.1772° E',
    priority: 'Critical',
    submittedDate: '2026-09-16',
    status: 'In Progress',
    assignedStaff: 'Virendra Singh',
    description: 'A 4-foot section of asphalt road crust has caved in near the central heritage market circle, posing immediate collision and tipping hazard for two-wheelers.',
    citizenImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=60',
    timeline: [
      { step: 'Complaint Submitted', date: '2026-09-16 07:10 AM', by: 'Citizen (Anita Sharma)' },
      { step: 'Prioritized as Critical', date: '2026-09-16 07:15 AM', by: 'Dispatch Desk' },
      { step: 'Field Inspection Started', date: '2026-09-16 09:00 AM', by: 'Virendra Singh' }
    ]
  },
  {
    id: 'CIV-2026-00130',
    title: 'Broken Footpath Slab near City Center Flyover',
    category: 'Broken Footpaths',
    location: 'City Center Main Junction, Gwalior',
    coordinates: '26.2230° N, 78.1950° E',
    priority: 'Medium',
    submittedDate: '2026-09-15',
    status: 'Pending',
    assignedStaff: 'Unassigned',
    description: 'Pedestrian walkway concrete slabs have broken open exposing an open drainage gap underneath near the primary pedestrian crossing.',
    citizenImage: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=600&auto=format&fit=crop&q=60',
    timeline: [
      { step: 'Complaint Submitted', date: '2026-09-15 02:45 PM', by: 'Citizen (Prakash Verma)' },
      { step: 'Queued for Assignment', date: '2026-09-15 03:00 PM', by: 'System' }
    ]
  },
  {
    id: 'CIV-2026-00131',
    title: 'Fallen Construction Debris Blocking Lane 4',
    category: 'Road Blockage',
    location: 'Morar Circle, Sub-Zone 2, Gwalior',
    coordinates: '26.2289° N, 78.2201° E',
    priority: 'Critical',
    submittedDate: '2026-09-15',
    status: 'In Progress',
    assignedStaff: 'Amit Verma',
    description: 'Heavy concrete construction debris dumped on public road blocking 2 lanes of vehicular traffic. JCB clearance equipment requested.',
    citizenImage: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=60',
    timeline: [
      { step: 'Complaint Submitted', date: '2026-09-15 11:20 AM', by: 'Citizen (Rohan Gupta)' },
      { step: 'Equipment Dispatched', date: '2026-09-15 01:00 PM', by: 'Amit Verma' }
    ]
  },
  {
    id: 'CIV-2026-00132',
    title: 'Damaged Speed Breaker near Scindia School',
    category: 'Damaged Speed Breakers',
    location: 'Lashkar Road, Ward 18, Gwalior',
    coordinates: '26.2088° N, 78.1650° E',
    priority: 'High',
    submittedDate: '2026-09-14',
    status: 'In Progress',
    assignedStaff: 'Rajesh Sharma',
    description: 'Rubberized modular speed hump torn apart with sharp protruding anchor bolts threatening school bus tires and bicycle safety.',
    citizenImage: 'https://images.unsplash.com/photo-1508873696983-2df515122519?w=600&auto=format&fit=crop&q=60',
    timeline: [
      { step: 'Complaint Submitted', date: '2026-09-14 04:15 PM', by: 'Citizen (Meena Das)' },
      { step: 'Work Order Issued', date: '2026-09-15 09:30 AM', by: 'Rajesh Sharma' }
    ]
  },
  {
    id: 'CIV-2026-00133',
    title: 'Missing Stop & Direction Signboard',
    category: 'Missing Road Signs',
    location: 'Pinto Park Intersection, Gwalior',
    coordinates: '26.2410° N, 78.2105° E',
    priority: 'Low',
    submittedDate: '2026-09-14',
    status: 'On Hold',
    assignedStaff: 'Manoj Kumar',
    description: 'Key junction direction sign post knocked down by an unknown commercial vehicle. Awaiting replacement aluminum signboard delivery.',
    citizenImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=60',
    workRemarks: 'Awaiting new retro-reflective sign supply from municipal store warehouse.',
    timeline: [
      { step: 'Complaint Submitted', date: '2026-09-14 10:00 AM', by: 'Citizen (Sunil Soni)' },
      { step: 'Placed On Hold (Supply Shortage)', date: '2026-09-14 02:30 PM', by: 'Manoj Kumar' }
    ]
  },
  {
    id: 'CIV-2026-00134',
    title: 'Severe Asphalt Erosion after Heavy Rain',
    category: 'Damaged Roads',
    location: 'Naya Bazar Main Cross, Gwalior',
    coordinates: '26.2160° N, 78.1720° E',
    priority: 'Medium',
    submittedDate: '2026-09-13',
    status: 'Resolved',
    assignedStaff: 'Virendra Singh',
    description: 'Top layer of asphalt washed away creating bumpy uneven surface across 50 meters of commercial street.',
    citizenImage: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=60',
    resolutionRemarks: 'Cold-mix asphalt patch applied and road roller compaction completed successfully.',
    resolutionDate: '2026-09-14',
    timeline: [
      { step: 'Complaint Submitted', date: '2026-09-13 09:00 AM', by: 'Citizen (Vijay Malhotra)' },
      { step: 'Field Crew Deployed', date: '2026-09-13 01:30 PM', by: 'Virendra Singh' },
      { step: 'Work Completed & Marked Resolved', date: '2026-09-14 05:00 PM', by: 'Virendra Singh' }
    ]
  },
  {
    id: 'CIV-2026-00135',
    title: 'Deep Trench left un-surfaced near Hazira',
    category: 'Other Road Issues',
    location: 'Hazira Chowk, Ward 12, Gwalior',
    coordinates: '26.2345° N, 78.1888° E',
    priority: 'High',
    submittedDate: '2026-09-12',
    status: 'Resolved',
    assignedStaff: 'Amit Verma',
    description: 'Utility cable trench left filled with loose soil without final asphalt capping, creating severe mud during rain.',
    citizenImage: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=60',
    resolutionRemarks: 'Concrete leveling base poured and bitumen macadam patch applied.',
    resolutionDate: '2026-09-13',
    timeline: [
      { step: 'Complaint Submitted', date: '2026-09-12 11:45 AM', by: 'Citizen (Deepak Tomar)' },
      { step: 'Resolved & Closed', date: '2026-09-13 04:00 PM', by: 'Amit Verma' }
    ]
  },
  {
    id: 'CIV-2026-00136',
    title: 'Clusters of Deep Potholes on Fort Slope',
    category: 'Potholes',
    location: 'Gwalior Fort Access Road, Gwalior',
    coordinates: '26.2301° N, 78.1690° E',
    priority: 'Critical',
    submittedDate: '2026-09-11',
    status: 'In Progress',
    assignedStaff: 'Rajesh Sharma',
    description: 'Multiple steep slope potholes putting tourist buses and light vehicles at hazard on the fort approach road.',
    citizenImage: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=60',
    timeline: [
      { step: 'Complaint Submitted', date: '2026-09-11 08:30 AM', by: 'Citizen (Sanjeev Saxena)' },
      { step: 'Assigned to Heavy Repair Crew', date: '2026-09-11 10:00 AM', by: 'Rajesh Sharma' }
    ]
  },
  {
    id: 'CIV-2026-00137',
    title: 'Cracked Concrete Footpath Slabs',
    category: 'Broken Footpaths',
    location: 'DB City Mall Road, Gwalior',
    coordinates: '26.2195° N, 78.1912° E',
    priority: 'Low',
    submittedDate: '2026-09-10',
    status: 'Resolved',
    assignedStaff: 'Manoj Kumar',
    description: 'Settlement of interlock pavers causing tripping hazard for pedestrians.',
    citizenImage: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=600&auto=format&fit=crop&q=60',
    resolutionRemarks: 'Interlock pavers re-laid on stone dust bed and compacted.',
    resolutionDate: '2026-09-11',
    timeline: [
      { step: 'Complaint Submitted', date: '2026-09-10 03:00 PM', by: 'Citizen (Kavita Jain)' },
      { step: 'Resolved', date: '2026-09-11 02:00 PM', by: 'Manoj Kumar' }
    ]
  },
  {
    id: 'CIV-2026-00138',
    title: 'Broken Guardrail creating road hazard',
    category: 'Other Road Issues',
    location: 'Thatipur Main Square, Gwalior',
    coordinates: '26.2270° N, 78.2045° E',
    priority: 'Medium',
    submittedDate: '2026-09-09',
    status: 'Pending',
    assignedStaff: 'Unassigned',
    description: 'Metallic median guardrail damaged in past traffic incident protruding into fast lane.',
    citizenImage: 'https://images.unsplash.com/photo-1508873696983-2df515122519?w=600&auto=format&fit=crop&q=60',
    timeline: [
      { step: 'Complaint Submitted', date: '2026-09-09 01:20 PM', by: 'Citizen (Alok Mishra)' }
    ]
  },
  {
    id: 'CIV-2026-00139',
    title: 'Unmarked Road Hump causing vehicle jolts',
    category: 'Damaged Speed Breakers',
    location: 'Airport Road, Line 3, Gwalior',
    coordinates: '26.2650° N, 78.2250° E',
    priority: 'High',
    submittedDate: '2026-09-08',
    status: 'Resolved',
    assignedStaff: 'Virendra Singh',
    description: 'Newly laid asphalt speed breaker built without reflective paint stripes or warning board.',
    citizenImage: 'https://images.unsplash.com/photo-1508873696983-2df515122519?w=600&auto=format&fit=crop&q=60',
    resolutionRemarks: 'Thermoplastic reflective zebra painting completed & cat-eyes installed.',
    resolutionDate: '2026-09-09',
    timeline: [
      { step: 'Complaint Submitted', date: '2026-09-08 10:15 AM', by: 'Citizen (Nitin Shrivastava)' },
      { step: 'Marking Completed & Closed', date: '2026-09-09 03:45 PM', by: 'Virendra Singh' }
    ]
  },
  {
    id: 'CIV-2026-00140',
    title: 'Collapsed Storm Drain Cover on Road Edge',
    category: 'Damaged Roads',
    location: 'Phoolbagh Chowk, Gwalior',
    coordinates: '26.2130° N, 78.1810° E',
    priority: 'High',
    submittedDate: '2026-09-07',
    status: 'In Progress',
    assignedStaff: 'Amit Verma',
    description: 'Heavy duty cast iron drain grate fractured under bus axle load near Phoolbagh bus stop.',
    citizenImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=60',
    timeline: [
      { step: 'Complaint Submitted', date: '2026-09-07 05:30 PM', by: 'Citizen (Gaurav Chouhan)' },
      { step: 'New Grate Ordered & Site Barricaded', date: '2026-09-08 11:00 AM', by: 'Amit Verma' }
    ]
  },
  {
    id: 'CIV-2026-00141',
    title: 'Loose Gravel & Slippery Sand Spread',
    category: 'Road Blockage',
    location: 'Station Road, Sector 2, Gwalior',
    coordinates: '26.2210° N, 78.1860° E',
    priority: 'Low',
    submittedDate: '2026-09-06',
    status: 'Resolved',
    assignedStaff: 'Manoj Kumar',
    description: 'Spilled construction sand on sharp turn causing two-wheeler skidding risk.',
    citizenImage: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=60',
    resolutionRemarks: 'Road sweeping truck cleared gravel and sand layer.',
    resolutionDate: '2026-09-07',
    timeline: [
      { step: 'Complaint Submitted', date: '2026-09-06 02:00 PM', by: 'Citizen (Tarun Parihar)' },
      { step: 'Swept & Resolved', date: '2026-09-07 10:30 AM', by: 'Manoj Kumar' }
    ]
  }
];

export const initialDepartmentActivities = [
  {
    id: 'act-1',
    type: 'assigned',
    title: 'Complaint CIV-2026-00129 assigned',
    description: 'Assigned to Senior Officer Virendra Singh for urgent field inspection.',
    timestamp: '25 minutes ago',
    date: '2026-09-16 09:15 AM'
  },
  {
    id: 'act-2',
    type: 'status_change',
    title: 'Status updated to In Progress',
    description: 'Complaint CIV-2026-00131 (Road Blockage) updated with equipment dispatch notes.',
    timestamp: '1 hour ago',
    date: '2026-09-16 08:30 AM'
  },
  {
    id: 'act-3',
    type: 'resolved',
    title: 'Complaint CIV-2026-00134 Marked Resolved',
    description: 'Asphalt resurfacing completed near Naya Bazar. Final quality check passed.',
    timestamp: 'Yesterday',
    date: '2026-09-15 05:00 PM'
  },
  {
    id: 'act-4',
    type: 'remarks',
    title: 'Work Remarks Added for CIV-2026-00133',
    description: 'Placed on hold due to reflective signboard inventory restock requirement.',
    timestamp: 'Yesterday',
    date: '2026-09-15 02:30 PM'
  }
];
