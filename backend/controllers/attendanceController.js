import Attendance from '../models/attendanceModel.js';

export const clockIn = async (req, res) => {
  try {
    const { employee } = req.body;
    const today = new Date().setHours(0, 0, 0, 0);

    let record = await Attendance.findOne({ employee, date: today });
    if (record && record.clockIn) {
      return res.status(400).json({ message: 'Already clocked in' });
    }

    if (!record) {
      record = new Attendance({ employee, date: today });
    }

    record.clockIn = new Date();
    await record.save();

    res.status(200).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const clockOut = async (req, res) => {
  try {
    const { employee } = req.body;
    const today = new Date().setHours(0, 0, 0, 0);

    const record = await Attendance.findOne({ employee, date: today });
    if (!record || record.clockOut) {
      return res.status(400).json({ message: 'Cannot clock out' });
    }

    record.clockOut = new Date();
    await record.save();

    res.status(200).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAttendanceLogs = async (req, res) => {
  try {
    const logs = await Attendance.find().populate('employee', 'name email');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};