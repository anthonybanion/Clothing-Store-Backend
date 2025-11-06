import mongoose from 'mongoose';

/**
 * MongoDB database configuration
 */
export const dbConfig = {
  options: {
    maxPoolSize: 50, // Max simultaneous connections (default: 100)
    serverSelectionTimeoutMS: 5000, // Time to find server (default: 30000)
    socketTimeoutMS: 45000, // Maximum time per operation (default: 360000)
    connectTimeoutMS: 10000, // Maximum time to connect to server (default: 30000)
    bufferCommands: false, // Do not buffer commands if there is no connection (default: true)
    useNewUrlParser: true, // Use the new URL parser (default: false)
    useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine (default: false)
  },
};

export const connectDatabase = async () => {
  try {
    // Evaluate process.env INSIDE the function
    const url = process.env.URLDB;
    console.log(
      'Connecting to MongoDB with URL:',
      url ? 'URL present' : 'URL missing'
    );

    if (!url) {
      throw new Error('URLDB environment variable is not defined');
    }
    // Assign the URL to the config
    await mongoose.connect(url, dbConfig.options);
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
