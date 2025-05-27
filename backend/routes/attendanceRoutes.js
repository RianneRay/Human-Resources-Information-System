import express from 'express';
import {
  clockIn,
  clockOut,
  getAttendanceLogs,
  getEmployeeAttendanceLogs,
  getEmployeeAttendanceById,
  deleteAttendance
} from '../controllers/attendanceController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/clockin', protect, clockIn);
router.post('/clockout', protect, clockOut);
router.get('/me', protect, getEmployeeAttendanceLogs);

router.get('/', protect, adminOnly, getAttendanceLogs);
router.get('/employee/:id', protect, adminOnly, getEmployeeAttendanceById);
router.delete('/:id', protect, adminOnly, deleteAttendance);

export default router;