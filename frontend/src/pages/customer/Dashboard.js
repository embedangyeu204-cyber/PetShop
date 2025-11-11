import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const NAV_ITEMS = [
  {
    key: 'overview',
    section: 'Dashboard',
    label: 'Overview',
    icon: 'fa-table-columns',
  },
  {
    key: 'profile',
    section: 'Customer Functions',
    label: 'Manage personal & pet profiles',
    icon: 'fa-user-group',
  },
  {
    key: 'booking',
    section: 'Customer Functions',
    label: 'Book service appointments',
    icon: 'fa-calendar-days',
  },
  {
    key: 'chat',
    section: 'Customer Functions',
    label: 'Chat',
    icon: 'fa-comment-dots',
    badge: 3,
  },
  {
    key: 'feedback',
    section: 'Customer Functions',
    label: 'Feedback & complaints',
    icon: 'fa-comments',
  },
  {
    key: 'notifications',
    section: 'Customer Functions',
    label: 'Notifications',
    icon: 'fa-bell',
  },
  {
    key: 'support',
    section: 'Support',
    label: 'Help Center',
    icon: 'fa-circle-question',
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(userData);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!user) return null;

  const renderNavSection = (section) => {
    const items = NAV_ITEMS.filter((item) => item.section === section);
    return (
      <div className="nav-section" key={section}>
        <h4>{section}</h4>
        {items.map((item) => (
          <button
            key={item.key}
            className={`nav-item ${activeTab === item.key ? 'active' : ''}`}
            onClick={() => setActiveTab(item.key)}
          >
            <i className={`fa-solid ${item.icon} nav-item-icon`} aria-hidden="true" />
            <span>{item.label}</span>
            {item.badge && <span className="badge">{item.badge}</span>}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <div className="user-profile">
            <div className="user-avatar">
              <img
                src={`https://i.pravatar.cc/80?u=${encodeURIComponent(user.name || 'customer')}`}
                alt={user.name || 'Customer'}
              />
            </div>
            <div className="user-info">
              <h3>{user.name || 'Jane Doe'}</h3>
              <p>Customer</p>
            </div>
          </div>

          <nav className="dashboard-nav">
            {['Dashboard', 'Customer Functions', 'Support'].map((section) => renderNavSection(section))}
            <button className="nav-item logout" onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket nav-item-icon" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        <main className="dashboard-main">
          {/* Existing tab content rendering */}
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="welcome-header">
                <h1>
                  Welcome, {user.name || 'Jane'}! <span className="badge-purple">Customer</span>
                </h1>
                <p>Manage your bookings and shop essentials for your pets in one place.</p>
              </div>
              {/* Rest of the overview content remains unchanged */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
