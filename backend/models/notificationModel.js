import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  type: { type: String, enum: ['info', 'leave', 'attendance'], default: 'info' },
  message: { type: String, required: true },
  read: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;