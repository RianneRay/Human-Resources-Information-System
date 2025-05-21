import Notification from '../models/notificationModel.js';

export const getNotificationsForUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createNotification = async (userId, type, message) => {
  try {
    const note = new Notification({ user: userId, type, message });
    await note.save();
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};