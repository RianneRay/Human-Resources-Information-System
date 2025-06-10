import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { FaPen, FaTrash } from 'react-icons/fa';

export default function MyLeave() {
  const [leaves, setLeaves] = useState([]);
  const [editingLeave, setEditingLeave] = useState(null);
  const [formData, setFormData] = useState({ type: '', startDate: '', endDate: '', reason: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await api.get('/leaves/my');
      setLeaves(res.data);
    } catch {
      setError('Failed to load leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leave request?')) return;
    try {
      await api.delete(`/leaves/my/${id}`);
      fetchLeaves();
      setMessage('Leave deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleEditClick = (leave) => {
    setEditingLeave(leave);
    setFormData({
      type: leave.type,
      startDate: leave.startDate?.split('T')[0],
      endDate: leave.endDate?.split('T')[0],
      reason: leave.reason || ''
    });
    setMessage('');
    setError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/leaves/my/${editingLeave._id}`, formData);
      setMessage('Leave updated successfully');
      setEditingLeave(null);
      fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white shadow rounded">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-blue-900 mb-6">📅 My Leave Requests</h1>

      {loading ? (
        <p>Loading...</p>
      ) : leaves.length === 0 ? (
        <p className="text-gray-600">No leave requests found.</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-blue-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Start</th>
                <th className="px-4 py-2 text-left">End</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Reason</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td className="px-4 py-2">{leave.type}</td>
                  <td className="px-4 py-2">{leave.startDate?.split('T')[0]}</td>
                  <td className="px-4 py-2">{leave.endDate?.split('T')[0]}</td>
                  <td className={`px-4 py-2 font-medium ${leave.status === 'Pending' ? 'text-yellow-600' : leave.status === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>
                    {leave.status}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{leave.reason || '-'}</td>
                  <td className="px-4 py-2 text-center space-x-3">
                    {leave.status === 'Pending' && (
                      <>
                        <button onClick={() => handleEditClick(leave)} className="text-blue-600 hover:text-blue-800">
                          <FaPen />
                        </button>
                        <button onClick={() => handleDelete(leave._id)} className="text-red-600 hover:text-red-800">
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Form Modal */}
      {editingLeave && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={() => setEditingLeave(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-blue-800">Edit Leave</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="Vacation">Vacation</option>
                  <option value="Sick">Sick</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </form>
            {message && <p className="text-green-600 mt-3">{message}</p>}
            {error && <p className="text-red-600 mt-3">{error}</p>}
          </div>
        </div>
      )}

      {message && <p className="text-green-600 mt-6">{message}</p>}
      {error && <p className="text-red-600 mt-6">{error}</p>}
    </div>
  );
}