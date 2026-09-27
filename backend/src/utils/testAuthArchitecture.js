import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Citizen from '../models/Citizen.js';
import Admin from '../models/Admin.js';
import Department from '../models/Department.js';

const runTest = async () => {
  console.log('=== STARTING AUTH ARCHITECTURE TEST ===');
  await connectDB();

  // 1. Check Citizens collection
  const citizens = await Citizen.find({});
  console.log(`[Citizens Collection] Total documents: ${citizens.length}`);
  citizens.forEach(c => console.log(`  - Citizen: ${c.name} (${c.email}) [role: ${c.role}]`));

  // 2. Check Admins collection
  const admins = await Admin.find({});
  console.log(`[Admins Collection] Total documents: ${admins.length}`);
  admins.forEach(a => console.log(`  - Admin: ${a.name} (${a.email}) [role: ${a.role}]`));

  // 3. Check Departments collection
  const departments = await Department.find({});
  console.log(`[Departments Collection] Total documents: ${departments.length}`);
  departments.forEach(d => console.log(`  - Department: ${d.name} (${d.email}) [role: ${d.role}]`));

  // 4. Test Citizen Password Verification (Ramu)
  const ramu = await Citizen.findOne({ email: 'ramu@gmail.com' }).select('+password');
  if (ramu) {
    const isMatch = await ramu.comparePassword('Citizen@123');
    console.log(`[Test Auth] Citizen 'ramu@gmail.com' password match: ${isMatch}`);
  }

  // 5. Test Admin Password Verification
  const adminAcc = await Admin.findOne({ email: 'admin@civis.gov' }).select('+password');
  if (adminAcc) {
    const isMatch = await adminAcc.comparePassword('Admin@123');
    console.log(`[Test Auth] Admin 'admin@civis.gov' password match: ${isMatch}`);
  }

  // 6. Test Department Password Verification
  const deptAcc = await Department.findOne({ email: 'road@smartcivic.gov.in' }).select('+password');
  if (deptAcc) {
    const isMatch = await deptAcc.comparePassword('Dept@123');
    console.log(`[Test Auth] Department 'road@smartcivic.gov.in' password match: ${isMatch}`);
  }

  console.log('=== TEST COMPLETED SUCCESSFULLY ===');
  mongoose.connection.close();
  process.exit(0);
};

runTest();
