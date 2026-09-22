import 'dotenv/config';
import mongoose from 'mongoose';
import dns from 'node:dns';

// Fix for Windows/ISP DNS servers failing to resolve MongoDB Atlas SRV records (ECONNREFUSED querySrv)
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('[Database] Could not set custom DNS resolvers:', dnsErr.message);
}

/**
 * Connect to MongoDB with Mongoose
 */
export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_civic_db';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000 // 5s timeout for initial connection
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB at ${mongoUri}: ${error.message}`);
    console.warn('[Database Notice] Please ensure MongoDB is running locally or specify MONGO_URI in backend/.env');
    // Return null instead of exiting immediately so health check and other endpoints can still be inspected
    return null;
  }
};

let hasConnectedOnce = false;

mongoose.connection.on('connected', () => {
  hasConnectedOnce = true;
});

mongoose.connection.on('disconnected', () => {
  if (hasConnectedOnce) {
    console.warn('[Database] MongoDB connection lost. Attempting to reconnect...');
  }
});

mongoose.connection.on('reconnected', () => {
  console.log('[Database] MongoDB reconnected successfully.');
});
