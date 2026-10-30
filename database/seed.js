/**
 * ============================================================================
 * Smart Civic Complaint System - Database Seed Script & Reference
 * ============================================================================
 * This script serves as the executable entry point and reference copy for
 * populating the MongoDB database with initial configuration, administrative
 * users, municipal departments, citizens, and realistic sample complaints.
 *
 * Real Implementation Location: backend/src/utils/seed.js
 *
 * ----------------------------------------------------------------------------
 * USAGE:
 * ----------------------------------------------------------------------------
 * Option 1 (From Project Root):
 *   node database/seed.js
 *
 * Option 2 (Via Backend npm script):
 *   cd backend
 *   npm run seed
 *
 * Option 3 (Docker Compose):
 *   docker-compose exec backend npm run seed
 *
 * ----------------------------------------------------------------------------
 * SEEDED ACCOUNTS & CREDENTIALS:
 * ----------------------------------------------------------------------------
 * 1. System Administrator:
 *    - Email:    admin@civis.gov
 *    - Password: Admin@123
 *    - Role:     admin
 *
 * 2. Municipal Departments:
 *    - Road Maintenance (ROAD):  road@smartcivic.gov.in / Dept@123
 *    - Sanitation (SANI):        sanitation@smartcivic.gov.in / Dept@123
 *    - Electricity (ELEC):       electricity@smartcivic.gov.in / Dept@123
 *
 * 3. Citizen Test Accounts:
 *    - Raj Kumar:     raj@example.com / Citizen@123 (Area: Thatipur)
 *    - Priya Sharma:  priya@example.com / Citizen@123 (Area: City Center)
 *    - Ramu:          ramu@gmail.com / Citizen@123 (Area: Morar)
 * ============================================================================
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env if not already set
dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });

// Import the core seeding routine from backend
import { seedDatabase } from '../backend/src/utils/seed.js';

async function runSeed() {
  console.log('----------------------------------------------------');
  console.log(' Starting Smart Civic Database Initialization...');
  console.log(` Target URI: ${process.env.MONGO_URI ? process.env.MONGO_URI.split('@')[1] || 'mongodb://localhost:27017' : 'Default local'}`);
  console.log('----------------------------------------------------');

  try {
    await seedDatabase();
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Seeding encountered an error:', error);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log(' MongoDB connection closed.');
    }
    process.exit(0);
  }
}

runSeed();
