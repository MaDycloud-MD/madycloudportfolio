const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not defined in environment variables');

  const conn = await mongoose.connect(uri, {
    bufferCommands: false,
  });

  isConnected = true;
  console.log(`MongoDB connected: ${conn.connection.host}`);
}

module.exports = { connectDB };
