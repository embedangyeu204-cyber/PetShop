import React from 'react';
import AuthPage from './AuthPage';

/**
 * CustomerLogin - Login page dành cho khách hàng
 */
function CustomerLogin() {
  return <AuthPage defaultRole="customer" />;
}

export default CustomerLogin;