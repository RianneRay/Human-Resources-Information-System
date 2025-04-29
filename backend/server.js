import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors';
import { env_vars }from './config/envVars.js';
import authRoutes from './routes/authRoute.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = env_vars.PORT;
app.listen(PORT, () => {
  console.log("server start at " + PORT);
  connectDB();
})
