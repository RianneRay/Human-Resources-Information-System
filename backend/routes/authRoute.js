import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post("/register", protect, adminOnly, register);
router.post("/login", login);
router.post("/logout", logout);

export default router;