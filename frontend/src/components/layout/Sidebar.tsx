/**
 * Agent 3 — Sidebar v11: Raycast × Linear × Arc
 * No highlight boxes · Left indicator bar · Micro typography
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../utils';
import logoImg from '../../assets/logo.png';
import { notificationService } from '../../services/notificationService';

interface SidebarProps { activeTab: string; onTabChange: (tab: string) => void; }

/* 15px icons — Feather-style, very thin */
const Ic = {
  Home:      (a?:boolean) => <svg width="15" height="15" viewBox="0 0 24 24" fill={a?'currentColor':'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
  Search:    (_?:boolean) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Explore:   (a?:boolean) => <svg width="15" height="15" viewBox="0 0 24 24" fill={a?'currentColor':'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  People:    (_?:boolean) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Messages:  (a?:boolean) => <svg width="15" height="15" viewBox="0 0 24 24" fill={a?'currentColor':'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Events:    (_?:boolean) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Groups:    (_?:boolean) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Jobs:      (_?:boolean) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  Resources: (_?:boolean) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Bell:      (a?:boolean) => <svg width="15" height="15" viewBox="0 0 24 24" fill={a?'currentColor':'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Ticket:    (_?:boolean) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/></svg>,
  Profile:   (a?:boolean) => <svg width="15" height="15" viewBox="0 0 24 24" fill={a?'currentColor':'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Report:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Logout:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Sun:       () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon:      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
};

const NAV = [
  { id:'feed',          label:'Home',          ic:Ic.Home      },
  { id:'search',        label:'Search',        ic:Ic.Search    },
  { id:'explore',       label:'Explore',       ic:Ic.Explore   },
  { id:'people',        label:'People',        ic:Ic.People    },
  { id:'messages',      label:'Messages',      ic:Ic.Messages  },
  { id:'events',        label:'Events',        ic:Ic.Events    },
  { id:'groups',        label:'Groups',        ic:Ic.Groups    },
  { id:'jobs',          label:'Jobs',          ic:Ic.Jobs      },
  { id:'resources',     label:'Resources',     ic:Ic.Resources },
  { id:'notifications', label:'Notifications', ic:Ic.Bell      },
  { id:'tickets',       label:'Tickets',       ic:Ic.Ticket    },
  { id:'profile',       label:'Profile',       ic:Ic.Profile   },
];

const GROUPS = [
  ['feed','search','explore','people','messages'],
  ['events','groups','jobs','resources'],
  ['notifications','tickets','profile'],
];
const GROUP_LABELS = ['', 'Community', 'Campus'];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(true);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try { const n = await notificationService.getAll(); setUnread(n.filter((x:any)=>!x.isRead).length); } catch {}
    };
    load(); const t = setInterval(load, 60000); return () => clearInterval(t);
  }, [user]);

  useEffect(() => { if (activeTab==='notifications') setUnread(0); }, [activeTab]);

  return (
    <aside style={{ width:212, height:'100dvh', display:'flex', flexDirection:'column', background:'var(--sidebar-bg)', borderRight:'1px solid rgba(255,255,255,.04)', position:'relative', overflow:'hidden' }}>

      {/* Ambient top glow */}
      <div style={{ position:'absolute',top:-60,left:-30,width:160,height:160,background:'radial-gradient(circle,rgba(229,72,77,.05) 0%,transparent 70%)',pointerEvents:'none',zIndex:0 }} />

      {/* Brand */}
      <div style={{ padding:'18px 14px 10px', position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:24,height:24,borderRadius:6,overflow:'hidden',flexShrink:0,background:'rgba(229,72,77,.15)',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <img src={logoImg} alt="" style={{ width:'100%',height:'100%',objectFit:'contain' }} />
          </div>
          <div>
            <div style={{ fontSize:12,fontWeight:700,color:'rgba(255,255,255,.85)',letterSpacing:'-.03em',lineHeight:1 }}>
              KCE<span style={{ color:'var(--red)' }}>Connect</span>
            </div>
            <div style={{ fontSize:8,color:'rgba(255,255,255,.2)',letterSpacing:'.1em',textTransform:'uppercase',marginTop:2 }}>Campus · Social</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, overflowY:'auto', padding:'2px 8px', position:'relative', zIndex:1 }}>
        {GROUPS.map((ids, gi) => (
          <div key={gi} style={{ marginBottom: gi < 2 ? 18 : 0 }}>
            {GROUP_LABELS[gi] && (
              <div style={{ fontSize:9,fontWeight:600,color:'rgba(255,255,255,.16)',textTransform:'uppercase',letterSpacing:'.12em',padding:'6px 6px 5px' }}>
                {GROUP_LABELS[gi]}
              </div>
            )}
            {NAV.filter(n=>ids.includes(n.id)).map(({ id, label, ic }) => {
              const on = activeTab === id;
              const badge = id==='notifications' && unread>0 && !on;
              return (
                <button key={id} onClick={()=>onTabChange(id)}
                  style={{
                    display:'flex', alignItems:'center', gap:9,
                    width:'100%', padding:'6px 8px', marginBottom:1,
                    border:'none', borderRadius:6, cursor:'pointer',
                    background:on?'rgba(229,72,77,.09)':'transparent',
                    color:on?'rgba(255,255,255,.88)':'rgba(255,255,255,.35)',
                    fontFamily:'var(--font)', fontSize:12,
                    fontWeight:on?500:400, letterSpacing:'-.01em',
                    transition:'all .1s ease', textAlign:'left', position:'relative',
                  }}
                  onMouseEnter={e=>{ if(!on){(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.04)';(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,.6)';} }}
                  onMouseLeave={e=>{ if(!on){(e.currentTarget as HTMLElement).style.background='transparent';(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,.35)';} }}
                >
                  {/* Active bar */}
                  {on && <div style={{ position:'absolute',left:0,top:'50%',transform:'translateY(-50%)',width:2,height:13,borderRadius:2,background:'var(--red)' }} />}
                  <span style={{ display:'flex', flexShrink:0, color:on?'var(--red)':'rgba(255,255,255,.28)', transition:'color .1s', position:'relative' }}>
                    {ic(on)}
                    {badge && <span style={{ position:'absolute',top:-2,right:-2,width:5,height:5,borderRadius:'50%',background:'var(--red)',border:'1px solid var(--sidebar-bg)' }} />}
                  </span>
                  <span style={{ flex:1 }}>{label}</span>
                  {badge && <span style={{ fontSize:9,fontWeight:700,padding:'1px 5px',borderRadius:10,background:'var(--red)',color:'#fff' }}>{unread>9?'9+':unread}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Utility buttons */}
      <div style={{ padding:'6px 8px 4px', position:'relative', zIndex:1 }}>
        {[
          { label:'File a Report', icon:<Ic.Report/>, onClick:()=>onTabChange('report'), col:'rgba(245,166,35,.55)' },
          { label:isDark?'Light mode':'Dark mode', icon:isDark?<Ic.Sun/>:<Ic.Moon/>, onClick:()=>setIsDark(!isDark), col:'rgba(255,255,255,.25)' },
        ].map(({ label, icon, onClick, col }) => (
          <button key={label} onClick={onClick}
            style={{ display:'flex',alignItems:'center',gap:9,width:'100%',padding:'6px 8px',marginBottom:1,border:'none',borderRadius:6,cursor:'pointer',background:'transparent',color:'rgba(255,255,255,.25)',fontFamily:'var(--font)',fontSize:12,fontWeight:400,letterSpacing:'-.01em',transition:'all .1s' }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.04)';(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,.55)';}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,.25)';}}
          >
            <span style={{ display:'flex',flexShrink:0,color:col }}>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* User pill */}
      <div style={{ padding:'8px 10px 14px', borderTop:'1px solid rgba(255,255,255,.04)', position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:26,height:26,borderRadius:6,flexShrink:0,background:'linear-gradient(135deg,#E5484D,#9B6DFF)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:600,color:'#fff' }}>
            {user?getInitials(user.name):'?'}
          </div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:11,fontWeight:500,color:'rgba(255,255,255,.65)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{user?.name.split(' ')[0]}</div>
            <div style={{ fontSize:9,color:'rgba(255,255,255,.22)',marginTop:1 }}>@{user?.rollNumber??'campus'}</div>
          </div>
          <button onClick={()=>logout()} title="Sign out"
            style={{ display:'flex',padding:5,borderRadius:5,border:'none',background:'transparent',cursor:'pointer',color:'rgba(255,255,255,.18)',transition:'color .1s',flexShrink:0 }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='var(--red)';}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,.18)';}}
          >
            <Ic.Logout/>
          </button>
        </div>
      </div>

      <style>{`@media(min-width:768px)and(max-width:1023px){.app-sidebar{width:52px!important}.app-sidebar button{justify-content:center!important;padding:9px!important}}`}</style>
    </aside>
  );
}
