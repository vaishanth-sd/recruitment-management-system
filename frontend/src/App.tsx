import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CandidateDashboardPage } from './pages/CandidateDashboardPage';
import { CandidateApplicationsPage } from './pages/CandidateApplicationsPage';
import { RecruiterDashboardPage } from './pages/RecruiterDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* Candidate Protected Routes */}
            <Route
              path="candidate/dashboard"
              element={
                <ProtectedRoute allowedRole="CANDIDATE">
                  <CandidateDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="candidate/applications"
              element={
                <ProtectedRoute allowedRole="CANDIDATE">
                  <CandidateApplicationsPage />
                </ProtectedRoute>
              }
            />

            {/* Recruiter Protected Routes */}
            <Route
              path="recruiter/dashboard"
              element={
                <ProtectedRoute allowedRole="RECRUITER">
                  <RecruiterDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
