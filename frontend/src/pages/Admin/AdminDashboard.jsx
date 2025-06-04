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
  if (!dashboardData) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Admin Dashboard</h1>
        <div className="hidden md:flex space-x-6 items-center text-sm font-medium">
          <NavDropdown
            label="Employees"
            open={dropdown.employees}
            onToggle={() =>
              setDropdown({ ...dropdown, employees: !dropdown.employees })
            }
            links={[
              { to: '/admin/create-employee', label: 'Create Employee' },
              { to: '/admin/employees', label: 'Employee List' },
            ]}
          />
          <NavDropdown
            label="Attendance & Leaves"
            open={dropdown.others}
            onToggle={() =>
              setDropdown({ ...dropdown, others: !dropdown.others })
            }
            links={[
              { to: '/admin/attendance', label: 'Attendance' },
              { to: '/admin/leaves', label: 'Leaves' },
            ]}
          />
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </header>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white shadow-md p-4 space-y-2 text-sm">
          <MobileDropdown
            label="Employees"
            links={[
              { to: '/admin/create-employee', label: 'Create Employee' },
              { to: '/admin/employees', label: 'Employee List' },
            ]}
          />
          <MobileDropdown
            label="Attendance & Leaves"
            links={[
              { to: '/admin/attendance', label: 'Attendance' },
              { to: '/admin/leaves', label: 'Leaves' },
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

      {/* Main Content */}
      <main className="flex-1 p-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Employees" value={dashboardData.totalEmployees} />
          <StatCard label="Pending Leaves" value={dashboardData.pendingLeaves} />
        </section>

        <Section title="Recent Leaves">
          {dashboardData.recentLeaves.map((leave) => (
            <ListItem
              key={leave._id}
              name={leave.employee.name}
              email={leave.employee.email}
              status={leave.status}
            />
          ))}
        </Section>

        <Section title="Recent Attendance">
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
      </main>
    </div>
  );
}

function NavDropdown({ label, open, onToggle, links }) {
  return (
    <div className="relative group">
      <button
        onClick={onToggle}
        className="flex items-center text-gray-700 hover:text-blue-600"
      >
        {label}
        <FiChevronDown className="ml-1" />
      </button>
      {open && (
        <div className="absolute mt-2 bg-white shadow-lg rounded w-48 py-2 z-10">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-4 py-2 text-gray-700 hover:bg-blue-100"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileDropdown({ label, links }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left font-semibold text-gray-700"
      >
        {label} {open ? '−' : '+'}
      </button>
      {open &&
        links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="block pl-4 py-1 text-gray-600 hover:text-blue-600"
          >
            {link.label}
          </Link>
        ))}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
      <h2 className="text-lg font-semibold text-gray-700 mb-1">{label}</h2>
      <p className="text-3xl font-bold text-blue-600">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ul className="bg-white rounded-xl shadow divide-y">{children}</ul>
    </section>
  );
}

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
        className={`px-3 py-1 rounded-full font-medium ${
          isDate ? 'text-gray-600 bg-gray-100' : statusClasses[status] || 'bg-gray-200 text-gray-700'
        }`}
      >
        {status}
      </span>
    </li>
  );
}

export default AdminDashboard;