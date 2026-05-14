/**
 * Agent 3a — FeedPage v12: Max-width centered · Framer Motion entry
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
import { motion } from 'framer-motion';
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
        setPosts(p=>[np,...p]); postIdsRef.current.add(np.id);
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
      <motion.div
        initial={{ opacity:0, y:10 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:.3, ease:[.16,1,.3,1] }}
      >
        <div className="feed-layout">

          {/* ── Feed column ── */}
          <div className="feed-col">

            {/* Sticky translucent filter header */}
            <div style={{
              position:'sticky', top:0, zIndex:20,
              background:'rgba(241,243,247,0.85)',
              backdropFilter:'blur(16px) saturate(180%)',
              WebkitBackdropFilter:'blur(16px) saturate(180%)',
              borderBottom:'1px solid rgba(15,23,42,0.07)',
              marginBottom:16,
            }}>
              <div style={{ display:'flex', alignItems:'stretch', padding:'0 4px', maxWidth:'100%' }}>
                {FILTERS.map(f => (
                  <button key={f} onClick={()=>setActiveFilter(f)}
                    style={{
                      flex:1, padding:'13px 4px',
                      border:'none', background:'transparent',
                      color: activeFilter===f ? '#0F172A' : '#94A3B8',
                      fontSize:13, fontWeight: activeFilter===f ? 700 : 400,
                      cursor:'pointer', fontFamily:'var(--font)',
                      borderBottom:`2px solid ${activeFilter===f?'#8B1D34':'transparent'}`,
                      transition:'all .15s ease', letterSpacing:'-.01em',
                    }}
                    onMouseEnter={e=>{ if(activeFilter!==f)(e.currentTarget as HTMLElement).style.color='#475569'; }}
                    onMouseLeave={e=>{ if(activeFilter!==f)(e.currentTarget as HTMLElement).style.color='#94A3B8'; }}
                  >
                    {f}
                  </button>
                ))}
                <button onClick={fetchPosts} title="Refresh"
                  style={{ padding:'0 14px',border:'none',background:'transparent',color:'#CBD5E1',cursor:'pointer',flexShrink:0,transition:'color .12s' }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='#475569';}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color='#CBD5E1';}}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Composer */}
            <div style={{ marginBottom:20 }}>
              <CreatePost onSubmit={handleNewPost} submitting={submitting} />
            </div>

            {/* Posts */}
            <div>
              {loading ? (
                <><PostSkeleton/><PostSkeleton/></>
              ) : error ? (
                <div style={{ background:'#fff',borderRadius:20,boxShadow:'0 2px 8px rgba(15,23,42,.06)',padding:'48px 24px',textAlign:'center' }}>
                  <div style={{ fontSize:13,color:'#8B1D34',marginBottom:12,fontWeight:600 }}>{error}</div>
                  <button onClick={fetchPosts} className="btn btn-secondary">Retry</button>
                </div>
              ) : displayed.length===0 ? (
                <div style={{ background:'#fff',borderRadius:20,boxShadow:'0 2px 8px rgba(15,23,42,.06)',padding:'64px 24px',textAlign:'center' }}>
                  <div style={{ fontSize:32,marginBottom:16,opacity:.2 }}>✦</div>
                  <div style={{ fontSize:15,color:'#0F172A',fontWeight:700,marginBottom:6 }}>Nothing here yet</div>
                  <div style={{ fontSize:13,color:'#94A3B8' }}>Be the first to post something to the community.</div>
                </div>
              ) : (
                displayed.map(p => <PostCard key={p.id} post={p}/>)
              )}
            </div>
          </div>

          {/* ── Right panel ── */}
          <aside className="feed-highlights-col">
            <CampusHighlights/>
          </aside>

        </div>
      </motion.div>

      {/* Mobile FAB */}
      <button className="fab-compose">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
    </PageTransition>
  );
}
