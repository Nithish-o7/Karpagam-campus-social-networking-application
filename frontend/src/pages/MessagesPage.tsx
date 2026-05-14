/**
 * KCE Connect — Messages Page
 * Full direct messaging UI: conversation list + real-time chat window.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRealtime } from '../contexts/RealtimeContext';
import { messagingService, type Conversation, type Message } from '../services/messagingService';
import PageTransition from '../components/layout/PageTransition';
import { getInitials } from '../utils';
import toast from 'react-hot-toast';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

/* ── Conversation List Item ───────────────────── */
function ConvItem({ conv, active, onClick, myId }: {
  conv: Conversation; active: boolean; onClick: () => void; myId: number;
}) {
  const other = conv.participants.find(p => p.user.id !== myId)?.user;
  const lastMsg = conv.messages[0];
  const displayName = conv.isGroup ? (conv.name ?? 'Group Chat') : (other?.name ?? 'Unknown');

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 20px', width: '100%', border: 'none', textAlign: 'left',
        background: active ? 'rgba(196,18,48,0.07)' : 'transparent',
        borderLeft: active ? '3px solid var(--crimson)' : '3px solid transparent',
        cursor: 'pointer', transition: 'all 0.15s', borderRadius: 0,
        fontFamily: 'inherit',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, var(--crimson) 0%, #1a1a1a 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15, fontWeight: 800, color: '#fff',
      }}>
        {getInitials(displayName)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: active ? 'var(--crimson)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130 }}>
            {displayName}
          </span>
          {lastMsg && (
            <span style={{ fontSize: 10, color: 'var(--text-faint)', fontWeight: 500, flexShrink: 0, marginLeft: 8 }}>
              {timeAgo(lastMsg.createdAt)}
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
          {lastMsg ? lastMsg.content : 'No messages yet'}
        </div>
      </div>
    </button>
  );
}

/* ── Chat Bubble ──────────────────────────────── */
function ChatBubble({ msg, isMe }: { msg: Message; isMe: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
      {!isMe && (
        <div style={{
          width: 30, height: 30, borderRadius: '50%', flexShrink: 0, marginRight: 8, marginTop: 4,
          background: 'linear-gradient(135deg, #4A5FD9, #1a1a1a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 800, color: '#fff',
        }}>
          {getInitials(msg.sender.name)}
        </div>
      )}
      <div style={{ maxWidth: '68%' }}>
        {!isMe && (
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-faint)', marginBottom: 4, paddingLeft: 2 }}>
            {msg.sender.name}
          </div>
        )}
        <div style={{
          padding: '10px 16px', borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
          background: isMe ? 'var(--crimson)' : 'var(--surface)',
          color: isMe ? '#fff' : 'var(--text-primary)',
          fontSize: 14, lineHeight: 1.5, fontWeight: 450,
          border: isMe ? 'none' : '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {msg.content}
        </div>
        <div style={{ fontSize: 9, color: 'var(--text-faint)', marginTop: 4, textAlign: isMe ? 'right' : 'left', fontWeight: 500 }}>
          {formatTime(msg.createdAt)}
        </div>
      </div>
    </div>
  );
}

/* ── Empty State ──────────────────────────────── */
function EmptyState() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: 'var(--text-muted)', padding: 40 }}>
      <div style={{ fontSize: 56 }}>💬</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>No conversation selected</div>
      <div style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
        Pick a conversation from the left, or go to <strong>People</strong> to start a new chat.
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────── */
export default function MessagesPage() {
  const { user } = useAuth();
  const { socket } = useRealtime();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeId);
  const otherUser = activeConv?.participants.find(p => p.user.id !== user?.id)?.user;
  const displayName = activeConv?.isGroup ? (activeConv.name ?? 'Group Chat') : (otherUser?.name ?? '');

  const loadConversations = useCallback(async () => {
    setLoadingConvs(true);
    try {
      const convs = await messagingService.getConversations();
      setConversations(convs);
    } catch { toast.error('Failed to load conversations'); }
    finally { setLoadingConvs(false); }
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  const openConversation = useCallback(async (id: number) => {
    setActiveId(id);
    setLoadingMsgs(true);
    try {
      const msgs = await messagingService.getMessages(id);
      setMessages(msgs);
    } catch { toast.error('Failed to load messages'); }
    finally { setLoadingMsgs(false); }
  }, []);

  // Real-time incoming messages
  useEffect(() => {
    if (!socket) return;
    const handler = (msg: Message) => {
      if (msg.conversationId === activeId) {
        setMessages(prev => [...prev, msg]);
      }
      // refresh conversation list to update last message preview
      loadConversations();
    };
    socket.on('new-message', handler);
    return () => { socket.off('new-message', handler); };
  }, [socket, activeId, loadConversations]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeId || sending) return;
    const text = input.trim();
    setInput('');
    setSending(true);
    try {
      const msg = await messagingService.sendMessage(activeId, text);
      setMessages(prev => [...prev, msg]);
      loadConversations();
    } catch { toast.error('Failed to send message'); setInput(text); }
    finally { setSending(false); }
  };

  const filteredConvs = search
    ? conversations.filter(c => {
        const other = c.participants.find(p => p.user.id !== user?.id)?.user;
        const name = c.isGroup ? (c.name ?? '') : (other?.name ?? '');
        return name.toLowerCase().includes(search.toLowerCase());
      })
    : conversations;

  return (
    <PageTransition>
      <div style={{ height: 'calc(100vh - 64px)', display: 'flex', overflow: 'hidden', background: 'var(--bg-app)' }}>

        {/* ── Left: Conversation List ── */}
        <div style={{
          width: 320, flexShrink: 0, borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', background: 'var(--surface)',
        }}>
          {/* Header */}
          <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', marginBottom: 12 }}>
              Messages
            </h2>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-faint)' }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations..."
                style={{
                  width: '100%', padding: '8px 12px 8px 34px',
                  background: 'var(--bg-app)', border: '1px solid var(--border)',
                  borderRadius: 10, fontSize: 13, color: 'var(--text-primary)',
                  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loadingConvs ? (
              [1,2,3].map(i => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 20px', alignItems: 'center' }}>
                  <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ width: '60%', height: 12, borderRadius: 6, marginBottom: 8 }} />
                    <div className="skeleton" style={{ width: '80%', height: 10, borderRadius: 6 }} />
                  </div>
                </div>
              ))
            ) : filteredConvs.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                {search ? 'No results' : 'No conversations yet'}
              </div>
            ) : (
              filteredConvs.map(conv => (
                <ConvItem
                  key={conv.id}
                  conv={conv}
                  active={activeId === conv.id}
                  myId={user?.id ?? 0}
                  onClick={() => openConversation(conv.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Right: Chat Window ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {!activeId ? <EmptyState /> : (
            <>
              {/* Chat Header */}
              <div style={{
                padding: '16px 24px', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'var(--surface)', flexShrink: 0,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--crimson) 0%, #1a1a1a 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0,
                }}>
                  {getInitials(displayName)}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>{displayName}</div>
                  {otherUser?.role && (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'capitalize' }}>
                      {otherUser.role}
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
                {loadingMsgs ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: 40, color: 'var(--text-faint)' }}>
                    Loading messages…
                  </div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>👋</div>
                    <div style={{ fontWeight: 600 }}>Say hello to {displayName}!</div>
                  </div>
                ) : (
                  messages.map(msg => (
                    <ChatBubble key={msg.id} msg={msg} isMe={msg.senderId === user?.id} />
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{
                padding: '12px 20px', borderTop: '1px solid var(--border)',
                display: 'flex', gap: 10, alignItems: 'flex-end',
                background: 'var(--surface)', flexShrink: 0,
              }}>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Type a message… (Enter to send)"
                  rows={1}
                  style={{
                    flex: 1, padding: '12px 16px', border: '1px solid var(--border)',
                    borderRadius: 14, fontSize: 14, fontFamily: 'inherit',
                    background: 'var(--bg-app)', color: 'var(--text-primary)',
                    resize: 'none', outline: 'none', maxHeight: 120, overflowY: 'auto',
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  style={{
                    width: 44, height: 44, borderRadius: '50%', border: 'none',
                    background: input.trim() ? 'var(--crimson)' : 'var(--border)',
                    color: '#fff', fontSize: 18, cursor: input.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s', flexShrink: 0,
                  }}
                >
                  {sending ? '⌛' : '➤'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
