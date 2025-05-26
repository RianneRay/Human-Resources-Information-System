import express from 'express';
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  updateEmployeeProfile,
  updateEmployeePassword
} from '../controllers/employeeController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, adminOnly, getEmployees)
  .post(protect, adminOnly, createEmployee);

router.route('/:id')
  .get(protect, adminOnly, getEmployeeById)
  .put(protect, adminOnly, updateEmployee)
  .delete(protect, adminOnly, deleteEmployee);

router.put('/profile/update', protect, updateEmployeeProfile);
router.put('/profile/password', protect, updateEmployeePassword);

export default router;