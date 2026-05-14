import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../utils';
import logoImg from '../../assets/logo.png';

interface AppHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onMenuToggle: () => void;
}

export default function AppHeader({ onMenuToggle }: AppHeaderProps) {
  const [notifCount] = useState(3);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Hamburger — mobile only */}
        <button
          className="hamburger-btn"
          onClick={onMenuToggle}
          style={{ 
            width: 32, height: 32, border: 'none', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="var(--text-primary)" strokeWidth="2.5" strokeLinecap="round">
            <line x1="4" y1="7"  x2="20" y2="7"/>
            <line x1="4" y1="12" x2="20" y2="12"/>
            <line x1="4" y1="17" x2="20" y2="17"/>
          </svg>
        </button>

        {/* Logo Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
            overflow: 'hidden', border: '1.5px solid var(--border-subtle)',
            background: '#fff'
          }}>
            <img src={logoImg} alt="KCE Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="brand-text" style={{ fontSize: '21px' }}>
            KCE<span className="brand-accent" style={{ fontSize: '21px' }}>CONNECT</span>
          </div>
        </div>
      </div>

      {/* Right actions - Compact & Polished */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
        <button 
          className="btn-icon" 
          style={{ color: 'var(--slate-500)', width: 32, height: 32 }}
          onClick={() => setIsDarkMode(!isDarkMode)}
          title="Toggle Theme"
        >
          {isDarkMode ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>

        <button className="btn-icon" style={{ color: 'var(--slate-500)', width: 32, height: 32 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </button>

        <button className="btn-icon" style={{ position: 'relative', color: 'var(--slate-500)', width: 32, height: 32 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          {notifCount > 0 && (
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 5, height: 5, background: 'var(--crimson)',
              borderRadius: '50%', border: '1.5px solid #fff',
            }}/>
          )}
        </button>

        <div style={{ width: 1, height: 16, background: 'var(--slate-200)', margin: '0 4px' }} />

        {/* User Profile Trigger */}
        <div 
          className="profile-trigger"
          style={{ 
            display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px', 
            borderRadius: '100px', cursor: 'pointer', transition: 'background 0.2s',
            background: showProfileMenu ? 'var(--slate-100)' : 'transparent'
          }}
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'var(--slate-800)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700
          }}>
            {user ? getInitials(user.name) : '??'}
          </div>
          <span className="user-name-label">
            {user?.name.split(' ')[0]}
          </span>
          <svg 
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="3" 
            style={{ transform: showProfileMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>

        {/* Profile Dropdown Menu */}
        {showProfileMenu && (
          <>
            <div 
              style={{ position: 'fixed', inset: 0, zIndex: 90 }} 
              onClick={() => setShowProfileMenu(false)} 
            />
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '13px' }}>{user?.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role} • {user?.department || 'Campus'}</div>
              </div>
              <div className="dropdown-divider" />
              <button className="dropdown-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                View Profile
              </button>
              <button className="dropdown-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                Settings
              </button>
              <div className="dropdown-divider" />
              <button 
                className="dropdown-item logout" 
                onClick={handleLogout}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Log out
              </button>
            </div>
          </>
        )}
      </div>
      
      <style>{`
        .user-name-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          display: none;
        }
        .profile-trigger:hover {
          background: var(--slate-100) !important;
        }
        .profile-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 200px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
          border: 1px solid var(--border-subtle);
          padding: 6px;
          z-index: 100;
          animation: slideUp 0.2s var(--ease-out);
        }
        .dropdown-header {
          padding: 10px 12px;
        }
        .dropdown-divider {
          height: 1px;
          background: var(--slate-100);
          margin: 4px 0;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 8px 12px;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s;
          text-align: left;
        }
        .dropdown-item:hover {
          background: var(--slate-50);
          color: var(--text-primary);
        }
        .dropdown-item.logout {
          color: var(--crimson);
        }
        .dropdown-item.logout:hover {
          background: #fff5f5;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (min-width: 768px) {
          .user-name-label { display: block; }
          .hamburger-btn { display: none !important; }
        }
        .brand-text {
          font-size: 17px;
          font-weight: 900;
          color: var(--text-primary);
          letter-spacing: -0.03em;
          line-height: 1;
          display: flex;
          align-items: baseline;
        }
        .brand-accent {
          color: var(--crimson);
          margin-left: 1px;
          font-weight: 900;
          font-size: 17px;
        }
      `}</style>
    </header>
  );
}
