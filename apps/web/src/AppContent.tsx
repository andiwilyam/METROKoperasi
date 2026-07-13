import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useDataStore, useLoadAllData } from './stores/dataStore';
import LoginScreen from './components/LoginScreen';
import DashboardApp from './components/DashboardApp';
import MetroKspLandingPage from './pages/MetroKspLandingPage';

export default function AppContent() {
  const user = useAuthStore((s) => s.user);
  const loadAllData = useLoadAllData();
  const location = useLocation();
  useEffect(() => { if (user) { loadAllData(); } }, [user]);
  if (location.pathname === '/') { return <MetroKspLandingPage />; }
  if (!user) { return <LoginScreen />; }
  return <DashboardApp />;
}
