import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/loading/LoadingScreen';
import './styles/themes.css';

// Layout
import MainLayout from './components/layout/MainLayout';

// Public Pages
import Home from './pages/public/Home';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/Projects';
import AdminExperiences from './pages/admin/Experiences';
import AdminCertificates from './pages/admin/Certificates';
import AdminContacts from './pages/admin/Contacts';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi loading atau preload assets
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3500); // Loading akan tampil selama 3.5 detik

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppProvider>
      {loading && <LoadingScreen onFinish={() => setLoading(false)} />}
      <Router>
        <Routes>
          {/* Public Routes with MainLayout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
          </Route>
          
          {/* Admin Routes (without MainLayout) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/projects" element={
            <ProtectedRoute>
              <AdminProjects />
            </ProtectedRoute>
          } />
          <Route path="/admin/experiences" element={
            <ProtectedRoute>
              <AdminExperiences />
            </ProtectedRoute>
          } />
          <Route path="/admin/certificates" element={
            <ProtectedRoute>
              <AdminCertificates />
            </ProtectedRoute>
          } />
          <Route path="/admin/contacts" element={
            <ProtectedRoute>
              <AdminContacts />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;