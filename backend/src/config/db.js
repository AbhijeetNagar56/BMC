import mongoose from 'mongoose';

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'bmc';

export const connectDB = async () => {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set in environment variables');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(mongoUri, {
    dbName,
  });

  console.log(`MongoDB connected: ${dbName}`);
  return mongoose.connection;
};

export const getDb = () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return mongoose.connection;
};

export const closeDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};
