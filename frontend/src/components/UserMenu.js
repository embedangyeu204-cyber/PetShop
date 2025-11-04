import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserMenu.css';

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Lấy thông tin user từ localStorage
  const userName = localStorage.getItem('userName') || 'Jane Doe';
  const userRole = localStorage.getItem('role') || 'Customer';

  // Đóng dropdown khi click bên ngoài
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
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userAvatar');
    
    // Trigger storage event để header update
    window.dispatchEvent(new Event('storage'));
    
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
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fa-solid fa-user-circle user-icon"></i>
        <span className="user-name">{userName}</span>
        <i className={`fa-solid fa-chevron-down chevron-icon ${isOpen ? 'rotate' : ''}`}></i>
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

          <div className="dropdown-divider"></div>

          <button 
            onClick={() => handleNavigation('/profile')}
            className="dropdown-item"
          >
            <i className="fa-solid fa-user"></i>
            <span>Manage personal & pet profiles</span>
          </button>

          <button 
            onClick={() => handleNavigation('/appointments')}
            className="dropdown-item"
          >
            <i className="fa-solid fa-calendar"></i>
            <span>Book service appointments</span>
          </button>

          <button 
            onClick={() => handleNavigation('/chat')}
            className="dropdown-item"
          >
            <i className="fa-solid fa-message"></i>
            <span>Chat</span>
          </button>

          <button 
            onClick={() => handleNavigation('/feedback')}
            className="dropdown-item"
          >
            <i className="fa-solid fa-comment"></i>
            <span>Feedback & complaints</span>
          </button>

          <button 
            onClick={() => handleNavigation('/notifications')}
            className="dropdown-item"
          >
            <i className="fa-solid fa-bell"></i>
            <span>Notifications</span>
          </button>

          <div className="dropdown-divider"></div>

          <button 
            onClick={() => handleNavigation('/help')}
            className="dropdown-item"
          >
            <i className="fa-solid fa-circle-question"></i>
            <span>Help Center</span>
          </button>

          <div className="dropdown-divider"></div>

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
