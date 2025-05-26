import express from 'express';
import {
  getAllEmployees,
  updateUserRole,
  createDepartment,
  listDepartments
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/employees', getAllEmployees);
router.put('/employee/:id/role', updateUserRole);

router.post('/departments', createDepartment);
router.get('/departments', listDepartments);

export default router;