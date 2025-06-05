import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios.js';
import { FaTrash } from 'react-icons/fa';

function formatTime(timeStr) {
  if (!timeStr) return '-';
  const date = new Date(timeStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function AttendanceList() {
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendanceLogs();
  }, []);

  const fetchAttendanceLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/attendance');
      setLogs(res.data);
    } catch (err) {
      setError('Failed to load attendance logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchAttendanceLogs();
      return;
    }

    setLoading(true);
    setError('');
    try {
      const searchRes = await api.get(`/employees/search?name=${encodeURIComponent(searchTerm)}`);
      const employee = searchRes.data?.[0];

      if (!employee) {
        setLogs([]);
        return;
      }

      const logsRes = await api.get(`/attendance/employee/${employee._id}`);
      setLogs(logsRes.data || []);
    } catch {
      setLogs([]);
      setError('Search failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this attendance record?')) return;
    try {
      await api.delete(`/attendance/${id}`);
      setLogs(prev => prev.filter(log => log._id !== id));
    } catch {
      alert('Failed to delete record');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 mt-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-bold text-blue-900 mb-6">🕒 Attendance Management</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by employee name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-72 px-4 py-2 border rounded shadow-sm"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading attendance logs...</p>}
      {!loading && error && <p className="text-red-600">{error}</p>}
      {!loading && logs.length === 0 && !error && (
        <p className="text-gray-500">No attendance logs found.</p>
      )}

      {!loading && logs.length > 0 && (
        <div className="overflow-x-auto border rounded-lg shadow-md">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-blue-100 text-gray-800 uppercase tracking-wide text-xs">
              <tr>
                <th className="px-4 py-3 text-left w-40">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Position</th>
                <th className="px-4 py-3 text-left w-32">Date</th>
                <th className="px-4 py-3 text-left w-32">Clock In</th>
                <th className="px-4 py-3 text-left w-32">Clock Out</th>
                <th className="px-4 py-3 text-center w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{log.employee?.name || '-'}</td>
                  <td className="px-4 py-3 text-gray-700">{log.employee?.email || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{log.employee?.position || '-'}</td>
                  <td className="px-4 py-3">{new Date(log.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {log.clockIn ? (
                      <span className="text-green-600 font-semibold">{formatTime(log.clockIn)}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {log.clockOut ? (
                      <span className="text-red-600 font-semibold">{formatTime(log.clockOut)}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(log._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Record"
                    >
                      <FaTrash />
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

export default AttendanceList;