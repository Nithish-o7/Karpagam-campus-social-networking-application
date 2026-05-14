/**
 * Agent 5 — CampusHighlights v11
 * Zero card borders · Arc-style compact widgets
 */
import { TRENDING_TOPICS, UPCOMING_EVENTS } from '../../utils/dummyData';

const COLORS = ['#E5484D','#4488FF','#00C896','#9B6DFF','#F5A623'];

export default function CampusHighlights() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0 }}>

      {/* ─ Pinned notice — subtle gradient surface, no border */}
      <div style={{
        margin:'0 0 20px', padding:'14px 16px',
        background:'linear-gradient(135deg,rgba(229,72,77,.11) 0%,rgba(155,109,255,.07) 100%)',
        borderRadius:10, position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(229,72,77,.25),transparent)',pointerEvents:'none' }} />
        <div style={{ fontSize:9,fontWeight:700,color:'var(--red)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:7 }}>Pinned Notice</div>
        <div style={{ fontSize:13,fontWeight:600,color:'var(--t1)',lineHeight:1.4,marginBottom:4 }}>Semester Registration</div>
        <div style={{ fontSize:11,color:'var(--t2)',lineHeight:1.55,marginBottom:12 }}>
          Last date: <span style={{ color:'var(--t1)',fontWeight:500 }}>April 28</span>. Register before the deadline.
        </div>
        <button
          style={{ padding:'5px 12px',borderRadius:6,border:'none',background:'rgba(255,255,255,.09)',color:'rgba(255,255,255,.8)',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'var(--font)',backdropFilter:'blur(8px)',transition:'background .1s' }}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.16)';}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.09)';}}
        >
          Access Portal →
        </button>
      </div>

      {/* ─ Events */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:9,fontWeight:600,color:'var(--t4)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:8,paddingLeft:2 }}>
          Upcoming
        </div>
        {UPCOMING_EVENTS.map((ev, i) => (
          <div key={i}
            style={{ display:'flex',alignItems:'center',gap:10,padding:'8px 8px',borderRadius:7,cursor:'pointer',transition:'background .1s' }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.04)';}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';}}
          >
            <div style={{ width:3,height:30,borderRadius:2,flexShrink:0,background:COLORS[i%COLORS.length],opacity:.75 }} />
            <div style={{ textAlign:'center',flexShrink:0,width:26 }}>
              <div style={{ fontSize:8,fontWeight:600,color:'var(--t4)',textTransform:'uppercase',letterSpacing:'.04em' }}>{ev.date.split(' ')[0]}</div>
              <div style={{ fontSize:14,fontWeight:700,color:'var(--t1)',lineHeight:1 }}>{ev.date.split(' ')[1]?.replace(',','')}</div>
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:12,fontWeight:500,color:'var(--t1)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{ev.title}</div>
              <div style={{ fontSize:10,color:'var(--t3)',marginTop:1 }}>{ev.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ─ Trending — ranked list */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:9,fontWeight:600,color:'var(--t4)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:8,paddingLeft:2 }}>
          Trending
        </div>
        {TRENDING_TOPICS.slice(0,6).map((t, i) => (
          <div key={i}
            style={{ display:'flex',alignItems:'center',gap:9,padding:'7px 8px',borderRadius:7,cursor:'pointer',transition:'background .1s' }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.04)';}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';}}
          >
            <span style={{ fontSize:10,color:'var(--t4)',fontWeight:600,minWidth:14,textAlign:'right',flexShrink:0 }}>{i+1}</span>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:12,fontWeight:500,color:'var(--t1)' }}>#{t.tag}</div>
              {(t as any).count && <div style={{ fontSize:10,color:'var(--t4)',marginTop:1 }}>{(t as any).count} posts</div>}
            </div>
            <div style={{ width:6,height:6,borderRadius:'50%',flexShrink:0,background:i<2?'var(--red)':i<4?'var(--amber)':'var(--t4)',opacity:i<2?1:.5 }} />
          </div>
        ))}
      </div>

      {/* ─ Stats 2×2 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        {[
          { l:'Students', v:'4.2k', c:'#4488FF' },
          { l:'Online',   v:'312',  c:'#00C896' },
          { l:'Today',    v:'89',   c:'#9B6DFF' },
          { l:'Events',   v:'14',   c:'#F5A623' },
        ].map(({ l, v, c }) => (
          <div key={l} style={{ padding:'10px 12px',borderRadius:8,background:'rgba(255,255,255,.025)' }}>
            <div style={{ fontSize:16,fontWeight:700,color:c,letterSpacing:'-.02em' }}>{v}</div>
            <div style={{ fontSize:9,color:'var(--t4)',marginTop:2,fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em' }}>{l}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
