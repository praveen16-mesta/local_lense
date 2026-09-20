const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/locallens';
    const conn = await mongoose.connect(connStr);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Continue running app even if MongoDB is not immediately active, logging warnings
  }
};

module.exports = connectDB;
