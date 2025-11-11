import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext(null);

const ROLE_MAP = {
  customer: 'customer',
  admin: 'admin',
  veterinarian: 'veterinarian',
  veterinary: 'veterinarian',
};

const normaliseRole = (role) => {
  if (!role) return undefined;
  return ROLE_MAP[role.toLowerCase()] || role.toLowerCase();
};

const persistAuth = (token, user) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('role', user.role || '');
  localStorage.setItem('userRole', user.role || '');

  if (user.firstName || user.fullName) {
    const fallbackName = user.fullName || user.email || 'User';
    const combined =
      user.fullName || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
    localStorage.setItem('userName', combined || fallbackName);
  }

  setAuthToken(token);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token =
      localStorage.getItem('authToken') || localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        const normalizedRole = normaliseRole(parsedUser.role);
        const hydratedUser = normalizedRole
          ? { ...parsedUser, role: normalizedRole }
          : parsedUser;
        setAuthToken(token);
        setUser(hydratedUser);
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async ({ identifier, password, role }) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { identifier, password });
      const { token, user: userPayload } = response.data || {};

      if (!token || !userPayload) {
        throw new Error('Server did not return authentication payload.');
      }

      const expectedRole = normaliseRole(role);
      const actualRole = normaliseRole(userPayload.role);
      if (expectedRole && actualRole && expectedRole !== actualRole) {
        throw new Error('Tài khoản không thuộc vai trò đã chọn.');
      }

      const normalisedUser = {
        ...userPayload,
        role: actualRole,
      };

      persistAuth(token, normalisedUser);
      setUser(normalisedUser);

      return { success: true, user: normalisedUser };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(async (payload) => {
    try {
      setError(null);
      const role = normaliseRole(payload.role) || 'customer';
      const response = await api.post('/auth/register', {
        email: payload.email,
        password: payload.password,
        role,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phoneNumber: payload.phoneNumber,
        address: payload.address,
        dateOfBirth: payload.dateOfBirth,
      });

      const { token, user: userPayload } = response.data || {};
      if (!token || !userPayload) {
        throw new Error('Server did not return registration payload.');
      }

      const normalisedUser = {
        ...userPayload,
        role: normaliseRole(userPayload.role),
      };

      persistAuth(token, normalisedUser);
      setUser(normalisedUser);

      return { success: true, user: normalisedUser };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    setAuthToken(null);
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
