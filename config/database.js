const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/workout_app');

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn('⚠️  Database connection failed:', error.message);
    console.warn('⚠️  App will run without authentication features');
    console.warn('⚠️  Set up MongoDB to enable user accounts and workout saving');
    return false;
  }
};

module.exports = connectDB; 