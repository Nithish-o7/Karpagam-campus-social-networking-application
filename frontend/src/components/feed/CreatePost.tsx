/**
 * KCE Connect — CreatePost (Phase 14: Polls + Hashtag suggestions)
 * - Regular text posts
 * - Interactive poll creation (2–4 options)
 * - Hashtag auto-detect
 */
import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../utils';

interface CreatePostProps {
  onSubmit: (content: string, pollOptions?: string[]) => Promise<void>;
  submitting?: boolean;
}

const ROLE_GRADIENT: Record<string, string> = {
  student: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
  faculty: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
  alumni:  'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
  staff:   'linear-gradient(135deg, #D97706 0%, #92400E 100%)',
};

const SUGGESTED_TAGS = ['#KCE', '#Campus', '#Placements', '#Events', '#Tech', '#Sports', '#Hostel', '#Labs'];

export default function CreatePost({ onSubmit, submitting = false }: CreatePostProps) {
  const [content,      setContent]    = useState('');
  const [focused,      setFocused]    = useState(false);
  const [showPoll,     setShowPoll]   = useState(false);
  const [pollOptions,  setPollOptions] = useState(['', '']);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();

  const charCount  = content.length;
  const maxChars   = 500;
  const pollValid  = showPoll ? pollOptions.filter(o => o.trim()).length >= 2 : true;
  const canSubmit  = content.trim().length >= 3 && !submitting && pollValid;
  const gradient   = ROLE_GRADIENT[user?.role ?? 'student'] ?? ROLE_GRADIENT.student;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const opts = showPoll ? pollOptions.filter(o => o.trim()) : undefined;
    await onSubmit(content, opts);
    setContent('');
    setFocused(false);
    setShowPoll(false);
    setPollOptions(['', '']);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > maxChars) return;
    setContent(e.target.value);
    const ta = textareaRef.current;
    if (ta) { ta.style.height = 'auto'; ta.style.height = `${ta.scrollHeight}px`; }
  };

  const updatePollOption = (i: number, val: string) => {
    setPollOptions(prev => prev.map((o, idx) => idx === i ? val : o));
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) setPollOptions(prev => [...prev, '']);
  };

  const removePollOption = (i: number) => {
    if (pollOptions.length > 2) setPollOptions(prev => prev.filter((_, idx) => idx !== i));
  };

  const insertTag = (tag: string) => {
    setContent(prev => prev ? `${prev} ${tag}` : tag);
    textareaRef.current?.focus();
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

            {/* ── Poll Creator ── */}
            {showPoll && (
              <div style={{
                marginTop: 12, padding: '16px', background: 'var(--bg-app)',
                borderRadius: 14, border: '1px solid var(--border)', display: 'flex',
                flexDirection: 'column', gap: 10,
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                  📊 Poll Options
                </div>
                {pollOptions.map((opt, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      value={opt}
                      onChange={e => updatePollOption(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      maxLength={80}
                      style={{
                        flex: 1, padding: '9px 14px', border: '1px solid var(--border)',
                        borderRadius: 10, fontSize: 13, fontFamily: 'inherit',
                        background: 'var(--surface)', color: 'var(--text-primary)',
                        outline: 'none',
                      }}
                    />
                    {pollOptions.length > 2 && (
                      <button type="button" onClick={() => removePollOption(i)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', fontSize: 18, padding: '0 4px' }}>
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 4 && (
                  <button type="button" onClick={addPollOption}
                    style={{
                      alignSelf: 'flex-start', background: 'none', border: '1px dashed var(--border)',
                      borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700,
                      color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                    + Add option
                  </button>
                )}
              </div>
            )}

            {/* ── Hashtag Suggestions ── */}
            {focused && !showPoll && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                {SUGGESTED_TAGS.map(tag => (
                  <button key={tag} type="button" onClick={() => insertTag(tag)}
                    style={{
                      padding: '3px 10px', borderRadius: 100, border: '1px solid var(--border)',
                      background: 'var(--bg-app)', fontSize: 11, fontWeight: 700,
                      color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'var(--crimson)'; (e.target as HTMLElement).style.color = 'var(--crimson)'; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'var(--border)'; (e.target as HTMLElement).style.color = 'var(--text-muted)'; }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
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
            {/* Poll toggle */}
            <button
              type="button"
              title="Poll"
              onClick={() => setShowPoll(v => !v)}
              className="btn-icon"
              style={{
                width: 34, height: 34, borderRadius: 10,
                background: showPoll ? 'rgba(196,18,48,0.08)' : 'transparent',
                color: showPoll ? 'var(--crimson)' : 'inherit',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20v-6M6 20V10M18 20V4"/>
              </svg>
            </button>

            {/* Hashtag insert helper */}
            <button
              type="button"
              title="Add Hashtag"
              onClick={() => { setFocused(true); insertTag('#'); }}
              className="btn-icon"
              style={{ width: 34, height: 34, borderRadius: 10 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/>
                <line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>
              </svg>
            </button>

            {/* Emoji quick access */}
            {['🎉','📢','💡','🚀'].map(em => (
              <button key={em} type="button" title={em}
                onClick={() => setContent(prev => prev + em)}
                className="btn-icon"
                style={{ width: 32, height: 32, borderRadius: 8, fontSize: 15 }}>
                {em}
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
              {submitting ? 'Posting...' : showPoll ? 'Post Poll' : 'Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
