import mongoose from 'mongoose';
import { env_vars } from './envVars.js';

export const connectDB = async () => {
  
  try {
    const conn = await mongoose.connect(env_vars.MONGO_URI)
    console.log("mongodb connected:" + conn.connection.host)
  } catch (error) {
    console.error("connection error:" + error.message)
    process.exit(1)
  }
}