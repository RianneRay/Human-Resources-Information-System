import express from 'express';
import {
  getNotificationsForEmployee,
  markAsRead,
  deleteNotification,
  deleteAllNotifications
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getNotificationsForEmployee);
router.put('/:id/read', protect, markAsRead);
router.delete('/all', protect, deleteAllNotifications);
router.delete('/:id', protect, deleteNotification);

export default router;