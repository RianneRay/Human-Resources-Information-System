import express from "express";
import { register, login } from "../controllers/authController.js";
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post("/register", protect, adminOnly, register);
router.post("/login", login);

export default router;