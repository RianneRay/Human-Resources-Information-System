import React from 'react';
import api from '../api/axios.js';
import { useEffect, useState } from 'react';
import fetchAdminDashboard from '../api/FetchAdminDashboard.js';

const logoutUser = async () => {
  try {
    await api.post('/auth/logout', {});
    localStorage.removeItem('token');
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await fetchAdminDashboard();
        setDashboardData(data);
      } catch (err) {
        setError('Unable to load dashboard data');
      }
    };
    loadDashboard();
  }, []);

  if (error)
    return (
      <div className="text-red-600 text-center mt-10 font-semibold">{error}</div>
    );
  if (!dashboardData)
    return (
      <div className="text-gray-600 text-center mt-10 font-medium">Loading...</div>
    );

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded shadow transition"
          >
            Logout
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Total Employees</h2>
            <p className="text-3xl font-bold text-gray-800">
              {dashboardData.totalEmployees}
            </p>
          </div>

          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Pending Leaves</h2>
            <p className="text-3xl font-bold text-gray-800">
              {dashboardData.pendingLeaves}
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Recent Leaves
          </h2>
          <ul className="bg-white rounded shadow divide-y divide-gray-200">
            {dashboardData.recentLeaves?.map((leave) => (
              <li
                key={leave._id}
                className="p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-900">{leave.employee.name}</p>
                  <p className="text-sm text-gray-500">{leave.employee.email}</p>
                </div>
                <span
                  className={`font-semibold px-3 py-1 rounded-full text-sm
                    ${
                      leave.status === 'Approved'
                        ? 'bg-green-100 text-green-700'
                        : leave.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                >
                  {leave.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Recent Attendance
          </h2>
          <ul className="bg-white rounded shadow divide-y divide-gray-200">
            {dashboardData.recentAttendance?.map((att) => (
              <li
                key={att._id}
                className="p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-900">{att.employee.name}</p>
                  <p className="text-sm text-gray-500">{att.employee.email}</p>
                </div>
                <span className="text-sm text-gray-600">
                  {new Date(att.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;