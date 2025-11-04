import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

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

  // Check if user is already logged in when app loads
  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login Customer
  const loginCustomer = async (email, password) => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/customer/login', {...});
      
      // Mock success for now
      const mockUser = {
        id: '1',
        email: email,
        firstName: 'Customer',
        role: 'customer'
      };
      
      const mockToken = 'mock-token-' + Date.now();
      
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('userRole', 'customer');
      localStorage.setItem('role', 'customer');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return { success: true, user: mockUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Login Admin
  const loginAdmin = async (credentials) => {
    try {
      setError(null);
      
      const mockUser = {
        id: '2',
        email: credentials.workEmail,
        name: 'Admin User',
        role: 'admin'
      };
      
      const mockToken = 'admin-token-' + Date.now();
      
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('role', 'admin');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return { success: true, user: mockUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Login Veterinarian
  const loginVeterinarian = async (email, password) => {
    try {
      setError(null);
      
      const mockUser = {
        id: '3',
        email: email,
        fullName: 'Dr. Veterinarian',
        role: 'veterinarian'
      };
      
      const mockToken = 'vet-token-' + Date.now();
      
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('userRole', 'veterinarian');
      localStorage.setItem('role', 'veterinarian');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return { success: true, user: mockUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Register Customer
  const registerCustomer = async (userData) => {
    try {
      setError(null);
      
      const mockUser = {
        id: '4',
        email: userData.email,
        firstName: userData.firstName,
        role: 'customer'
      };
      
      const mockToken = 'new-user-token-' + Date.now();
      
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('userRole', 'customer');
      localStorage.setItem('role', 'customer');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return { success: true, user: mockUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    loginCustomer,
    loginAdmin,
    loginVeterinarian,
    registerCustomer,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;