import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';

function Header({ show = true }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    setIsLoggedIn(!!token);

    const handleStorageChange = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleUserClick = () => {
    navigate('/dashboard');
  };

  const handleRegister = () => {
    navigate('/customer-login');
  };

  if (!show) return null;

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-brand">
          <span className="brand-icon">🐾</span>
          <span>Shop Pet</span>
        </Link>

        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>

        <div className={`header-nav-wrapper ${menuOpen ? 'active' : ''}`}>
          <ul className="header-nav">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/service">Service</Link></li>
            <li><Link to="/discovery">Discovery</Link></li>
          </ul>
        </div>

        <div className="header-actions">
          {isLoggedIn ? (
            <button className="btn-user" onClick={handleUserClick}>
              <i className="fa-solid fa-user-circle"></i>
              <span>{localStorage.getItem('userName') || 'Jane Doe'}</span>
            </button>
          ) : (
            <button className="btn-register" onClick={handleRegister}>
              <span className="user-icon">👤</span>
              <span>Register / Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
