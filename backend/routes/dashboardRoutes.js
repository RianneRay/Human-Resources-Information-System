import express from 'express';
import {
  getAdminDashboard,
  getEmployeeDashboard
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/admin', getAdminDashboard);
router.get('/employee/:employeeId', getEmployeeDashboard);

export default router;