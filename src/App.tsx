import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import Sidebar    from './components/layout/Sidebar';
import BottomNav  from './components/layout/BottomNav';

import FeedPage    from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import ReportPage  from './pages/ReportPage';
import TicketsPage from './pages/TicketsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage   from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EmergencyProvider } from './contexts/EmergencyContext';
import EmergencyOverlay from './components/emergency/EmergencyOverlay';
import { Toaster } from 'react-hot-toast';

type Tab = 'feed' | 'explore' | 'report' | 'tickets' | 'profile';

const PAGE_MAP: Record<Tab, React.ComponentType> = {
  feed:    FeedPage,
  explore: ExplorePage,
  report:  ReportPage,
  tickets: TicketsPage,
  profile: ProfilePage,
};

/* ── Protected App Shell ─────────────────────────────────────── */
function AppShell() {
  const { user, loading } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>('feed');

  // Handle global tab switch events
  useEffect(() => {
    const handleSwitch = (e: any) => {
      if (e.detail && PAGE_MAP[e.detail as Tab]) {
        setActiveTab(e.detail as Tab);
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('switch-tab', handleSwitch);
    return () => window.removeEventListener('switch-tab', handleSwitch);
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)', gap: 24
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '18px', background: 'var(--crimson)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
          boxShadow: '0 12px 32px rgba(166,25,46,0.15)', animation: 'pulse-scale 1.8s ease-in-out infinite',
        }}>🎓</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 800, textTransform: 'uppercase' }}>
          Establishing Connection…
        </div>
        <style>{`@keyframes pulse-scale { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }`}</style>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  function handleTabChange(tab: string) {
    setActiveTab(tab as Tab);
  }

  const PageComponent = PAGE_MAP[activeTab];

  return (
    <div className="app-shell">
      <EmergencyOverlay />

      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="app-main">
        <div className="main-content-wrapper">
          <PageComponent />
        </div>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      <style>{`
        @keyframes slide-in { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <EmergencyProvider>
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#FFFFFF', color: 'var(--text-primary)',
              borderRadius: '14px', border: '1px solid var(--border-subtle)',
              padding: '12px 24px', fontSize: '14px', fontWeight: 600,
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
            }
          }}
        />
        <Routes>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/*"        element={<AppShell />} />
        </Routes>
      </EmergencyProvider>
    </AuthProvider>
  );
}
