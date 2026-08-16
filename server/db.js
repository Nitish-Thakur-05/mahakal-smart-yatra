require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mahakal_db';

let isConnected = false;

// Disable Mongoose command buffering globally so operations don't hang 10s when MongoDB is offline
mongoose.set('bufferCommands', false);

async function connectDB() {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
      bufferCommands: false
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`MongoDB Connection Note: ${error.message} (Running in fast fallback mode)`);
  }
}

module.exports = { connectDB };
