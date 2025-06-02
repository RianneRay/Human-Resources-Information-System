import api from './axios.js';

const fetchAdminDashboard = async () => {
  try {
    const response = await api.get('/dashboard/admin');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch admin dashboard:', error);
    throw error;
  }
};

export default fetchAdminDashboard;