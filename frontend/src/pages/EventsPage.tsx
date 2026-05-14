/**
 * KCE Connect — Events Page (F4: Full RSVP + Calendar)
 * Inspired by LinkedIn Events + Eventbrite
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import apiClient from '../services/apiClient';
import toast from 'react-hot-toast';

interface CampusEvent {
  id: number;
  title: string;
  description: string | null;
  date: string;
  venue: string;
  category: string;
  imageUrl: string | null;
  _count?: { rsvps: number };
  userRsvp?: string | null;
}

const CATEGORIES = ['All', 'TECH', 'SPORTS', 'CULTURAL', 'ACADEMIC', 'WORKSHOP'];
const CAT_META: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
  TECH:      { label: 'Tech',     color: '#2563EB', bg: 'rgba(37,99,235,0.1)',   emoji: '💻' },
  SPORTS:    { label: 'Sports',   color: '#059669', bg: 'rgba(5,150,105,0.1)',   emoji: '🏆' },
  CULTURAL:  { label: 'Cultural', color: '#7C3AED', bg: 'rgba(124,58,237,0.1)',  emoji: '🎭' },
  ACADEMIC:  { label: 'Academic', color: '#C41830', bg: 'rgba(196,24,48,0.1)',   emoji: '📚' },
  WORKSHOP:  { label: 'Workshop', color: '#D97706', bg: 'rgba(217,119,6,0.1)',   emoji: '🛠️' },
};

function EventCard({ event, onRsvp }: { event: CampusEvent; onRsvp: (id: number, status: string | null) => void }) {
  const meta = CAT_META[event.category] ?? CAT_META.TECH;
  const d = new Date(event.date);
  const [rsvpStatus, setRsvpStatus] = useState<string | null>(event.userRsvp ?? null);
  const [loading, setLoading] = useState(false);

  const handleRsvp = async (status: string) => {
    setLoading(true);
    try {
      if (rsvpStatus === status) {
        await apiClient.delete(`/campus/events/${event.id}/rsvp`);
        setRsvpStatus(null);
        onRsvp(event.id, null);
        toast.success('RSVP cancelled');
      } else {
        await apiClient.post(`/campus/events/${event.id}/rsvp`, { status });
        setRsvpStatus(status);
        onRsvp(event.id, status);
        toast.success(status === 'GOING' ? "You're going! 🎉" : "Marked as interested!");
      }
    } catch { toast.error('Could not update RSVP'); }
    finally { setLoading(false); }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
    >
      {/* Banner */}
      <div style={{
        height: 96, background: `linear-gradient(135deg, ${meta.color}22 0%, ${meta.color}44 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40,
        borderBottom: `1px solid ${meta.color}33`,
      }}>
        {meta.emoji}
      </div>

      <div style={{ padding: '16px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Category + date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: 9, fontWeight: 800, padding: '3px 10px', borderRadius: 100,
            color: meta.color, background: meta.bg, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>{meta.label}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-faint)' }}>
            {d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>

        {/* Title */}
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.4, letterSpacing: '-0.02em' }}>
          {event.title}
        </div>

        {/* Venue + time */}
        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
          📍 {event.venue} &nbsp;·&nbsp; 🕐 {d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </div>

        {event.description && (
          <p style={{
            fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0,
            display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden',
          }}>{event.description}</p>
        )}

        <div style={{ flex: 1 }} />

        {/* Attendee count */}
        <div style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 600 }}>
          {(event._count?.rsvps ?? 0)} people attending
        </div>

        {/* RSVP Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => handleRsvp('INTERESTED')}
            disabled={loading}
            style={{
              flex: 1, padding: '9px 0', borderRadius: 10, fontFamily: 'inherit',
              background: rsvpStatus === 'INTERESTED' ? meta.bg : 'var(--bg-app)',
              border: `1px solid ${rsvpStatus === 'INTERESTED' ? meta.color : 'var(--border)'}`,
              color: rsvpStatus === 'INTERESTED' ? meta.color : 'var(--text-muted)',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
            }}>
            {rsvpStatus === 'INTERESTED' ? '★ Interested' : '☆ Interested'}
          </button>
          <button
            onClick={() => handleRsvp('GOING')}
            disabled={loading}
            style={{
              flex: 1, padding: '9px 0', borderRadius: 10, fontFamily: 'inherit',
              background: rsvpStatus === 'GOING' ? meta.color : 'var(--crimson)',
              border: 'none', color: '#fff',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
              opacity: rsvpStatus === 'GOING' ? 0.85 : 1,
            }}>
            {rsvpStatus === 'GOING' ? '✓ Going' : 'Going'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    apiClient.get('/campus/events')
      .then(r => setEvents(r.data.events ?? r.data))
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All' ? events : events.filter(e => e.category === activeCategory);

  return (
    <PageTransition>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px 100px' }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 950, color: 'var(--text-primary)', letterSpacing: '-0.04em', marginBottom: 8 }}>
            Campus Events
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', fontWeight: 500 }}>
            Discover and RSVP for upcoming campus activities.
          </p>
        </header>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => {
            const meta = CAT_META[cat];
            const active = activeCategory === cat;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 18px', borderRadius: 100, fontFamily: 'inherit',
                  background: active ? (meta?.color ?? 'var(--crimson)') : 'var(--surface)',
                  color: active ? '#fff' : 'var(--text-secondary)',
                  border: active ? 'none' : '1px solid var(--border)',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                }}>
                {meta ? `${meta.emoji} ${meta.label}` : 'All Events'}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="card" style={{ height: 280 }}>
                <div className="skeleton" style={{ height: 96, borderRadius: 0 }} />
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="skeleton" style={{ height: 10, width: '40%', borderRadius: 6 }} />
                  <div className="skeleton" style={{ height: 14, width: '80%', borderRadius: 6 }} />
                  <div className="skeleton" style={{ height: 10, width: '60%', borderRadius: 6 }} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                    <div className="skeleton" style={{ flex: 1, height: 36, borderRadius: 10 }} />
                    <div className="skeleton" style={{ flex: 1, height: 36, borderRadius: 10 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📅</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>No events yet</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>Check back soon for upcoming activities</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            <AnimatePresence>
              {filtered.map(ev => (
                <EventCard key={ev.id} event={ev} onRsvp={(id, status) => {
                  setEvents(prev => prev.map(e => e.id === id ? { ...e, userRsvp: status } : e));
                }} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
