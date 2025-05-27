import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const employeeSchema = new mongoose.Schema({
  employeeID: { type: Number, unique: true},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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

employeeSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'employeeID' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.employeeID = counter.seq;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

export default mongoose.model('Employee', employeeSchema);