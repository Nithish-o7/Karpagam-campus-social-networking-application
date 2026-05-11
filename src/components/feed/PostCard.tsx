/**
 * KCE Connect — PostCard (Agent 1: Wired Like + Agent 2: Pro Icons)
 */
import { useState } from 'react';
import { type FeedPost } from '../../services/postService';
import { postService } from '../../services/postService';
import { formatRelativeTime, getInitials } from '../../utils';
import { motion } from 'framer-motion';

interface PostCardProps {
  post: FeedPost;
}

const ROLE_META: Record<string, { label: string; color: string; bg: string }> = {
  student: { label: 'Student',  color: '#1D4ED8', bg: 'rgba(37,99,235,0.08)'  },
  faculty: { label: 'Faculty',  color: '#065F46', bg: 'rgba(5,150,105,0.08)'  },
  alumni:  { label: 'Alumni',   color: '#5B21B6', bg: 'rgba(139,92,246,0.08)' },
  staff:   { label: 'Staff',    color: '#92400E', bg: 'rgba(217,119,6,0.08)'  },
};

export default function PostCard({ post }: PostCardProps) {
  const [liked,      setLiked]      = useState(post.has_liked);
  const [likesCount, setLikesCount] = useState(post.likes);

  const roleMeta = ROLE_META[post.author_role] ?? { label: post.author_role, color: '#64748B', bg: 'rgba(100,116,139,0.08)' };
  const initials  = getInitials(post.author_name);

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
      // Revert on failure
      setLiked(liked);
      setLikesCount(post.likes);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="card"
      style={{ padding: '20px 24px', marginBottom: 12 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          {/* Avatar */}
          <div style={{
            width: 42, height: 42, borderRadius: 14,
            background: `linear-gradient(135deg, var(--crimson) 0%, ${roleMeta.color} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0,
            letterSpacing: '-0.02em',
          }}>
            {initials}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {post.author_name}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 100,
                color: roleMeta.color, background: roleMeta.bg,
                textTransform: 'uppercase', letterSpacing: '0.04em',
              }}>
                {roleMeta.label}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1, display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                {post.author_dept}
              </span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ flexShrink: 0 }}>{formatRelativeTime(post.timestamp)}</span>
            </div>
          </div>

          {/* Menu */}
          <button className="btn-icon" style={{ marginTop: -4, marginRight: -8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
            </svg>
          </button>
        </div>

        {/* ── Content ── */}
        <div style={{
          fontSize: 15, color: 'var(--text-secondary)',
          lineHeight: 1.65, whiteSpace: 'pre-wrap',
          fontWeight: 450, letterSpacing: '-0.003em',
        }}>
          {post.content}
        </div>

        {/* ── Actions ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 2,
          paddingTop: 8, borderTop: '1px solid var(--border-subtle)',
        }}>
          {/* Like */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleLike}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 100, border: 'none',
              background: liked ? 'rgba(196,18,48,0.06)' : 'transparent',
              color: liked ? 'var(--crimson)' : 'var(--text-faint)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24"
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>{likesCount > 0 ? likesCount : ''}</span>
          </motion.button>

          {/* Comment */}
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 100, border: 'none',
            background: 'transparent', color: 'var(--text-faint)',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease',
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>{post.comments_count > 0 ? post.comments_count : ''}</span>
          </button>

          {/* Share */}
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 100, border: 'none',
            background: 'transparent', color: 'var(--text-faint)',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease',
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
          </button>

          <div style={{ flex: 1 }} />

          {/* Bookmark */}
          <button style={{
            display: 'flex', alignItems: 'center',
            padding: '6px 10px', borderRadius: 100, border: 'none',
            background: 'transparent', color: 'var(--text-faint)',
            cursor: 'pointer', transition: 'all 0.15s ease',
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
            </svg>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
