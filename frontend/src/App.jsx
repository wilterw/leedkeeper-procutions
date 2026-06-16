import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Onboarding from './pages/Onboarding';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Pending from './pages/Auth/Pending';
import ClientDashboard from './pages/Client/ClientDashboard';
import ClientSettings from './pages/Client/ClientSettings';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  if (!user) return <Navigate to="/login" />;

  // Si requiere admin pero no lo es
  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" />;
  }

  // Si es un cliente pero no está activo, redirigir a /pending
  // EXCEPTO si ya está en /pending para evitar bucle
  if (user.role === 'CLIENT' && !user.isActive && window.location.pathname !== '/pending') {
    return <Navigate to="/pending" />;
  }

  // Si ya está activo y trata de entrar a /pending, mandarlo al dashboard/onboarding
  if (user.isActive && window.location.pathname === '/pending') {
    return <Navigate to="/onboarding" />;
  }

  return children;
};

function App() {
  return (
    <div className="min-h-screen">
      {window.location.pathname !== '/' && <Navbar />}
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/pending" element={
            <ProtectedRoute>
              <Pending />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <ClientSettings />
            </ProtectedRoute>
          } />
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
