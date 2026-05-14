/**
 * KCE Connect — People Directory Page
 * Search, discover, and follow/unfollow campus members.
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getInitials, getRoleBadgeClass } from '../utils';
import { authService } from '../services/authService';
import { messagingService } from '../services/messagingService';
import PageTransition from '../components/layout/PageTransition';
import toast from 'react-hot-toast';

interface CampusUser {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  rollNumber: string;
  avatarUrl: string | null;
  bio: string | null;
  _count?: { posts: number; followers: number; following: number };
  isFollowing?: boolean;
}

const ROLE_FILTERS = ['All', 'student', 'faculty', 'alumni', 'staff'] as const;

function PersonCard({
  person,
  myId,
  onFollow,
  onMessage,
  msgLoading,
}: {
  person: CampusUser;
  myId: number;
  onFollow: (id: number, following: boolean) => Promise<void>;
  onMessage: (id: number) => void;
  msgLoading: boolean;
}) {
  const [following, setFollowing] = useState(person.isFollowing ?? false);
  const [loading, setLoading] = useState(false);
  const isMe = person.id === myId;

  const handleFollow = async () => {
    setLoading(true);
    try {
      await onFollow(person.id, following);
      setFollowing(f => !f);
    } finally { setLoading(false); }
  };

  return (
    <div
      className="card fade-up"
      style={{
        padding: '24px', display: 'flex', flexDirection: 'column', gap: 16,
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
    >
      {/* Avatar + Info */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
          background: person.avatarUrl
            ? `url(${person.avatarUrl}) center/cover`
            : 'linear-gradient(135deg, var(--crimson) 0%, #2d1a3c 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 900, color: '#fff',
          boxShadow: '0 4px 16px rgba(166,25,46,0.15)',
        }}>
          {!person.avatarUrl && getInitials(person.name)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {person.name}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
            <span className={getRoleBadgeClass(person.role)} style={{ fontSize: 9, padding: '2px 8px', fontWeight: 800 }}>
              {person.role}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {person.department}
          </div>
        </div>
      </div>

      {/* Bio */}
      {person.bio && (
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 450, margin: 0,
          display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden',
        }}>
          {person.bio}
        </p>
      )}

      {/* Stats */}
      {person._count && (
        <div style={{ display: 'flex', gap: 20, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          {[
            { label: 'Posts',     val: person._count.posts },
            { label: 'Followers', val: person._count.followers },
            { label: 'Following', val: person._count.following },
          ].map(({ label, val }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {!isMe && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleFollow}
            disabled={loading}
            style={{
              flex: 1, padding: '9px 0', borderRadius: 10,
              background: following ? 'var(--surface)' : 'var(--crimson)',
              color: following ? 'var(--text-primary)' : '#fff',
              border: following ? '1px solid var(--border)' : 'none',
              fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s',
            } as React.CSSProperties}

          >
            {loading ? '…' : following ? '✓ Following' : '+ Follow'}
          </button>
          <button
            onClick={() => onMessage(person.id)}
            disabled={msgLoading}
            style={{
              width: 40, height: 40, border: '1px solid var(--border)', borderRadius: 10,
              background: 'var(--surface)', color: 'var(--text-secondary)',
              fontSize: 16, cursor: msgLoading ? 'not-allowed' : 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              fontFamily: 'inherit', transition: 'all 0.15s',
              opacity: msgLoading ? 0.5 : 1,
            }}
            title="Send message"
          >
            {msgLoading ? '⌛' : '💬'}
          </button>
        </div>
      )}
      {isMe && (
        <div style={{ padding: '8px 12px', borderRadius: 10, background: 'var(--bg-app)', fontSize: 12, fontWeight: 700, color: 'var(--text-faint)', textAlign: 'center' }}>
          This is you
        </div>
      )}
    </div>
  );
}

export default function PeoplePage() {
  const { user } = useAuth();
  const [people, setPeople] = useState<CampusUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [messageLoading, setMessageLoading] = useState<number | null>(null); // tracks which user's DM is loading


  const fetchPeople = useCallback(async () => {
    setLoading(true);
    try {
      const data = await authService.getPeople();
      setPeople(data);
    } catch {
      toast.error('Failed to load people');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPeople(); }, [fetchPeople]);

  const handleFollow = async (id: number, currently: boolean) => {
    try {
      if (currently) {
        await authService.unfollowUser(id);
        toast.success('Unfollowed');
      } else {
        await authService.followUser(id);
        toast.success('Now following!');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Action failed');
      throw err;
    }
  };

  const handleMessage = async (targetId: number) => {
    setMessageLoading(targetId);
    try {
      const convId = await messagingService.startConversation(targetId);
      toast.success('Opening chat…');
      // Switch to messages tab with this conversation
      window.dispatchEvent(new CustomEvent('switch-tab', { detail: 'messages' }));
      // Also broadcast the conversation ID so MessagesPage can open it
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-conversation', { detail: convId }));
      }, 300);
    } catch {
      toast.error('Could not start conversation');
    } finally {
      setMessageLoading(null);
    }
  };

  const filtered = people.filter(p => {
    const matchRole = roleFilter === 'All' || p.role === roleFilter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
      || p.department.toLowerCase().includes(search.toLowerCase())
      || p.rollNumber.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <PageTransition>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 100px' }}>
        {/* Header */}
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 950, color: 'var(--text-primary)', letterSpacing: '-0.04em', marginBottom: 8 }}>
            People
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 500 }}>
            Find and connect with {people.length} campus members.
          </p>
        </header>

        {/* Search + Filter Bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, department, roll no..."
              style={{
                width: '100%', padding: '12px 16px 12px 40px',
                border: '1px solid var(--border)', borderRadius: 14,
                fontSize: 14, fontFamily: 'inherit',
                background: 'var(--surface)', color: 'var(--text-primary)',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {ROLE_FILTERS.map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                style={{
                  padding: '10px 16px', borderRadius: 10,
                  background: roleFilter === r ? 'var(--crimson)' : 'var(--surface)',
                  color: roleFilter === r ? '#fff' : 'var(--text-secondary)',
                  border: roleFilter === r ? 'none' : '1px solid var(--border)',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.15s', textTransform: 'capitalize',
                } as React.CSSProperties}

              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                  <div className="skeleton" style={{ width: 52, height: 52, borderRadius: '50%', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ width: '60%', height: 14, borderRadius: 6, marginBottom: 8 }} />
                    <div className="skeleton" style={{ width: '40%', height: 10, borderRadius: 6 }} />
                  </div>
                </div>
                <div className="skeleton" style={{ width: '100%', height: 36, borderRadius: 10 }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔎</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>No results found</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>Try adjusting your search or filter</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {filtered.map(p => (
                <PersonCard
                  key={p.id}
                  person={p}
                  myId={user?.id ?? 0}
                  onFollow={handleFollow}
                  onMessage={handleMessage}
                  msgLoading={messageLoading === p.id}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
}
