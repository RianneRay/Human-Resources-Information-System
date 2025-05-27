import Employee from '../models/employeeModel.js';
import Leave from '../models/leaveModel.js';
import Attendance from '../models/attendanceModel.js';

// Admin Dashboard
export const getAdminDashboard = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });

    const recentLeaves = await Leave.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('employee', 'name email'); // show employee info

    const recentAttendance = await Attendance.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('employee', 'name email'); // show employee info

    res.json({
      totalEmployees,
      pendingLeaves,
      recentLeaves,
      recentAttendance
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Employee Dashboard
export const getEmployeeDashboard = async (req, res) => {
  try {
    // Step 1: Get the logged-in user ID
    const userId = req.user._id;

    // Step 2: Find the associated employee profile
    const employee = await Employee.findOne({ user: userId });

    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    // Step 3: Use the employee._id to query leave and attendance
    const leaveStatus = await Leave.find({ employee: employee._id })
      .sort({ createdAt: -1 })
      .limit(3);

    const attendanceLogs = await Attendance.find({ employee: employee._id })
      .sort({ date: -1 })
      .limit(5);

    res.json({
      profile: employee,
      leaveStatus,
      attendanceLogs
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};