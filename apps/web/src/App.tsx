import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useDataStore, useLoadAllData } from './stores/dataStore';
import LoginScreen from './components/LoginScreen';
import DashboardApp from './components/DashboardApp';
import LandingPage from './pages/LandingPage';

function AppContent() {
  const user = useAuthStore((s) => s.user);
  const loadAllData = useLoadAllData();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  // Public landing page at root
  if (location.pathname === '/') {
    return <LandingPage />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <DashboardApp />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
