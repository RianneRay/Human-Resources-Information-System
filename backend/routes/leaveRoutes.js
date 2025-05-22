import express from 'express';
import {
  requestLeave,
  getAllLeaves,
  updateLeaveStatus,
  deleteLeave
} from '../controllers/leaveController.js';
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.route('/')
  .get(getAllLeaves)
  .post(protect, requestLeave);

router.route('/:id')
  .put(updateLeaveStatus)
  .delete(deleteLeave);

export default router;