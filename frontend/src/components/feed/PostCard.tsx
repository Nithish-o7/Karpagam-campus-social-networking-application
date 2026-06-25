/**
 * Agent 2 — PostCard v12: Premium Floating Card
 * White bg · Large shadow · 24px radius · hover lift
 * All logic/hooks/API preserved exactly
 */
import { useState, useCallback } from 'react';
import { type FeedPost, type Comment, postService } from '../../services/postService';
import { formatRelativeTime, getInitials } from '../../utils';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface PostCardProps { post: FeedPost; }

/* Role avatars — rich gradients for visual identity */
const ROLE_META = {
  student: { grad:'linear-gradient(135deg,#1E40AF,#3B82F6)', label:'Student', bg:'#EFF6FF', color:'#1D4ED8' },
  faculty: { grad:'linear-gradient(135deg,#065F46,#10B981)', label:'Faculty', bg:'#ECFDF5', color:'#065F46' },
  alumni:  { grad:'linear-gradient(135deg,#4C1D95,#7C3AED)', label:'Alumni',  bg:'#F5F3FF', color:'#5B21B6' },
  staff:   { grad:'linear-gradient(135deg,#78350F,#D97706)', label:'Staff',   bg:'#FFFBEB', color:'#92400E' },
} as const;
type RK = keyof typeof ROLE_META;

/* Action button style */
const ab = (on: boolean, col: string): React.CSSProperties => ({
  display:'flex', alignItems:'center', gap:5,
  padding:'6px 10px', borderRadius:8, border:'none',
  background: on ? `${col}12` : 'transparent',
  color: on ? col : '#94A3B8',
  fontSize:12, fontWeight:on?600:400, cursor:'pointer',
  transition:'all .12s', fontFamily:'var(--font)',
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

  const meta = ROLE_META[post.author_role as RK] ?? { grad:'linear-gradient(135deg,#475569,#64748B)', label:post.author_role, bg:'#F8FAFC', color:'#475569' };

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
    if (!newComment.trim() || submittingCmt) return;
    setSubmittingCmt(true);
    try { const c = await postService.addComment(post.id, newComment.trim()); setComments(p=>[...p,c]); setCommentsCount(n=>n+1); setNewComment(''); }
    catch { toast.error('Failed to post comment.'); } finally { setSubmittingCmt(false); }
  };

  return (
    <motion.article
      layout
      initial={{ opacity:0, y:10 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.22, ease:[0.16,1,0.3,1] }}
      className="post-item"
      whileHover={{ y:-2, boxShadow:'0 8px 32px rgba(15,23,42,0.10), 0 24px 64px rgba(15,23,42,0.08)' } as any}
    >
      {/* Subtle top border accent */}
      <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:'linear-gradient(90deg,#8B1D34,rgba(139,29,52,0))',borderRadius:'20px 20px 0 0',pointerEvents:'none' }} />

      <div style={{ display:'flex', gap:13 }}>

        {/* Avatar */}
        <div style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div style={{
            width:38, height:38, borderRadius:10, flexShrink:0,
            background:meta.grad,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:12, fontWeight:700, color:'#fff', letterSpacing:'-.01em',
            boxShadow:`0 2px 8px rgba(0,0,0,0.15)`,
          }}>
            {getInitials(post.author_name)}
          </div>
          {showComments && <div style={{ width:2,flex:1,minHeight:14,marginTop:8,background:'#E2E8F0',borderRadius:2 }} />}
        </div>

        {/* Content */}
        <div style={{ flex:1, minWidth:0 }}>

          {/* Header row */}
          <div style={{ display:'flex', alignItems:'center', marginBottom:6, gap:0 }}>
            <span style={{ fontSize:14,fontWeight:700,color:'#0F172A',letterSpacing:'-.02em',flexShrink:0 }}>
              {post.author_name}
            </span>
            <span style={{
              marginLeft:8, fontSize:10, fontWeight:700, padding:'2px 7px',
              borderRadius:100, color:meta.color, background:meta.bg,
              textTransform:'uppercase', letterSpacing:'.04em', flexShrink:0,
            }}>
              {meta.label}
            </span>
            {post.author_dept && (
              <span style={{ marginLeft:8,fontSize:11,color:'#94A3B8',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:140 }}>
                {post.author_dept}
              </span>
            )}
            <span style={{ marginLeft:'auto',fontSize:11,color:'#94A3B8',flexShrink:0,paddingLeft:8 }}>
              {formatRelativeTime(post.timestamp)}
            </span>
            <button className="btn-icon" style={{ width:28,height:28,marginLeft:4,color:'#CBD5E1',flexShrink:0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/></svg>
            </button>
          </div>

          {/* Body text */}
          <div style={{ fontSize:14,color:'#334155',lineHeight:1.7,whiteSpace:'pre-wrap',letterSpacing:'-.006em',marginBottom:12,fontWeight:400 }}>
            {post.content}
          </div>

          {/* Poll */}
          {pollOptions.length > 0 && (() => {
            const total = pollOptions.reduce((s,o)=>s+o.votes,0);
            return (
              <div style={{ marginBottom:14,borderRadius:12,border:'1px solid #E2E8F0',overflow:'hidden',background:'#FAFAFA' }}>
                <div style={{ padding:'10px 14px 8px',fontSize:10,fontWeight:700,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'.08em' }}>
                  Poll · {total} vote{total!==1?'s':''}
                </div>
                {pollOptions.map(opt => {
                  const pct = total>0?Math.round(opt.votes/total*100):0;
                  const voted = userVote===opt.id;
                  return (
                    <button key={opt.id}
                      onClick={async()=>{ if(userVote||votingPoll)return;setVotingPoll(true);try{await postService.votePoll(post.id,opt.id);setPollOptions(p=>p.map(o=>o.id===opt.id?{...o,votes:o.votes+1}:o));setUserVote(opt.id);}catch{toast.error('Vote failed');}finally{setVotingPoll(false);} }}
                      disabled={!!userVote||votingPoll}
                      style={{ position:'relative',width:'100%',padding:'9px 14px',border:'none',borderTop:'1px solid #E2E8F0',background:voted?'rgba(139,29,52,.05)':'transparent',cursor:userVote?'default':'pointer',textAlign:'left',fontFamily:'var(--font)',overflow:'hidden' }}
                    >
                      {userVote&&<div style={{ position:'absolute',left:0,top:0,height:'100%',width:`${pct}%`,background:voted?'rgba(139,29,52,.08)':'rgba(15,23,42,.04)',transition:'width .5s ease' }}/>}
                      <div style={{ position:'relative',display:'flex',justifyContent:'space-between' }}>
                        <span style={{ fontSize:13,fontWeight:voted?600:400,color:voted?'#8B1D34':'#0F172A' }}>{voted&&'✓ '}{opt.text}</span>
                        {userVote&&<span style={{ fontSize:11,fontWeight:700,color:voted?'#8B1D34':'#94A3B8' }}>{pct}%</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })()}

          {/* Divider */}
          <div style={{ height:1,background:'#F1F5F9',marginBottom:8 }} />

          {/* Actions */}
          <div style={{ display:'flex', alignItems:'center' }}>
            <motion.button whileTap={{scale:.9}} onClick={handleLike} style={ab(liked,'#8B1D34')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={liked?'currentColor':'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {likesCount>0&&<span>{likesCount}</span>}
            </motion.button>

            <button onClick={handleToggleComments} style={ab(showComments,'#2563EB')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {commentsCount>0&&<span>{commentsCount}</span>}
            </button>

            <button style={ab(false,'#475569')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            </button>

            <div style={{ flex:1 }} />

            <button onClick={()=>setSaved(s=>!s)} style={ab(saved,'#D97706')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={saved?'currentColor':'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            </button>
          </div>

          {/* Comments */}
          <AnimatePresence>
            {showComments && (
              <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} style={{overflow:'hidden'}}>
                <div style={{ paddingTop:14,marginTop:10,borderTop:'1px solid #F1F5F9' }}>
                  {loadingCmt && <div style={{ fontSize:12,color:'#94A3B8',padding:'4px 0' }}>Loading…</div>}
                  {!loadingCmt && comments.map(c => {
                    const cm = ROLE_META[c.author_role as RK] ?? { grad:'linear-gradient(135deg,#475569,#64748B)', bg:'#F8FAFC', color:'#475569', label:'' };
                    return (
                      <div key={c.id} style={{ display:'flex',gap:9,marginBottom:12 }}>
                        <div style={{ width:28,height:28,borderRadius:7,flexShrink:0,background:cm.grad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#fff',boxShadow:'0 1px 4px rgba(0,0,0,.12)' }}>{getInitials(c.author_name)}</div>
                        <div style={{ flex:1,background:'#F8FAFC',borderRadius:10,padding:'8px 12px',border:'1px solid #E2E8F0' }}>
                          <div style={{ fontSize:12,fontWeight:600,color:'#0F172A',marginBottom:3 }}>{c.author_name}</div>
                          <div style={{ fontSize:13,color:'#475569',lineHeight:1.55 }}>{c.content}</div>
                        </div>
                      </div>
                    );
                  })}
                  {!loadingCmt && comments.length===0 && <div style={{ fontSize:12,color:'#94A3B8',padding:'4px 0 10px' }}>No comments yet. Start the conversation.</div>}
                  <div style={{ display:'flex',gap:8,alignItems:'center' }}>
                    <input type="text" placeholder="Write a reply…" value={newComment}
                      onChange={e=>setNewComment(e.target.value)}
                      onKeyDown={e=>e.key==='Enter'&&handleAddComment()}
                      style={{ flex:1,padding:'8px 12px',borderRadius:10,border:'1.5px solid #E2E8F0',background:'#FAFAFA',color:'#0F172A',fontSize:12,outline:'none',fontFamily:'var(--font)',transition:'border-color .12s' }}
                      onFocus={e=>{(e.target as HTMLInputElement).style.borderColor='rgba(139,29,52,.4)';}}
                      onBlur={e=>{(e.target as HTMLInputElement).style.borderColor='#E2E8F0';}}
                    />
                    <motion.button whileTap={{scale:.95}} onClick={handleAddComment} disabled={!newComment.trim()||submittingCmt}
                      style={{ padding:'8px 16px',borderRadius:10,background:newComment.trim()?'#8B1D34':'#F1F5F9',color:newComment.trim()?'#fff':'#94A3B8',border:'none',fontSize:12,fontWeight:600,cursor:newComment.trim()?'pointer':'not-allowed',fontFamily:'var(--font)',transition:'all .12s' }}>
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
