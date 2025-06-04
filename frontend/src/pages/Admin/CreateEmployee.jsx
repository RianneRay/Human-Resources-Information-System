import { useNavigate } from 'react-router-dom';
import EmployeeForm from '../../components/EmployeeForm.jsx';
import api from '../../api/axios.js';

function CreateEmployee() {
  const navigate = useNavigate();

  const handleSubmit = async (formData, setMessage, setError, resetForm) => {
    try {
      const res = await api.post('/employees', formData);

      if (res.status === 201 && res.data) {
        const msg = res.data.message || 'Employee created successfully';
        setMessage(msg);
        resetForm();
      } else {
        setError(res.data?.error || 'Unexpected server response');
      }
    } catch (err) {
      const backendMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong';

      setError(`Create employee failed: ${backendMsg}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-800 text-center">
        Create New Employee
      </h1>
      <EmployeeForm onSubmit={handleSubmit} onCancel={() => navigate('/admindashboard')} />
    </div>
  );
}

export default CreateEmployee;