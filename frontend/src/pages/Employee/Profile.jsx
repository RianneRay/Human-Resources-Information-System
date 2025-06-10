import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function Profile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    department: '',
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const [profileRes, deptRes] = await Promise.all([
          api.get('/employees/profile'),
          api.get('/employees/department'),
        ]);

        const profile = profileRes.data;

        setFormData({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
          position: profile.position || '',
          department: profile.department?._id || '',
        });

        setDepartments(deptRes.data || []);
        setLoading(false);
      } catch (err) {
        setProfileError('Failed to load profile');
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.put('/employees/profile/update', formData);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.put('/employees/profile/password', passwordForm);
      setMessage('Password updated successfully.');
      setPasswordForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
    }
  };

  if (loading) return <div className="p-6 text-lg">Loading...</div>;
  if (profileError) return <div className="p-6 text-red-600">{profileError}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white shadow rounded-lg">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-blue-900 mb-6">👤 My Profile</h1>

      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full p-2 border rounded shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded shadow-sm bg-white"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">
          Update Profile
        </button>
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </form>

      <hr className="my-10" />

      <h2 className="text-2xl font-bold text-blue-800 mb-4">🔒 Change Password</h2>

      <form onSubmit={handlePasswordChange} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Old Password</label>
          <input
            type="password"
            name="oldPassword"
            value={passwordForm.oldPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({ ...prev, oldPassword: e.target.value }))
            }
            required
            className="w-full p-2 border rounded shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
            }
            required
            className="w-full p-2 border rounded shadow-sm"
          />
        </div>
        <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Update Password
        </button>
      </form>
    </div>
  );
}