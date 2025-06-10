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
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const leaves = await Leave.find({ employee: employee._id }).populate('employee', 'name');
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

export const updateMyLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    if (leave.employee.toString() !== employee._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: Cannot edit this leave' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot edit leave after approval or rejection' });
    }

    const { type, startDate, endDate, reason } = req.body;
    if (type) leave.type = type;
    if (startDate) leave.startDate = startDate;
    if (endDate) leave.endDate = endDate;
    if (reason) leave.reason = reason;

    const updatedLeave = await leave.save();
    res.json(updatedLeave);
  } catch (err) {
    res.status(500).json({ message: 'Server error while updating leave' });
  }
};

export const deleteMyLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    if (leave.employee.toString() !== employee._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: Cannot delete this leave' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot delete leave after approval or rejection' });
    }

    await leave.deleteOne();
    res.json({ message: 'Leave deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error while deleting leave' });
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