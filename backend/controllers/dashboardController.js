import Employee from '../models/employeeModel.js';
import Leave from '../models/leaveModel.js';
import Attendance from '../models/attendanceModel.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });

    const recentLeaves = await Leave.find().sort({ createdAt: -1 }).limit(5).populate('employee', 'name');
    const recentAttendance = await Attendance.find().sort({ createdAt: -1 }).limit(5).populate('employee', 'name');

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

export const getEmployeeDashboard = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const profile = await Employee.findById(employeeId);
    const leaveStatus = await Leave.find({ employee: employeeId }).sort({ createdAt: -1 }).limit(3);
    const attendanceLogs = await Attendance.find({ employee: employeeId }).sort({ date: -1 }).limit(5);

    res.json({
      profile,
      leaveStatus,
      attendanceLogs
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};