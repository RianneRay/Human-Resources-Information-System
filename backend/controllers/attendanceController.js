import Attendance from '../models/attendanceModel.js';
import Employee from '../models/employeeModel.js';
import Notification from '../models/notificationModel.js';

export const clockIn = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = new Attendance({
      employee: employee._id,
      date: today,
      clockIn: new Date()
    });

    await attendance.save();

    await Notification.create({
      employee: employee._id,
      type: "attendance",
      message: "You have successfully clocked in.",
      read: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json(attendance);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Already clocked in today' });
    }
    res.status(500).json({ message: err.message });
  }
};

export const clockOut = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await Attendance.findOne({ employee: employee._id, date: today });

    if (!record) {
      return res.status(400).json({ message: 'No clock-in record found for today' });
    }
    if (record.clockOut) {
      return res.status(400).json({ message: 'Already clocked out today' });
    }

    record.clockOut = new Date();
    await record.save();

    await Notification.create({
      employee: employee._id,
      type: "attendance",
      message: "You have successfully clocked out.",
      read: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(200).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAttendanceLogs = async (req, res) => {
  try {
    const { employee, startDate, endDate } = req.query;
    const filter = {};

    if (employee) filter.employee = employee;
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const logs = await Attendance.find(filter).populate('employee', 'name email position');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEmployeeAttendanceLogs = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const logs = await Attendance.find({ employee: employee._id })
      .sort({ date: -1 })
      .limit(5)
      .populate('employee', 'name email position');

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEmployeeAttendanceById = async (req, res) => {
  try {
    const employeeId = req.params.id;

    const logs = await Attendance.find({ employee: employeeId })
      .sort({ date: -1 })
      .populate('employee', 'name email position');

    if (!logs.length) {
      return res.status(404).json({ message: 'No attendance logs found for this employee' });
    }

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    await record.deleteOne();
    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};