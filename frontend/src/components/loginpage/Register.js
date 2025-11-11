import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80';

const roleRedirectMap = {
  admin: '/admin-dashboard',
  customer: '/dashboard',
  veterinary: '/vet-dashboard',
  veterinarian: '/vet-dashboard',
};

const roleMeta = {
  customer: { label: 'Customer', icon: 'fa-solid fa-shopping-bag' },
  admin: { label: 'Admin', icon: 'fa-solid fa-shield-halved' },
  veterinarian: { label: 'Veterinarian', icon: 'fa-solid fa-user-doctor' },
};

const normaliseRoleValue = (role) => {
  if (!role) return undefined;
  const value = role.toLowerCase();
  if (value === 'veterinary') return 'veterinarian';
  return value;
};

const CreateAccount = ({ onSwitchToLogin, defaultRole = 'customer' }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredContact: 'email',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    dateOfBirth: '',
    role: normaliseRoleValue(defaultRole) || defaultRole,
  });
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register, error: authError, clearError } = useAuth();

  useEffect(() => {
    if (authError) {
      setMessage(authError);
    }
  }, [authError]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      role: normaliseRoleValue(defaultRole) || defaultRole,
    }));
  }, [defaultRole]);

  const normalisedRole = useMemo(() => {
    return normaliseRoleValue(formData.role) || 'customer';
  }, [formData.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (message) {
      setMessage(null);
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }
    
    if (formData.dateOfBirth) {
      const inputDate = new Date(formData.dateOfBirth);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (inputDate > today) {
        setMessage('Date of birth cannot be in the future.');
        return;
      }
    }

    setSubmitting(true);
    setMessage(null);

    const addressLine = [formData.address, formData.city, formData.state, formData.zipCode]
      .filter(Boolean)
      .join(', ');

    const dobPayload = formData.dateOfBirth ? `${formData.dateOfBirth}T00:00:00` : null;

    const result = await register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phone,
      address: addressLine,
      dateOfBirth: dobPayload,
      role: normaliseRoleValue(formData.role) || formData.role,
    });

    if (!result.success) {
      setMessage(result.error || 'Registration failed. Please try again.');
      setSubmitting(false);
      return;
    }

    const destination = roleRedirectMap[normalisedRole] || '/';
    navigate(destination, { replace: true });
    setSubmitting(false);
  };

  const handleSwitchRole = (e) => {
    e.preventDefault();
    console.log('Switch role clicked');
  };

  const handleViewPolicies = (e) => {
    e.preventDefault();
    console.log('View policies clicked');
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-left-content">
          <h1>Set up your {roleMeta[normalisedRole]?.label?.toLowerCase() || 'customer'} account</h1>
          <p>We'll personalize your Shop Pet experience for fast checkout and easy bookings.</p>
          <div className="auth-image">
            <img src={HERO_IMAGE_URL} alt="Cute cat in carrier bag" loading="lazy" />
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="breadcrumb">
            <span>Register / Login</span>
            <i className="fa-solid fa-chevron-right"></i>
            <span>Choose role</span>
            <i className="fa-solid fa-chevron-right"></i>
            <span className="active">
              <i className={roleMeta[normalisedRole]?.icon || 'fa-solid fa-shopping-bag'}></i>{' '}
              {roleMeta[normalisedRole]?.label || 'Customer'}
            </span>
          </div>

          <h2>Create your profile</h2>
          <p className="subtitle">Use the same details for shopping and service bookings. You can add pets later.</p>

          <div className="profile-badge">
            <div className="profile-avatar">
              <img
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=200&q=60"
                alt="Profile"
                loading="lazy"
              />
            </div>
              <div className="profile-info">
                <div className="badge-item">
                  <i className={roleMeta[normalisedRole]?.icon || 'fa-solid fa-shopping-bag'}></i>
                  <span>{roleMeta[normalisedRole]?.label || 'Customer'}</span>
                </div>
              <button 
                type="button"
                className="switch-role-btn"
                onClick={handleSwitchRole}
              >
                <i className="fa-solid fa-repeat"></i> Switch role
              </button>
            </div>
            <p>Visible to support and vets when booking.</p>
          </div>

          <div className="auth-tabs">
            <button className="auth-tab active" type="button">Create account</button>
            <button className="auth-tab" type="button" onClick={onSwitchToLogin}>Login</button>
          </div>

          <form className="auth-form register-form" onSubmit={handleSubmit}>
            <div className="form-row-two">
              <div className="form-group">
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Jane"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                required
              />
            </div>

            <div className="form-row-two">
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 555 0100"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="preferredContact">Preferred contact</label>
                <select
                  id="preferredContact"
                  name="preferredContact"
                  value={formData.preferredContact}
                  onChange={handleChange}
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of birth</label>
              <input
                id="dateOfBirth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-row-two">
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
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="form-row-two">
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Pet St, Suite 4"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="San Diego"
                  required
                />
              </div>
            </div>

            <div className="form-row-two">
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="CA"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="zipCode">ZIP code</label>
                <input
                  id="zipCode"
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="92101"
                  required
                />
              </div>
            </div>

            <div className="terms">
              <p>
                By creating an account, you agree to our{' '}
                <button type="button" className="terms-link">Terms</button>
                {' '}and{' '}
                <button type="button" className="terms-link">Privacy</button>.
                <button 
                  type="button" 
                  className="terms-link view-policies"
                  onClick={handleViewPolicies}
                >
                  View policies
                </button>
              </p>
            </div>

            <button type="submit" className="btn-submit">
              <i className="fa-solid fa-user-plus"></i>
              {submitting ? 'Creating account...' : 'Create account'}
            </button>

            {message && (
              <div className="form-error" role="alert">
                {message}
              </div>
            )}

            <div className="divider">
              <span>or</span>
            </div>

            <button type="button" className="btn-secondary-action" onClick={onSwitchToLogin}>
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
              I already have an account — Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
