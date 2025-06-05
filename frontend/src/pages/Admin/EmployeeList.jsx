import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios.js';
import EmployeeForm from '../../components/EmployeeForm.jsx';
import { FaPen, FaTrash } from 'react-icons/fa';

function EmployeeList() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() === '') {
        fetchEmployees();
      } else {
        searchEmployees(searchTerm);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch {
      setError('Failed to load employees.');
    } finally {
      setLoading(false);
    }
  };

  const searchEmployees = async (name) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/employees/search?name=${encodeURIComponent(name)}`);
      setEmployees(res.data);
    } catch {
      setError('Failed to search employees.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedData, setMessage, setError, resetForm) => {
    try {
      await api.put(`/employees/${editingEmployee._id}`, updatedData);
      setMessage('Employee updated successfully');
      resetForm();
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch {
      alert('Failed to delete employee');
    }
  };

  const openEditForm = (emp) => {
    setEditingEmployee(emp);
    setFormMessage('');
    setFormError('');
  };

  const closeEditForm = () => {
    setEditingEmployee(null);
    setFormMessage('');
    setFormError('');
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

      <h1 className="text-4xl font-bold text-blue-900 mb-6">👥 Employee Directory</h1>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search employee by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 border rounded shadow-sm"
        />
      </div>

      {loading && <p className="text-gray-600">Loading employees...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && employees.length === 0 && (
        <p className="text-gray-500">No employees found.</p>
      )}

      {!loading && !error && employees.length > 0 && !editingEmployee && (
        <div className="overflow-x-auto border rounded-lg shadow">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-blue-100 text-gray-800 uppercase tracking-wide text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Position</th>
                <th className="px-4 py-3 text-left">Department</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {employees.map((emp) => (
                <tr key={emp._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{emp.name}</td>
                  <td className="px-4 py-3 text-gray-700">{emp.email}</td>
                  <td className="px-4 py-3">{emp.phone || '-'}</td>
                  <td className="px-4 py-3">{emp.position || '-'}</td>
                  <td className="px-4 py-3">{emp.department?.name || 'Unassigned'}</td>
                  <td className="px-4 py-3 capitalize">{emp.role || '-'}</td>
                  <td className="px-4 py-3 text-center space-x-4">
                    <button
                      onClick={() => openEditForm(emp)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FaPen />
                    </button>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
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

      {/* Edit Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 overflow-y-auto">
          <div className="min-h-screen flex items-start justify-center p-6">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
              <button
                onClick={closeEditForm}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-xl"
              >
                ×
              </button>

              <h2 className="text-2xl font-bold mb-4 text-blue-800">✏️ Edit Employee</h2>

              <EmployeeForm
                initialData={editingEmployee}
                onSubmit={handleUpdate}
                onCancel={closeEditForm}
              />

              {formMessage && <p className="mt-4 text-green-600">{formMessage}</p>}
              {formError && <p className="mt-4 text-red-600">{formError}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;