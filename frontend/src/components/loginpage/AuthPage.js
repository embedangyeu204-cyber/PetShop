import React, { useState } from 'react';
import Login from './login';
import CreateAccount from './Register';

/**
 * AuthPage - Wrapper component để chuyển đổi giữa Login và Register
 * @param {string} defaultRole - Role mặc định (customer, admin, veterinarian)
 */
function AuthPage({ defaultRole = 'customer' }) {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="auth-page">
      {showRegister ? (
        <CreateAccount 
          onSwitchToLogin={() => setShowRegister(false)}
          defaultRole={defaultRole}
        />
      ) : (
        <Login 
          onSwitchToRegister={() => setShowRegister(true)}
          defaultRole={defaultRole}
        />
      )}
    </div>
  );
}

export default AuthPage;