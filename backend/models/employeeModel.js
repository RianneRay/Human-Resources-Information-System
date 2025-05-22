import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
//  password: { type: String, required: true }, // Add this field
  position: { type: String, required: true },
  department: { type: String },
  phone: { type: String },
  address: { type: String },
  avatar: { type: String },
  role: { type: String, enum: ['employee', 'admin'], default: 'employee' },
  hireDate: { type: Date, default: Date.now },
  status: { type: String, default: 'active' }
}, {
  timestamps: true
});

// Auto-hash password before saving
employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords (use in login)
employeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('Employee', employeeSchema);