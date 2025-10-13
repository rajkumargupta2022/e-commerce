// lib/mongoose.js

import mongoose from 'mongoose';

// const MONGODB_URI = "mongodb://localhost:27017/lebel"; 
const MONGODB_URI = "mongodb+srv://rajkumar:Raj%409956@lebel.amqvplr.mongodb.net/lebelankasha?retryWrites=true&w=majority";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Connected database")
      return mongoose;
    });
  }
    console.log("Connection failed")
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connect;
