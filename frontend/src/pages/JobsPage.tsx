/**
 * KCE Connect — Jobs & Internships Board (F9)
 * Inspired by LinkedIn Jobs
 */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import apiClient from '../services/apiClient';
import { useAuth } from '../contexts/AuthContext';
import { formatRelativeTime } from '../utils';
import toast from 'react-hot-toast';

interface JobPost { id: number; title: string; company: string; location: string; type: string; description: string; requirements: string | null; applyUrl: string | null; salary: string | null; deadline: string | null; postedBy: { name: string; role: string }; isActive: boolean; createdAt: string; }

const JOB_TYPES = ['All', 'FULL_TIME', 'INTERNSHIP', 'CONTRACT', 'ON_CAMPUS'];
const TYPE_META: Record<string, { label: string; color: string; bg: string }> = {
  FULL_TIME:  { label: 'Full Time',  color: '#059669', bg: 'rgba(5,150,105,0.1)'  },
  INTERNSHIP: { label: 'Internship', color: '#2563EB', bg: 'rgba(37,99,235,0.1)'  },
  CONTRACT:   { label: 'Contract',   color: '#D97706', bg: 'rgba(217,119,6,0.1)'  },
  ON_CAMPUS:  { label: 'On Campus',  color: '#C41830', bg: 'rgba(196,24,48,0.1)'  },
};

const POSTER_ROLES = ['faculty', 'alumni', 'staff'];

function JobCard({ job }: { job: JobPost }) {
  const [saved, setSaved] = useState(false);
  const meta = TYPE_META[job.type] ?? TYPE_META.FULL_TIME;
  const deadline = job.deadline ? new Date(job.deadline) : null;
  const isExpired = deadline ? deadline < new Date() : false;

  return (
    <motion.div className="card" whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
      style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
          background: `linear-gradient(135deg, ${meta.color}33, ${meta.color}11)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          border: `1px solid ${meta.color}33`,
        }}>🏢</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>{job.title}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{job.company}</div>
        </div>
        <button onClick={() => setSaved(s => !s)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: '4px', color: saved ? 'var(--crimson)' : 'var(--text-faint)', transition: 'all 0.15s' }}
          title={saved ? 'Unsave' : 'Save job'}>
          {saved ? '🔖' : '📑'}
        </button>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 100, background: meta.bg, color: meta.color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{meta.label}</span>
        <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 100, background: 'var(--bg-app)', color: 'var(--text-muted)', fontWeight: 700 }}>📍 {job.location}</span>
        {job.salary && <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 100, background: 'rgba(5,150,105,0.08)', color: '#059669', fontWeight: 700 }}>💰 {job.salary}</span>}
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>
        {job.description}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
            Posted by {job.postedBy.name} · <span style={{ textTransform: 'capitalize' }}>{job.postedBy.role}</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 2 }}>
            {formatRelativeTime(job.createdAt)}
            {deadline && <> · Deadline: <span style={{ color: isExpired ? '#DC2626' : '#D97706', fontWeight: 700 }}>{deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></>}
          </div>
        </div>
        {job.applyUrl ? (
          <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
            style={{ padding: '8px 18px', background: 'var(--crimson)', color: '#fff', borderRadius: 10, fontSize: 12, fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>
            Apply Now →
          </a>
        ) : (
          <span style={{ padding: '8px 14px', background: 'var(--bg-app)', color: 'var(--text-muted)', borderRadius: 10, fontSize: 12, fontWeight: 700, border: '1px solid var(--border)' }}>
            View Details
          </span>
        )}
      </div>
    </motion.div>
  );
}

function PostJobModal({ onClose, onCreated }: { onClose: () => void; onCreated: (j: JobPost) => void }) {
  const [form, setForm] = useState({ title: '', company: '', location: '', type: 'INTERNSHIP', description: '', requirements: '', applyUrl: '', salary: '', deadline: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await apiClient.post('/jobs', { ...form, deadline: form.deadline || undefined });
      onCreated(r.data.job);
      toast.success('Job posted! 🎉');
      onClose();
    } catch { toast.error('Failed to post job'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, overflowY: 'auto' }}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ width: '100%', maxWidth: 500, padding: 32, margin: 'auto' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 24, letterSpacing: '-0.03em' }}>Post Opportunity</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Job Title', key: 'title', placeholder: 'e.g. Software Engineer Intern' },
            { label: 'Company', key: 'company', placeholder: 'e.g. Infosys, TCS, Google' },
            { label: 'Location', key: 'location', placeholder: 'e.g. Coimbatore / Remote' },
            { label: 'Salary / Stipend (optional)', key: 'salary', placeholder: 'e.g. ₹15,000/month' },
            { label: 'Apply URL (optional)', key: 'applyUrl', placeholder: 'https://...' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>{label}</label>
              <input value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} required={!['salary', 'applyUrl'].includes(key)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: 'var(--bg-app)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: 'var(--bg-app)', color: 'var(--text-primary)', outline: 'none' }}>
                {Object.entries(TYPE_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: 'var(--bg-app)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the role, responsibilities..." rows={3} required
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: 'var(--bg-app)', color: 'var(--text-primary)', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: 'none', background: 'var(--crimson)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {loading ? 'Posting…' : 'Post Job'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');
  const [showPostModal, setShowPostModal] = useState(false);
  const canPost = POSTER_ROLES.includes(user?.role ?? '');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const r = await apiClient.get('/jobs');
      setJobs(r.data.jobs ?? []);
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const filtered = typeFilter === 'All' ? jobs : jobs.filter(j => j.type === typeFilter);
  const stats = {
    total: jobs.length,
    internships: jobs.filter(j => j.type === 'INTERNSHIP').length,
    onCampus: jobs.filter(j => j.type === 'ON_CAMPUS').length,
  };

  return (
    <PageTransition>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 100px' }}>
        <AnimatePresence>{showPostModal && <PostJobModal onClose={() => setShowPostModal(false)} onCreated={j => { setJobs(prev => [j, ...prev]); setShowPostModal(false); }} />}</AnimatePresence>

        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 950, color: 'var(--text-primary)', letterSpacing: '-0.04em', marginBottom: 8 }}>Jobs & Internships</h1>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', fontWeight: 500 }}>Opportunities shared by faculty and alumni.</p>
          </div>
          {canPost && (
            <button onClick={() => setShowPostModal(true)}
              style={{ padding: '10px 20px', background: 'var(--crimson)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(196,24,48,0.25)', flexShrink: 0 }}>
              + Post Job
            </button>
          )}
        </header>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Total', value: stats.total, color: '#64748B' },
            { label: 'Internships', value: stats.internships, color: '#2563EB' },
            { label: 'On Campus', value: stats.onCampus, color: '#C41830' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Type Filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {JOB_TYPES.map(t => {
            const meta = TYPE_META[t];
            const active = typeFilter === t;
            return (
              <button key={t} onClick={() => setTypeFilter(t)}
                style={{
                  padding: '8px 18px', borderRadius: 100, fontFamily: 'inherit',
                  background: active ? (meta?.color ?? 'var(--crimson)') : 'var(--surface)',
                  color: active ? '#fff' : 'var(--text-secondary)',
                  border: active ? 'none' : '1px solid var(--border)',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                }}>
                {meta ? meta.label : 'All Jobs'}
              </button>
            );
          })}
        </div>

        {/* List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1,2,3].map(i => (
              <div key={i} className="card" style={{ padding: '20px 24px', display: 'flex', gap: 14 }}>
                <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 14, width: '50%', borderRadius: 6, marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 10, width: '30%', borderRadius: 6, marginBottom: 16 }} />
                  <div className="skeleton" style={{ height: 10, width: '80%', borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>💼</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>No opportunities yet</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>
              {canPost ? 'Be the first to post an opportunity!' : 'Check back soon.'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map(j => <JobCard key={j.id} job={j} />)}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
