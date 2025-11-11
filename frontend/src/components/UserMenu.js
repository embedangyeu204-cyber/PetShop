import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './UserMenu.css';

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userName =
    user?.fullName ||
    `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() ||
    user?.email ||
    'Account';
  const roleValue = (user?.role || 'customer').toLowerCase();
  const userRole =
    roleValue === 'veterinarian' || roleValue === 'veterinary'
      ? 'Veterinarian'
      : roleValue.charAt(0).toUpperCase() + roleValue.slice(1);
  const restrictedMenu =
    roleValue === 'veterinarian' ||
    roleValue === 'veterinary' ||
    roleValue === 'admin';

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/customer-login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="user-menu" ref={dropdownRef}>
      <button
        className="user-menu-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <i className="fa-solid fa-user-circle user-icon"></i>
        <span className="user-name">{userName}</span>
        <i
          className={`fa-solid fa-chevron-down chevron-icon ${
            isOpen ? 'rotate' : ''
          }`}
        ></i>
      </button>

      {isOpen && (
        <div className="user-dropdown">
          <div className="dropdown-header">
            <i className="fa-solid fa-user-circle dropdown-avatar"></i>
            <div className="dropdown-user-info">
              <div className="dropdown-name">{userName}</div>
              <div className="dropdown-role">{userRole}</div>
            </div>
          </div>

          {!restrictedMenu && (
            <>
              <div className="dropdown-divider"></div>

              <button
                onClick={() => handleNavigation('/dashboard/profile')}
                className="dropdown-item"
              >
                <i className="fa-solid fa-user"></i>
                <span>Manage personal & pet profiles</span>
              </button>

              <button
                onClick={() => handleNavigation('/dashboard/appointments')}
                className="dropdown-item"
              >
                <i className="fa-solid fa-calendar"></i>
                <span>Book service appointments</span>
              </button>

              <button
                onClick={() => handleNavigation('/dashboard/chat')}
                className="dropdown-item"
              >
                <i className="fa-solid fa-message"></i>
                <span>Chat</span>
              </button>

              <button
                onClick={() => handleNavigation('/dashboard/feedback')}
                className="dropdown-item"
              >
                <i className="fa-solid fa-comment"></i>
                <span>Feedback & complaints</span>
              </button>

              <button
                onClick={() => handleNavigation('/dashboard/notifications')}
                className="dropdown-item"
              >
                <i className="fa-solid fa-bell"></i>
                <span>Notifications</span>
              </button>

              <div className="dropdown-divider"></div>

              <button
                onClick={() => handleNavigation('/dashboard/help')}
                className="dropdown-item"
              >
                <i className="fa-solid fa-circle-question"></i>
                <span>Help Center</span>
              </button>

              <div className="dropdown-divider"></div>
            </>
          )}

          <button onClick={handleLogout} className="dropdown-item logout">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
