import express from 'express';
import {
  getAdminDashboard,
  getEmployeeDashboard
} from '../controllers/dashboardController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin',protect, adminOnly, getAdminDashboard);
router.get('/employee', protect, getEmployeeDashboard);

export default router;