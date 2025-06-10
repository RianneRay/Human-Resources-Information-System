import Employee from '../models/employeeModel.js';
import User from '../models/User.js';
import Department from '../models/departmentModel.js';
import bcrypt from 'bcryptjs';

export const getMyProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id })
      .populate('department', 'name');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, address, position, department, role, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    let departmentRef = null;
    if (department) {
      const foundDept = await Department.findById(department);
      if (!foundDept) {
        return res.status(400).json({ error: 'Invalid department ID' });
      }
      departmentRef = foundDept._id;
    }

    const user = new User({
      name,
      email,
      password,
      role: role || 'employee'
    });
    await user.save();

    const employee = new Employee({
      user: user._id,
      name,
      email,
      phone,
      address,
      position,
      department: departmentRef,
      role: role || 'employee'
    });
    await employee.save();

    res.status(201).json({
      message: 'Employee and login credentials created successfully',
      employee
    });

  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('department', 'name');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const searchEmployeesByName = async (req, res) => {
  try {
    const { name } = req.query;

    const query = name
      ? { name: { $regex: new RegExp(name, 'i') } } // case-insensitive
      : {};

    const employees = await Employee.find(query).populate('department', 'name');

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (req.body.role) {
      const user = await User.findOne({ email: employee.email });
      if (user) {
        user.role = req.body.role;
        await user.save();
      }
    }

    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    await Employee.findByIdAndDelete(req.params.id);

    await User.findOneAndDelete({ email: employee.email });

    res.json({ message: 'Employee and associated user credentials deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) return res.status(404).json({ message: 'User not found' });

    const { name, email, position, department, phone, address } = req.body;

    if (name) employee.name = name;
    if (email) employee.email = email;
    if (position) employee.position = position;
    if (department) employee.department = department;
    if (phone) employee.phone = phone;
    if (address) employee.address = address;

    await employee.save();
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateEmployeePassword = async (req, res) => {
  try {
    const employee = await User.findById(req.user._id).select('+password');

    if (!employee || !employee.password) {
      return res.status(404).json({ message: "User or password not found" });
    }

    const isMatch = await bcrypt.compare(req.body.oldPassword, employee.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    employee.password = req.body.newPassword;
    await employee.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDepartmentsForEmployee = async (req, res) => {
  try {
    const departments = await Department.find().select('name');
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};