import express from 'express';
import {
  clockIn,
  clockOut,
  getAttendanceLogs,
  getEmployeeAttendanceLogs,
  deleteAttendance
} from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/clockin', protect, clockIn);
router.post('/clockout', protect, clockOut);
router.get('/', protect, getAttendanceLogs);
router.get('/me', protect, getEmployeeAttendanceLogs);
router.delete('/:id', protect, deleteAttendance);

export default router;