/**
 * Agent 1b — Sidebar v12: Deep charcoal/navy · Maroon active bar
 * bg-slate-900 equivalent · 3px maroon left border on active
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../utils';
import logoImg from '../../assets/logo.png';
import { notificationService } from '../../services/notificationService';

interface SidebarProps { activeTab: string; onTabChange: (tab: string) => void; }

const Ic = {
  Home:      (a?:boolean) => <svg width="16" height="16" viewBox="0 0 24 24" fill={a?'currentColor':'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
  Search:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Explore:   (a?:boolean) => <svg width="16" height="16" viewBox="0 0 24 24" fill={a?'currentColor':'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  People:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Messages:  (a?:boolean) => <svg width="16" height="16" viewBox="0 0 24 24" fill={a?'currentColor':'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Events:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Groups:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Jobs:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  Resources: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Bell:      (a?:boolean) => <svg width="16" height="16" viewBox="0 0 24 24" fill={a?'currentColor':'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Ticket:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/></svg>,
  Profile:   (a?:boolean) => <svg width="16" height="16" viewBox="0 0 24 24" fill={a?'currentColor':'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Report:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Moon:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Sun:       () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Logout:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

const NAV = [
  { id:'feed',          label:'Home',          Icon:Ic.Home      },
  { id:'search',        label:'Search',        Icon:Ic.Search    },
  { id:'explore',       label:'Explore',       Icon:Ic.Explore   },
  { id:'people',        label:'People',        Icon:Ic.People    },
  { id:'messages',      label:'Messages',      Icon:Ic.Messages  },
  { id:'events',        label:'Events',        Icon:Ic.Events    },
  { id:'groups',        label:'Groups',        Icon:Ic.Groups    },
  { id:'jobs',          label:'Jobs',          Icon:Ic.Jobs      },
  { id:'resources',     label:'Resources',     Icon:Ic.Resources },
  { id:'notifications', label:'Notifications', Icon:Ic.Bell      },
  { id:'tickets',       label:'Tickets',       Icon:Ic.Ticket    },
  { id:'profile',       label:'Profile',       Icon:Ic.Profile   },
];

const SECTIONS = [
  { label:'',          ids:['feed','search','explore','people','messages'] },
  { label:'Community', ids:['events','groups','jobs','resources']          },
  { label:'Campus',    ids:['notifications','tickets','profile']           },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false); // Light mode default
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
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
    <aside style={{
      width:220, height:'100dvh', display:'flex', flexDirection:'column',
      background:'#0F172A', position:'relative', overflow:'hidden',
      boxShadow:'4px 0 24px rgba(0,0,0,0.15)',
    }}>
      {/* Subtle top ambient glow — maroon */}
      <div style={{ position:'absolute',top:-50,left:-20,width:140,height:140,background:'radial-gradient(circle,rgba(139,29,52,.12) 0%,transparent 70%)',pointerEvents:'none',zIndex:0 }} />

      {/* Brand */}
      <div style={{ padding:'20px 16px 14px', zIndex:1, position:'relative' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:30,height:30,borderRadius:8,overflow:'hidden',flexShrink:0,background:'rgba(139,29,52,.2)',display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid rgba(139,29,52,.3)' }}>
            <img src={logoImg} alt="" style={{ width:'100%',height:'100%',objectFit:'contain' }} />
          </div>
          <div>
            <div style={{ fontSize:13,fontWeight:800,color:'#F1F5F9',letterSpacing:'-.03em',lineHeight:1 }}>
              KCE<span style={{ color:'#8B1D34' }}>Connect</span>
            </div>
            <div style={{ fontSize:9,color:'rgba(255,255,255,.25)',letterSpacing:'.1em',textTransform:'uppercase',marginTop:2 }}>Campus Network</div>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div style={{ height:1, background:'rgba(255,255,255,.05)', margin:'0 16px 6px' }} />

      {/* Navigation */}
      <nav style={{ flex:1, overflowY:'auto', padding:'2px 10px', zIndex:1, position:'relative' }}>
        {SECTIONS.map(({ label, ids }, si) => (
          <div key={si} style={{ marginBottom: si < 2 ? 20 : 0 }}>
            {label && (
              <div style={{ fontSize:9,fontWeight:700,color:'rgba(148,163,184,.5)',textTransform:'uppercase',letterSpacing:'.12em',padding:'8px 6px 5px' }}>
                {label}
              </div>
            )}
            {NAV.filter(n=>ids.includes(n.id)).map(({ id, label:lbl, Icon }) => {
              const on = activeTab === id;
              const badge = id==='notifications' && unread>0 && !on;
              return (
                <button key={id} onClick={()=>onTabChange(id)}
                  style={{
                    display:'flex', alignItems:'center', gap:10,
                    width:'100%', padding:'7px 10px 7px 8px', marginBottom:1,
                    border:'none', borderRadius:8, cursor:'pointer',
                    /* Active: 3px maroon left border + slightly lighter bg */
                    borderLeft: on ? '3px solid #8B1D34' : '3px solid transparent',
                    paddingLeft: on ? '7px' : '8px',
                    background: on ? 'rgba(139,29,52,.12)' : 'transparent',
                    color: on ? '#F1F5F9' : 'rgba(148,163,184,.8)',
                    fontFamily:'var(--font)', fontSize:13,
                    fontWeight: on ? 600 : 400, letterSpacing:'-.01em',
                    transition:'all .12s ease', textAlign:'left', position:'relative',
                  }}
                  onMouseEnter={e=>{if(!on){const el=e.currentTarget as HTMLElement;el.style.background='rgba(255,255,255,.05)';el.style.color='rgba(226,232,240,.9)';}}}
                  onMouseLeave={e=>{if(!on){const el=e.currentTarget as HTMLElement;el.style.background='transparent';el.style.color='rgba(148,163,184,.8)';}}}
                >
                  <span style={{ display:'flex',flexShrink:0, color:on?'#8B1D34':'rgba(100,116,139,.8)', transition:'color .12s', position:'relative' }}>
                    <Icon on={on} />
                    {badge && <span style={{ position:'absolute',top:-2,right:-2,width:5,height:5,borderRadius:'50%',background:'#8B1D34',border:'1px solid #0F172A' }} />}
                  </span>
                  <span style={{ flex:1 }}>{lbl}</span>
                  {badge && <span style={{ fontSize:9,fontWeight:700,padding:'1px 5px',borderRadius:10,background:'#8B1D34',color:'#fff' }}>{unread>9?'9+':unread}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Utilities */}
      <div style={{ padding:'4px 10px', zIndex:1 }}>
        {[
          { label:'File a Report', icon:<Ic.Report/>, cb:()=>onTabChange('report'), col:'rgba(217,119,6,.8)' },
          { label:isDark?'Light mode':'Dark mode', icon:isDark?<Ic.Sun/>:<Ic.Moon/>, cb:()=>setIsDark(!isDark), col:'rgba(148,163,184,.5)' },
        ].map(({ label, icon, cb, col }) => (
          <button key={label} onClick={cb}
            style={{ display:'flex',alignItems:'center',gap:10,width:'100%',padding:'6px 8px',marginBottom:1,border:'none',borderLeft:'3px solid transparent',borderRadius:8,cursor:'pointer',background:'transparent',color:'rgba(148,163,184,.55)',fontFamily:'var(--font)',fontSize:12,fontWeight:400,transition:'all .12s' }}
            onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background='rgba(255,255,255,.05)';el.style.color='rgba(226,232,240,.8)';}}
            onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background='transparent';el.style.color='rgba(148,163,184,.55)';}}
          >
            <span style={{ display:'flex',flexShrink:0,color:col }}>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Separator */}
      <div style={{ height:1, background:'rgba(255,255,255,.05)', margin:'4px 16px 0' }} />

      {/* User pill */}
      <div style={{ padding:'10px 12px 16px', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:28,height:28,borderRadius:7,flexShrink:0,background:'linear-gradient(135deg,#8B1D34,#C0392B)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'#fff',letterSpacing:'-.01em' }}>
            {user?getInitials(user.name):'?'}
          </div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:12,fontWeight:600,color:'rgba(226,232,240,.8)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{user?.name.split(' ')[0]}</div>
            <div style={{ fontSize:10,color:'rgba(148,163,184,.4)',marginTop:1 }}>@{user?.rollNumber??'campus'}</div>
          </div>
          <button onClick={()=>logout()} title="Sign out"
            style={{ display:'flex',padding:5,borderRadius:5,border:'none',background:'transparent',cursor:'pointer',color:'rgba(148,163,184,.3)',transition:'color .12s',flexShrink:0 }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='#8B1D34';}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color='rgba(148,163,184,.3)';}}
          >
            <Ic.Logout/>
          </button>
        </div>
      </div>

      <style>{`
        @media(min-width:768px)and(max-width:1023px){
          .app-sidebar{width:56px!important}
          .app-sidebar nav button span:last-child,
          .app-sidebar div[style*="Campus Network"] { display:none!important; }
          .app-sidebar nav button { justify-content:center!important; }
        }
      `}</style>
    </aside>
  );
}
