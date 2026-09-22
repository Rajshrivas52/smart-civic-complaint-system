import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Department from '../models/Department.js';
import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';
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

const defaultUsers = [
  {
    name: 'System Admin',
    email: 'admin@civis.gov',
    phone: '+91 98765 43210',
    password: 'Admin@123',
    role: 'admin',
    area: 'City Center',
    status: 'Active'
  },
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
    name: 'Jane Smith (Roads)',
    email: 'jane@roads.civis.gov',
    phone: '+91 98333 44556',
    password: 'Dept@123',
    role: 'department',
    departmentName: 'Road Maintenance',
    area: 'Thatipur',
    status: 'Active'
  },
  {
    name: 'John Doe (Sanitation)',
    email: 'john@water.civis.gov',
    phone: '+91 98444 55667',
    password: 'Dept@123',
    role: 'department',
    departmentName: 'Sanitation',
    area: 'City Center',
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

    // 2. Seed Departments
    for (const dept of defaultDepartments) {
      const exists = await Department.findOne({ code: dept.code });
      if (!exists) {
        await Department.create(dept);
        console.log(`[Seeder] Seeded department: ${dept.name} (${dept.code})`);
      }
    }

    // Map departments to assign ID references to department staff
    const roadDept = await Department.findOne({ code: 'ROAD' });
    const saniDept = await Department.findOne({ code: 'SANI' });

    // 3. Seed Users
    for (const user of defaultUsers) {
      const exists = await User.findOne({ email: user.email });
      if (!exists) {
        let userToCreate = { ...user };
        if (user.role === 'department') {
          if (user.departmentName === 'Road Maintenance' && roadDept) {
            userToCreate.department = roadDept._id;
          } else if (user.departmentName === 'Sanitation' && saniDept) {
            userToCreate.department = saniDept._id;
          }
        }
        await User.create(userToCreate);
        console.log(`[Seeder] Seeded user: ${user.name} (${user.email}) [${user.role}]`);
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
