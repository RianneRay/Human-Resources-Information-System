import express from 'express';
import {
  requestLeave,
  getAllLeaves,
  updateLeaveStatus,
  deleteLeave
} from '../controllers/leaveController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Employee requests leave
router.post('/', protect, requestLeave);

// Admin views all leave requests
router.get('/', protect, adminOnly, getAllLeaves);

// Admin updates leave status or deletes a leave request
router.route('/:id')
  .put(protect, adminOnly, updateLeaveStatus)
  .delete(protect, adminOnly, deleteLeave);

export default router;