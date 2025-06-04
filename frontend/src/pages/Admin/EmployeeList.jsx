import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import EmployeeForm from '../../components/EmployeeForm.jsx';
import { FaPen, FaTrash } from 'react-icons/fa';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
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
  }

  async function handleUpdate(updatedData) {
    setFormMessage('');
    setFormError('');
    try {
      await api.put(`/employees/${editingEmployee._id}`, updatedData);
      setFormMessage('Employee updated successfully');
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Update failed');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch {
      alert('Failed to delete employee');
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Employee Directory</h1>

      {loading && <p className="text-gray-600">Loading employees...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && employees.length === 0 && (
        <p className="text-gray-500">No employees found.</p>
      )}

      {!loading && !error && employees.length > 0 && !editingEmployee && (
        <div className="overflow-x-auto shadow rounded border">
          <table className="min-w-full table-auto">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Position</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {employees.map(emp => (
                <tr key={emp._id}>
                  <td className="px-4 py-2">{emp.name}</td>
                  <td className="px-4 py-2">{emp.email}</td>
                  <td className="px-4 py-2">{emp.phone || '-'}</td>
                  <td className="px-4 py-2">{emp.position || '-'}</td>
                  <td className="px-4 py-2">{emp.department?.name || 'Unassigned'}</td>
                  <td className="px-4 py-2 capitalize">{emp.role || '-'}</td>
                  <td className="px-4 py-2 text-center space-x-4">
                    <button
                      onClick={() => setEditingEmployee(emp)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                      aria-label="Edit Employee"
                    >
                      <FaPen />
                    </button>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                      aria-label="Delete Employee"
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

      {/* Edit form modal */}
      {editingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-10 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
            <button
              onClick={() => setEditingEmployee(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-xl"
              aria-label="Close edit form"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-4 text-blue-800">Update Employee</h2>

            <EmployeeForm
              initialData={editingEmployee}
              submitLabel="Update Employee"
              onSubmit={handleUpdate}
              onCancel={() => setEditingEmployee(null)}
            />

            {formMessage && <p className="mt-4 text-green-600">{formMessage}</p>}
            {formError && <p className="mt-4 text-red-600">{formError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;