import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Citizen from '../models/Citizen.js';
import Admin from '../models/Admin.js';
import Department from '../models/Department.js';
import Setting from '../models/Setting.js';

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
