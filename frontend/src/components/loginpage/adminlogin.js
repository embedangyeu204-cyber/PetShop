import React from 'react';
import AuthPage from './AuthPage';

/**
 * AdminLogin - Login page dành cho admin
 */
function AdminLogin() {
  return <AuthPage defaultRole="admin" />;
}

export default AdminLogin;