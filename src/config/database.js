import mongoose from 'mongoose';

/**
 * MongoDB database configuration
 */
export const dbConfig = {
  url: process.env.URLDB,
  options: {
    maxPoolSize: 50, // Max simultaneous connections (default: 100)
    serverSelectionTimeoutMS: 5000, // Time to find server (default: 30000)
    socketTimeoutMS: 45000, // Maximum time per operation (default: 360000)
    connectTimeoutMS: 10000, // Maximum time to connect to server (default: 30000)
    bufferCommands: false, // Do not buffer commands if there is no connection (default: true)
    bufferMaxEntries: 0, // Don't buffer failed operations (default: -1) unlimited
  },
};

export const connectDatabase = async () => {
  try {
    await mongoose.connect(dbConfig.url, dbConfig.options);
    console.log('✅ Connected to MongoDB Atlas');

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};
