import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import {
  getAllLeaves,
  updateLeaveStatus,
  deleteLeaveRequest
} from '../../api/leave';

function LeaveManagement() {
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaves = async () => {
    try {
      const data = await getAllLeaves();
      setLeaves(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching leaves:', err);
      setError('Failed to load leave requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateLeaveStatus(id, newStatus);
      fetchLeaves();
    } catch {
      alert('Error updating leave status.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      try {
        await deleteLeaveRequest(id);
        fetchLeaves();
      } catch {
        alert('Failed to delete leave request.');
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading leave requests...</div>;
  if (error) return <div className="text-red-600 text-center mt-10">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8 bg-white rounded-xl shadow-md">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Leave Management</h1>

      {leaves.length === 0 ? (
        <p className="text-gray-600 text-center">No leave requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-blue-50 text-gray-700 text-left">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Start</th>
                <th className="px-4 py-3">End</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {leaves.map((leave) => (
                <tr key={leave._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{leave.employee.name}</td>
                  <td className="px-4 py-3">{leave.type}</td>
                  <td className="px-4 py-3">{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{leave.reason || '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        leave.status === 'Approved'
                          ? 'bg-green-100 text-green-700'
                          : leave.status === 'Rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    {leave.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(leave._id, 'Approved')}
                          title="Approve"
                          className="text-green-600 hover:text-green-800"
                        >
                          <FiCheck size={18} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(leave._id, 'Rejected')}
                          title="Reject"
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <FiX size={18} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(leave._id)}
                      title="Delete"
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LeaveManagement;