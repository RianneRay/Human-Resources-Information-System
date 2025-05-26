import Employee from '../models/employeeModel.js';
import Department from '../models/departmentModel.js';

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('department', 'name');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['employee', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const updated = await Employee.findByIdAndUpdate(id, { role }, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    const dept = new Department({ name, description });
    await dept.save();
    res.status(201).json(dept);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const listDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};