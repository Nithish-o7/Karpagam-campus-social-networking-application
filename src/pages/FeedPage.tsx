import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CreatePost from '../components/feed/CreatePost';
import PostCard   from '../components/feed/PostCard';
import CampusHighlights from '../components/feed/CampusHighlights';
import { postService, type FeedPost } from '../services/postService';
import PageTransition from '../components/layout/PageTransition';
import { PostSkeleton } from '../components/ui/SkeletonLoader';

import toast from 'react-hot-toast';

const FILTERS = ['All Updates', 'Faculty', 'Students', 'Alumni'] as const;
type Filter = (typeof FILTERS)[number];
export default function FeedPage() {
  const [posts,        setPosts]        = useState<FeedPost[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [submitting,   setSubmitting]   = useState(false);
  const [activeFilter, setActiveFilter] = useState<Filter>('All Updates');

  const { user } = useAuth();

  const fetchPosts = useCallback(async () => {
    setLoading(true); setError(null);
    try { setPosts(await postService.getFeed()); }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed to load feed.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleNewPost = useCallback(async (content: string) => {
    if (!user) return;
    setSubmitting(true);
    
    const optimistic: FeedPost = {
      id: Date.now(),
      author_name: user.name,
      author_role: (user.role as any) || 'student',
      author_dept: user.department,
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments_count: 0,
      has_liked: false,
    };
    
    setPosts((prev) => [optimistic, ...prev]);
    
    try {
      const real = await postService.create(content);
      // Replace optimistic post with the real one from DB
      setPosts((prev) => prev.map((p) => p.id === optimistic.id ? real : p));
      toast.success('Post shared! 🎉');
    } catch (err) {
      setPosts((prev) => prev.filter((p) => p.id !== optimistic.id));
      toast.error(err instanceof Error ? err.message : 'Failed to post.');
    } finally { setSubmitting(false); }
  }, [user]);

  const FILTER_ROLE: Partial<Record<Filter, string>> = { Faculty: 'faculty', Students: 'student', Alumni: 'alumni' };
  const displayed = activeFilter === 'All Updates'
    ? posts : posts.filter((p) => p.author_role === FILTER_ROLE[activeFilter]);

  return (
    <PageTransition>
      <div className="feed-layout">
        {/* ── Center Feed Column ── */}
        <div className="feed-col">
          {/* Feed Filter Chips */}
          <div style={{
            display: 'flex', gap: 8, marginBottom: 8, overflowX: 'auto', padding: '4px 0',
            scrollbarWidth: 'none'
          }}>
            {FILTERS.map(f => (
              <button
                key={f} onClick={() => setActiveFilter(f)}
                style={{
                  padding: '6px 14px', borderRadius: '100px', border: 'none',
                  background: activeFilter === f ? 'var(--slate-800)' : 'var(--surface)',
                  color: activeFilter === f ? '#fff' : 'var(--text-muted)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  boxShadow: activeFilter === f ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  transition: 'all 0.2s'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <CreatePost onSubmit={handleNewPost} submitting={submitting} />

          {/* Posts Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {loading ? (
              <><PostSkeleton /><PostSkeleton /></>
            ) : error ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <p style={{ color: 'var(--crimson)', fontWeight: 600 }}>{error}</p>
                <button onClick={fetchPosts} className="btn btn-secondary" style={{ marginTop: 12 }}>Retry</button>
              </div>
            ) : (
              displayed.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>

        {/* ── Right Panel (Desktop Only) ── */}
        <aside className="feed-highlights-col">
          <CampusHighlights />
        </aside>
      </div>
    </PageTransition>
  );
}
