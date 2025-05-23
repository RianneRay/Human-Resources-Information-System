import Employee from '../models/employeeModel.js';
import User from '../models/User.js';

export const createEmployee = async (req, res) => {
  try {
    const { name, email, position, department, role, password } = req.body;

    // Check if email already used by a user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Create Employee record
    const employee = new Employee({ name, email, position, department });
    await employee.save();

    // Create User record (with default role as 'employee' if not given)
    const user = new User({
      name,
      email,
      password, // This will be hashed by the pre-save middleware in userSchema
      role: role || 'employee'
    });
    await user.save();

    res.status(201).json({
      message: 'Employee and login credentials created successfully',
      employee
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
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

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Also update user role if role is changed
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
    // Find the employee first
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Delete the employee record
    await Employee.findByIdAndDelete(req.params.id);

    // Also delete the corresponding user (by email match)
    await User.findOneAndDelete({ email: employee.email });

    res.json({ message: 'Employee and associated user credentials deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update basic info
export const updateEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user._id);
    if (!employee) return res.status(404).json({ message: 'User not found' });

    const { name, phone, address, department } = req.body;
    if (name) employee.name = name;
    if (phone) employee.phone = phone;
    if (address) employee.address = address;
    if (department) employee.department = department;

    await employee.save();
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update password
export const updateEmployeePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const employee = await Employee.findById(req.user._id);
    if (!employee) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, employee.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });

    employee.password = await bcrypt.hash(newPassword, 10);
    await employee.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};