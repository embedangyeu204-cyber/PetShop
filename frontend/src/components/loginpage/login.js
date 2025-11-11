import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './login.css';

const roleRedirectMap = {
  admin: '/admin-dashboard',
  customer: '/dashboard',
  veterinary: '/vet-dashboard',
  veterinarian: '/vet-dashboard',
};

const normaliseRoleValue = (role) => {
  if (!role) return undefined;
  const value = role.toLowerCase();
  if (value === 'veterinary') return 'veterinarian';
  return value;
};

const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=900&q=80';

const Login = ({ onSwitchToRegister, defaultRole = 'customer' }) => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    rememberMe: false,
    role: defaultRole,
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const { login, error: authError, clearError, isAuthenticated, user } = useAuth();

  useEffect(() => {
    const storedIdentifier = localStorage.getItem('rememberedLogin');
    if (storedIdentifier) {
      setFormData((prev) => ({
        ...prev,
        emailOrPhone: storedIdentifier,
        rememberMe: true,
      }));
    }
  }, []);

  useEffect(() => {
    if (authError) {
      setMessage(authError);
    }
  }, [authError]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      role: defaultRole,
    }));
  }, [defaultRole]);

  const normalisedRole = useMemo(
    () => normaliseRoleValue(formData.role) || formData.role?.toLowerCase(),
    [formData.role],
  );

  useEffect(() => {
    if (!isAuthenticated) return;
    const userRole = normaliseRoleValue(user?.role) || normaliseRoleValue(normalisedRole) || normalisedRole;
    const destination = roleRedirectMap[userRole] || '/';
    navigate(destination, { replace: true });
  }, [isAuthenticated, user, normalisedRole, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (message) {
      setMessage(null);
      clearError();
    }
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }));
    if (message) {
      setMessage(null);
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    const result = await login({
      identifier: formData.emailOrPhone,
      password: formData.password,
      role: normaliseRoleValue(formData.role) || formData.role,
    });

    if (!result.success) {
      setMessage(result.error || 'Login failed. Please try again.');
      setSubmitting(false);
      return;
    }

    if (formData.rememberMe) {
      localStorage.setItem('rememberedLogin', formData.emailOrPhone);
    } else {
      localStorage.removeItem('rememberedLogin');
    }

    const redirectRole =
      normaliseRoleValue(result.user?.role) || normaliseRoleValue(normalisedRole) || normalisedRole;
    const destination = roleRedirectMap[redirectRole] || '/';
    navigate(destination, { replace: true });
    setSubmitting(false);
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
            <img src={HERO_IMAGE_URL} alt="Window with plants and cat" loading="lazy" />
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

            <button type="submit" className="btn-submit" disabled={submitting}>
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
              {submitting ? 'Logging in...' : 'Login'}
            </button>

            {message && (
              <div className="form-error" role="alert">
                {message}
              </div>
            )}

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
