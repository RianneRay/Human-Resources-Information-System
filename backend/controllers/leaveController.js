import Leave from '../models/leaveModel.js';
import { createNotification } from './notificationController.js';
import Employee from '../models/employeeModel.js';

export const requestLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;

    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const leave = new Leave({
      employee: employee._id,
      type,
      startDate,
      endDate,
      reason
    });

    await leave.save();
    res.status(201).json({ message: 'Leave request submitted', leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate('employee', 'name');
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user._id }).populate('employee', 'name');
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
    const updated = await Leave.findById(req.params.id).populate('employee', '_id name');

    if (!updated) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    updated.status = status;
    await updated.save();

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