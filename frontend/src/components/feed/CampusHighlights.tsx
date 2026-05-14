import { TRENDING_TOPICS, UPCOMING_EVENTS } from '../../utils/dummyData';

export default function CampusHighlights() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Campus Notice Banner (Glassmorphism) ── */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
        padding: '20px',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--crimson)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Important</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
        </div>
        <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: 6, letterSpacing: '-0.01em' }}>Semester Registration</h4>
        <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.5, marginBottom: 16 }}>
          Last date to register for current semester is <strong style={{ color: '#fff' }}>April 28</strong>.
        </p>
        <button style={{
          width: '100%', padding: '10px', borderRadius: '10px',
          background: '#fff', color: 'var(--slate-900)',
          border: 'none', fontSize: '12px', fontWeight: 700,
          cursor: 'pointer', transition: 'all 0.2s'
        }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Access Portal
        </button>
      </div>

      {/* ── Upcoming Events ── */}
      <div className="card" style={{ padding: '16px' }}>
        <h4 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
          Upcoming Events
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {UPCOMING_EVENTS.map((event, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, padding: '10px', borderRadius: '12px',
              borderLeft: `4px solid ${i % 2 === 0 ? 'var(--crimson)' : 'var(--accent)'}`,
              background: 'var(--slate-50)',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--slate-100)'}
              onMouseOut={e => e.currentTarget.style.background = 'var(--slate-50)'}
            >
              <div style={{ textAlign: 'center', minWidth: 32 }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{event.date.split(',')[0]}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{event.date.split(' ')[1]}</div>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{event.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Trending Topics (Pill Chips) ── */}
      <div className="card" style={{ padding: '16px' }}>
        <h4 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
          Trending Topics
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {TRENDING_TOPICS.map((topic, i) => (
            <div key={i} style={{
              padding: '6px 12px', borderRadius: '100px',
              background: 'var(--slate-100)', color: 'var(--text-secondary)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s ease', border: '1px solid transparent'
            }}
              onMouseOver={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.borderColor = 'var(--slate-200)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'var(--slate-100)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              #{topic.tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
