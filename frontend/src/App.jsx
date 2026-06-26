import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout / Shared components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Mentor Pages
import MentorDashboard from './pages/mentor/MentorDashboard';
import CohortDetail from './pages/mentor/CohortDetail';

// Mentee Pages
import MenteeDashboard from './pages/mentee/MenteeDashboard';
import BrowseCohorts from './pages/mentee/BrowseCohorts';
import LearningTracker from './pages/mentee/LearningTracker';
import CertPage from './pages/mentee/CertPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMentors from './pages/admin/AdminMentors';
import AdminCohorts from './pages/admin/AdminCohorts';
import AdminMentees from './pages/admin/AdminMentees';
import AdminCerts from './pages/admin/AdminCerts';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar />
          
          <main className="flex-1 flex flex-col">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Mentor Routes */}
              <Route
                path="/mentor/dashboard"
                element={
                  <ProtectedRoute allowedRole="MENTOR">
                    <MentorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentor/cohorts"
                element={
                  <ProtectedRoute allowedRole="MENTOR">
                    <MentorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentor/cohorts/:id"
                element={
                  <ProtectedRoute allowedRole="MENTOR">
                    <CohortDetail />
                  </ProtectedRoute>
                }
              />

              {/* Mentee Routes */}
              <Route
                path="/mentee/dashboard"
                element={
                  <ProtectedRoute allowedRole="MENTEE">
                    <MenteeDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentee/cohorts"
                element={
                  <ProtectedRoute allowedRole="MENTEE">
                    <BrowseCohorts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentee/tracker"
                element={
                  <ProtectedRoute allowedRole="MENTEE">
                    <LearningTracker />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentee/cert"
                element={
                  <ProtectedRoute allowedRole="MENTEE">
                    <CertPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRole="SUPER_ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/mentors"
                element={
                  <ProtectedRoute allowedRole="SUPER_ADMIN">
                    <AdminMentors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/cohorts"
                element={
                  <ProtectedRoute allowedRole="SUPER_ADMIN">
                    <AdminCohorts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/mentees"
                element={
                  <ProtectedRoute allowedRole="SUPER_ADMIN">
                    <AdminMentees />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/certs"
                element={
                  <ProtectedRoute allowedRole="SUPER_ADMIN">
                    <AdminCerts />
                  </ProtectedRoute>
                }
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Toast Notification Container */}
          <Toast />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
