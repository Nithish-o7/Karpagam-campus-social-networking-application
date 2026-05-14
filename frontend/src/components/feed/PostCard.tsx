/**
 * KCE Connect — PostCard v9 (Premium Redesign)
 */
import { useState, useCallback } from 'react';
import { type FeedPost, type Comment, postService } from '../../services/postService';
import { formatRelativeTime, getInitials } from '../../utils';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface PostCardProps { post: FeedPost; }

const ROLE_META: Record<string, { label: string; color: string; bg: string }> = {
  student: { label: 'Student', color: '#60A5FA', bg: 'rgba(59,130,246,0.1)'  },
  faculty: { label: 'Faculty', color: '#34D399', bg: 'rgba(16,185,129,0.1)'  },
  alumni:  { label: 'Alumni',  color: '#A78BFA', bg: 'rgba(139,92,246,0.1)'  },
  staff:   { label: 'Staff',   color: '#FCD34D', bg: 'rgba(245,158,11,0.1)'  },
};

const AVATAR_GRAD: Record<string, string> = {
  student: 'linear-gradient(135deg,#1D4ED8,#3B82F6)',
  faculty: 'linear-gradient(135deg,#065F46,#10B981)',
  alumni:  'linear-gradient(135deg,#5B21B6,#8B5CF6)',
  staff:   'linear-gradient(135deg,#92400E,#F59E0B)',
};

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

  const roleMeta   = ROLE_META[post.author_role] ?? { label: post.author_role, color: '#9898B8', bg: 'rgba(152,152,184,0.1)' };
  const avatarGrad = AVATAR_GRAD[post.author_role] ?? 'linear-gradient(135deg,#3A3A55,#5C5C80)';
  const initials   = getInitials(post.author_name);

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(c => newLiked ? c + 1 : c - 1);
    try {
      const res = await postService.like(post.id);
      if (res.has_liked !== newLiked) {
        setLiked(res.has_liked);
        setLikesCount(c => res.has_liked ? c + 1 : c - 1);
      }
    } catch {
      setLiked(liked);
      setLikesCount(post.likes);
    }
  };

  const handleToggleComments = useCallback(async () => {
    if (!showComments && comments.length === 0) {
      setLoadingCmt(true);
      try {
        setComments(await postService.getComments(post.id));
      } catch {
        toast.error('Could not load comments.');
      } finally {
        setLoadingCmt(false);
      }
    }
    setShowComments(v => !v);
  }, [showComments, comments.length, post.id]);

  const handleAddComment = async () => {
    if (!newComment.trim() || submittingCmt) return;
    setSubmittingCmt(true);
    try {
      const c = await postService.addComment(post.id, newComment.trim());
      setComments(prev => [...prev, c]);
      setCommentsCount(n => n + 1);
      setNewComment('');
    } catch {
      toast.error('Failed to post comment.');
    } finally {
      setSubmittingCmt(false);
    }
  };

  const actionBtn = (active: boolean, activeColor: string): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '5px 10px', borderRadius: 6, border: 'none',
    background: active ? `${activeColor}12` : 'transparent',
    color: active ? activeColor : 'var(--text-faint)',
    fontSize: 12, fontWeight: 500, cursor: 'pointer',
    transition: 'all 0.12s ease', fontFamily: 'var(--font)',
  });

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '16px 18px',
        marginBottom: 1,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
      whileHover={{ borderColor: 'rgba(255,255,255,0.1)' } as any}
    >
      {/* Top shimmer line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', gap: 11 }}>

        {/* Avatar */}
        <div style={{ flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: avatarGrad,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff',
          }}>
            {initials}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6, gap: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
              {post.author_name}
            </span>
            <span style={{
              marginLeft: 7, fontSize: 10, fontWeight: 600, padding: '1px 6px',
              borderRadius: 100, color: roleMeta.color, background: roleMeta.bg,
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              {roleMeta.label}
            </span>
            {post.author_dept && (
              <span style={{ fontSize: 11, color: 'var(--text-faint)', marginLeft: 7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
                {post.author_dept}
              </span>
            )}
            <span style={{ fontSize: 11, color: 'var(--text-faint)', marginLeft: 7, flexShrink: 0 }}>
              · {formatRelativeTime(post.timestamp)}
            </span>
            <div style={{ flex: 1 }} />
            <button className="btn-icon" style={{ width: 26, height: 26, color: 'var(--text-faint)', flexShrink: 0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div style={{
            fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65,
            whiteSpace: 'pre-wrap', letterSpacing: '-0.005em', marginBottom: 10,
          }}>
            {post.content}
          </div>

          {/* Poll */}
          {pollOptions.length > 0 && (() => {
            const totalVotes = pollOptions.reduce((s, o) => s + o.votes, 0);
            return (
              <div style={{
                marginBottom: 12, padding: '11px 13px', borderRadius: 8,
                border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)',
                display: 'flex', flexDirection: 'column', gap: 7,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Poll · {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
                </div>
                {pollOptions.map(opt => {
                  const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                  const voted = userVote === opt.id;
                  return (
                    <button key={opt.id}
                      onClick={async () => {
                        if (userVote || votingPoll) return;
                        setVotingPoll(true);
                        try {
                          await postService.votePoll(post.id, opt.id);
                          setPollOptions(prev => prev.map(o => o.id === opt.id ? { ...o, votes: o.votes + 1 } : o));
                          setUserVote(opt.id);
                        } catch { toast.error('Vote failed'); }
                        finally { setVotingPoll(false); }
                      }}
                      disabled={!!userVote || votingPoll}
                      style={{
                        position: 'relative', width: '100%', padding: '7px 11px',
                        border: `1px solid ${voted ? 'rgba(255,23,68,0.25)' : 'var(--border)'}`,
                        borderRadius: 6, background: voted ? 'rgba(255,23,68,0.06)' : 'transparent',
                        cursor: userVote ? 'default' : 'pointer',
                        textAlign: 'left', fontFamily: 'var(--font)', overflow: 'hidden',
                      }}
                    >
                      {userVote && (
                        <div style={{
                          position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`,
                          background: voted ? 'rgba(255,23,68,0.08)' : 'rgba(255,255,255,0.03)',
                          transition: 'width 0.5s ease',
                        }} />
                      )}
                      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, fontWeight: voted ? 600 : 400, color: voted ? 'var(--crimson)' : 'var(--text-primary)' }}>
                          {voted && '✓ '}{opt.text}
                        </span>
                        {userVote && <span style={{ fontSize: 11, fontWeight: 600, color: voted ? 'var(--crimson)' : 'var(--text-faint)' }}>{pct}%</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })()}

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <motion.button whileTap={{ scale: 0.88 }} onClick={handleLike} style={actionBtn(liked, '#FF1744')}>
              <svg width="14" height="14" viewBox="0 0 24 24"
                fill={liked ? 'currentColor' : 'none'}
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {likesCount > 0 && <span>{likesCount}</span>}
            </motion.button>

            <button onClick={handleToggleComments} style={actionBtn(showComments, '#3B82F6')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              {commentsCount > 0 && <span>{commentsCount}</span>}
            </button>

            <button style={actionBtn(false, '#9898B8')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
            </button>

            <div style={{ flex: 1 }} />

            <button onClick={() => setSaved(s => !s)} style={actionBtn(saved, '#F59E0B')}>
              <svg width="14" height="14" viewBox="0 0 24 24"
                fill={saved ? 'currentColor' : 'none'}
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
              </svg>
            </button>
          </div>

          {/* Comment panel */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 10 }}>
                  {loadingCmt && <div style={{ fontSize: 12, color: 'var(--text-faint)', padding: '4px 0' }}>Loading…</div>}

                  {!loadingCmt && comments.map(c => (
                    <div key={c.id} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: 5, flexShrink: 0,
                        background: AVATAR_GRAD[c.author_role] ?? 'linear-gradient(135deg,#3A3A55,#5C5C80)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 8, fontWeight: 700, color: '#fff',
                      }}>{getInitials(c.author_name)}</div>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: 7, padding: '7px 10px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{c.author_name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{c.content}</div>
                      </div>
                    </div>
                  ))}

                  {!loadingCmt && comments.length === 0 && (
                    <div style={{ padding: '4px 0 10px', color: 'var(--text-faint)', fontSize: 12 }}>No comments yet.</div>
                  )}

                  <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Add a comment…"
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                      style={{
                        flex: 1, padding: '7px 11px', borderRadius: 7,
                        border: '1px solid var(--border)',
                        background: 'rgba(255,255,255,0.03)',
                        color: 'var(--text-primary)',
                        fontSize: 12, outline: 'none', fontFamily: 'var(--font)',
                        transition: 'border-color 0.12s',
                      }}
                      onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,23,68,0.35)'; }}
                      onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; }}
                    />
                    <button onClick={handleAddComment}
                      disabled={!newComment.trim() || submittingCmt}
                      style={{
                        padding: '7px 13px', borderRadius: 7,
                        background: newComment.trim() ? 'var(--crimson)' : 'var(--surface-2)',
                        color: newComment.trim() ? '#fff' : 'var(--text-faint)',
                        border: 'none', fontSize: 12, fontWeight: 600,
                        cursor: newComment.trim() ? 'pointer' : 'not-allowed',
                        fontFamily: 'var(--font)', transition: 'all 0.12s',
                      }}
                    >
                      {submittingCmt ? '…' : 'Reply'}
                    </button>
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
