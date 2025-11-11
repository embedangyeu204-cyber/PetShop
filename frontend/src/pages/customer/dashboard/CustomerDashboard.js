import React from 'react';
import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import { LuBell, LuCalendarDays, LuCircleHelp, LuLayoutGrid, LuLogOut, LuMessageCircle, LuMessageSquare, LuUsers } from 'react-icons/lu';
import './CustomerDashboard.css';
import { useAuth } from '../../../context/AuthContext';

import Overview from './Overview';
import ManageProfile from './ManageProfile';
import Appointments from './Appointments';
import Chat from './Chat';
import Feedback from './Feedback';
import Notifications from './Notifications';
import HelpCenter from './HelpCenter';

const formatRoleLabel = (role) => {
  if (!role) return 'Customer';
  const value = role.toLowerCase();
  if (value === 'veterinary' || value === 'veterinarian') return 'Veterinarian';
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const formatName = (user) => {
  if (!user) return 'Jane Doe';
  if (user.fullName) return user.fullName;
  const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  if (name) return name;
  return user.email || 'Jane Doe';
};

function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/customer-login', { replace: true });
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">

        <div className="user-profile">
          <div className="user-avatar">
            <img
              src={`https://i.pravatar.cc/80?u=${encodeURIComponent(formatName(user))}`}
              alt={formatName(user)}
            />
          </div>
          <div className="user-info">
            <div className="user-name">{formatName(user)}</div>
            <div className="user-role">{formatRoleLabel(user?.role)}</div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="section-title">Dashboard</div>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
          >
            <LuLayoutGrid className="sidebar-item-icon" aria-hidden="true" />
            <span>Overview</span>
          </NavLink>
        </div>

        <div className="sidebar-section">
          <div className="section-title">Customer Functions</div>

          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
          >
            <LuUsers className="sidebar-item-icon" aria-hidden="true" />
            <span>Manage personal &amp; pet profiles</span>
          </NavLink>

          <NavLink
            to="/dashboard/appointments"
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
          >
            <LuCalendarDays className="sidebar-item-icon" aria-hidden="true" />
            <span>Book service appointments</span>
          </NavLink>

          <NavLink
            to="/dashboard/chat"
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
          >
            <LuMessageCircle className="sidebar-item-icon" aria-hidden="true" />
            <span>Chat</span>
            <span className="badge">3</span>
          </NavLink>

          <NavLink
            to="/dashboard/feedback"
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
          >
            <LuMessageSquare className="sidebar-item-icon" aria-hidden="true" />
            <span>Feedback &amp; complaints</span>
          </NavLink>

          <NavLink
            to="/dashboard/notifications"
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
          >
            <LuBell className="sidebar-item-icon" aria-hidden="true" />
            <span>Notifications</span>
          </NavLink>
        </div>

        <div className="sidebar-section">
          <div className="section-title">Support</div>

          <NavLink
            to="/dashboard/help"
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
          >
            <LuCircleHelp className="sidebar-item-icon" aria-hidden="true" />
            <span>Help Center</span>
          </NavLink>
        </div>

        <button onClick={handleLogout} className="sidebar-item logout">
          <LuLogOut className="sidebar-item-icon" aria-hidden="true" />
          <span>Logout</span>
        </button>
      </aside>

      <main className="dashboard-main">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/profile" element={<ManageProfile />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/help" element={<HelpCenter />} />
        </Routes>
      </main>
    </div>
  );
}

export default CustomerDashboard;
