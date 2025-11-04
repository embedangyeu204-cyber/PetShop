import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';

// Import các sub-pages
import Overview from './Overview';
import ManageProfile from './ManageProfile';
import Appointments from './Appointments';
import Chat from './Chat';
import Feedback from './Feedback';
import Notifications from './Notifications';
import HelpCenter from './HelpCenter';

function CustomerDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Jane Doe';
  const userRole = localStorage.getItem('role') || 'Customer';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/customer-login');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <i className="fa-solid fa-paw"></i>
            <span>Shop Pet</span>
          </Link>
        </div>

        <div className="user-profile">
          <div className="user-avatar">
            <i className="fa-solid fa-user-circle"></i>
          </div>
          <div className="user-info">
            <div className="user-name">{userName}</div>
            <div className="user-role">{userRole}</div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="section-title">Dashboard</div>
          <Link to="/dashboard" className="sidebar-item">
            <i className="fa-solid fa-table-columns"></i>
            <span>Overview</span>
          </Link>
        </div>

        <div className="sidebar-section">
          <div className="section-title">Customer Functions</div>
          
          <Link to="/dashboard/profile" className="sidebar-item">
            <i className="fa-solid fa-user"></i>
            <span>Manage personal & pet profiles</span>
          </Link>

          <Link to="/dashboard/appointments" className="sidebar-item">
            <i className="fa-solid fa-calendar"></i>
            <span>Book service appointments</span>
          </Link>

          <Link to="/dashboard/chat" className="sidebar-item">
            <i className="fa-solid fa-message"></i>
            <span>Chat</span>
            <span className="badge">3</span>
          </Link>

          <Link to="/dashboard/feedback" className="sidebar-item">
            <i className="fa-solid fa-comment"></i>
            <span>Feedback & complaints</span>
          </Link>

          <Link to="/dashboard/notifications" className="sidebar-item">
            <i className="fa-solid fa-bell"></i>
            <span>Notifications</span>
          </Link>
        </div>

        <div className="sidebar-section">
          <div className="section-title">Support</div>
          
          <Link to="/dashboard/help" className="sidebar-item">
            <i className="fa-solid fa-circle-question"></i>
            <span>Help Center</span>
          </Link>
        </div>

        <button onClick={handleLogout} className="sidebar-item logout">
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
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
