/**
 * Agent 3b — CampusHighlights v12: Premium white floating widgets
 * Hover lift · Maroon accent · Arc-style info density
 */
import { TRENDING_TOPICS, UPCOMING_EVENTS } from '../../utils/dummyData';

const COLORS = ['#8B1D34','#2563EB','#059669','#7C3AED','#D97706'];

export default function CampusHighlights() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* ── Pinned Notice — floating card with maroon accent ── */}
      <div style={{
        background:'#fff', borderRadius:20,
        boxShadow:'0 2px 8px rgba(15,23,42,0.05), 0 8px 32px rgba(15,23,42,0.06)',
        padding:'18px 20px', position:'relative', overflow:'hidden',
        transition:'box-shadow .2s, transform .2s',
      }}
        onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.boxShadow='0 4px 16px rgba(15,23,42,0.07), 0 16px 48px rgba(15,23,42,0.07)';el.style.transform='translateY(-2px)';}}
        onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.boxShadow='0 2px 8px rgba(15,23,42,0.05), 0 8px 32px rgba(15,23,42,0.06)';el.style.transform='translateY(0)';}}
      >
        {/* Top accent bar */}
        <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:'linear-gradient(90deg,#8B1D34,rgba(139,29,52,0))',pointerEvents:'none' }} />
        <div style={{ fontSize:9,fontWeight:700,color:'#8B1D34',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:8 }}>📌 Pinned Notice</div>
        <div style={{ fontSize:14,fontWeight:700,color:'#0F172A',lineHeight:1.4,marginBottom:5 }}>Semester Registration</div>
        <div style={{ fontSize:12,color:'#64748B',lineHeight:1.6,marginBottom:14 }}>
          Last date: <span style={{ color:'#0F172A',fontWeight:600 }}>April 28</span>. Register before the deadline to avoid penalties.
        </div>
        <button
          style={{ padding:'7px 16px',borderRadius:10,border:'none',background:'#8B1D34',color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'var(--font)',transition:'all .15s',boxShadow:'0 2px 8px rgba(139,29,52,.25)' }}
          onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background='#6B1528';el.style.transform='translateY(-1px)';el.style.boxShadow='0 4px 16px rgba(139,29,52,.35)';el.style.filter='brightness(1.05)';}}
          onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background='#8B1D34';el.style.transform='translateY(0)';el.style.boxShadow='0 2px 8px rgba(139,29,52,.25)';el.style.filter='none';}}
        >
          Access Portal →
        </button>
      </div>

      {/* ── Upcoming Events — floating widget ── */}
      <div style={{
        background:'#fff', borderRadius:20,
        boxShadow:'0 2px 8px rgba(15,23,42,0.05), 0 8px 32px rgba(15,23,42,0.06)',
        padding:'18px 20px',
        transition:'box-shadow .2s, transform .2s',
      }}
        onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.boxShadow='0 4px 16px rgba(15,23,42,0.07), 0 16px 48px rgba(15,23,42,0.07)';el.style.transform='translateY(-2px)';}}
        onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.boxShadow='0 2px 8px rgba(15,23,42,0.05), 0 8px 32px rgba(15,23,42,0.06)';el.style.transform='translateY(0)';}}
      >
        <div style={{ fontSize:10,fontWeight:700,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:14 }}>Upcoming Events</div>
        <div style={{ display:'flex',flexDirection:'column',gap:1 }}>
          {UPCOMING_EVENTS.map((ev, i) => (
            <div key={i}
              style={{ display:'flex',alignItems:'center',gap:12,padding:'10px 8px',borderRadius:10,cursor:'pointer',transition:'background .12s' }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='#F8FAFC';}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';}}
            >
              <div style={{ width:36,height:36,borderRadius:10,flexShrink:0,background:`${COLORS[i%COLORS.length]}12`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',border:`1px solid ${COLORS[i%COLORS.length]}20` }}>
                <div style={{ fontSize:8,fontWeight:700,color:COLORS[i%COLORS.length],textTransform:'uppercase',letterSpacing:'.04em' }}>{ev.date.split(' ')[0]}</div>
                <div style={{ fontSize:14,fontWeight:800,color:COLORS[i%COLORS.length],lineHeight:1 }}>{ev.date.split(' ')[1]?.replace(',','')}</div>
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:12,fontWeight:600,color:'#0F172A',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{ev.title}</div>
                <div style={{ fontSize:10,color:'#94A3B8',marginTop:2 }}>{ev.time}</div>
              </div>
              <div style={{ width:6,height:6,borderRadius:'50%',flexShrink:0,background:COLORS[i%COLORS.length],opacity:.5 }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Trending — floating widget ── */}
      <div style={{
        background:'#fff', borderRadius:20,
        boxShadow:'0 2px 8px rgba(15,23,42,0.05), 0 8px 32px rgba(15,23,42,0.06)',
        padding:'18px 20px',
        transition:'box-shadow .2s, transform .2s',
      }}
        onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.boxShadow='0 4px 16px rgba(15,23,42,0.07), 0 16px 48px rgba(15,23,42,0.07)';el.style.transform='translateY(-2px)';}}
        onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.boxShadow='0 2px 8px rgba(15,23,42,0.05), 0 8px 32px rgba(15,23,42,0.06)';el.style.transform='translateY(0)';}}
      >
        <div style={{ fontSize:10,fontWeight:700,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:12 }}>Trending</div>
        {TRENDING_TOPICS.slice(0,6).map((t, i) => (
          <div key={i}
            style={{ display:'flex',alignItems:'center',gap:10,padding:'8px 8px',borderRadius:8,cursor:'pointer',transition:'background .1s' }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='#F8FAFC';}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';}}
          >
            <span style={{ fontSize:11,color:'#CBD5E1',fontWeight:700,minWidth:16,textAlign:'right',flexShrink:0 }}>{i+1}</span>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:12,fontWeight:600,color:'#0F172A' }}>#{t.tag}</div>
              {(t as any).count && <div style={{ fontSize:10,color:'#94A3B8',marginTop:1 }}>{(t as any).count} posts</div>}
            </div>
            <div style={{ width:6,height:6,borderRadius:'50%',flexShrink:0,background:i<2?'#8B1D34':i<4?'#D97706':'#CBD5E1',opacity:i<2?1:.6 }} />
          </div>
        ))}
      </div>

      {/* ── Stats grid — floating cards ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {[
          { l:'Students', v:'4.2k', c:'#2563EB', bg:'#EFF6FF' },
          { l:'Online',   v:'312',  c:'#059669', bg:'#ECFDF5' },
          { l:'Today',    v:'89',   c:'#7C3AED', bg:'#F5F3FF' },
          { l:'Events',   v:'14',   c:'#D97706', bg:'#FFFBEB' },
        ].map(({ l, v, c, bg }) => (
          <div key={l} style={{ padding:'14px 16px',borderRadius:14,background:'#fff',boxShadow:'0 2px 8px rgba(15,23,42,0.05)',transition:'all .15s',cursor:'default' }}
            onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='translateY(-2px)';el.style.boxShadow='0 4px 16px rgba(15,23,42,0.08)';el.style.background=bg;}}
            onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='translateY(0)';el.style.boxShadow='0 2px 8px rgba(15,23,42,0.05)';el.style.background='#fff';}}
          >
            <div style={{ fontSize:20,fontWeight:800,color:c,letterSpacing:'-.03em',lineHeight:1 }}>{v}</div>
            <div style={{ fontSize:9,color:'#94A3B8',marginTop:4,fontWeight:700,textTransform:'uppercase',letterSpacing:'.07em' }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
