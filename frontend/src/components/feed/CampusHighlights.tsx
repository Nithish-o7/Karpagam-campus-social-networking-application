import { TRENDING_TOPICS, UPCOMING_EVENTS } from '../../utils/dummyData';

const ACCENT_COLORS = ['#E5484D','#4488FF','#00C896','#9B6DFF','#F5A623'];

export default function CampusHighlights() {
  return (
    <>
      {/* ── Notice — no card border, pure bg elevation ── */}
      <div style={{
        padding: '14px 16px',
        background: 'linear-gradient(135deg, rgba(229,72,77,0.12) 0%, rgba(155,109,255,0.08) 100%)',
        borderRadius: 10, position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle glow top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg,transparent,rgba(229,72,77,0.3),transparent)',
        }} />
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          Important Notice
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 4 }}>
          Semester Registration
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 12 }}>
          Last date: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>April 28</span>. Don't miss the deadline.
        </div>
        <button style={{
          padding: '6px 14px', borderRadius: 6, border: 'none',
          background: 'rgba(255,255,255,0.1)', color: '#fff',
          fontSize: 11, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'var(--font)', transition: 'background 0.12s',
          backdropFilter: 'blur(8px)',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
        >
          Access Portal →
        </button>
      </div>

      {/* ── Upcoming Events — compact horizontal rows ── */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, paddingLeft: 2 }}>
          Upcoming Events
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {UPCOMING_EVENTS.map((event, i) => (
            <div key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 10px', borderRadius: 7, cursor: 'pointer',
                transition: 'background 0.1s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              {/* Color accent line */}
              <div style={{
                width: 3, height: 32, borderRadius: 2, flexShrink: 0,
                background: ACCENT_COLORS[i % ACCENT_COLORS.length],
                opacity: 0.7,
              }} />
              {/* Date block */}
              <div style={{ textAlign: 'center', flexShrink: 0, width: 28 }}>
                <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {event.date.split(' ')[0]}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                  {event.date.split(' ')[1]?.replace(',', '')}
                </div>
              </div>
              {/* Event info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {event.title}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
                  {event.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Trending — pill system ── */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, paddingLeft: 2 }}>
          Trending
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {TRENDING_TOPICS.slice(0, 6).map((topic, i) => (
            <div key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 7, cursor: 'pointer',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 500, minWidth: 14, textAlign: 'right' }}>
                {i + 1}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>#{topic.tag}</div>
                {topic.count && (
                  <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 1 }}>{topic.count} posts</div>
                )}
              </div>
              {/* Activity dot */}
              <div style={{
                width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                background: i < 2 ? 'var(--accent)' : i < 4 ? 'var(--amber)' : 'var(--text-faint)',
                opacity: i < 2 ? 1 : 0.5,
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick stats strip ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 8, marginTop: 4,
      }}>
        {[
          { label: 'Students', value: '4.2k', color: '#4488FF' },
          { label: 'Online',   value: '312',  color: '#00C896' },
          { label: 'Posts today', value: '89', color: '#9B6DFF' },
          { label: 'Events',   value: '14',   color: '#F5A623' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            padding: '10px 12px', borderRadius: 8,
            background: 'rgba(255,255,255,0.025)',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color, letterSpacing: '-0.02em' }}>{value}</div>
            <div style={{ fontSize: 9, color: 'var(--text-faint)', marginTop: 2, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
          </div>
        ))}
      </div>
    </>
  );
}
