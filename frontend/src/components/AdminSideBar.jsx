import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const logoutUser = async (navigate) => {
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    navigate('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-white shadow-lg h-screen p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6 text-blue-600">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <Link to="home" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
          <Link to="create-employee" className="text-gray-700 hover:text-blue-600">Create Employee</Link>
          <Link to="employee-list" className="text-gray-700 hover:text-blue-600">Employee List</Link>
          <Link to="attendance" className="text-gray-700 hover:text-blue-600">Attendance</Link>
          <Link to="leave-management" className="text-gray-700 hover:text-blue-600">Leave Management</Link>
        </nav>
      </div>
      <button
        onClick={() => logoutUser(navigate)}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

export default AdminSidebar;