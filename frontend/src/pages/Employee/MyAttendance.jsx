import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function MyAttendance() {
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendanceLogs();
  }, []);

  const fetchAttendanceLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/attendance/me');
      setLogs(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load attendance logs.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    return dateString ? new Date(dateString).toLocaleTimeString() : '–';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8 bg-white rounded-lg shadow">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-blue-900 mb-4">📅 My Attendance Logs</h1>

      {loading && <p className="text-gray-600">Loading logs...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && logs.length === 0 && (
        <p className="text-gray-500">You have no recent attendance records.</p>
      )}

      {!loading && !error && logs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm border rounded shadow">
            <thead className="bg-blue-100 text-gray-800 uppercase tracking-wide text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Clock In</th>
                <th className="px-4 py-3 text-left">Clock Out</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{formatDate(log.date)}</td>
                  <td className="px-4 py-3 text-green-700">{formatTime(log.clockIn)}</td>
                  <td className="px-4 py-3 text-red-700">{formatTime(log.clockOut)}</td>
                  <td className="px-4 py-3">
                    {log.clockIn && log.clockOut ? (
                      <span className="text-green-600 font-semibold">Complete</span>
                    ) : log.clockIn ? (
                      <span className="text-yellow-600 font-semibold">Pending Clock-Out</span>
                    ) : (
                      <span className="text-gray-600 italic">No Record</span>
                    )}
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