import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Clock() {
  const navigate = useNavigate();

  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [hasClockedIn, setHasClockedIn] = useState(false);
  const [hasClockedOut, setHasClockedOut] = useState(false);

  // Real-time clock
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClockIn = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await api.post('/attendance/clockin');
      setMessage('✅ Clock-in successful!');
      setHasClockedIn(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clock in.');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await api.post('/attendance/clockout');
      setMessage('✅ Clock-out successful!');
      setHasClockedOut(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clock out.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-8 bg-white rounded-lg shadow">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-blue-900 mb-4">⏰ Attendance Clock</h1>

      <div className="text-center text-4xl font-mono text-gray-800 mb-6">
        {time.toLocaleTimeString()}
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
        <button
          onClick={handleClockIn}
          disabled={loading || hasClockedIn}
          className={`px-6 py-2 rounded text-white ${
            hasClockedIn ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          Clock In
        </button>

        <button
          onClick={handleClockOut}
          disabled={loading || hasClockedOut}
          className={`px-6 py-2 rounded text-white ${
            hasClockedOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          Clock Out
        </button>
      </div>

      {message && <p className="text-green-600 mt-2 text-center">{message}</p>}
      {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
    </div>
  );
}