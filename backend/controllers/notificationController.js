import Employee from '../models/employeeModel.js';
import Notification from '../models/notificationModel.js';

export const getNotificationsForEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const notifications = await Notification.find({
      $or: [
        { employee: employee._id },
        { user: req.user._id }
      ]
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: You can only update your own notifications" });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.employee) {
      const employee = await Employee.findOne({ user: req.user._id });
      if (!employee) {
        return res.status(404).json({ message: 'Employee profile not found' });
      }

      if (notification.employee.toString() !== employee._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: Cannot delete this notification' });
      }

    } else if (notification.user) {
      if (notification.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: Cannot delete this notification' });
      }

    } else {
      console.error('[DEBUG] Notification missing both user and employee:', notification);
      return res.status(400).json({
        message: 'Invalid notification: not linked to a user or employee',
        id: notification._id
      });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted successfully' });

  } catch (err) {
    console.error('deleteNotification error:', err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteAllNotifications = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    const result = await Notification.deleteMany({});
    res.json({ message: `Deleted ${result.deletedCount} notifications` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createNotification = async (employeeId, type, message) => {
  try {
    const note = new Notification({
      employee: employeeId,
      type,
      message,
    });
    await note.save();
    console.log('Notification saved:', note);
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};