import express from 'express';
import {
  requestLeave,
  getAllLeaves,
  updateLeaveStatus,
  deleteLeave,
  getMyLeaves
} from '../controllers/leaveController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, requestLeave);

router.get('/', protect, adminOnly, getAllLeaves);
router.get('/my', protect, getMyLeaves);

router.route('/:id')
  .put(protect, adminOnly, updateLeaveStatus)
  .delete(protect, adminOnly, deleteLeave);

export default router;