import React from 'react';
import api from '../api/axios.js';

const logoutUser = async () => {
  try {
    await api.post('/auth/logout', {});
    localStorage.removeItem('token');
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

function Dashboard() {
  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome employee</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;