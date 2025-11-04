import React, { useState } from 'react';
import './login.css';

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    rememberMe: false,
    role: 'customer'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login data:', formData);
    // Add your login logic here
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Handle forgot password logic
    console.log('Forgot password clicked');
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    // Handle email login
    console.log('Email login clicked');
  };

  const handlePhoneLogin = (e) => {
    e.preventDefault();
    // Handle phone login
    console.log('Phone login clicked');
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-left-content">
          <h1>Welcome back to Shop Pet</h1>
          <p>Log in or create an account to book services, manage pets, and shop faster.</p>
          <div className="auth-image">
            <img src="/images/window-cat.jpg" alt="Window with plants and cat" />
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-tabs">
            <button className="auth-tab active" type="button">Login</button>
            <button className="auth-tab" type="button" onClick={onSwitchToRegister}>Create account</button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="emailOrPhone">Email or phone</label>
              <input
                id="emailOrPhone"
                type="text"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                placeholder="example@domain.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>
              <button 
                type="button" 
                className="forgot-password-btn"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>
            </div>

            <div className="role-selection">
              <label>Continue as</label>
              <div className="role-buttons">
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'customer' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('customer')}
                >
                  <i className="fa-solid fa-shopping-bag"></i>
                  <span>Customer</span>
                </button>
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'admin' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('admin')}
                >
                  <i className="fa-solid fa-shield-halved"></i>
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'veterinarian' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('veterinarian')}
                >
                  <i className="fa-solid fa-user-doctor"></i>
                  <span>Veterinarian</span>
                </button>
              </div>
            </div>

            <button type="submit" className="btn-submit">
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
              Login
            </button>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <div className="social-login">
              <button type="button" className="social-btn" onClick={handleEmailLogin}>
                <i className="fa-solid fa-envelope"></i>
                Email
              </button>
              <button type="button" className="social-btn" onClick={handlePhoneLogin}>
                <i className="fa-solid fa-phone"></i>
                Phone
              </button>
            </div>

            <div className="terms">
              <button type="button" className="terms-link">Privacy</button>
              <span> • </span>
              <button type="button" className="terms-link">Terms</button>
              <p>By continuing you agree to our Terms and acknowledge our Privacy Policy.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
