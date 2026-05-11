/**
 * KCE Connect — CreatePost (Agent 2: Pro LinkedIn/X Style Composer)
 */
import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../utils';

interface CreatePostProps {
  onSubmit: (content: string) => Promise<void>;
  submitting?: boolean;
}

const ROLE_GRADIENT: Record<string, string> = {
  student: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
  faculty: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
  alumni:  'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
  staff:   'linear-gradient(135deg, #D97706 0%, #92400E 100%)',
};

export default function CreatePost({ onSubmit, submitting = false }: CreatePostProps) {
  const [content,   setContent]   = useState('');
  const [focused,   setFocused]   = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();

  const charCount  = content.length;
  const maxChars   = 500;
  const canSubmit  = content.trim().length >= 3 && !submitting;
  const gradient   = ROLE_GRADIENT[user?.role ?? 'student'] ?? ROLE_GRADIENT.student;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    await onSubmit(content);
    setContent('');
    setFocused(false);
  };

  /* Auto-grow textarea */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > maxChars) return;
    setContent(e.target.value);
    const ta = textareaRef.current;
    if (ta) { ta.style.height = 'auto'; ta.style.height = `${ta.scrollHeight}px`; }
  };

  return (
    <div className="card" style={{
      padding: 0, overflow: 'hidden', marginBottom: 16,
      border: focused ? '1.5px solid var(--crimson)' : '1px solid var(--border-subtle)',
      boxShadow: focused ? '0 0 0 3px rgba(196,18,48,0.07), var(--shadow-sm)' : 'var(--shadow-soft)',
      transition: 'all 0.2s ease-out',
    }}>
      <form onSubmit={handleSubmit}>
        <div style={{ padding: '16px 20px 12px', display: 'flex', gap: 14 }}>
          {/* Avatar */}
          <div style={{
            width: 40, height: 40, borderRadius: 13, flexShrink: 0,
            background: gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em',
          }}>
            {user ? getInitials(user.name) : '?'}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* User hint */}
            {focused && (
              <div style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 8, fontWeight: 600 }}>
                Posting as <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>{user?.name ?? 'Guest'}</span>
              </div>
            )}
            <textarea
              ref={textareaRef}
              placeholder={`What's happening on campus${user ? `, ${user.name.split(' ')[0]}` : ''}?`}
              value={content}
              onChange={handleChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              disabled={submitting}
              rows={focused ? 3 : 1}
              style={{
                width: '100%', minHeight: 44,
                padding: '10px 0', background: 'transparent',
                border: 'none', outline: 'none', resize: 'none',
                fontSize: 15, color: 'var(--text-primary)',
                fontFamily: 'inherit', fontWeight: 450, lineHeight: 1.6,
                transition: 'min-height 0.2s ease',
              }}
            />
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div style={{
          background: 'var(--slate-50)', padding: '10px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          {/* Media icons */}
          <div style={{ display: 'flex', gap: 2 }}>
            {[
              {
                label: 'Image', icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                )
              },
              {
                label: 'Poll', icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20v-6M6 20V10M18 20V4"/>
                  </svg>
                )
              },
              {
                label: 'Hashtag', icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>
                  </svg>
                )
              },
            ].map(({ label, icon }) => (
              <button key={label} type="button" title={label} className="btn-icon"
                style={{ width: 34, height: 34, borderRadius: 10 }}
              >
                {icon}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Character counter */}
            {content.length > 0 && (
              <span style={{
                fontSize: 12, fontWeight: 600,
                color: charCount > maxChars * 0.85 ? 'var(--amber)' : 'var(--text-faint)',
              }}>
                {maxChars - charCount}
              </span>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                padding: '8px 20px', borderRadius: 100,
                background: canSubmit ? 'var(--crimson)' : 'var(--slate-200)',
                color: canSubmit ? '#fff' : 'var(--text-faint)',
                border: 'none', fontSize: 13, fontWeight: 800,
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
                boxShadow: canSubmit ? '0 4px 12px rgba(196,18,48,0.25)' : 'none',
              }}
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
