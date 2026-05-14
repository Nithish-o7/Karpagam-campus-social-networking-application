import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRealtime } from '../contexts/RealtimeContext';
import CreatePost from '../components/feed/CreatePost';
import PostCard   from '../components/feed/PostCard';
import CampusHighlights from '../components/feed/CampusHighlights';
import { postService, type FeedPost } from '../services/postService';
import PageTransition from '../components/layout/PageTransition';
import { PostSkeleton } from '../components/ui/SkeletonLoader';
import toast from 'react-hot-toast';

const FILTERS = ['All', 'Faculty', 'Students', 'Alumni'] as const;
type Filter = (typeof FILTERS)[number];

export default function FeedPage() {
  const [posts,        setPosts]        = useState<FeedPost[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [submitting,   setSubmitting]   = useState(false);
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  const { user } = useAuth();
  const { socket } = useRealtime();
  const postIdsRef = useRef<Set<number>>(new Set());

  const fetchPosts = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const fetchedPosts = await postService.getFeed();
      setPosts(fetchedPosts);
      postIdsRef.current = new Set(fetchedPosts.map(p => p.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feed.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  useEffect(() => {
    if (!socket) return;
    socket.on('new-post', (newPost: FeedPost) => {
      if (!postIdsRef.current.has(newPost.id)) {
        setPosts((prev) => [newPost, ...prev]);
        postIdsRef.current.add(newPost.id);
        if (newPost.author_name !== user?.name) {
          toast.success(`New post from ${newPost.author_name}`, {
            icon: '🗞️', position: 'bottom-right', duration: 3000,
          });
        }
      }
    });
    return () => { socket.off('new-post'); };
  }, [socket, user?.name]);

  const handleNewPost = useCallback(async (content: string, pollOptions?: string[]) => {
    if (!user) return;
    setSubmitting(true);
    try {
      await postService.create(content, pollOptions);
      toast.success('Posted!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to post.');
    } finally {
      setSubmitting(false);
    }
  }, [user]);

  const FILTER_ROLE: Partial<Record<Filter, string>> = { Faculty: 'faculty', Students: 'student', Alumni: 'alumni' };
  const displayed = activeFilter === 'All'
    ? posts : posts.filter((p) => p.author_role === FILTER_ROLE[activeFilter]);

  return (
    <PageTransition>
      <div className="feed-layout">

        {/* ── Center Feed ── */}
        <div className="feed-col">

          {/* Sticky filter bar */}
          <div style={{
            position: 'sticky', top: 0, zIndex: 10,
            background: 'rgba(8,8,16,0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--border)',
            marginBottom: 0,
            padding: '0 0 0 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 2px' }}>
              {FILTERS.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  style={{
                    padding: '14px 16px',
                    border: 'none', background: 'transparent',
                    color: activeFilter === f ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontSize: 13, fontWeight: activeFilter === f ? 600 : 400,
                    cursor: 'pointer', fontFamily: 'var(--font)',
                    borderBottom: `2px solid ${activeFilter === f ? 'var(--crimson)' : 'transparent'}`,
                    transition: 'all 0.15s ease',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {f}
                </button>
              ))}
              <div style={{ flex: 1 }} />
              <button onClick={fetchPosts}
                style={{
                  padding: '6px 10px', border: 'none', background: 'transparent',
                  color: 'var(--text-faint)', cursor: 'pointer', borderRadius: 6,
                  fontSize: 12, fontFamily: 'var(--font)', transition: 'all 0.12s',
                }}
                title="Refresh feed"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Composer */}
          <div style={{ padding: '12px 0 4px' }}>
            <CreatePost onSubmit={handleNewPost} submitting={submitting} />
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border)', margin: '4px 0 2px' }} />

          {/* Posts */}
          <div>
            {loading ? (
              <><PostSkeleton /><PostSkeleton /></>
            ) : error ? (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: 'var(--crimson)', marginBottom: 12 }}>{error}</div>
                <button onClick={fetchPosts} className="btn btn-secondary">Retry</button>
              </div>
            ) : displayed.length === 0 ? (
              <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.4 }}>✦</div>
                <div style={{ fontSize: 14, color: 'var(--text-faint)', fontWeight: 500 }}>Nothing here yet</div>
                <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 4 }}>Be the first to post something.</div>
              </div>
            ) : (
              displayed.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>

        {/* ── Right Panel (Desktop) ── */}
        <aside className="feed-highlights-col">
          <CampusHighlights />
        </aside>

      </div>
    </PageTransition>
  );
}
