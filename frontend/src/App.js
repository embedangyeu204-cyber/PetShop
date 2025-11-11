import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/header';

// ===== PAGES =====
import Homepage from './pages/customer/Homepage';
import Aboutpage from './pages/customer/Aboutpage';
import Servicepage from './pages/customer/Servicepage';
import Discoverypage from './pages/customer/Discoverypage';
import ConsultationForm from './pages/customer/dashboard/ConsultationForm';
import CustomerDashboard from './pages/customer/dashboard/CustomerDashboard';
import VeterinarianDashboard from './pages/veterinarian/dashboard/VeterinarianDashboard';
import UpdateMedicalRecords from './pages/veterinarian/medical-records/UpdateMedicalRecords';
import CreatePrescription from './pages/veterinarian/prescriptions/CreatePrescription';
import VeterinarianProfile from './pages/veterinarian/profile/VeterinarianProfile';
import VeterinarianChat from './pages/veterinarian/chat/VeterinarianChat';

// ===== LOGIN PAGES =====
import CustomerLogin from './components/loginpage/customerlogin';
import AdminLogin from './components/loginpage/adminlogin';

const normaliseRole = (role) => {
  if (!role) return undefined;
  const value = role.toLowerCase();
  if (value === 'veterinary') return 'veterinarian';
  return value;
};

function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/customer-login" replace />;
  }

  if (role) {
    const expectedRole = normaliseRole(role);
    const userRole = normaliseRole(user?.role);
    if (expectedRole && userRole !== expectedRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

function AppRoutes() {
  return (
    <Router>
      <Header />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<Aboutpage />} />
        <Route path="/service" element={<Servicepage />} />
        <Route path="/discovery" element={<Discoverypage />} />
        <Route path="/consultation" element={<ConsultationForm />} />

        {/* AUTH ROUTES */}
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* CUSTOMER ROUTES */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute role="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        {/* VETERINARIAN ROUTES */}
        <Route
          path="/vet-dashboard"
          element={
            <ProtectedRoute role="veterinarian">
              <VeterinarianDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vet-dashboard/medical-records"
          element={
            <ProtectedRoute role="veterinarian">
              <UpdateMedicalRecords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vet-dashboard/prescriptions"
          element={
            <ProtectedRoute role="veterinarian">
              <CreatePrescription />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vet-dashboard/profile"
          element={
            <ProtectedRoute role="veterinarian">
              <VeterinarianProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vet-dashboard/chat"
          element={
            <ProtectedRoute role="veterinarian">
              <VeterinarianChat />
            </ProtectedRoute>
          }
        />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
