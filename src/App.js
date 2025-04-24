import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import FreelancerSignup from './components/FreelancerSignup';
import CompanySignup from './components/CompanySignup';
import FreelancerDashboard from './components/FreelancerDashboard';
import CompanyDashboard from './components/CompanyDashboard';

// Protected Route component
const ProtectedRoute = ({ children, userType }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.userType !== userType) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Check if user is already logged in
const checkAuth = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return false;
  
  // Redirect based on user type
  if (user.userType === 'company') {
    return <Navigate to="/dashboard/company" replace />;
  } else if (user.userType === 'freelancer') {
    return <Navigate to="/dashboard/freelancer" replace />;
  }
  return false;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={checkAuth() || <Login />} 
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/freelancer" element={<FreelancerSignup />} />
        <Route path="/signup/company" element={<CompanySignup />} />
        <Route
          path="/dashboard/freelancer"
          element={
            <ProtectedRoute userType="freelancer">
              <FreelancerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/company"
          element={
            <ProtectedRoute userType="company">
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        {/* Add a catch-all route for unmatched paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
