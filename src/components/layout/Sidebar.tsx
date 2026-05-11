/**
 * KCE Connect — Sidebar (Agent 2: Professional Icons + Agent 3: Responsive)
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../utils';
import logoImg from '../../assets/logo.png';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/* ── Professional SVG Icon Set (Agent 2) ──── */
const Icons = {
  Home: ({ filled }: { filled?: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  ),
  Explore: ({ filled }: { filled?: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  Tickets: ({ filled }: { filled?: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="8" y1="13" x2="16" y2="13"/>
      <line x1="8" y1="17" x2="12" y2="17"/>
    </svg>
  ),
  Profile: ({ filled }: { filled?: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Report: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  Logout: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  ThemeToggle: ({ isDark }: { isDark?: boolean }) => (
    isDark ? (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    ) : (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    )
  ),
};

const NAV_ITEMS = [
  { id: 'feed',    label: 'Home',    Icon: Icons.Home    },
  { id: 'explore', label: 'Explore', Icon: Icons.Explore },
  { id: 'tickets', label: 'Tickets', Icon: Icons.Tickets },
  { id: 'profile', label: 'Profile', Icon: Icons.Profile },
] as const;

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <aside className="app-sidebar">
      {/* ── Brand ── */}
      <div style={{ padding: '24px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', overflow: 'hidden', flexShrink: 0,
          }}>
            <img src={logoImg} alt="KCE" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
          </div>
          <div className="nav-label">
            <div style={{ fontSize: 8, fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              University Portal
            </div>
            <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
              KCE<span style={{ color: 'var(--crimson)' }}>CONNECT</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ padding: '8px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button key={id} onClick={() => onTabChange(id)} className={`sb-nav-btn ${active ? 'sb-active' : ''}`}>
              <span className="sb-icon"><Icon filled={active} /></span>
              <span className="nav-label sb-label">{label}</span>
              {active && <span className="sb-active-dot" />}
            </button>
          );
        })}

        <button onClick={() => setIsDarkMode(!isDarkMode)} className="sb-nav-btn mt-auto" style={{ marginTop: 'auto' }}>
          <span className="sb-icon"><Icons.ThemeToggle isDark={isDarkMode} /></span>
          <span className="nav-label sb-label">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </nav>

      {/* ── Report CTA ── */}
      <div style={{ padding: '0 12px 16px' }}>
        <button onClick={() => onTabChange('report')} className="sb-cta">
          <Icons.Report />
          <span className="nav-label">File a Report</span>
        </button>
      </div>

      {/* ── User Pill ── */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="sb-user-pill">
          <div className="sb-avatar">{user ? getInitials(user.name) : '??'}</div>
          <div className="nav-label sb-user-info">
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name.split(' ')[0]}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 500 }}>
              @{user?.rollNumber ?? 'campus'}
            </div>
          </div>
          <button className="sb-logout" onClick={() => logout()} title="Sign out">
            <Icons.Logout />
          </button>
        </div>
      </div>

      <style>{`
        .sb-nav-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 11px 14px;
          border-radius: 12px;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.45);
          font-family: inherit;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease-out;
          width: 100%;
          position: relative;
        }
        .sb-nav-btn:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .sb-nav-btn.sb-active { background: rgba(196,18,48,0.12); color: #fff; }
        .sb-nav-btn.sb-active .sb-icon { color: var(--crimson); }
        .sb-icon { flex-shrink: 0; display: flex; }
        .sb-active-dot {
          margin-left: auto;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--crimson);
          flex-shrink: 0;
        }
        .sb-cta {
          width: 100%;
          height: 48px;
          background: var(--crimson);
          color: #fff;
          border: none;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(196,18,48,0.3);
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .sb-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(196,18,48,0.4); }
        .sb-user-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .sb-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: var(--crimson);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 800; color: #fff;
          flex-shrink: 0;
        }
        .sb-user-info { flex: 1; min-width: 0; }
        .sb-logout {
          background: none; border: none;
          color: rgba(255,255,255,0.25);
          cursor: pointer; padding: 6px;
          border-radius: 8px;
          transition: all 0.15s;
          flex-shrink: 0;
          display: flex;
        }
        .sb-logout:hover { color: var(--crimson); background: rgba(196,18,48,0.1); }

        /* Collapsed sidebar for medium screens */
        @media (min-width: 768px) and (max-width: 1023px) {
          .app-sidebar { width: 72px !important; }
          .nav-label, .sb-active-dot { display: none !important; }
          .sb-nav-btn { justify-content: center; padding: 12px; }
          .sb-cta { width: 48px; border-radius: 50%; padding: 0; }
          .sb-user-pill { justify-content: center; padding: 8px; }
          .sb-logout { display: none; }
        }
      `}</style>
    </aside>
  );
}
