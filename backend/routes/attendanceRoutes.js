import express from 'express';
import {
  clockIn,
  clockOut,
  getAttendanceLogs
} from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/clockin', clockIn);
router.post('/clockout', clockOut);
router.get('/', getAttendanceLogs);

export default router;