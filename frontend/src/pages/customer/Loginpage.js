import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'customer'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost/pet-shop/api/login.php', formData);
      
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <h2>Welcome back to Shop Pet</h2>
          <p>Log in or create an account to book services, manage pets, and shop faster.</p>
          <div className="decorative-image">
            🪟🪴
          </div>
        </div>

        <div className="login-right">
          <div className="login-tabs">
            <button className="tab-btn active">Login</button>
            <Link to="/register" className="tab-btn">Create account</Link>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email or phone</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@domain.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <div className="user-type-selector">
              <p>Continue as</p>
              <div className="type-buttons">
                <button
                  type="button"
                  className={`type-btn ${formData.userType === 'customer' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, userType: 'customer' })}
                >
                  👤 Customer
                </button>
                <button
                  type="button"
                  className={`type-btn ${formData.userType === 'admin' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, userType: 'admin' })}
                >
                  ⚙️ Admin
                </button>
                <button
                  type="button"
                  className={`type-btn ${formData.userType === 'veterinarian' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, userType: 'veterinarian' })}
                >
                  ⚕️ Veterinarian
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn btn-primary btn-full">
              ➜ Login
            </button>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <div className="social-login">
              <button type="button" className="social-btn">
                ✉️ Email
              </button>
              <button type="button" className="social-btn">
                📱 Phone
              </button>
            </div>

            <div className="terms">
              <p>
                By continuing you agree to our{' '}
                <Link to="/terms">Terms</Link> and acknowledge our{' '}
                <Link to="/privacy">Privacy Policy</Link>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;