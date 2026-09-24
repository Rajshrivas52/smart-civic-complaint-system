import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import app from './src/app.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 5000;

// Start server function
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Smart Civic Complaint System Backend`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Server URL : http://localhost:${PORT}`);
    console.log(` Health API : http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });

  process.on('unhandledRejection', (err) => {
    console.error(`[Unhandled Rejection] Error: ${err.message}`);
  });

  process.on('SIGTERM', () => {
    console.log('[Server] SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('[Server] Process terminated.');
    });
  });
};

startServer();