/**
 * Agent 2 — PostCard v11: Twitter/X thread-style, zero border card
 */
import { useState, useCallback } from 'react';
import { type FeedPost, type Comment, postService } from '../../services/postService';
import { formatRelativeTime, getInitials } from '../../utils';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface PostCardProps { post: FeedPost; }

const ROLE = {
  student: { grad:'linear-gradient(135deg,#1A3A8F,#4488FF)', badge:'#4488FF', dim:'rgba(68,136,255,.1)'   },
  faculty: { grad:'linear-gradient(135deg,#054F3A,#00C896)', badge:'#00C896', dim:'rgba(0,200,150,.1)'   },
  alumni:  { grad:'linear-gradient(135deg,#3D1A8F,#9B6DFF)', badge:'#9B6DFF', dim:'rgba(155,109,255,.1)' },
  staff:   { grad:'linear-gradient(135deg,#5A2A00,#F5A623)', badge:'#F5A623', dim:'rgba(245,166,35,.1)'  },
} as const;
type RK = keyof typeof ROLE;

const ab = (on: boolean, col: string): React.CSSProperties => ({
  display:'flex', alignItems:'center', gap:5, padding:'5px 9px', borderRadius:6,
  border:'none', background:on?`${col}1A`:'transparent', color:on?col:'var(--t3)',
  fontSize:12, fontWeight:on?500:400, cursor:'pointer', transition:'all .1s', fontFamily:'var(--font)',
});

export default function PostCard({ post }: PostCardProps) {
  const [liked,         setLiked]        = useState(post.has_liked);
  const [likesCount,    setLikesCount]   = useState(post.likes);
  const [showComments,  setShowComments] = useState(false);
  const [comments,      setComments]     = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount]= useState(post.comments_count);
  const [loadingCmt,    setLoadingCmt]   = useState(false);
  const [newComment,    setNewComment]   = useState('');
  const [submittingCmt, setSubmittingCmt]= useState(false);
  const [saved,         setSaved]        = useState(false);
  const [pollOptions,   setPollOptions]  = useState(post.poll_options ?? []);
  const [userVote,      setUserVote]     = useState<number | null>(post.user_poll_vote ?? null);
  const [votingPoll,    setVotingPoll]   = useState(false);

  const role = ROLE[post.author_role as RK] ?? { grad:'linear-gradient(135deg,#2A2A3E,#555575)', badge:'#888', dim:'rgba(0,0,0,0)' };

  const handleLike = async () => {
    const next = !liked; setLiked(next); setLikesCount(c => next?c+1:c-1);
    try { const r = await postService.like(post.id); if (r.has_liked !== next) { setLiked(r.has_liked); setLikesCount(c=>r.has_liked?c+1:c-1); } }
    catch { setLiked(liked); setLikesCount(post.likes); }
  };

  const handleToggleComments = useCallback(async () => {
    if (!showComments && comments.length === 0) {
      setLoadingCmt(true);
      try { setComments(await postService.getComments(post.id)); }
      catch { toast.error('Could not load comments.'); } finally { setLoadingCmt(false); }
    }
    setShowComments(v => !v);
  }, [showComments, comments.length, post.id]);

  const handleAddComment = async () => {
    if (!newComment.trim() || submittingCmt) return;
    setSubmittingCmt(true);
    try { const c = await postService.addComment(post.id, newComment.trim()); setComments(p=>[...p,c]); setCommentsCount(n=>n+1); setNewComment(''); }
    catch { toast.error('Failed to post comment.'); } finally { setSubmittingCmt(false); }
  };

  return (
    <motion.article
      layout initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:.18, ease:'easeOut' }}
      style={{ display:'flex', gap:11, padding:'14px 16px 10px', borderBottom:'1px solid var(--line-s)', position:'relative', cursor:'default' }}
      whileHover={{ backgroundColor:'rgba(255,255,255,0.012)' } as any}
    >
      {/* Avatar + thread line */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
        <div style={{ width:34,height:34,borderRadius:8,background:role.grad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:600,color:'#fff' }}>
          {getInitials(post.author_name)}
        </div>
        {showComments && <div style={{ width:1,flex:1,minHeight:12,marginTop:6,background:'var(--line-s)' }} />}
      </div>

      {/* Content */}
      <div style={{ flex:1, minWidth:0 }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'baseline', marginBottom:4, gap:0 }}>
          <span style={{ fontSize:13,fontWeight:600,color:'var(--t1)',letterSpacing:'-.02em',flexShrink:0 }}>{post.author_name}</span>
          <span style={{ marginLeft:6,fontSize:10,fontWeight:600,padding:'1px 6px',borderRadius:100,color:role.badge,background:role.dim,textTransform:'uppercase',letterSpacing:'.04em',flexShrink:0 }}>{post.author_role}</span>
          {post.author_dept && <span style={{ marginLeft:6,fontSize:11,color:'var(--t4)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:120 }}>{post.author_dept}</span>}
          <span style={{ marginLeft:'auto',fontSize:11,color:'var(--t4)',flexShrink:0,paddingLeft:8 }}>{formatRelativeTime(post.timestamp)}</span>
          <button className="btn-icon" style={{ width:24,height:24,marginLeft:2,color:'var(--t4)',flexShrink:0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ fontSize:14,color:'var(--t2)',lineHeight:1.65,whiteSpace:'pre-wrap',letterSpacing:'-.006em',marginBottom:10 }}>{post.content}</div>

        {/* Poll */}
        {pollOptions.length > 0 && (() => {
          const total = pollOptions.reduce((s,o)=>s+o.votes,0);
          return (
            <div style={{ marginBottom:10,borderRadius:8,border:'1px solid var(--line-s)',overflow:'hidden' }}>
              <div style={{ padding:'8px 12px 6px',fontSize:10,fontWeight:600,color:'var(--t4)',textTransform:'uppercase',letterSpacing:'.08em' }}>Poll · {total} vote{total!==1?'s':''}</div>
              {pollOptions.map(opt => {
                const pct = total>0?Math.round(opt.votes/total*100):0;
                const voted = userVote===opt.id;
                return (
                  <button key={opt.id}
                    onClick={async()=>{ if(userVote||votingPoll)return; setVotingPoll(true); try{await postService.votePoll(post.id,opt.id);setPollOptions(p=>p.map(o=>o.id===opt.id?{...o,votes:o.votes+1}:o));setUserVote(opt.id);}catch{toast.error('Vote failed');}finally{setVotingPoll(false);} }}
                    disabled={!!userVote||votingPoll}
                    style={{ position:'relative',width:'100%',padding:'8px 12px',border:'none',borderTop:'1px solid var(--line-s)',background:voted?'rgba(229,72,77,.06)':'transparent',cursor:userVote?'default':'pointer',textAlign:'left',fontFamily:'var(--font)',overflow:'hidden' }}
                  >
                    {userVote&&<div style={{ position:'absolute',left:0,top:0,height:'100%',width:`${pct}%`,background:voted?'rgba(229,72,77,.08)':'rgba(255,255,255,.03)',transition:'width .5s ease' }}/>}
                    <div style={{ position:'relative',display:'flex',justifyContent:'space-between' }}>
                      <span style={{ fontSize:12,fontWeight:voted?600:400,color:voted?'var(--red)':'var(--t1)' }}>{voted&&'✓ '}{opt.text}</span>
                      {userVote&&<span style={{ fontSize:11,fontWeight:600,color:voted?'var(--red)':'var(--t4)' }}>{pct}%</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })()}

        {/* Actions */}
        <div style={{ display:'flex', alignItems:'center', marginTop:2 }}>
          <motion.button whileTap={{scale:.88}} onClick={handleLike} style={ab(liked,'#E5484D')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={liked?'currentColor':'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {likesCount>0&&<span>{likesCount}</span>}
          </motion.button>

          <button onClick={handleToggleComments} style={ab(showComments,'#4488FF')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            {commentsCount>0&&<span>{commentsCount}</span>}
          </button>

          <button style={ab(false,'#888')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          </button>

          <div style={{ flex:1 }} />

          <button onClick={()=>setSaved(s=>!s)} style={ab(saved,'#F5A623')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={saved?'currentColor':'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          </button>
        </div>

        {/* Comment panel */}
        <AnimatePresence>
          {showComments && (
            <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} style={{overflow:'hidden'}}>
              <div style={{ paddingTop:12,marginTop:8,borderTop:'1px solid var(--line-s)' }}>
                {loadingCmt && <div style={{ fontSize:11,color:'var(--t4)',padding:'4px 0' }}>Loading…</div>}
                {!loadingCmt && comments.map(c => (
                  <div key={c.id} style={{ display:'flex',gap:8,marginBottom:10 }}>
                    <div style={{ width:24,height:24,borderRadius:6,flexShrink:0,background:ROLE[c.author_role as RK]?.grad??'linear-gradient(135deg,#2A2A3E,#555575)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:700,color:'#fff' }}>
                      {getInitials(c.author_name)}
                    </div>
                    <div style={{ flex:1,background:'rgba(255,255,255,.025)',borderRadius:7,padding:'7px 10px' }}>
                      <div style={{ fontSize:11,fontWeight:600,color:'var(--t1)',marginBottom:3 }}>{c.author_name}</div>
                      <div style={{ fontSize:12,color:'var(--t2)',lineHeight:1.5 }}>{c.content}</div>
                    </div>
                  </div>
                ))}
                {!loadingCmt && comments.length===0 && <div style={{ fontSize:12,color:'var(--t4)',padding:'4px 0 8px' }}>No comments yet.</div>}
                <div style={{ display:'flex',gap:6,alignItems:'center' }}>
                  <input type="text" placeholder="Reply…" value={newComment} onChange={e=>setNewComment(e.target.value)}
                    onKeyDown={e=>e.key==='Enter'&&handleAddComment()}
                    style={{ flex:1,padding:'7px 11px',borderRadius:7,border:'1px solid var(--line)',background:'rgba(255,255,255,.03)',color:'var(--t1)',fontSize:12,outline:'none',fontFamily:'var(--font)',transition:'border-color .1s' }}
                    onFocus={e=>{(e.target as HTMLInputElement).style.borderColor='rgba(229,72,77,.4)';}}
                    onBlur={e=>{(e.target as HTMLInputElement).style.borderColor='var(--line)';}}
                  />
                  <button onClick={handleAddComment} disabled={!newComment.trim()||submittingCmt}
                    style={{ padding:'7px 13px',borderRadius:7,background:newComment.trim()?'var(--red)':'var(--surface-2)',color:newComment.trim()?'#fff':'var(--t3)',border:'none',fontSize:12,fontWeight:600,cursor:newComment.trim()?'pointer':'not-allowed',fontFamily:'var(--font)',transition:'all .1s' }}>
                    {submittingCmt?'…':'Reply'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
