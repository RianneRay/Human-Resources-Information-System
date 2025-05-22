import express from 'express';
import {
  getAllEmployees,
  updateUserRole,
  createDepartment,
  listDepartments
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all admin routes
router.use(protect, adminOnly);

// Employee management
router.get('/employees', getAllEmployees);
router.put('/employee/:id/role', updateUserRole);

// Department management
router.post('/departments', createDepartment);
router.get('/departments', listDepartments);

export default router;