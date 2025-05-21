import express from 'express';
import {
  getNotificationsForUser,
  markAsRead
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/:userId', getNotificationsForUser);
router.put('/:id/read', markAsRead);

export default router;