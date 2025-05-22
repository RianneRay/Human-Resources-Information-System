import express from 'express';
import {
  getAdminDashboard,
  getEmployeeDashboard
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin', getAdminDashboard);
router.get('/employee/:id', protect, getEmployeeDashboard);

export default router;