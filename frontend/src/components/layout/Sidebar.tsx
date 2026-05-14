/**
 * KCE Connect — Sidebar v10 (Cinematic Recomposition)
 * Inspired by: Linear · Raycast · Arc Browser
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

/* ── Icon set — 16px, thin stroke ── */
const I = {
  Home:       ({ on }: { on?: boolean }) => <svg width="16" height="16" viewBox="0 0 24 24" fill={on?'currentColor':'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
  Search:     ({ on }: { on?: boolean }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Explore:    ({ on }: { on?: boolean }) => <svg width="16" height="16" viewBox="0 0 24 24" fill={on?'currentColor':'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  People:     ({ on }: { on?: boolean }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Messages:   ({ on }: { on?: boolean }) => <svg width="16" height="16" viewBox="0 0 24 24" fill={on?'currentColor':'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Events:     ({ on }: { on?: boolean }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Groups:     ({ on }: { on?: boolean }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Jobs:       ({ on }: { on?: boolean }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  Resources:  ({ on }: { on?: boolean }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Bell:       ({ on }: { on?: boolean }) => <svg width="16" height="16" viewBox="0 0 24 24" fill={on?'currentColor':'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Ticket:     ({ on }: { on?: boolean }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>,
  Profile:    ({ on }: { on?: boolean }) => <svg width="16" height="16" viewBox="0 0 24 24" fill={on?'currentColor':'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Sun:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon:       () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Report:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Logout:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

const NAV: { id: string; label: string; Icon: (p: { on?: boolean }) => JSX.Element }[] = [
  { id: 'feed',          label: 'Home',          Icon: I.Home       },
  { id: 'search',        label: 'Search',        Icon: I.Search     },
  { id: 'explore',       label: 'Explore',       Icon: I.Explore    },
  { id: 'people',        label: 'People',        Icon: I.People     },
  { id: 'messages',      label: 'Messages',      Icon: I.Messages   },
  { id: 'events',        label: 'Events',        Icon: I.Events     },
  { id: 'groups',        label: 'Groups',        Icon: I.Groups     },
  { id: 'jobs',          label: 'Jobs',          Icon: I.Jobs       },
  { id: 'resources',     label: 'Resources',     Icon: I.Resources  },
  { id: 'notifications', label: 'Notifications', Icon: I.Bell       },
  { id: 'tickets',       label: 'Tickets',       Icon: I.Ticket     },
  { id: 'profile',       label: 'Profile',       Icon: I.Profile    },
];

const SECTIONS = [
  { items: ['feed','search','explore','people','messages'] },
  { label: 'Community', items: ['events','groups','jobs','resources'] },
  { label: 'Campus',    items: ['notifications','tickets','profile'] },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user, logout } = useAuth();
  const [isDark, setIsDark]       = useState(true);
  const [unread, setUnread]       = useState(0);
  const [hover,  setHover]        = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const n = await notificationService.getAll();
        setUnread(n.filter((x: any) => !x.isRead).length);
      } catch {}
    };
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [user]);

  useEffect(() => { if (activeTab === 'notifications') setUnread(0); }, [activeTab]);

  return (
    <aside style={{
      width: 220, height: '100dvh', display: 'flex', flexDirection: 'column',
      background: 'var(--sidebar-bg)',
      borderRight: '1px solid rgba(255,255,255,0.04)',
      position: 'relative', zIndex: 100, overflow: 'hidden',
      userSelect: 'none',
    }}>

      {/* Ambient top glow */}
      <div style={{
        position: 'absolute', top: -80, left: -40, width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(229,72,77,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Brand */}
      <div style={{ padding: '20px 16px 12px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7, overflow: 'hidden', flexShrink: 0,
            background: 'rgba(229,72,77,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src={logoImg} alt="KCE" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
              KCE<span style={{ color: 'var(--accent)' }}>Connect</span>
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>
              Campus Network
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 10px' }}>
        {SECTIONS.map(({ label, items }, si) => (
          <div key={si} style={{ marginBottom: si < SECTIONS.length - 1 ? 20 : 0 }}>
            {label && (
              <div style={{
                fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.18)',
                textTransform: 'uppercase', letterSpacing: '0.12em',
                padding: '8px 6px 6px',
              }}>
                {label}
              </div>
            )}
            {NAV.filter(n => items.includes(n.id)).map(({ id, label: lbl, Icon }) => {
              const active = activeTab === id;
              const hovered = hover === id;
              const badge = id === 'notifications' && unread > 0 && !active;
              return (
                <button key={id} onClick={() => onTabChange(id)}
                  onMouseEnter={() => setHover(id)}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    width: '100%', padding: '7px 8px', marginBottom: 1,
                    border: 'none', borderRadius: 7, cursor: 'pointer',
                    background: active
                      ? 'rgba(229,72,77,0.1)'
                      : hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
                    color: active ? '#fff' : hovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.38)',
                    fontFamily: 'var(--font)', fontSize: 13, fontWeight: active ? 500 : 400,
                    letterSpacing: '-0.01em', transition: 'all 0.1s ease',
                    textAlign: 'left', position: 'relative',
                  }}
                >
                  {/* Active indicator */}
                  {active && (
                    <div style={{
                      position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                      width: 2, height: 14, borderRadius: 2, background: 'var(--accent)',
                    }} />
                  )}
                  <span style={{
                    color: active ? 'var(--accent)' : hovered ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.3)',
                    display: 'flex', flexShrink: 0, transition: 'color 0.1s',
                    position: 'relative',
                  }}>
                    <Icon on={active} />
                    {badge && (
                      <span style={{
                        position: 'absolute', top: -3, right: -3,
                        width: 5, height: 5, borderRadius: '50%',
                        background: 'var(--accent)', border: '1px solid var(--sidebar-bg)',
                      }} />
                    )}
                  </span>
                  <span style={{ flex: 1 }}>{lbl}</span>
                  {badge && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 10,
                      background: 'var(--accent)', color: '#fff', letterSpacing: 0,
                    }}>
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Report */}
        <button onClick={() => onTabChange('report')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '7px 8px', borderRadius: 7,
            border: 'none', background: 'transparent', cursor: 'pointer',
            color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font)',
            fontSize: 12, fontWeight: 400, letterSpacing: '-0.01em',
            transition: 'all 0.1s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
        >
          <span style={{ display: 'flex', color: 'rgba(255,165,0,0.6)', flexShrink: 0 }}><I.Report /></span>
          File a Report
        </button>

        {/* Theme */}
        <button onClick={() => setIsDark(!isDark)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '7px 8px', borderRadius: 7,
            border: 'none', background: 'transparent', cursor: 'pointer',
            color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font)',
            fontSize: 12, fontWeight: 400, letterSpacing: '-0.01em',
            transition: 'all 0.1s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
        >
          <span style={{ display: 'flex', flexShrink: 0, color: 'rgba(255,255,255,0.3)' }}>
            {isDark ? <I.Sun /> : <I.Moon />}
          </span>
          {isDark ? 'Light mode' : 'Dark mode'}
        </button>
      </div>

      {/* User pill — at bottom */}
      <div style={{
        padding: '10px 12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          {/* Avatar */}
          <div style={{
            width: 28, height: 28, borderRadius: 7, flexShrink: 0,
            background: 'linear-gradient(135deg, #E5484D 0%, #9B6DFF 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em',
          }}>
            {user ? getInitials(user.name) : '?'}
          </div>
          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name.split(' ')[0]}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>
              @{user?.rollNumber ?? 'campus'}
            </div>
          </div>
          {/* Logout */}
          <button onClick={() => logout()} title="Sign out"
            style={{
              display: 'flex', padding: 5, borderRadius: 5, border: 'none',
              background: 'transparent', cursor: 'pointer', color: 'rgba(255,255,255,0.2)',
              transition: 'color 0.1s', flexShrink: 0,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.2)'; }}
          >
            <I.Logout />
          </button>
        </div>
      </div>

      {/* Collapsed state — tablets */}
      <style>{`
        @media (min-width: 768px) and (max-width: 1023px) {
          .app-sidebar { width: 52px !important; }
          .app-sidebar span:not([style*="position: absolute"]) ~ span,
          .app-sidebar div[style*="fontSize: 9px"],
          .app-sidebar div[style*="fontSize: 10px"][style*="Campus"],
          .app-sidebar div[style*="flex: 1"] { display: none !important; }
          .app-sidebar button { justify-content: center !important; padding: 9px !important; }
        }
      `}</style>
    </aside>
  );
}
