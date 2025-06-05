import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import fetchAdminDashboard from '../../api/FetchAdminDashboard.js';

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState({ employees: false, others: false });
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await fetchAdminDashboard();
        setDashboardData(data);
      } catch {
        setError('Unable to load dashboard data');
      }
    };
    loadDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (error) return <div className="text-red-600 text-center mt-10">{error}</div>;
  if (!dashboardData) return <div className="text-center mt-10 text-blue-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-800">Admin Dashboard</h1>
        <div className="hidden md:flex space-x-6 items-center font-medium text-sm">
          <NavDropdown
            label="Employees"
            open={dropdown.employees}
            onToggle={() => setDropdown(prev => ({ ...prev, employees: !prev.employees }))}
            links={[
              { to: '/admin/create-employee', label: 'Create Employee' },
              { to: '/admin/employees', label: 'Employee List' }
            ]}
          />
          <NavDropdown
            label="Attendance & Leaves"
            open={dropdown.others}
            onToggle={() => setDropdown(prev => ({ ...prev, others: !prev.others }))}
            links={[
              { to: '/admin/attendance', label: 'Attendance' },
              { to: '/admin/leaves', label: 'Leaves' }
            ]}
          />
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </header>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t shadow px-4 py-3 space-y-2">
          <MobileDropdown
            label="Employees"
            links={[
              { to: '/admin/create-employee', label: 'Create Employee' },
              { to: '/admin/employees', label: 'Employee List' }
            ]}
          />
          <MobileDropdown
            label="Attendance & Leaves"
            links={[
              { to: '/admin/attendance', label: 'Attendance' },
              { to: '/admin/leaves', label: 'Leaves' }
            ]}
          />
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded mt-4"
          >
            Logout
          </button>
        </nav>
      )}

      {/* Main Dashboard */}
      <main className="flex-1 p-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Employees" value={dashboardData.totalEmployees} />
          <StatCard label="Pending Leaves" value={dashboardData.pendingLeaves} />
        </section>

        <Section title="🕒 Recent Attendance">
          {dashboardData.recentAttendance.map((att) => (
            <ListItem
              key={att._id}
              name={att.employee.name}
              email={att.employee.email}
              status={new Date(att.createdAt).toLocaleString()}
              isDate
            />
          ))}
        </Section>

        <Section title="📋 Recent Leave Requests">
          {dashboardData.recentLeaves.map((leave) => (
            <ListItem
              key={leave._id}
              name={leave.employee.name}
              email={leave.employee.email}
              status={leave.status}
            />
          ))}
        </Section>
      </main>
    </div>
  );
}

// Dropdown Menu Component
function NavDropdown({ label, open, onToggle, links }) {
  return (
    <div className="relative group">
      <button
        onClick={onToggle}
        className="flex items-center text-gray-700 hover:text-blue-600 transition"
      >
        {label}
        <FiChevronDown className="ml-1" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white shadow rounded-md w-48 py-2 z-50">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Mobile Dropdown Menu
function MobileDropdown({ label, links }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left font-medium text-gray-700"
      >
        {label} {open ? '−' : '+'}
      </button>
      {open && links.map(link => (
        <Link
          key={link.to}
          to={link.to}
          className="block pl-4 py-1 text-sm text-gray-600 hover:text-blue-600"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

// Dashboard Stat Card
function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition">
      <h3 className="text-sm text-gray-500 mb-1">{label}</h3>
      <p className="text-3xl font-bold text-blue-600">{value}</p>
    </div>
  );
}

// Section Wrapper
function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-blue-800 mb-3">{title}</h2>
      <ul className="bg-white rounded-xl shadow divide-y">{children}</ul>
    </section>
  );
}

// Reusable List Item
function ListItem({ name, email, status, isDate }) {
  const statusClasses = {
    Approved: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Rejected: 'bg-red-100 text-red-700',
  };

  return (
    <li className="p-4 flex justify-between items-center text-sm">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-gray-500">{email}</p>
      </div>
      <span
        className={`px-3 py-1 rounded-full font-medium text-xs ${
          isDate ? 'bg-gray-100 text-gray-600' : statusClasses[status] || 'bg-gray-200 text-gray-700'
        }`}
      >
        {status}
      </span>
    </li>
  );
}

export default AdminDashboard;