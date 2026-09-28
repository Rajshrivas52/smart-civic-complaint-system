import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Citizen from '../models/Citizen.js';
import Admin from '../models/Admin.js';
import Department from '../models/Department.js';
import Setting from '../models/Setting.js';
import Complaint from '../models/Complaint.js';

const defaultDepartments = [
  {
    departmentId: 'DEPT-001',
    name: 'Road Maintenance',
    code: 'ROAD',
    description: 'Handles potholes, damaged roads, asphalt resurfacing, curb repairs, and road infrastructure.',
    head: 'Rajesh Verma',
    phone: '+91 98765 43210',
    email: 'road@smartcivic.gov.in',
    password: 'Dept@123',
    role: 'department',
    officeLocation: 'Zone 1 Municipal Workshop, Thatipur, Gwalior',
    status: 'Active',
    iconName: 'Construction',
    categories: ['Road Damage', 'Pothole'],
    staffCount: 14,
    staff: [
      { name: 'Rajesh Verma', designation: 'Department Head', phone: '+91 98765 43210' },
      { name: 'Jane Smith', designation: 'Senior Field Officer', phone: '+91 98234 11223' }
    ]
  },
  {
    departmentId: 'DEPT-002',
    name: 'Sanitation',
    code: 'SANI',
    description: 'Responsible for municipal waste management, daily garbage collection, street sweeping, and dumpsters.',
    head: 'Pooja Deshmukh',
    phone: '+91 98221 54321',
    email: 'sanitation@smartcivic.gov.in',
    password: 'Dept@123',
    role: 'department',
    officeLocation: 'Solid Waste Management Center, City Centre, Gwalior',
    status: 'Active',
    iconName: 'Trash2',
    categories: ['Garbage', 'Drainage'],
    staffCount: 16,
    staff: [
      { name: 'Pooja Deshmukh', designation: 'Department Head', phone: '+91 98221 54321' },
      { name: 'John Doe', designation: 'Sanitation Supervisor', phone: '+91 98450 67890' }
    ]
  },
  {
    departmentId: 'DEPT-003',
    name: 'Electricity',
    code: 'ELEC',
    description: 'Manages municipal power infrastructure, street lighting, junction transformers, and public poles.',
    head: 'Kunal Singhania',
    phone: '+91 97555 88990',
    email: 'electricity@smartcivic.gov.in',
    password: 'Dept@123',
    role: 'department',
    officeLocation: 'Power Grid Substation, Morar, Gwalior',
    status: 'Active',
    iconName: 'Lightbulb',
    categories: ['Streetlight', 'Power Outage'],
    staffCount: 12,
    staff: [
      { name: 'Kunal Singhania', designation: 'Chief Electrical Engineer', phone: '+91 97555 88990' }
    ]
  }
];

const defaultAdmins = [
  {
    name: 'System Admin',
    email: 'admin@civis.gov',
    phone: '+91 98765 43210',
    password: 'Admin@123',
    role: 'admin',
    status: 'Active'
  }
];

const defaultCitizens = [
  {
    name: 'Raj Kumar',
    email: 'raj@example.com',
    phone: '+91 98111 22334',
    password: 'Citizen@123',
    role: 'citizen',
    area: 'Thatipur',
    status: 'Active'
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 98222 33445',
    password: 'Citizen@123',
    role: 'citizen',
    area: 'City Center',
    status: 'Active'
  },
  {
    name: 'Ramu',
    email: 'ramu@gmail.com',
    phone: '+91 98999 88776',
    password: 'Citizen@123',
    role: 'citizen',
    area: 'Morar',
    status: 'Active'
  }
];

export const seedDatabase = async () => {
  console.log('[Seeder] Starting database seeding process...');

  try {
    const conn = await connectDB();
    if (!conn) {
      console.error('[Seeder] Cannot seed database: MongoDB connection failed.');
      return;
    }

    // 1. Seed Settings if none exist
    const settingsCount = await Setting.countDocuments();
    if (settingsCount === 0) {
      await Setting.create({});
      console.log('[Seeder] Created default system settings.');
    }

    // 2. Seed Departments in `departments` collection
    for (const dept of defaultDepartments) {
      const exists = await Department.findOne({ code: dept.code });
      if (!exists) {
        await Department.create(dept);
        console.log(`[Seeder] Seeded department: ${dept.name} (${dept.code})`);
      } else if (!exists.password) {
        exists.password = dept.password;
        exists.email = dept.email;
        exists.role = 'department';
        await exists.save();
        console.log(`[Seeder] Updated credentials for department: ${dept.name}`);
      }
    }

    // 3. Seed Admins in `admins` collection
    for (const admin of defaultAdmins) {
      const exists = await Admin.findOne({ email: admin.email });
      if (!exists) {
        await Admin.create(admin);
        console.log(`[Seeder] Seeded admin: ${admin.name} (${admin.email})`);
      }
    }

    // 4. Seed Citizens in `citizens` collection
    for (const citizen of defaultCitizens) {
      const exists = await Citizen.findOne({ email: citizen.email });
      if (!exists) {
        await Citizen.create(citizen);
        console.log(`[Seeder] Seeded citizen: ${citizen.name} (${citizen.email})`);
      }
    }

    // 5. Seed Real Complaints in `complaints` collection
    const rajCitizen = await Citizen.findOne({ email: 'raj@example.com' });
    const priyaCitizen = await Citizen.findOne({ email: 'priya@example.com' });
    const ramuCitizen = await Citizen.findOne({ email: 'ramu@gmail.com' });

    const roadDept = await Department.findOne({ code: 'ROAD' });
    const saniDept = await Department.findOne({ code: 'SANI' });
    const elecDept = await Department.findOne({ code: 'ELEC' });

    const initialComplaints = [
      {
        complaintId: 'CMP-1024',
        title: 'Large pothole on main road',
        description: 'Deep pothole causing severe traffic slowdown and two-wheeler hazard near Thatipur crossing.',
        category: 'Road Damage',
        priority: 'High',
        severity: 'High',
        status: 'Assigned',
        citizen: rajCitizen?._id,
        citizenName: rajCitizen?.name || 'Raj Kumar',
        citizenPhone: rajCitizen?.phone || '+91 98111 22334',
        department: roadDept?._id,
        departmentName: roadDept?.name || 'Road Maintenance',
        location: { lat: 26.2124, lng: 78.2045 },
        area: 'Thatipur',
        address: 'Thatipur Crossing, Main Road',
        timeline: [
          { status: 'Pending', note: 'Complaint submitted by citizen', updatedByName: 'Raj Kumar', date: new Date('2026-09-02T10:00:00Z') },
          { status: 'Assigned', note: 'Assigned to Road Maintenance department', updatedByName: 'System', date: new Date('2026-09-02T11:30:00Z') }
        ]
      },
      {
        complaintId: 'CMP-1031',
        title: 'Potholes near school entrance',
        description: 'Multiple potholes right outside the primary school gate creating danger for children.',
        category: 'Road Damage',
        priority: 'Medium',
        severity: 'Medium',
        status: 'Pending',
        citizen: rajCitizen?._id,
        citizenName: rajCitizen?.name || 'Raj Kumar',
        citizenPhone: rajCitizen?.phone || '+91 98111 22334',
        department: roadDept?._id,
        departmentName: roadDept?.name || 'Road Maintenance',
        location: { lat: 26.2185, lng: 78.1820 },
        area: 'City Center',
        address: 'City Center School Gate 2',
        timeline: [
          { status: 'Pending', note: 'Complaint submitted by citizen', updatedByName: 'Raj Kumar', date: new Date('2026-09-05T08:30:00Z') }
        ]
      },
      {
        complaintId: 'CMP-1019',
        title: 'Resurfacing work at Naya Bazar road',
        description: 'Road asphalt cracked and worn out after monsoon rains.',
        category: 'Road Damage',
        priority: 'Low',
        severity: 'Low',
        status: 'Resolved',
        citizen: rajCitizen?._id,
        citizenName: rajCitizen?.name || 'Raj Kumar',
        citizenPhone: rajCitizen?.phone || '+91 98111 22334',
        department: roadDept?._id,
        departmentName: roadDept?.name || 'Road Maintenance',
        location: { lat: 26.2050, lng: 78.1610 },
        area: 'Main Market',
        address: 'Naya Bazar, Near Clock Tower',
        timeline: [
          { status: 'Pending', note: 'Complaint submitted', updatedByName: 'Raj Kumar', date: new Date('2026-08-20T09:00:00Z') },
          { status: 'Assigned', note: 'Assigned to Road Maintenance', updatedByName: 'System', date: new Date('2026-08-21T10:00:00Z') },
          { status: 'In Progress', note: 'Road repair team dispatched', updatedByName: 'Rajesh Verma', date: new Date('2026-08-23T14:00:00Z') },
          { status: 'Resolved', note: 'Road patching completed successfully', updatedByName: 'Rajesh Verma', date: new Date('2026-08-26T16:00:00Z') }
        ]
      },
      {
        complaintId: 'CMP-1025',
        title: 'Overflowing community garbage container',
        description: 'Solid waste dump overflowing into the pedestrian footpath, attracting stray cattle.',
        category: 'Garbage',
        priority: 'High',
        severity: 'High',
        status: 'Pending',
        citizen: priyaCitizen?._id,
        citizenName: priyaCitizen?.name || 'Priya Sharma',
        citizenPhone: priyaCitizen?.phone || '+91 98222 33445',
        department: saniDept?._id,
        departmentName: saniDept?.name || 'Sanitation',
        location: { lat: 26.2052, lng: 78.1925 },
        area: 'Lashkar',
        address: 'Maharaj Bada, Lashkar',
        timeline: [
          { status: 'Pending', note: 'Complaint submitted', updatedByName: 'Priya Sharma', date: new Date('2026-09-04T12:00:00Z') }
        ]
      },
      {
        complaintId: 'CMP-1026',
        title: 'Broken streetlights along main avenue',
        description: 'Four consecutive pole LED lights flickering and blacked out, creating hazard at night.',
        category: 'Streetlight',
        priority: 'Medium',
        severity: 'Medium',
        status: 'In Progress',
        citizen: priyaCitizen?._id,
        citizenName: priyaCitizen?.name || 'Priya Sharma',
        citizenPhone: priyaCitizen?.phone || '+91 98222 33445',
        department: elecDept?._id,
        departmentName: elecDept?.name || 'Electricity',
        location: { lat: 26.2165, lng: 78.1970 },
        area: 'Thatipur',
        address: 'Thatipur Main Road, Pole #34',
        timeline: [
          { status: 'Pending', note: 'Complaint submitted', updatedByName: 'Priya Sharma', date: new Date('2026-09-06T19:45:00Z') },
          { status: 'In Progress', note: 'Electrician team inspecting wiring', updatedByName: 'Kunal Singhania', date: new Date('2026-09-07T11:00:00Z') }
        ]
      },
      {
        complaintId: 'CMP-1028',
        title: 'Blocked storm drainage causing water logging',
        description: 'Heavy drainage blockage causing dirty water backflow on residential road.',
        category: 'Drainage',
        priority: 'High',
        severity: 'Critical',
        status: 'Assigned',
        citizen: ramuCitizen?._id,
        citizenName: ramuCitizen?.name || 'Ramu',
        citizenPhone: ramuCitizen?.phone || '+91 98999 88776',
        department: saniDept?._id,
        departmentName: saniDept?.name || 'Sanitation',
        location: { lat: 26.2230, lng: 78.2250 },
        area: 'Morar',
        address: 'Morar Market Avenue',
        timeline: [
          { status: 'Pending', note: 'Complaint submitted', updatedByName: 'Ramu', date: new Date('2026-09-08T15:30:00Z') },
          { status: 'Assigned', note: 'Assigned to Sanitation', updatedByName: 'System', date: new Date('2026-09-09T09:00:00Z') }
        ]
      }
    ];

    for (const c of initialComplaints) {
      if (!c.citizen) continue;
      const exists = await Complaint.findOne({ complaintId: c.complaintId });
      if (!exists) {
        await Complaint.create(c);
        console.log(`[Seeder] Seeded complaint: ${c.complaintId} - ${c.title}`);
      }
    }

    console.log('[Seeder] Seeding completed successfully.');
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
  }
};

// Auto-run if called directly: node src/utils/seed.js
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}
