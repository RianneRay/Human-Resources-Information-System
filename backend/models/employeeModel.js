import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position: { type: String, required: true },
  department: { type: String },
  hireDate: { type: Date, default: Date.now },
  status: { type: String, default: "active" },
}, {
  timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;