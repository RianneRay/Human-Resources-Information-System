import Attendance from '../models/attendanceModel.js';
import { createNotification } from './notificationController.js';

// Clock In
export const clockIn = async (req, res) => {
  try {
    const employeeId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({ employee: employeeId, date: today });

    if (existing) {
      return res.status(400).json({ message: 'Already clocked in today' });
    }

    const attendance = new Attendance({
      employee: employeeId,
      date: today,
      clockIn: new Date()
    });

    await attendance.save();

    await createNotification(employeeId, 'attendance', 'You have successfully clocked in.');

    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clock Out
export const clockOut = async (req, res) => {
  try {
    const employeeId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight

    const record = await Attendance.findOne({ employee: employeeId, date: today });

    if (!record || record.clockOut) {
      return res.status(400).json({ message: 'Cannot clock out' });
    }

    record.clockOut = new Date();
    await record.save();

    await createNotification(employeeId, 'attendance', 'You have successfully clocked out.');

    res.status(200).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Attendance Logs (Admin)
export const getAttendanceLogs = async (req, res) => {
  try {
    const logs = await Attendance.find().populate('employee', 'name email');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Employee-Specific Attendance Logs (Dashboard)
export const getEmployeeAttendanceLogs = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const logs = await Attendance.find({ employee: employeeId })
      .sort({ date: -1 })
      .limit(5);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Attendance by ID (Admin only)
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Attendance.findById(id);

    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await record.deleteOne();
    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};