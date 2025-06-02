const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://admin123:admin123@cluster0.csryx8q.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0');
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
};

module.exports = connectDB;