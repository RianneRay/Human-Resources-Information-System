import express from 'express';
import {
  requestLeave,
  getAllLeaves,
  updateLeaveStatus
} from '../controllers/leaveController.js';

const router = express.Router();

router.route('/')
  .get(getAllLeaves)
  .post(requestLeave);

router.route('/:id/status')
  .put(updateLeaveStatus);

export default router;