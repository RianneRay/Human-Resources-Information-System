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
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// CRUD for employees
router.route('/')
  .get(getEmployees)
  .post(createEmployee);

router.route('/:id')
  .get(getEmployeeById)
  .put(updateEmployee)
  .delete(deleteEmployee);

// Profile routes (authenticated)
router.put('/profile/update', protect, updateEmployeeProfile);
router.put('/profile/password', protect, updateEmployeePassword);

export default router;