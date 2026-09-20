// Modular Department Configuration Registry for Smart Civic System

export const DEPARTMENTS = [
  {
    id: 'road-maintenance',
    name: 'Road Maintenance Department',
    shortName: 'Road Maintenance',
    code: 'RMD',
    iconName: 'Wrench',
    color: '#4f46e5',
    active: true,
    staffName: 'Eng. Suresh Sharma',
    staffRole: 'Senior Road Officer',
    description: 'Manage and resolve road-related complaints assigned to your department.',
    categories: [
      'Potholes',
      'Damaged Roads',
      'Broken Footpaths',
      'Road Blockage',
      'Missing Road Signs',
      'Damaged Speed Breakers',
      'Other Road Issues'
    ],
    officers: [
      'Eng. Suresh Sharma (Senior Officer)',
      'Rajesh Sharma (Field Engineer)',
      'Virendra Singh (Site Supervisor)',
      'Amit Verma (Field Lead)',
      'Manoj Kumar (Junior Technician)',
      'Unassigned'
    ]
  },
  {
    id: 'sanitation',
    name: 'Sanitation & Waste Management',
    shortName: 'Sanitation',
    code: 'SWM',
    iconName: 'Trash2',
    color: '#10b981',
    active: false,
    staffName: 'Dr. Anita Roy',
    staffRole: 'Chief Sanitation Officer',
    description: 'Manage waste collection, street sweeping, and public hygiene complaints.',
    categories: [
      'Garbage Overflow',
      'Unswept Streets',
      'Illegal Debris Dumping',
      'Damaged Public Dustbin',
      'Biomedical Waste Risk'
    ],
    officers: [
      'Dr. Anita Roy (Chief Officer)',
      'Rakesh Gupta (Ward Supervisor)',
      'Sanjay Yadav (Sanitation Lead)'
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical & Public Lighting',
    shortName: 'Electrical',
    code: 'EPL',
    iconName: 'Zap',
    color: '#f59e0b',
    active: false,
    staffName: 'Ramesh Patel',
    staffRole: 'Executive Electrical Engineer',
    description: 'Maintain streetlights, public power poles, and electrical safety.',
    categories: [
      'Broken Streetlight',
      'Exposed High Voltage Wire',
      'Power Fluctuation',
      'Transformer Fault',
      'Light Sensor Timer Failure'
    ],
    officers: [
      'Ramesh Patel (Exec. Engineer)',
      'Deepak Kumar (Lineman Lead)',
      'Sunil Joshi (Electrician)'
    ]
  },
  {
    id: 'water-supply',
    name: 'Water Supply & Sewerage Board',
    shortName: 'Water Supply',
    code: 'WSSB',
    iconName: 'Droplets',
    color: '#0284c7',
    active: false,
    staffName: 'Sunil Verma',
    staffRole: 'Water Works Inspector',
    description: 'Handle pipeline leaks, water contamination, and sewerage overflows.',
    categories: [
      'Pipeline Leakage',
      'Water Contamination',
      'Low Supply Pressure',
      'Sewage Line Overflow',
      'Main Valve Repair'
    ],
    officers: [
      'Sunil Verma (Inspector)',
      'Pankaj Tripathi (Pipeline Lead)'
    ]
  },
  {
    id: 'drainage',
    name: 'Stormwater & Drainage Division',
    shortName: 'Drainage',
    code: 'SDD',
    iconName: 'Waves',
    color: '#0d9488',
    active: false,
    staffName: 'Vikram Bundela',
    staffRole: 'Drainage Superintendent',
    description: 'Clear storm drains, open culverts, and prevent monsoon waterlogging.',
    categories: [
      'Drain Blockage',
      'Open Manhole Hazard',
      'Culvert Siltation',
      'Monsoon Waterlogging',
      'Gully Trap Repair'
    ],
    officers: [
      'Vikram Bundela (Superintendent)',
      'Karan Singh (Drainage Lead)'
    ]
  },
  {
    id: 'traffic-management',
    name: 'Traffic Control & Safety Bureau',
    shortName: 'Traffic Management',
    code: 'TCSB',
    iconName: 'ShieldAlert',
    color: '#dc2626',
    active: false,
    staffName: 'Insp. R.K. Bhadoria',
    staffRole: 'Traffic Safety Officer',
    description: 'Oversee traffic signal failures, road barriers, and blind spot hazards.',
    categories: [
      'Traffic Signal Fault',
      'Fallen Road Barrier',
      'Hazardous Obstruction',
      'Missing Signal Light',
      'Blind Spot Warning Signs'
    ],
    officers: [
      'Insp. R.K. Bhadoria (Safety Officer)',
      'Sub-Insp. Mehta (Field Lead)'
    ]
  }
];

export const getDepartmentById = (id) => {
  return DEPARTMENTS.find(d => d.id === id) || DEPARTMENTS[0];
};
