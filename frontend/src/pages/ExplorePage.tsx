/**
 * KCE Connect — Explore Page (Phase 12: Live Real-time Widgets)
 */
import { useState, useEffect } from 'react';
import PageTransition from '../components/layout/PageTransition';
import { EXPLORE_LINKS } from '../utils/dummyData';
import { useEmergency } from '../contexts/EmergencyContext';
import { campusService, type CampusEvent, type TrendingTopic } from '../services/campusService';
import { motion, AnimatePresence } from 'framer-motion';

const CAMPUS_BUILDINGS = [
  'Main Block (A-Block)', 'CST/IT Block (B-Block)', 'Mechanical Block (C-Block)',
  'ECE/EEE Block (D-Block)', 'Library Block', 'Auditorium Area',
  'Boys Hostel (Main)', 'Girls Hostel', 'Campus Mess / Dining', 'Sports Grounds',
];

/* ── Emergency Modal (Redesigned) ─────────────────────────── */
function EmergencyModal({ onClose }: { onClose: () => void }) {
  const { triggerEmergency, isTriggering } = useEmergency();
  const [location, setLocation] = useState('');
  const [clickCount, setClickCount] = useState(0);

  async function handleTrigger() {
    if (!location) return;
    if (clickCount < 1) { setClickCount(1); return; }
    try { await triggerEmergency(location); onClose(); } catch { }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ width: '100%', maxWidth: 420, padding: 40, textAlign: 'center', borderRadius: 28, boxShadow: '0 32px 64px rgba(0,0,0,0.15)' }}>
        <div style={{ fontSize: 44, marginBottom: 20 }}>🚨</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12, color: 'var(--text-primary)' }}>Emergency Dispatch</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>Immediate physical dispatch will occur. Only use in life-threatening or critical safety events.</p>

        <div style={{ textAlign: 'left', marginBottom: 28 }}>
          <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>Location Selection</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)} disabled={isTriggering} className="form-select">
            <option value="">Choose a building...</option>
            {CAMPUS_BUILDINGS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <button 
          onClick={handleTrigger} disabled={!location || isTriggering}
          style={{
            width: 140, height: 140, borderRadius: '50%', background: !location ? 'var(--border)' : 'var(--crimson)',
            color: '#fff', fontSize: 12, fontWeight: 900, cursor: !location ? 'not-allowed' : 'pointer',
            margin: '0 auto 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: location ? '0 12px 30px rgba(166,25,46,0.2)' : 'none', textTransform: 'uppercase'
          }}
        >
          {isTriggering ? '⌛' : clickCount === 0 ? 'Push to Trigger' : 'Confirm Now'}
        </button>

        <button className="btn btn-secondary btn-full" onClick={onClose} disabled={isTriggering}>Cancel Misfire</button>
      </motion.div>
    </div>
  );
}

/* ── Events Widget ─────────────────────────────────────────── */
function EventsWidget() {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    campusService.getEvents().then(setEvents).finally(() => setLoading(false));
  }, []);

  return (
    <div className="card" style={{ padding: 24 }}>
      <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>Upcoming Events</h4>
      {loading ? (
        <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)' }}>Loading real data...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {events.map((event) => {
            const d = new Date(event.date);
            const day = d.toLocaleDateString('en-IN', { weekday: 'short' });
            const dateNum = d.getDate();
            const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div key={event.id} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--bg-app)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 8, fontWeight: 900, color: 'var(--text-faint)' }}>{day}</span>
                  <span style={{ fontSize: 15, fontWeight: 900, color: 'var(--crimson)' }}>{dateNum}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontWeight: 500 }}>{time} • {event.venue}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Trending Widget ────────────────────────────────────────── */
function TrendingWidget() {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    campusService.getTrending().then(setTopics).finally(() => setLoading(false));
  }, []);

  return (
    <div className="card" style={{ padding: 24 }}>
      <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>Trending Topics</h4>
      {loading ? (
        <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)' }}>Refreshing trends...</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {topics.map((topic) => (
            <motion.div key={topic.tag} whileHover={{ scale: 1.05 }} style={{ padding: '8px 16px', borderRadius: 100, background: 'var(--bg-app)', border: '1px solid var(--border)', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              #{topic.tag} <span style={{ color: 'var(--text-faint)', marginLeft: 4, fontWeight: 500 }}>{topic.posts}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Quick Links ────────────────────────────────────────────── */
function QuickLinksWidget({ onEmergencyClick }: { onEmergencyClick: () => void }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>Quick Access</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {EXPLORE_LINKS.map((link) => (
          <motion.button 
            key={link.label} whileTap={{ scale: 0.95 }}
            onClick={() => link.label === 'Emergency' ? onEmergencyClick() : null}
            style={{ padding: '20px 10px', borderRadius: 18, border: '1px solid var(--border)', background: link.label === 'Emergency' ? 'var(--crimson-06)' : 'var(--surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          >
            <span style={{ fontSize: 24 }}>{link.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: link.label === 'Emergency' ? 'var(--crimson)' : 'var(--text-secondary)' }}>{link.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────────── */
export default function ExplorePage() {
  const [showEmergency, setShowEmergency] = useState(false);

  return (
    <PageTransition>
      <div style={{ maxWidth: 840, margin: '0 auto', padding: '40px 24px 100px' }}>
        <AnimatePresence>{showEmergency && <EmergencyModal onClose={() => setShowEmergency(false)} />}</AnimatePresence>

        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 950, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>Explore Campus</h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', marginTop: 8, fontWeight: 500 }}>Live updates from across Karpagam University blocks.</p>
        </header>

        <div style={{ display: 'grid', gap: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            <EventsWidget />
            <TrendingWidget />
          </div>
          
          <QuickLinksWidget onEmergencyClick={() => setShowEmergency(true)} />

          <div className="card" style={{ padding: 32, background: 'linear-gradient(135deg, var(--slate-900) 0%, #000 100%)', color: '#fff', border: 'none', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, background: 'var(--crimson)', filter: 'blur(60px)', opacity: 0.4 }} />
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--crimson)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.08em' }}>Academic Notice</div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Digital Library Access</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 24 }}>Access over 50,000+ top journals directly from your portal starting this Monday.</p>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px' }}>Learn More</button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
