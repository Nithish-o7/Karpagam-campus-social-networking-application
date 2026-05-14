/**
 * KCE Connect — Groups Page (F7: Study Groups, Discord-inspired)
 */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import apiClient from '../services/apiClient';
import { useAuth } from '../contexts/AuthContext';
import { getInitials } from '../utils';
import toast from 'react-hot-toast';

interface Group { id: number; name: string; subject: string; department: string; description: string | null; isPrivate: boolean; adminId: number; _count: { members: number }; isMember: boolean; }
interface GroupPost { id: number; content: string; author: { name: string; role: string }; createdAt: string; }

const DEPARTMENTS = ['General','CSE','IT','ECE','EEE','Mechanical','Civil','MBA','MCA'];
const DEPT_COLORS: Record<string, string> = {
  CSE:'#2563EB', IT:'#7C3AED', ECE:'#059669', EEE:'#D97706', Mechanical:'#DC2626',
  Civil:'#0891B2', MBA:'#C41830', MCA:'#DB2777', General:'#64748B',
};

function GroupCard({ group, onJoin, onOpen }: { group: Group; onJoin: (id: number, joined: boolean) => void; onOpen: (g: Group) => void }) {
  const [joined, setJoined] = useState(group.isMember);
  const [loading, setLoading] = useState(false);
  const color = DEPT_COLORS[group.department] ?? '#64748B';

  const toggleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      if (joined) {
        await apiClient.delete(`/groups/${group.id}/leave`);
        setJoined(false); onJoin(group.id, false);
        toast.success('Left group');
      } else {
        await apiClient.post(`/groups/${group.id}/join`);
        setJoined(true); onJoin(group.id, true);
        toast.success('Joined group! 🎉');
      }
    } catch { toast.error('Action failed'); }
    finally { setLoading(false); }
  };

  return (
    <motion.div className="card" whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
      style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
      onClick={() => onOpen(group)}>
      {/* Banner */}
      <div style={{ height: 72, background: `linear-gradient(135deg, ${color}44, ${color}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${color}33` }}>
        <div style={{ width: 48, height: 48, borderRadius: 16, background: `linear-gradient(135deg, ${color}, ${color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#fff' }}>
          {getInitials(group.name)}
        </div>
      </div>

      <div style={{ padding: '16px 18px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3, flex: 1, marginRight: 8 }}>{group.name}</div>
          {group.isPrivate && <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 6, background: 'var(--bg-app)', color: 'var(--text-faint)', fontWeight: 800 }}>🔒 PRIVATE</span>}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 500 }}>{group.subject} · {group.department}</div>
        {group.description && (
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 12px', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>
            {group.description}
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 600 }}>👥 {group._count.members} members</span>
          <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 100, background: `${color}18`, color, fontWeight: 800, textTransform: 'uppercase' }}>{group.department}</span>
        </div>
        <button onClick={toggleJoin} disabled={loading}
          style={{
            width: '100%', padding: '9px 0', borderRadius: 10, fontFamily: 'inherit',
            background: joined ? 'var(--bg-app)' : `linear-gradient(135deg, ${color}, ${color}cc)`,
            border: joined ? '1px solid var(--border)' : 'none',
            color: joined ? 'var(--text-primary)' : '#fff',
            fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
          }}>
          {loading ? '…' : joined ? '✓ Joined' : '+ Join Group'}
        </button>
      </div>
    </motion.div>
  );
}

function CreateGroupModal({ onClose, onCreate }: { onClose: () => void; onCreate: (g: Group) => void }) {
  const [form, setForm] = useState({ name: '', subject: '', department: 'General', description: '', isPrivate: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.subject.trim()) return;
    setLoading(true);
    try {
      const r = await apiClient.post('/groups', form);
      onCreate(r.data.group);
      toast.success('Group created! 🎉');
      onClose();
    } catch { toast.error('Failed to create group'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ width: '100%', maxWidth: 440, padding: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 24, letterSpacing: '-0.03em' }}>Create Study Group</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Group Name', key: 'name', placeholder: 'e.g. Data Structures Study Group' },
            { label: 'Subject', key: 'subject', placeholder: 'e.g. Data Structures & Algorithms' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>{label}</label>
              <input value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: 'var(--bg-app)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Department</label>
            <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: 'var(--bg-app)', color: 'var(--text-primary)', outline: 'none' }}>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What will your group study?" rows={3}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: 'var(--bg-app)', color: 'var(--text-primary)', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
          </div>
          <label style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isPrivate} onChange={e => setForm(f => ({ ...f, isPrivate: e.target.checked }))} style={{ width: 16, height: 16 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Private group (invite only)</span>
          </label>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            <button type="submit" disabled={loading || !form.name.trim() || !form.subject.trim()} style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: 'none', background: 'var(--crimson)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {loading ? 'Creating…' : 'Create Group'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function GroupFeed({ group, onBack }: { group: Group; onBack: () => void }) {
  useAuth(); // ensure authenticated context

  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    apiClient.get(`/groups/${group.id}/posts`)
      .then(r => setPosts(r.data.posts ?? []))
      .catch(() => toast.error('Failed to load group posts'))
      .finally(() => setLoading(false));
  }, [group.id]);

  const handlePost = async () => {
    if (!newPost.trim() || posting) return;
    setPosting(true);
    try {
      const r = await apiClient.post(`/groups/${group.id}/posts`, { content: newPost });
      setPosts(prev => [r.data.post, ...prev]);
      setNewPost('');
    } catch { toast.error('Failed to post'); }
    finally { setPosting(false); }
  };

  return (
    <div>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 20, fontFamily: 'inherit' }}>
        ← Back to Groups
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg, var(--crimson), #1a1a1a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#fff' }}>{getInitials(group.name)}</div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>{group.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{group.subject} · {group._count.members} members</div>
        </div>
      </div>

      {/* Compose */}
      <div className="card" style={{ padding: 16, marginBottom: 20 }}>
        <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder={`Share something with ${group.name}…`} rows={2}
          style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', fontFamily: 'inherit', fontSize: 14, color: 'var(--text-primary)', background: 'transparent', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button onClick={handlePost} disabled={!newPost.trim() || posting}
            style={{ padding: '8px 20px', borderRadius: 100, background: newPost.trim() ? 'var(--crimson)' : 'var(--border)', color: newPost.trim() ? '#fff' : 'var(--text-faint)', border: 'none', fontSize: 13, fontWeight: 700, cursor: newPost.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
            {posting ? 'Posting…' : 'Post'}
          </button>
        </div>
      </div>

      {/* Posts */}
      {loading ? <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading…</div> :
        posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
            <div style={{ fontWeight: 700 }}>No posts yet. Start the conversation!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {posts.map(p => (
              <div key={p.id} className="card" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{p.author.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{p.content}</p>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const r = await apiClient.get('/groups');
      setGroups(r.data.groups ?? []);
    } catch { toast.error('Failed to load groups'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  const myGroups = groups.filter(g => g.isMember);
  const discoverGroups = groups.filter(g => !g.isMember);

  if (activeGroup) return (
    <PageTransition>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 100px' }}>
        <GroupFeed group={activeGroup} onBack={() => setActiveGroup(null)} />
      </div>
    </PageTransition>
  );

  return (
    <PageTransition>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px 100px' }}>
        <AnimatePresence>{showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} onCreate={g => { setGroups(prev => [g, ...prev]); setShowCreate(false); }} />}</AnimatePresence>

        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 950, color: 'var(--text-primary)', letterSpacing: '-0.04em', marginBottom: 8 }}>Study Groups</h1>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', fontWeight: 500 }}>Join subject-focused communities and collaborate.</p>
          </div>
          <button onClick={() => setShowCreate(true)} style={{ padding: '10px 20px', background: 'var(--crimson)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(196,24,48,0.25)' }}>
            + Create Group
          </button>
        </header>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="skeleton" style={{ height: 72 }} />
                <div style={{ padding: 18 }}>
                  <div className="skeleton" style={{ height: 14, width: '60%', borderRadius: 6, marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 10, width: '40%', borderRadius: 6, marginBottom: 16 }} />
                  <div className="skeleton" style={{ height: 36, borderRadius: 10 }} />
                </div>
              </div>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🎓</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>No groups yet</div>
            <div style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 24 }}>Create the first study group for your class!</div>
            <button onClick={() => setShowCreate(true)} style={{ padding: '12px 28px', background: 'var(--crimson)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Create Group</button>
          </div>
        ) : (
          <>
            {myGroups.length > 0 && (
              <section style={{ marginBottom: 40 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>My Groups ({myGroups.length})</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                  {myGroups.map(g => <GroupCard key={g.id} group={g} onJoin={() => fetchGroups()} onOpen={setActiveGroup} />)}
                </div>
              </section>
            )}
            {discoverGroups.length > 0 && (
              <section>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Discover Groups ({discoverGroups.length})</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                  {discoverGroups.map(g => <GroupCard key={g.id} group={g} onJoin={() => fetchGroups()} onOpen={setActiveGroup} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}
