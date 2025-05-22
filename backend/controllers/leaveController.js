import Leave from '../models/leaveModel.js';
import { createNotification } from './notificationController.js';

export const requestLeave = async (req, res) => {
  try {
    const leave = new Leave({
      ...req.body,
      employee: req.user._id // set employee ID from token
    });

    const saved = await leave.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate('employee', 'name email');
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  const { status } = req.body;
  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const updated = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('employee', 'name');
    if (!updated) return res.status(404).json({ message: 'Leave request not found' });

    // Notify employee
    await createNotification(
      updated.employee._id,
      'leave',
      `Your leave request from ${new Date(updated.startDate).toDateString()} to ${new Date(updated.endDate).toDateString()} was ${status.toLowerCase()}.`
      );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteLeave = async (req, res) => {
  try {
    const deleted = await Leave.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    res.json({ message: 'Leave deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};