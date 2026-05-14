/**
 * KCE Connect — Sidebar (Agent 2: Professional Icons + Agent 3: Responsive)
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../utils';
import logoImg from '../../assets/logo.png';
import { notificationService } from '../../services/notificationService';

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
  Notifications: ({ filled }: { filled?: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Messages: ({ filled }: { filled?: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  People: ({ filled }: { filled?: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
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
  Search: ({ filled }: { filled?: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  Events: ({ filled }: { filled?: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Groups: ({ filled }: { filled?: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Jobs: ({ filled }: { filled?: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  Resources: ({ filled }: { filled?: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
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
  { id: 'feed',          label: 'Home',          Icon: Icons.Home          },
  { id: 'search',        label: 'Search',        Icon: Icons.Search        },
  { id: 'explore',       label: 'Explore',       Icon: Icons.Explore       },
  { id: 'people',        label: 'People',        Icon: Icons.People        },
  { id: 'messages',      label: 'Messages',      Icon: Icons.Messages      },
  { id: 'events',        label: 'Events',        Icon: Icons.Events        },
  { id: 'groups',        label: 'Study Groups',  Icon: Icons.Groups        },
  { id: 'jobs',          label: 'Jobs',          Icon: Icons.Jobs          },
  { id: 'resources',     label: 'Resources',     Icon: Icons.Resources     },
  { id: 'notifications', label: 'Notifications', Icon: Icons.Notifications },
  { id: 'tickets',       label: 'Tickets',       Icon: Icons.Tickets       },
  { id: 'profile',       label: 'Profile',       Icon: Icons.Profile       },
] as const;

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Always dark by default; toggle adds .light class
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const notifs = await notificationService.getAll();
        setUnreadCount(notifs.filter((n: any) => !n.isRead).length);
      } catch {}
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (activeTab === 'notifications') setUnreadCount(0);
  }, [activeTab]);

  const SECTIONS = [
    { label: null, items: ['feed', 'search', 'explore', 'people', 'messages'] },
    { label: 'Community', items: ['events', 'groups', 'jobs', 'resources'] },
    { label: 'Campus', items: ['notifications', 'tickets', 'profile'] },
  ];

  return (
    <aside className="app-sidebar" style={{ position: 'relative', zIndex: 1 }}>

      {/* Brand Header */}
      <div style={{ padding: '20px 16px 12px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--crimson), #7B1FA2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(255,23,68,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
            flexShrink: 0, overflow: 'hidden',
          }}>
            <img src={logoImg} alt="KCE" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
          </div>
          <div className="nav-label">
            <div style={{ fontSize: 9, fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              University Portal
            </div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
              KCE<span style={{ background: 'linear-gradient(135deg, var(--crimson), #FF6B9D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CONNECT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '0 16px 8px' }} />

      {/* Navigation */}
      <nav style={{ padding: '4px 10px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {SECTIONS.map(({ label, items }) => (
          <div key={label ?? 'main'} style={{ marginBottom: 8 }}>
            {label && (
              <div className="nav-label section-label" style={{ padding: '8px 8px 4px' }}>{label}</div>
            )}
            {NAV_ITEMS.filter(n => items.includes(n.id)).map(({ id, label: navLabel, Icon }) => {
              const active = activeTab === id;
              const showBadge = id === 'notifications' && unreadCount > 0 && !active;
              return (
                <button key={id} onClick={() => onTabChange(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '9px 12px', borderRadius: 11, border: 'none',
                    background: active
                      ? 'linear-gradient(135deg, rgba(255,23,68,0.18), rgba(255,23,68,0.08))'
                      : 'transparent',
                    color: active ? '#fff' : 'rgba(255,255,255,0.42)',
                    fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', width: '100%', textAlign: 'left',
                    transition: 'all 0.15s ease-out', marginBottom: 1,
                    letterSpacing: '-0.01em',
                    boxShadow: active ? 'inset 0 0 0 1px rgba(255,23,68,0.2)' : 'none',
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.42)'; } }}
                >
                  <span style={{ position: 'relative', flexShrink: 0, display: 'flex', color: active ? 'var(--crimson)' : 'inherit' }}>
                    <Icon filled={active} />
                    {showBadge && (
                      <span style={{
                        position: 'absolute', top: -4, right: -5,
                        minWidth: 15, height: 15, borderRadius: 8,
                        background: 'var(--crimson)', color: '#fff',
                        fontSize: 8, fontWeight: 900,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '0 3px', border: '1.5px solid #09090F',
                        boxShadow: '0 0 8px rgba(255,23,68,0.5)',
                      }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </span>
                  <span className="nav-label" style={{ flex: 1 }}>{navLabel}</span>
                  {active && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--crimson)', flexShrink: 0, boxShadow: '0 0 8px rgba(255,23,68,0.8)' }} />}
                </button>
              );
            })}
          </div>
        ))}

        {/* Theme Toggle */}
        <button onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '9px 12px', borderRadius: 11, border: 'none',
            background: 'transparent', color: 'rgba(255,255,255,0.35)',
            fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', width: '100%', marginTop: 4, letterSpacing: '-0.01em',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
        >
          <span style={{ display: 'flex', flexShrink: 0 }}><Icons.ThemeToggle isDark={isDarkMode} /></span>
          <span className="nav-label">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </nav>

      {/* Report CTA */}
      <div style={{ padding: '8px 12px' }}>
        <button onClick={() => onTabChange('report')}
          style={{
            width: '100%', height: 44,
            background: 'linear-gradient(135deg, var(--crimson), #C62828)',
            color: '#fff', border: 'none', borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 13, fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(255,23,68,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
            transition: 'all 0.2s ease', fontFamily: 'inherit', letterSpacing: '0.01em',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(255,23,68,0.45), inset 0 1px 0 rgba(255,255,255,0.18)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(255,23,68,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'; }}
        >
          <Icons.Report />
          <span className="nav-label">File a Report</span>
        </button>
      </div>

      {/* User Pill */}
      <div style={{ padding: '10px 12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 14,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--crimson), #7B1FA2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, color: '#fff',
            boxShadow: '0 2px 8px rgba(255,23,68,0.3)',
          }}>
            {user ? getInitials(user.name) : '??'}
          </div>
          <div className="nav-label" style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fff', fontSize: 12, fontWeight: 700, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name.split(' ')[0]}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 500 }}>
              @{user?.rollNumber ?? 'campus'}
            </div>
          </div>
          <button onClick={() => logout()} title="Sign out"
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', padding: 6, borderRadius: 8, transition: 'all 0.15s', display: 'flex', flexShrink: 0 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--crimson)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,23,68,0.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)'; (e.currentTarget as HTMLElement).style.background = 'none'; }}
          >
            <Icons.Logout />
          </button>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) and (max-width: 1023px) {
          .app-sidebar { width: 68px !important; }
          .nav-label, .section-label { display: none !important; }
          .app-sidebar button { justify-content: center !important; padding: 11px !important; }
          .app-sidebar .sb-icon, .app-sidebar span:first-child { margin: 0 auto; }
        }
      `}</style>
    </aside>
  );
}

