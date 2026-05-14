/**
 * PostCard v13 — Glassmorphism · Hover glow · Dynamic accents
 * All logic/hooks/API preserved
 */
import { useState, useCallback } from 'react';
import { type FeedPost, type Comment, postService } from '../../services/postService';
import { formatRelativeTime, getInitials } from '../../utils';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface PostCardProps { post: FeedPost; }

const ROLE_META = {
  student: { grad:'linear-gradient(135deg,#1D4ED8,#3B82F6)', label:'Student', glow:'rgba(59,130,246,0.3)',  badgeBg:'rgba(59,130,246,0.12)',  badgeColor:'#60A5FA'  },
  faculty: { grad:'linear-gradient(135deg,#065F46,#10B981)', label:'Faculty', glow:'rgba(16,185,129,0.3)',  badgeBg:'rgba(16,185,129,0.12)',  badgeColor:'#34D399'  },
  alumni:  { grad:'linear-gradient(135deg,#4C1D95,#8B5CF6)', label:'Alumni',  glow:'rgba(139,92,246,0.3)',  badgeBg:'rgba(139,92,246,0.12)',  badgeColor:'#A78BFA'  },
  staff:   { grad:'linear-gradient(135deg,#78350F,#F59E0B)', label:'Staff',   glow:'rgba(245,158,11,0.3)',  badgeBg:'rgba(245,158,11,0.12)',  badgeColor:'#FCD34D'  },
} as const;
type RK = keyof typeof ROLE_META;

const ab = (on: boolean, col: string): React.CSSProperties => ({
  display:'flex', alignItems:'center', gap:5,
  padding:'5px 10px', borderRadius:7, border:'none',
  background: on ? `${col}18` : 'transparent',
  color: on ? col : 'rgba(255,255,255,0.25)',
  fontSize:12, fontWeight:on?600:400, cursor:'pointer',
  transition:'all .12s', fontFamily:"'Inter',sans-serif",
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
  const [userVote,      setUserVote]     = useState<number|null>(post.user_poll_vote ?? null);
  const [votingPoll,    setVotingPoll]   = useState(false);

  const meta = ROLE_META[post.author_role as RK] ?? {
    grad:'linear-gradient(135deg,#334155,#475569)', label:post.author_role,
    glow:'rgba(100,116,139,0.2)', badgeBg:'rgba(100,116,139,0.1)', badgeColor:'#94A3B8',
  };

  const handleLike = async () => {
    const next = !liked; setLiked(next); setLikesCount(c=>next?c+1:c-1);
    try { const r = await postService.like(post.id); if(r.has_liked!==next){setLiked(r.has_liked);setLikesCount(c=>r.has_liked?c+1:c-1);} }
    catch { setLiked(liked); setLikesCount(post.likes); }
  };

  const handleToggleComments = useCallback(async () => {
    if (!showComments && comments.length===0) {
      setLoadingCmt(true);
      try { setComments(await postService.getComments(post.id)); }
      catch { toast.error('Could not load comments.'); } finally { setLoadingCmt(false); }
    }
    setShowComments(v=>!v);
  }, [showComments, comments.length, post.id]);

  const handleAddComment = async () => {
    if (!newComment.trim()||submittingCmt) return;
    setSubmittingCmt(true);
    try { const c = await postService.addComment(post.id,newComment.trim()); setComments(p=>[...p,c]); setCommentsCount(n=>n+1); setNewComment(''); }
    catch { toast.error('Failed to post comment.'); } finally { setSubmittingCmt(false); }
  };

  return (
    <motion.article
      layout
      initial={{ opacity:0, y:12 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.22, ease:[0.16,1,0.3,1] }}
      className="post-item"
    >
      {/* Avatar + content */}
      <div style={{ display:'flex', gap:13 }}>

        {/* Avatar */}
        <div style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div style={{
            width:38, height:38, borderRadius:10, background:meta.grad,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:12, fontWeight:700, color:'#fff',
            boxShadow:`0 2px 12px ${meta.glow}`,
            flexShrink:0,
          }}>
            {getInitials(post.author_name)}
          </div>
          {showComments && <div style={{ width:1,flex:1,minHeight:14,marginTop:8,background:'rgba(255,255,255,0.06)',borderRadius:2 }} />}
        </div>

        {/* Content */}
        <div style={{ flex:1, minWidth:0 }}>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', marginBottom:6, flexWrap:'nowrap', gap:0 }}>
            <span style={{ fontSize:14,fontWeight:700,color:'#F0F4FF',letterSpacing:'-.02em',flexShrink:0 }}>
              {post.author_name}
            </span>
            <span style={{
              marginLeft:8, fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:100,
              color:meta.badgeColor, background:meta.badgeBg,
              border:`1px solid ${meta.badgeColor}30`,
              textTransform:'uppercase', letterSpacing:'.04em', flexShrink:0,
            }}>
              {meta.label}
            </span>
            {post.author_dept && (
              <span style={{ marginLeft:8,fontSize:11,color:'rgba(255,255,255,0.25)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:120 }}>
                {post.author_dept}
              </span>
            )}
            <span style={{ marginLeft:'auto',fontSize:11,color:'rgba(255,255,255,0.2)',flexShrink:0,paddingLeft:8 }}>
              {formatRelativeTime(post.timestamp)}
            </span>
            <button className="btn-icon" style={{ width:26,height:26,marginLeft:4,color:'rgba(255,255,255,0.2)',flexShrink:0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/></svg>
            </button>
          </div>

          {/* Body */}
          <div style={{ fontSize:14,color:'rgba(255,255,255,0.72)',lineHeight:1.7,whiteSpace:'pre-wrap',letterSpacing:'-.005em',marginBottom:12 }}>
            {post.content}
          </div>

          {/* Poll */}
          {pollOptions.length > 0 && (() => {
            const total = pollOptions.reduce((s,o)=>s+o.votes,0);
            return (
              <div style={{ marginBottom:14,borderRadius:10,border:'1px solid rgba(255,255,255,0.08)',overflow:'hidden',background:'rgba(255,255,255,0.02)' }}>
                <div style={{ padding:'8px 12px 6px',fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.25)',textTransform:'uppercase',letterSpacing:'.08em' }}>Poll · {total} vote{total!==1?'s':''}</div>
                {pollOptions.map(opt => {
                  const pct = total>0?Math.round(opt.votes/total*100):0;
                  const voted = userVote===opt.id;
                  return (
                    <button key={opt.id}
                      onClick={async()=>{ if(userVote||votingPoll)return;setVotingPoll(true);try{await postService.votePoll(post.id,opt.id);setPollOptions(p=>p.map(o=>o.id===opt.id?{...o,votes:o.votes+1}:o));setUserVote(opt.id);}catch{toast.error('Vote failed');}finally{setVotingPoll(false);} }}
                      disabled={!!userVote||votingPoll}
                      style={{ position:'relative',width:'100%',padding:'9px 12px',border:'none',borderTop:'1px solid rgba(255,255,255,0.05)',background:voted?'rgba(139,29,52,0.08)':'transparent',cursor:userVote?'default':'pointer',textAlign:'left',fontFamily:"'Inter',sans-serif",overflow:'hidden' }}
                    >
                      {userVote&&<div style={{ position:'absolute',left:0,top:0,height:'100%',width:`${pct}%`,background:voted?'rgba(139,29,52,0.1)':'rgba(255,255,255,0.03)',transition:'width .5s ease' }}/>}
                      <div style={{ position:'relative',display:'flex',justifyContent:'space-between' }}>
                        <span style={{ fontSize:13,fontWeight:voted?600:400,color:voted?'#F87171':'rgba(255,255,255,0.75)' }}>{voted&&'✓ '}{opt.text}</span>
                        {userVote&&<span style={{ fontSize:11,fontWeight:700,color:voted?'#F87171':'rgba(255,255,255,0.3)' }}>{pct}%</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })()}

          {/* Action bar */}
          <div style={{ display:'flex', alignItems:'center', marginTop:4, paddingTop:8, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
            <motion.button whileTap={{scale:.86}} onClick={handleLike} style={ab(liked,'#F87171')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={liked?'currentColor':'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {likesCount>0&&<span>{likesCount}</span>}
            </motion.button>

            <button onClick={handleToggleComments} style={ab(showComments,'#60A5FA')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {commentsCount>0&&<span>{commentsCount}</span>}
            </button>

            <button style={ab(false,'#94A3B8')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            </button>

            <div style={{ flex:1 }} />

            <button onClick={()=>setSaved(s=>!s)} style={ab(saved,'#FCD34D')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={saved?'currentColor':'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            </button>
          </div>

          {/* Comments */}
          <AnimatePresence>
            {showComments && (
              <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} style={{overflow:'hidden'}}>
                <div style={{ paddingTop:14,marginTop:10,borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                  {loadingCmt && <div style={{ fontSize:12,color:'rgba(255,255,255,0.2)',padding:'4px 0' }}>Loading…</div>}
                  {!loadingCmt && comments.map(c => {
                    const cm = ROLE_META[c.author_role as RK];
                    return (
                      <div key={c.id} style={{ display:'flex',gap:9,marginBottom:12 }}>
                        <div style={{ width:26,height:26,borderRadius:7,flexShrink:0,background:cm?.grad??'linear-gradient(135deg,#334155,#475569)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#fff',boxShadow:`0 1px 8px ${cm?.glow??'rgba(0,0,0,0.3)'}` }}>
                          {getInitials(c.author_name)}
                        </div>
                        <div style={{ flex:1,background:'rgba(255,255,255,0.04)',borderRadius:9,padding:'8px 12px',border:'1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.7)',marginBottom:3 }}>{c.author_name}</div>
                          <div style={{ fontSize:12,color:'rgba(255,255,255,0.5)',lineHeight:1.55 }}>{c.content}</div>
                        </div>
                      </div>
                    );
                  })}
                  {!loadingCmt && comments.length===0 && (
                    <div style={{ fontSize:12,color:'rgba(255,255,255,0.2)',padding:'4px 0 10px' }}>No comments yet.</div>
                  )}
                  <div style={{ display:'flex',gap:8,alignItems:'center' }}>
                    <input type="text" placeholder="Reply…" value={newComment}
                      onChange={e=>setNewComment(e.target.value)}
                      onKeyDown={e=>e.key==='Enter'&&handleAddComment()}
                      style={{ flex:1,padding:'7px 12px',borderRadius:9,border:'1px solid rgba(255,255,255,0.08)',background:'rgba(255,255,255,0.04)',color:'#F0F4FF',fontSize:12,outline:'none',fontFamily:"'Inter',sans-serif",transition:'border-color .12s' }}
                      onFocus={e=>{(e.target as HTMLInputElement).style.borderColor='rgba(139,29,52,0.5)';}}
                      onBlur={e=>{(e.target as HTMLInputElement).style.borderColor='rgba(255,255,255,0.08)';}}
                    />
                    <motion.button whileTap={{scale:.94}} onClick={handleAddComment} disabled={!newComment.trim()||submittingCmt}
                      style={{ padding:'7px 14px',borderRadius:9,background:newComment.trim()?'linear-gradient(135deg,#A52444,#6B1528)':'rgba(255,255,255,0.06)',color:newComment.trim()?'#fff':'rgba(255,255,255,0.2)',border:'none',fontSize:12,fontWeight:700,cursor:newComment.trim()?'pointer':'not-allowed',fontFamily:"'Inter',sans-serif",transition:'all .12s',boxShadow:newComment.trim()?'0 2px 12px rgba(139,29,52,0.3)':'none' }}>
                      {submittingCmt?'…':'Reply'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
}
