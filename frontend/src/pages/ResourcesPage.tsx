/**
 * KCE Connect — Resources Hub (F10: Academic Resources)
 * Inspired by Notion, Google Drive sharing
 */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import apiClient from '../services/apiClient';
import { formatRelativeTime } from '../utils';
import toast from 'react-hot-toast';

interface Resource { id: number; title: string; description: string | null; fileUrl: string; type: string; subject: string; semester: number | null; department: string; upvotes: number; uploadedBy: { name: string; role: string }; createdAt: string; }

const RESOURCE_TYPES = ['All', 'NOTES', 'PAPER', 'BOOK', 'VIDEO', 'LINK'];
const TYPE_META: Record<string, { icon: string; label: string; color: string }> = {
  NOTES: { icon: '📝', label: 'Notes',     color: '#2563EB' },
  PAPER: { icon: '📄', label: 'Paper',     color: '#7C3AED' },
  BOOK:  { icon: '📚', label: 'Book',      color: '#059669' },
  VIDEO: { icon: '🎥', label: 'Video',     color: '#DC2626' },
  LINK:  { icon: '🔗', label: 'Link',      color: '#D97706' },
};

function ResourceCard({ resource, onUpvote }: { resource: Resource; onUpvote: (id: number) => void }) {
  const [upvoted, setUpvoted] = useState(false);
  const [votes, setVotes] = useState(resource.upvotes);
  const meta = TYPE_META[resource.type] ?? TYPE_META.NOTES;

  const handleUpvote = async () => {
    try {
      await apiClient.post(`/resources/${resource.id}/upvote`);
      if (upvoted) { setVotes(v => v - 1); setUpvoted(false); }
      else { setVotes(v => v + 1); setUpvoted(true); }
      onUpvote(resource.id);
    } catch { toast.error('Could not upvote'); }
  };

  return (
    <motion.div className="card" whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
      style={{ padding: '20px 22px', display: 'flex', gap: 16 }}>
      {/* Type Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 14, flexShrink: 0,
        background: `${meta.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        border: `1px solid ${meta.color}33`,
      }}>{meta.icon}</div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>{resource.title}</div>
          <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 100, background: `${meta.color}18`, color: meta.color, fontWeight: 800, textTransform: 'uppercase', flexShrink: 0 }}>{meta.label}</span>
        </div>

        {resource.description && (
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 8px', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, overflow: 'hidden' }}>
            {resource.description}
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 600 }}>📖 {resource.subject}</span>
          {resource.semester && resource.semester > 0 && (
            <span style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 600 }}>Sem {resource.semester}</span>
          )}
          <span style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 600 }}>🏛 {resource.department}</span>
          <span style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 600 }}>{formatRelativeTime(resource.createdAt)}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
            by {resource.uploadedBy.name} · <span style={{ textTransform: 'capitalize' }}>{resource.uploadedBy.role}</span>
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleUpvote}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, border: `1px solid ${upvoted ? meta.color : 'var(--border)'}`, background: upvoted ? `${meta.color}18` : 'var(--bg-app)', color: upvoted ? meta.color : 'var(--text-muted)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
              ▲ {votes}
            </button>
            <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, background: 'var(--crimson)', color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
              Open →
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function UploadModal({ onClose, onUploaded }: { onClose: () => void; onUploaded: (r: Resource) => void }) {
  const [form, setForm] = useState({ title: '', description: '', fileUrl: '', type: 'NOTES', subject: '', semester: '0', department: 'General' });
  const [loading, setLoading] = useState(false);
  const DEPTS = ['General','CSE','IT','ECE','EEE','Mechanical','Civil','MBA','MCA'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await apiClient.post('/resources', { ...form, semester: parseInt(form.semester) });
      onUploaded(r.data.resource);
      toast.success('Resource shared! 🎉');
      onClose();
    } catch { toast.error('Failed to share resource'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ width: '100%', maxWidth: 460, padding: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 24 }}>Share Resource</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Title', key: 'title', placeholder: 'e.g. Data Structures Complete Notes' },
            { label: 'File / Link URL', key: 'fileUrl', placeholder: 'https://drive.google.com/...' },
            { label: 'Subject', key: 'subject', placeholder: 'e.g. Data Structures & Algorithms' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>{label}</label>
              <input value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} required
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: 'var(--bg-app)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: 'var(--bg-app)', color: 'var(--text-primary)', outline: 'none' }}>
                {Object.entries(TYPE_META).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Semester</label>
              <select value={form.semester} onChange={e => setForm(f => ({ ...f, semester: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: 'var(--bg-app)', color: 'var(--text-primary)', outline: 'none' }}>
                <option value="0">General</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Department</label>
            <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: 'var(--bg-app)', color: 'var(--text-primary)', outline: 'none' }}>
              {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: 'none', background: 'var(--crimson)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {loading ? 'Sharing…' : 'Share Resource'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');
  const [subjectSearch, setSubjectSearch] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'upvoted'>('recent');
  const [showUpload, setShowUpload] = useState(false);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const r = await apiClient.get('/resources');
      setResources(r.data.resources ?? []);
    } catch { toast.error('Failed to load resources'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  const filtered = resources
    .filter(r => typeFilter === 'All' || r.type === typeFilter)
    .filter(r => !subjectSearch || r.subject.toLowerCase().includes(subjectSearch.toLowerCase()))
    .sort((a, b) => sortBy === 'upvoted' ? b.upvotes - a.upvotes : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <PageTransition>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 100px' }}>
        <AnimatePresence>{showUpload && <UploadModal onClose={() => setShowUpload(false)} onUploaded={r => { setResources(prev => [r, ...prev]); setShowUpload(false); }} />}</AnimatePresence>

        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 950, color: 'var(--text-primary)', letterSpacing: '-0.04em', marginBottom: 8 }}>Resources Hub</h1>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', fontWeight: 500 }}>Share and discover study materials.</p>
          </div>
          <button onClick={() => setShowUpload(true)} style={{ padding: '10px 20px', background: 'var(--crimson)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(196,24,48,0.25)', flexShrink: 0 }}>
            + Share Resource
          </button>
        </header>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 160 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13 }}>🔍</span>
            <input value={subjectSearch} onChange={e => setSubjectSearch(e.target.value)} placeholder="Filter by subject..."
              style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
            style={{ padding: '9px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text-secondary)', outline: 'none' }}>
            <option value="recent">Most Recent</option>
            <option value="upvoted">Most Upvoted</option>
          </select>
        </div>

        {/* Type Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {RESOURCE_TYPES.map(t => {
            const meta = TYPE_META[t];
            const active = typeFilter === t;
            return (
              <button key={t} onClick={() => setTypeFilter(t)}
                style={{
                  padding: '7px 16px', borderRadius: 100, fontFamily: 'inherit',
                  background: active ? (meta?.color ?? '#64748B') : 'var(--surface)',
                  color: active ? '#fff' : 'var(--text-secondary)',
                  border: active ? 'none' : '1px solid var(--border)',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                }}>
                {meta ? `${meta.icon} ${meta.label}` : 'All Types'}
              </button>
            );
          })}
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[1,2,3].map(i => (
              <div key={i} className="card" style={{ padding: '20px 22px', display: 'flex', gap: 16 }}>
                <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 14, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 14, width: '60%', borderRadius: 6, marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 10, width: '40%', borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📚</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>No resources found</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>Be the first to share a study material!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map(r => <ResourceCard key={r.id} resource={r} onUpvote={() => {}} />)}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
