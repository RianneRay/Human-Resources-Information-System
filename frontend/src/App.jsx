import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import CreateEmployee from './pages/Admin/CreateEmployee.jsx';
import EmployeeList from './pages/Admin/EmployeeList.jsx';
import Attendance from './pages/Admin/Attendance.jsx';
import LeaveManagement from './pages/Admin/LeaveManagement.jsx';
import EmployeeDashboard from './pages/Employee/EmployeeDashboard.jsx';
import EditProfile from './pages/Employee/Profile.jsx'; // make sure the file is named Profile.jsx
import Clock from './pages/Employee/Clock.jsx';
import MyAttendance from './pages/Employee/MyAttendance.jsx';
import RequestLeave from './pages/Employee/LeaveRequest.jsx';
import MyLeaves from './pages/Employee/MyLeave.jsx';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>

        {/* Default route */}
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/employeedashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-employee"
          element={
            <ProtectedRoute>
              <CreateEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute>
              <EmployeeList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leaves"
          element={
            <ProtectedRoute>
              <LeaveManagement />
            </ProtectedRoute>
          }
        />

        {/* Employee routes */}
        <Route
          path="/employeedashboard"
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/clock"
          element={
            <ProtectedRoute>
              <Clock />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/attendance"
          element={
            <ProtectedRoute>
              <MyAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/leaves/request"
          element={
            <ProtectedRoute>
              <RequestLeave />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/leaves/my"
          element={
            <ProtectedRoute>
              <MyLeaves />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;