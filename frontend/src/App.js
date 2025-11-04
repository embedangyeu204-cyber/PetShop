import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/header";

// ===== PAGES =====
import Homepage from "./pages/customer/Homepage";
import Aboutpage from "./pages/customer/Aboutpage";
import Servicepage from "./pages/customer/Servicepage";
import Discoverypage from "./pages/customer/Discoverypage";

// ===== LOGIN PAGES ===== 
// ✅ MỚI
import CustomerLogin from './components/loginpage/customerlogin';
import AdminLogin from './components/loginpage/adminlogin';

// 🧩 Protected Route
function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");
  const userRole = localStorage.getItem("role") || localStorage.getItem("userRole");

  if (!token) return <Navigate to="/customer-login" replace />;
  if (role && userRole !== role) return <Navigate to="/" replace />;

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />

        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Homepage />} />
          <Route path="/About" element={<Aboutpage />} />
          <Route path="/service" element={<Servicepage />} />
          <Route path="/discovery" element={<Discoverypage />} />

          {/* LOGIN ROUTES - Đăng nhập trực tiếp */}
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* CUSTOMER ROUTES */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute role="customer">
                <div>Cart page content</div>
              </ProtectedRoute>
            }
          />

          {/* ADMIN ROUTES */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute role="admin">
                <div>Admin Dashboard</div>
              </ProtectedRoute>
            }
          />

          {/* 404 REDIRECT */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;