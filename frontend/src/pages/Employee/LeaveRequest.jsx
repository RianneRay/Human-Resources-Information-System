import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function LeaveRequest() {
  const navigate = useNavigate();

  const [type, setType] = useState('Vacation');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');
    setLoading(true);

    try {
      await api.post('/leaves', { type, startDate, endDate, reason });
      setMessage('✅ Leave request submitted successfully.');
      setType('Vacation');
      setStartDate('');
      setEndDate('');
      setReason('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
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

      <h1 className="text-3xl font-bold text-blue-900 mb-4">📄 Leave Request</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Leave Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="Vacation">Vacation</option>
            <option value="Sick">Sick</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Reason (optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border rounded"
            placeholder="Optional details for your request..."
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>

        {/* Message */}
        {message && <p className="text-green-600 font-medium">{message}</p>}
        {error && <p className="text-red-600 font-medium">{error}</p>}
      </form>
    </div>
  );
}