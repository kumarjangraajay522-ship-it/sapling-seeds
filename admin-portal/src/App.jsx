import React, { useState, useEffect } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  // sessionStorage: survives reload, cleared when tab/window is closed
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!sessionStorage.getItem('admin_token')
  );

  const handleLoginSuccess = () => setIsAuthenticated(true);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_email');
    sessionStorage.removeItem('admin_data');
    setIsAuthenticated(false);
  };

  return isAuthenticated
    ? <AdminDashboard onLogout={handleLogout} />
    : <AdminLogin onLoginSuccess={handleLoginSuccess} />;
}

export default App;