import mongoose from 'mongoose';
import env from 'dotenv';
env.config();

mongoose
  .connect(process.env.URLDB)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully!');
    mongoose.connection.close();
  })
  .catch((err) => console.error('❌ Connection error:', err));
