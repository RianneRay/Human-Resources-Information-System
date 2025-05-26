import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position: { type: String, required: true },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: false
  },
  phone: { type: String },
  address: { type: String },
  avatar: { type: String },
  role: { type: String, enum: ['employee', 'admin'], default: 'employee' },
  hireDate: { type: Date, default: Date.now },
  status: { type: String, default: 'active' }
}, {
  timestamps: true
});

export default mongoose.model('Employee', employeeSchema);