import api from './axios';

// Get all leave requests (admin only)
export const getAllLeaves = async () => {
  const res = await api.get('/leaves');
  return res.data;
};

// Update leave status (Approve/Reject)
export const updateLeaveStatus = async (id, status) => {
  const res = await api.put(`/leaves/${id}`, { status });
  return res.data;
};

// Delete a leave request
export const deleteLeaveRequest = async (id) => {
  const res = await api.delete(`/leaves/${id}`);
  return res.data;
};