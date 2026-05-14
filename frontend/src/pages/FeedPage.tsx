/**
 * Agent 4 — FeedPage v11: X/Twitter sticky filter, editorial layout
 */
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

const FILTERS = ['All','Faculty','Students','Alumni'] as const;
type Filter = typeof FILTERS[number];

export default function FeedPage() {
  const [posts,        setPosts]        = useState<FeedPost[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string|null>(null);
  const [submitting,   setSubmitting]   = useState(false);
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  const { user } = useAuth();
  const { socket } = useRealtime();
  const postIdsRef = useRef<Set<number>>(new Set());

  const fetchPosts = useCallback(async () => {
    setLoading(true); setError(null);
    try { const p = await postService.getFeed(); setPosts(p); postIdsRef.current = new Set(p.map(x=>x.id)); }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed to load feed.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  useEffect(() => {
    if (!socket) return;
    socket.on('new-post', (np: FeedPost) => {
      if (!postIdsRef.current.has(np.id)) {
        setPosts(p => [np,...p]); postIdsRef.current.add(np.id);
        if (np.author_name !== user?.name) toast.success(`New post from ${np.author_name}`, { icon:'🗞️', position:'bottom-right', duration:3000 });
      }
    });
    return () => { socket.off('new-post'); };
  }, [socket, user?.name]);

  const handleNewPost = useCallback(async (content: string, pollOptions?: string[]) => {
    if (!user) return; setSubmitting(true);
    try { await postService.create(content, pollOptions); toast.success('Posted!'); }
    catch (err) { toast.error(err instanceof Error ? err.message : 'Failed to post.'); }
    finally { setSubmitting(false); }
  }, [user]);

  const ROLE_MAP: Partial<Record<Filter,string>> = { Faculty:'faculty', Students:'student', Alumni:'alumni' };
  const displayed = activeFilter==='All' ? posts : posts.filter(p=>p.author_role===ROLE_MAP[activeFilter]);

  return (
    <PageTransition>
      <div className="feed-layout">

        {/* ─ Feed column */}
        <div className="feed-col">

          {/* Sticky header — X-style underline tabs */}
          <div style={{
            position:'sticky', top:0, zIndex:20,
            background:'rgba(9,9,15,0.88)',
            backdropFilter:'blur(20px) saturate(180%)',
            WebkitBackdropFilter:'blur(20px) saturate(180%)',
            borderBottom:'1px solid var(--line-s)',
          }}>
            <div style={{ display:'flex', alignItems:'stretch' }}>
              {FILTERS.map(f => (
                <button key={f} onClick={()=>setActiveFilter(f)}
                  style={{
                    flex:1, padding:'14px 8px 13px',
                    border:'none', background:'transparent',
                    color:activeFilter===f?'var(--t1)':'var(--t3)',
                    fontSize:13, fontWeight:activeFilter===f?600:400,
                    cursor:'pointer', fontFamily:'var(--font)',
                    borderBottom:`2px solid ${activeFilter===f?'var(--red)':'transparent'}`,
                    transition:'all .15s ease', letterSpacing:'-.01em',
                  }}
                  onMouseEnter={e=>{ if(activeFilter!==f)(e.currentTarget as HTMLElement).style.color='var(--t2)'; }}
                  onMouseLeave={e=>{ if(activeFilter!==f)(e.currentTarget as HTMLElement).style.color='var(--t3)'; }}
                >
                  {f}
                </button>
              ))}
              <button onClick={fetchPosts} title="Refresh"
                style={{ padding:'0 14px', border:'none', background:'transparent', color:'var(--t4)', cursor:'pointer', fontSize:11, fontFamily:'var(--font)', transition:'color .1s', flexShrink:0 }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='var(--t2)';}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color='var(--t4)';}}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Composer */}
          <div style={{ borderBottom:'1px solid var(--line-s)' }}>
            <CreatePost onSubmit={handleNewPost} submitting={submitting} />
          </div>

          {/* Feed */}
          <div>
            {loading ? (
              <><PostSkeleton/><PostSkeleton/></>
            ) : error ? (
              <div style={{ padding:'48px 20px', textAlign:'center' }}>
                <div style={{ fontSize:13,color:'var(--red)',marginBottom:12 }}>{error}</div>
                <button onClick={fetchPosts} className="btn btn-secondary">Retry</button>
              </div>
            ) : displayed.length===0 ? (
              <div style={{ padding:'72px 20px', textAlign:'center' }}>
                <div style={{ fontSize:24,marginBottom:12,opacity:.2,letterSpacing:'-0.02em' }}>◈</div>
                <div style={{ fontSize:14,color:'var(--t3)',fontWeight:500 }}>Nothing here yet</div>
                <div style={{ fontSize:12,color:'var(--t4)',marginTop:4 }}>Be the first to post something.</div>
              </div>
            ) : (
              displayed.map(p => <PostCard key={p.id} post={p}/>)
            )}
          </div>
        </div>

        {/* ─ Right panel */}
        <aside className="feed-highlights-col">
          <CampusHighlights/>
        </aside>

      </div>

      {/* Mobile FAB */}
      <button className="fab-compose" onClick={()=>document.querySelector('.create-post-textarea')?.scrollIntoView({behavior:'smooth'})}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
    </PageTransition>
  );
}
