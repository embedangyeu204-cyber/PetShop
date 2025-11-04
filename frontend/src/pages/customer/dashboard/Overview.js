import React from 'react';
import './Overview.css';

function Overview() {
  const userName = localStorage.getItem('userName') || 'Jane';

  return (
    <div className="overview-page">
      <div className="welcome-section">
        <h1>Welcome, {userName}! <span className="badge-customer">Customer</span></h1>
        <p>Manage your bookings and shop essentials for your pets in one place.</p>
      </div>

      <div className="action-buttons">
        <button className="btn-primary-action">
          <i className="fa-solid fa-calendar-check"></i>
          Book appointment
        </button>
        <button className="btn-secondary-action">
          <i className="fa-solid fa-shopping-cart"></i>
          Shop products
        </button>
        <button className="btn-secondary-action">
          <i className="fa-solid fa-paw"></i>
          Add a pet
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="next-appointment-card">
          <h3>Next appointment</h3>
          <div className="appointment-empty">
            <p>None scheduled</p>
            <small>Book a check-up to keep your pet healthy.</small>
          </div>
        </div>

        <div className="your-pets-card">
          <h3>Your pets</h3>
          <div className="pets-list">
            <div className="pet-item">
              <i className="fa-solid fa-dog"></i>
              <div>
                <div className="pet-name">Milo</div>
                <div className="pet-info">Dog • 2 yrs</div>
              </div>
            </div>
            <div className="pet-item">
              <i className="fa-solid fa-cat"></i>
              <div>
                <div className="pet-name">Luna</div>
                <div className="pet-info">Cat • 4 yrs</div>
              </div>
            </div>
            <div className="pet-item">
              <i className="fa-solid fa-rabbit"></i>
              <div>
                <div className="pet-name">Nugget</div>
                <div className="pet-info">Rabbit • 1 yr</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-orders-section">
        <div className="section-header">
          <h2>Recent orders</h2>
          <button className="btn-view-all">View all</button>
        </div>

        <div className="orders-list">
          <div className="order-card">
            <i className="fa-solid fa-box"></i>
            <div className="order-info">
              <div className="order-id">Order #1024</div>
              <div className="order-details">Placed 2 days ago • 3 items</div>
            </div>
            <span className="order-status shipped">Shipped</span>
          </div>

          <div className="order-card">
            <i className="fa-solid fa-box"></i>
            <div className="order-info">
              <div className="order-id">Order #1018</div>
              <div className="order-details">Placed 1 week ago • 1 item</div>
            </div>
            <span className="order-status delivered">Delivered</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
