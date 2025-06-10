import express from 'express';
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  searchEmployeesByName,
  updateEmployee,
  deleteEmployee,
  updateEmployeeProfile,
  updateEmployeePassword,
  getDepartmentsForEmployee,
  getMyProfile
} from '../controllers/employeeController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, adminOnly, getEmployees)
  .post(protect, adminOnly, createEmployee);

router.get('/search', protect, adminOnly, searchEmployeesByName);
router.get('/department', protect, getDepartmentsForEmployee);
router.get('/Profile', protect, getMyProfile);

router.route('/:id')
  .get(protect, adminOnly, getEmployeeById)
  .put(protect, adminOnly, updateEmployee)
  .delete(protect, adminOnly, deleteEmployee);


router.put('/profile/update', protect, updateEmployeeProfile);
router.put('/profile/password', protect, updateEmployeePassword);


export default router;