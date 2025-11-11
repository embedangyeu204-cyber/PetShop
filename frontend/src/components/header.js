import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';
import { LuPawPrint } from 'react-icons/lu';
import './header.css';

function Header({ show = true }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const userRole = useMemo(() => {
    if (!user?.role) return undefined;
    return user.role.toLowerCase() === 'veterinary' ? 'veterinarian' : user.role.toLowerCase();
  }, [user?.role]);
  const disableGlobalNav = userRole === 'veterinarian';

  if (!show) return null;

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleRegister = () => {
    navigate('/customer-login');
  };

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Service', href: '/service' },
    { label: 'Discovery', href: '/discovery' },
  ];

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-brand">
          <LuPawPrint className="brand-icon" aria-hidden="true" />
          <div className="brand-text">
            <span className="brand-title">Shop Pet</span>
          </div>
        </Link>

        <button className="menu-toggle" onClick={toggleMenu}>
          &#9776;
        </button>

        <div className={`header-nav-wrapper ${menuOpen ? 'active' : ''}`}>
          <ul className="header-nav">
            {navLinks.map((item) => (
              <li key={item.label}>
                {disableGlobalNav ? (
                  <span className="nav-link disabled-link" title="Navigation disabled for veterinarian workspace">
                    {item.label}
                  </span>
                ) : (
                  <Link to={item.href}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="header-actions">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <button className="btn-register" onClick={handleRegister}>
              <span className="user-icon">&#9787;</span>
              <span>Register / Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
