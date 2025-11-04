import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

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

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="user-profile">
            <div className="user-avatar">👤</div>
            <div className="user-info">
              <h3>{user.name || 'Jane Doe'}</h3>
              <p>Customer</p>
            </div>
          </div>

          <nav className="dashboard-nav">
            <div className="nav-section">
              <h4>Dashboard</h4>
              <button 
                className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <span>📊</span> Overview
              </button>
            </div>

            <div className="nav-section">
              <h4>Customer Functions</h4>
              <button 
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <span>👤</span> Manage personal & pet profiles
              </button>
              <button 
                className={`nav-item ${activeTab === 'booking' ? 'active' : ''}`}
                onClick={() => setActiveTab('booking')}
              >
                <span>📅</span> Book service appointments
              </button>
              <button 
                className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
                onClick={() => setActiveTab('chat')}
              >
                <span>💬</span> Chat <span className="badge">3</span>
              </button>
              <button className="nav-item">
                <span>📝</span> Feedback & complaints
              </button>
              <button className="nav-item">
                <span>🔔</span> Notifications
              </button>
            </div>

            <div className="nav-section">
              <h4>Support</h4>
              <button className="nav-item">
                <span>❓</span> Help Center
              </button>
            </div>

            <button className="nav-item logout" onClick={handleLogout}>
              <span>🚪</span> Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="welcome-header">
                <h1>Welcome, {user.name || 'Jane'}! <span className="badge-purple">Customer</span></h1>
                <p>Manage your bookings and shop essentials for your pets in one place.</p>
              </div>

              <div className="action-buttons">
                <button className="btn btn-primary" onClick={() => setActiveTab('booking')}>
                  📅 Book appointment
                </button>
                <button className="btn btn-secondary">
                  🛒 Shop products
                </button>
                <button className="btn btn-secondary">
                  🐾 Add a pet
                </button>
              </div>

              <div className="info-card appointment-card">
                <h3>Next appointment</h3>
                <p className="no-appointment">None scheduled</p>
                <p className="card-subtitle">Book a checkup to keep your pet healthy.</p>
              </div>

              <div className="dashboard-grid">
                <div className="card-section">
                  <div className="section-header">
                    <h2>Upcoming appointments</h2>
                    <button className="btn btn-secondary btn-sm">📅 New booking</button>
                  </div>
                  <div className="empty-state">
                    <p>No appointments yet. Click New booking to schedule a visit.</p>
                  </div>
                </div>

                <div className="card-section pets-section">
                  <h2>Your pets</h2>
                  <div className="pets-list">
                    <div className="pet-item">
                      <div className="pet-avatar">🐕</div>
                      <div className="pet-details">
                        <h4>Milo</h4>
                        <p>Dog • 2 yrs</p>
                      </div>
                    </div>
                    <div className="pet-item">
                      <div className="pet-avatar">🐱</div>
                      <div className="pet-details">
                        <h4>Luna</h4>
                        <p>Cat • 4 yrs</p>
                      </div>
                    </div>
                    <div className="pet-item">
                      <div className="pet-avatar">🐰</div>
                      <div className="pet-details">
                        <h4>Nugget</h4>
                        <p>Rabbit • 1 yr</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-section orders-section">
                <div className="section-header">
                  <h2>Recent orders</h2>
                  <button className="btn-link">View all</button>
                </div>
                <div className="orders-list">
                  <div className="order-item">
                    <div className="order-icon">📦</div>
                    <div className="order-details">
                      <h4>Order #1024</h4>
                      <p>Placed 2 days ago • 3 items</p>
                    </div>
                    <span className="order-status shipped">Shipped</span>
                  </div>
                  <div className="order-item">
                    <div className="order-icon">📦</div>
                    <div className="order-details">
                      <h4>Order #1018</h4>
                      <p>Placed 1 week ago • 1 item</p>
                    </div>
                    <span className="order-status delivered">Delivered</span>
                  </div>
                </div>
              </div>

              <div className="tip-card">
                <div className="tip-icon">💡</div>
                <div>
                  <strong>Tip:</strong> You can manage appointments and orders anytime from the sidebar.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-content">
              <h1>Manage personal & pet profiles</h1>
              <p className="subtitle">Update your details and keep pet information accurate for faster bookings.</p>
              
              <div className="profile-tabs">
                <button className="tab-btn active">👤 Personal info</button>
                <button className="tab-btn">🐾 Pets</button>
              </div>

              <div className="profile-form">
                <h2>Personal information</h2>
                <button className="btn btn-secondary btn-sm reset-btn">🔄 Reset</button>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full name</label>
                    <input type="text" defaultValue="Jane Doe" />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <input type="text" defaultValue="Customer" disabled />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" defaultValue="jane.doe@email.com" />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" defaultValue="+1 202 555 0118" />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input type="text" defaultValue="123 Paw Street, Suite 5" />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input type="text" defaultValue="Pawsville" />
                  </div>
                  <div className="form-group">
                    <label>State/Region</label>
                    <input type="text" defaultValue="CA" />
                  </div>
                  <div className="form-group">
                    <label>ZIP code</label>
                    <input type="text" defaultValue="94016" />
                  </div>
                  <div className="form-group">
                    <label>Emergency contact</label>
                    <input type="text" defaultValue="John Doe • +1 202 555 0199" />
                  </div>
                  <div className="form-group">
                    <label>Preferred vet</label>
                    <input type="text" defaultValue="Any available veterinarian" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;