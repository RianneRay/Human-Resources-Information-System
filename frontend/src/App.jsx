import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import CreateEmployee from './pages/Admin/CreateEmployee.jsx';
import EmployeeList from './pages/Admin/EmployeeList.jsx';
import Attendance from './pages/Admin/Attendance.jsx';
import LeaveManagement from './pages/Admin/LeaveManagement.jsx';
import EmployeeDashboard from './pages/EmployeeDashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Flat admin routes */}
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-employee" element={<CreateEmployee />} />
        <Route path="/admin/employees" element={<EmployeeList />} />
        <Route path="/admin/attendance" element={<Attendance />} />
        <Route path="/admin/leaves" element={<LeaveManagement />} />
        
        {/* employee routes */}
        <Route path="/employeedashboard" element={<EmployeeDashboard />} />
        
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;