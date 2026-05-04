import React, { useState } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  // Check if already logged in (token in localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('admin_token')
  );

  const handleLoginSuccess = () => setIsAuthenticated(true);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    setIsAuthenticated(false);
  };

  return isAuthenticated
    ? <AdminDashboard onLogout={handleLogout} />
    : <AdminLogin onLoginSuccess={handleLoginSuccess} />;
}

export default App;