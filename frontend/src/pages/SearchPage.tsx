/**
 * KCE Connect — Search Page (F3: Global Search)
 * Inspired by Slack, LinkedIn, Twitter
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import apiClient from '../services/apiClient';
import { getInitials, formatRelativeTime } from '../utils';
import toast from 'react-hot-toast';

type SearchType = 'people' | 'posts' | 'events';

interface SearchPerson { id: number; name: string; role: string; department: string; avatarUrl: string | null; }
interface SearchPost   { id: number; content: string; author_name: string; author_role: string; timestamp: string; likes: number; }
interface SearchEvent  { id: number; title: string; date: string; venue: string; category: string; }

const TABS: { key: SearchType; label: string; icon: string }[] = [
  { key: 'people', label: 'People',  icon: '👥' },
  { key: 'posts',  label: 'Posts',   icon: '📝' },
  { key: 'events', label: 'Events',  icon: '📅' },
];

const SUGGESTED = ['#KCE', '#Placements', '#Tech', '#Sports', '#Hostel', '#Events', '#Alumni', '#Labs'];

const ROLE_COLOR: Record<string, string> = {
  student: '#2563EB', faculty: '#059669', alumni: '#7C3AED', staff: '#D97706',
};

function useDebounce<T>(val: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(val);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(val), delay);
    return () => clearTimeout(timer);
  }, [val, delay]);
  return debouncedValue;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<SearchType>('people');
  const [people, setPeople]  = useState<SearchPerson[]>([]);
  const [posts, setPosts]    = useState<SearchPost[]>([]);
  const [events, setEvents]  = useState<SearchEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 400);

  // Focus on / key press
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setPeople([]); setPosts([]); setEvents([]); return; }
    setLoading(true);
    try {
      const [pRes, poRes, eRes] = await Promise.all([
        apiClient.get('/search', { params: { q, type: 'people'  } }),
        apiClient.get('/search', { params: { q, type: 'posts'   } }),
        apiClient.get('/search', { params: { q, type: 'events'  } }),
      ]);
      setPeople(pRes.data.results ?? []);
      setPosts(poRes.data.results ?? []);
      setEvents(eRes.data.results ?? []);
    } catch { toast.error('Search failed'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { doSearch(debouncedQuery); }, [debouncedQuery, doSearch]);



  const searched = debouncedQuery.trim().length > 0;

  return (
    <PageTransition>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 100px' }}>
        {/* Search Bar */}
        <div style={{ marginBottom: 32, position: 'relative' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: 'var(--surface)', border: '1.5px solid var(--border)',
            borderRadius: 20, padding: '14px 20px',
            boxShadow: 'var(--shadow-soft)', transition: 'all 0.2s',
          }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--crimson)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-faint)', flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search people, posts, events..."
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontSize: 16, fontFamily: 'inherit', color: 'var(--text-primary)',
                fontWeight: 500,
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', fontSize: 20, padding: '0 4px', fontFamily: 'inherit' }}>×</button>
            )}
            <kbd style={{ fontSize: 10, padding: '3px 7px', background: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-faint)', fontFamily: 'monospace' }}>/</kbd>
          </div>
        </div>

        {/* Tabs */}
        {searched && (
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--surface)', borderRadius: 14, padding: 4, border: '1px solid var(--border)' }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', fontFamily: 'inherit',
                  background: tab === t.key ? 'var(--crimson)' : 'transparent',
                  color: tab === t.key ? '#fff' : 'var(--text-muted)',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Suggested searches */}
        {!searched && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
              Suggested searches
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SUGGESTED.map(s => (
                <button key={s} onClick={() => setQuery(s)}
                  style={{
                    padding: '8px 16px', borderRadius: 100, border: '1px solid var(--border)',
                    background: 'var(--surface)', color: 'var(--text-secondary)',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'var(--crimson)'; (e.target as HTMLElement).style.color = 'var(--crimson)'; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'var(--border)'; (e.target as HTMLElement).style.color = 'var(--text-secondary)'; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3].map(i => (
              <div key={i} className="card" style={{ padding: 20, display: 'flex', gap: 14, alignItems: 'center' }}>
                <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 12, width: '40%', borderRadius: 6, marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 10, width: '70%', borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && searched && (
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* People Tab */}
              {tab === 'people' && (
                people.length === 0
                  ? <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}><div style={{ fontSize: 48 }}>🔍</div><div style={{ fontWeight: 700, marginTop: 12 }}>No people found for "{query}"</div></div>
                  : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {people.map(p => (
                        <div key={p.id} className="card" style={{ padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'center' }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                            background: `linear-gradient(135deg, var(--crimson), ${ROLE_COLOR[p.role] ?? '#64748B'})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 14, fontWeight: 800, color: '#fff',
                          }}>{getInitials(p.name)}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{p.department} · <span style={{ textTransform: 'capitalize' }}>{p.role}</span></div>
                          </div>
                          <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 100, background: `${ROLE_COLOR[p.role] ?? '#64748B'}18`, color: ROLE_COLOR[p.role] ?? '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>{p.role}</span>
                        </div>
                      ))}
                    </div>
              )}

              {/* Posts Tab */}
              {tab === 'posts' && (
                posts.length === 0
                  ? <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}><div style={{ fontSize: 48 }}>📭</div><div style={{ fontWeight: 700, marginTop: 12 }}>No posts found</div></div>
                  : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {posts.map(p => (
                        <div key={p.id} className="card" style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{p.author_name}</span>
                            <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{formatRelativeTime(p.timestamp)}</span>
                          </div>
                          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>
                            {p.content}
                          </p>
                          <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 10 }}>❤️ {p.likes} likes</div>
                        </div>
                      ))}
                    </div>
              )}

              {/* Events Tab */}
              {tab === 'events' && (
                events.length === 0
                  ? <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}><div style={{ fontSize: 48 }}>📅</div><div style={{ fontWeight: 700, marginTop: 12 }}>No events found</div></div>
                  : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {events.map(e => (
                        <div key={e.id} className="card" style={{ padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'center' }}>
                          <div style={{
                            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                            background: 'linear-gradient(135deg, var(--crimson) 0%, #1a1a1a 100%)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <div style={{ fontSize: 9, fontWeight: 900, color: 'rgba(255,255,255,0.6)' }}>{new Date(e.date).toLocaleDateString('en-IN', { weekday: 'short' }).toUpperCase()}</div>
                            <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{new Date(e.date).getDate()}</div>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{e.title}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>📍 {e.venue}</div>
                          </div>
                          <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 100, background: 'rgba(196,24,48,0.08)', color: 'var(--crimson)', fontWeight: 800, textTransform: 'uppercase' }}>{e.category}</span>
                        </div>
                      ))}
                    </div>
              )}

            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </PageTransition>
  );
}
