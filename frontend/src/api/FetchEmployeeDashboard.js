const fetchEmployeeDashboard = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch('http://your-api-url.com/api/employee/dashboard', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch employee dashboard');
  }

  return await res.json();
};

export default fetchEmployeeDashboard;