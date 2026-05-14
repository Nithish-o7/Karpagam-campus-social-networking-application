/**
 * KCE Connect — Profile Page (Phase 9)
 *
 * Displays user details from AuthContext and provides tabs to view
 * "My Posts" and "My Tickets". Reuse logic from FeedPage and TicketsPage.
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getInitials, getRoleBadgeClass } from '../utils';
import { postService, type FeedPost } from '../services/postService';
import { ticketService, type TicketItem } from '../services/ticketService';
import { authService } from '../services/authService';
import PostCard from '../components/feed/PostCard';
import PageTransition from '../components/layout/PageTransition';
import toast from 'react-hot-toast';

/* ── Constants for Tickets (from TicketsPage.tsx) ─────────── */
const CATEGORY_ICON: Record<string, string> = {
  'Wifi issues':       '📶',
  'Lab':               '🖥️',
  'Electricity Issue': '⚡',
  'Hostel':            '🏠',
  'Transport':         '🚌',
  'Classroom':         '🏫',
  'General':           '📋',
};

const STATE_CONFIG: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  '1':  { label: 'Open',        bg: 'rgba(255,193,7,0.12)',  color: '#8a6500', dot: '#FFC107' },
  '-5': { label: 'Pending',     bg: 'rgba(107,114,128,0.1)', color: '#4B5563', dot: '#9CA3AF' },
  '2':  { label: 'In Progress', bg: 'rgba(74,95,217,0.10)',  color: '#4A5FD9', dot: '#4A5FD9' },
  '3':  { label: 'On Hold',     bg: 'rgba(245,158,11,0.12)', color: '#92400E', dot: '#F59E0B' },
  '6':  { label: 'Resolved',    bg: 'rgba(40,167,69,0.10)',  color: '#28A745', dot: '#28A745' },
  '7':  { label: 'Closed',      bg: 'rgba(40,167,69,0.10)',  color: '#16733a', dot: '#16733a' },
};

const DEFAULT_STATE = { label: 'Unknown', bg: 'rgba(107,114,128,0.1)', color: '#4B5563', dot: '#9CA3AF' };

/* ── Helper Components ─────────────────────────────────────── */

function StatusBadge({ stateCode }: { stateCode: string }) {
  const cfg = STATE_CONFIG[stateCode] ?? DEFAULT_STATE;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 'var(--r-pill)',
      background: cfg.bg, color: cfg.color,
      fontSize: 'var(--fs-xs)', fontWeight: 700,
      whiteSpace: 'nowrap', letterSpacing: '0.02em',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: cfg.dot,
        ...(stateCode === '2' ? { animation: 'pulse-dot 1.4s ease infinite' } : {}),
      }} />
      {cfg.label}
    </span>
  );
}

function TicketCard({ ticket }: { ticket: TicketItem }) {
  const icon = CATEGORY_ICON[ticket.category] ?? '📋';
  const formattedDate = new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <div className="card fade-up" style={{ 
      padding: '24px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 16,
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-card)',
      borderRadius: 'var(--r-lg)',
      background: 'var(--surface)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 'var(--r-md)', 
          background: 'var(--bg-app)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: 22,
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.02)'
        }}>{icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 900, color: 'var(--crimson)', letterSpacing: '-0.02em' }}>{ticket.number}</div>
          <div style={{ 
            fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', 
            textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 
          }}>{ticket.category}</div>
        </div>
        <StatusBadge stateCode={ticket.stateCode} />
      </div>
      <div style={{ 
        fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', 
        lineHeight: 1.6, fontWeight: 450,
        display: '-webkit-box', WebkitBoxOrient: 'vertical', 
        WebkitLineClamp: 2, overflow: 'hidden' 
      }}>
        {ticket.description}
      </div>
      <div style={{ 
        borderTop: '1px solid var(--border)', paddingTop: 12, 
        display: 'flex', justifyContent: 'space-between', 
        fontSize: '11px', fontWeight: 700, color: 'var(--text-faint)',
        textTransform: 'uppercase', letterSpacing: '0.04em'
      }}>
        <span>📅 {formattedDate}</span>
      </div>
    </div>
  );
}

function Shimmer() {
  return (
    <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 'var(--r-md)' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="skeleton" style={{ width: '40%', height: 14, borderRadius: 4 }} />
          <div className="skeleton" style={{ width: '60%', height: 10, borderRadius: 4 }} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ width: '100%', height: 12, borderRadius: 4 }} />
        <div className="skeleton" style={{ width: '80%', height: 12, borderRadius: 4 }} />
      </div>
    </div>
  );
}

/* ── Main Page Component ────────────────────────────────────── */

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'tickets'>('posts');
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');
  const [profileStats, setProfileStats] = useState({ posts: 0, followers: 0, following: 0 });

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [allPosts, allTickets, profileData] = await Promise.all([
        postService.getFeed(),
        ticketService.getUserTickets(),
        authService.getProfile(user.id)
      ]);

      setPosts(allPosts.filter((p: FeedPost) => p.author_name === user.name));
      setTickets(allTickets.filter((t: TicketItem) => t.name === user.name));
      
      if (profileData.success) {
        setProfileStats({
          posts: profileData.user._count?.posts || 0,
          followers: profileData.user._count?.followers || 0,
          following: profileData.user._count?.following || 0
        });
        setBio(profileData.user.bio || '');
      }
    } catch (err) {
      console.error('Failed to fetch profile activity:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleUpdateProfile = async () => {
    try {
      await authService.updateProfile({ bio });
      setIsEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (!user) return null;

  return (
    <PageTransition>
      <div style={{ padding: 'var(--content-pad)', paddingBottom: 'calc(var(--nav-h) + 24px)', maxWidth: 640, margin: '0 auto' }}>
      
      {/* ── Profile Header ───────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, marginBottom: 40, animation: 'fade-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
        <div style={{
          width: 120, height: 120, borderRadius: 'var(--r-pill)',
          background: user.avatarUrl ? `url(${user.avatarUrl}) center/cover` : 'linear-gradient(135deg, var(--crimson) 0%, #1a1a1a 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 44, fontWeight: 900,
          boxShadow: '0 20px 40px -12px rgba(166,25,46,0.3)',
          border: '4px solid var(--surface)',
          letterSpacing: '-0.02em',
          overflow: 'hidden'
        }}>
          {!user.avatarUrl && getInitials(user.name)}
        </div>
        
        <div style={{ textAlign: 'center', width: '100%' }}>
          <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', marginBottom: 6 }}>
            {user.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span className={getRoleBadgeClass(user.role)} style={{ 
              textTransform: 'uppercase', fontSize: '10px', padding: '3px 10px', fontWeight: 800, letterSpacing: '0.05em' 
            }}>
              {user.role}
            </span>
            <span style={{ color: 'var(--text-faint)', fontSize: '14px', fontWeight: 900 }}>•</span>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '-0.01em' }}>
              {user.department}
            </span>
          </div>

          {/* Bio Section */}
          <div style={{ marginTop: 16, maxWidth: 400, marginInline: 'auto' }}>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  style={{
                    width: '100%', padding: '12px', borderRadius: 'var(--r-md)',
                    border: '1px solid var(--border)', background: 'var(--surface)',
                    fontSize: 'var(--fs-sm)', fontFamily: 'inherit', resize: 'none'
                  }}
                  rows={3}
                />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button onClick={() => setIsEditing(false)} className="btn btn-secondary" style={{ padding: '6px 16px', fontSize: 12 }}>Cancel</button>
                  <button onClick={handleUpdateProfile} className="btn btn-primary" style={{ padding: '6px 16px', fontSize: 12 }}>Save</button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {bio || 'No bio yet...'}
                </p>
                <button 
                  onClick={() => setIsEditing(true)}
                  style={{ 
                    background: 'none', border: 'none', color: 'var(--crimson)', 
                    fontSize: 12, fontWeight: 700, cursor: 'pointer', marginTop: 8 
                  }}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Card */}
        <div style={{ 
          display: 'flex', gap: 0, marginTop: 8, 
          background: 'var(--surface)', padding: '12px 24px', borderRadius: 'var(--r-xl)',
          boxShadow: 'var(--shadow-card)', border: '1px solid var(--border)'
        }}>
          <div style={{ textAlign: 'center', minWidth: 70 }}>
            <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{profileStats.posts}</div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Posts</div>
          </div>
          <div style={{ width: 1, height: 20, background: 'var(--border)', alignSelf: 'center', margin: '0 12px' }} />
          <div style={{ textAlign: 'center', minWidth: 70 }}>
            <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{profileStats.followers}</div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Followers</div>
          </div>
          <div style={{ width: 1, height: 20, background: 'var(--border)', alignSelf: 'center', margin: '0 12px' }} />
          <div style={{ textAlign: 'center', minWidth: 70 }}>
            <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{profileStats.following}</div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Following</div>
          </div>
        </div>
      </div>

      {/* ── Activity Tabs ───────────────────────────── */}
      <div style={{ 
        display: 'flex', 
        background: 'rgba(226, 232, 240, 0.3)', 
        padding: '6px', 
        borderRadius: 'var(--r-pill)',
        marginBottom: 32,
        border: '1px solid var(--border)'
      }}>
        {(['posts', 'tickets'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: '12px', border: 'none', 
              borderRadius: 'var(--r-pill)',
              background: activeTab === tab ? 'var(--surface)' : 'transparent', 
              cursor: 'pointer',
              fontSize: 'var(--fs-sm)', fontWeight: activeTab === tab ? 800 : 600, 
              color: activeTab === tab ? 'var(--crimson)' : 'var(--text-muted)',
              fontFamily: 'var(--font)', position: 'relative', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {tab === 'posts' ? 'My Activity' : 'My Tickets'}
          </button>
        ))}
      </div>

      {/* ── Feed Content ────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading ? (
          <><Shimmer /><Shimmer /></>
        ) : activeTab === 'posts' ? (
          posts.length > 0 ? (
            posts.map(p => <PostCard key={p.id} post={p} />)
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🖋️</div>
              <p style={{ fontWeight: 600 }}>You haven't posted anything yet</p>
            </div>
          )
        ) : (
          tickets.length > 0 ? (
            tickets.map(t => <TicketCard key={t.sys_id || t.number} ticket={t} />)
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎫</div>
              <p style={{ fontWeight: 600 }}>No reported issues found</p>
            </div>
          )
        )}
      </div>

      </div>
    </PageTransition>
  );
}
