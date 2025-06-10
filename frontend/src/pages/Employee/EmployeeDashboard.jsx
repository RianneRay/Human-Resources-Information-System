import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown, FiBell } from 'react-icons/fi';
import api from '../../api/axios.js';

function EmployeeDashboard() {
  const [data, setData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard/employee');
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchDashboard();
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNotifClick = async () => {
    setNotifOpen(!notifOpen);
    try {
      await Promise.all(
        notifications
          .filter((n) => !n.read)
          .map((n) => api.put(`/notifications/${n._id}/read`))
      );
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
    }
  };

  if (error)
    return <div className="text-red-600 text-center mt-10">{error}</div>;
  if (!data)
    return <div className="text-center mt-10 text-blue-600">Loading...</div>;

  const { profile, leaveStatus, attendanceLogs } = data;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow px-4 sm:px-6 py-4 flex justify-between items-center relative">
        <h1 className="text-2xl font-bold text-blue-800">Employee Dashboard</h1>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button onClick={handleNotifClick} className="relative text-gray-600 hover:text-blue-600 focus:outline-none">
              <FiBell size={22} />
              {notifications.some(n => !n.read) && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white shadow rounded-md z-50 max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n._id} className={`p-3 border-b text-sm ${n.read ? 'text-gray-500' : 'text-black font-medium'}`}>
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4 text-sm font-medium">
            <NavDropdown
              label="Profile"
              open={activeDropdown === 'profile'}
              onToggle={() => setActiveDropdown(activeDropdown === 'profile' ? null : 'profile')}
              links={[{ to: '/employee/profile', label: 'Edit Profile' }]}
            />
            <NavDropdown
              label="Attendance"
              open={activeDropdown === 'attendance'}
              onToggle={() => setActiveDropdown(activeDropdown === 'attendance' ? null : 'attendance')}
              links={[
                { to: '/employee/clock', label: 'Clock In/Out' },
                { to: '/employee/attendance', label: 'My Attendance' },
              ]}
            />
            <NavDropdown
              label="Leaves"
              open={activeDropdown === 'leaves'}
              onToggle={() => setActiveDropdown(activeDropdown === 'leaves' ? null : 'leaves')}
              links={[
                { to: '/employee/leaves/request', label: 'Request Leave' },
                { to: '/employee/leaves/my', label: 'My Leaves' },
              ]}
            />
            <span className="text-gray-600">{profile.name}</span>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded">
              Logout
            </button>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t shadow px-4 py-3 space-y-2">
          <MobileDropdown label="Profile" links={[{ to: '/employee/profile', label: 'Edit Profile' }]} />
          <MobileDropdown
            label="Attendance"
            links={[
              { to: '/employee/clock', label: 'Clock In/Out' },
              { to: '/employee/attendance', label: 'My Attendance' },
            ]}
          />
          <MobileDropdown
            label="Leaves"
            links={[
              { to: '/employee/leaves/request', label: 'Request Leave' },
              { to: '/employee/leaves/my', label: 'My Leaves' },
            ]}
          />
          <div className="text-gray-600">{profile.name}</div>
          <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded mt-4">
            Logout
          </button>
        </nav>
      )}

      {/* Main */}
      <main className="flex-1 p-4 sm:p-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard label="Position" value={profile.position} />
          <StatCard label="Email" value={profile.email} />
          <StatCard label="Phone" value={profile.phone} />
        </section>

        <Section title="📋 Recent Leave Requests">
          {leaveStatus.length > 0 ? (
            leaveStatus.map((leave) => (
              <ListItem
                key={leave._id}
                name={leave.type}
                email={`${new Date(leave.startDate).toLocaleDateString()} → ${new Date(leave.endDate).toLocaleDateString()}`}
                status={leave.status}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500 p-4">No recent leave requests.</p>
          )}
        </Section>

        <Section title="🕒 Recent Attendance Logs">
          {attendanceLogs.length > 0 ? (
            attendanceLogs.map((log) => (
              <ListItem
                key={log._id}
                name={new Date(log.date).toLocaleDateString()}
                email={`Clock In: ${new Date(log.clockIn).toLocaleTimeString()}`}
                status={log.clockOut ? `Out: ${new Date(log.clockOut).toLocaleTimeString()}` : 'Still In'}
                isDate
              />
            ))
          ) : (
            <p className="text-sm text-gray-500 p-4">No recent attendance logs.</p>
          )}
        </Section>
      </main>
    </div>
  );
}

// Dropdown
function NavDropdown({ label, open, onToggle, links }) {
  return (
    <div className="relative group">
      <button onClick={onToggle} className="flex items-center text-gray-700 hover:text-blue-600 transition">
        {label}
        <FiChevronDown className="ml-1" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white shadow rounded-md w-48 py-2 z-50">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100">
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Mobile Dropdown
function MobileDropdown({ label, links }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="w-full text-left font-medium text-gray-700">
        {label} {open ? '−' : '+'}
      </button>
      {open &&
        links.map((link) => (
          <Link key={link.to} to={link.to} className="block pl-4 py-1 text-sm text-gray-600 hover:text-blue-600">
            {link.label}
          </Link>
        ))}
    </div>
  );
}

// Stat Card
function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition">
      <h3 className="text-sm text-gray-500 mb-1">{label}</h3>
      <p className="text-lg font-semibold text-blue-600">{value}</p>
    </div>
  );
}

// Section
function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-blue-800 mb-3">{title}</h2>
      <ul className="bg-white rounded-xl shadow divide-y">{children}</ul>
    </section>
  );
}

// List Item
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

export default EmployeeDashboard;