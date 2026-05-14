/**
 * KCE Connect — Bottom Navigation (Agent 2: Pro SVG Icons + Agent 3: Mobile-safe)
 */
interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAV_ITEMS = [
  {
    id: 'feed', label: 'Home',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth={active ? '0' : '1.8'} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
        <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.8" fill="none"/>
      </svg>
    ),
  },
  {
    id: 'explore', label: 'Explore',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={active ? '2.2' : '1.8'} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
    ),
  },
  {
    id: 'report', label: 'Report',
    icon: (_active: boolean) => (
      <div style={{
        width: 44, height: 44, borderRadius: '50%', background: 'var(--crimson)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(196,18,48,0.35)', marginTop: -18,
        border: '3px solid white',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </div>
    ),
  },
  {
    id: 'tickets', label: 'Tickets',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="12" y2="17"/>
      </svg>
    ),
  },
  {
    id: 'profile', label: 'Profile',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="mobile-dock">
      {NAV_ITEMS.map(({ id, label, icon }) => {
        const active = activeTab === id;
        const isReport = id === 'report';
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`dock-btn ${active && !isReport ? 'active' : ''}`}
            style={isReport ? { marginBottom: 8 } : {}}
          >
            {icon(active)}
            {!isReport && <span className="dock-btn-label" style={{ color: active ? 'var(--crimson)' : 'var(--text-faint)' }}>{label}</span>}
          </button>
        );
      })}
    </div>
  );
}
