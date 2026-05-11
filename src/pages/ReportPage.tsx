import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import type { IssueCategory } from '../types';
import { ticketService, type CreateTicketResponse } from '../services/ticketService';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/layout/PageTransition';

/* ── Constants ──────────────────────────────────────────────── */
const CATEGORIES: IssueCategory[] = [
  'Wifi Issues', 'Lab Issues', 'Electricity Issues',
  'Hostel Issues', 'Transport Issues', 'Classroom Issues',
];

const BLOCKS = [
  'A Block', 'B Block', 'C Block', 'D Block', 'E Block',
  'Main Block', 'Boys Hostel', 'Girls Hostel', 'Admin Block',
];

const CATEGORY_META: Record<IssueCategory, { icon: string; description: string; color: string }> = {
  'Wifi Issues':        { icon: '📶', color: '#3B82F6', description: 'Connectivity, slow speeds, or dead zones.' },
  'Lab Issues':         { icon: '🖥️', color: '#8B5CF6', description: 'Hardware failure or software access.' },
  'Electricity Issues': { icon: '⚡', color: '#F59E0B', description: 'Power cuts, flickering, or socket issues.' },
  'Hostel Issues':      { icon: '🏠', color: '#EC4899', description: 'Maintenance, plumbing, or common areas.' },
  'Transport Issues':   { icon: '🚌', color: '#10B981', description: 'Bus delays or route coordination.' },
  'Classroom Issues':   { icon: '🏫', color: '#6366F1', description: 'AV equipment or furniture repairs.' },
};

/* ── Components ─────────────────────────────────────────────── */

function Spinner({ size = 18 }: { size?: number }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      style={{ width: size, height: size, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}
    />
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 4, height: 16, background: 'var(--crimson)', borderRadius: 2 }} />
        {title}
      </h3>
      {subtitle && <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>{subtitle}</p>}
    </div>
  );
}

/* ── Success Modal ───────────────────────────────────────────── */
function SuccessModal({ result, onClose }: { result: CreateTicketResponse; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
          style={{ background: 'var(--surface)', borderRadius: 28, padding: 40, maxWidth: 460, width: '100%', border: '1px solid var(--border)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', textAlign: 'center' }}
        >
          <div style={{ width: 80, height: 80, background: 'var(--green-10)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          
          <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>Ticket Registered</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.6 }}>Your campus infrastructure report has been successfully synchronized with ServiceNow ITSM.</p>

          <div style={{ marginTop: 32, background: 'var(--bg-app)', borderRadius: 20, padding: 24, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Incident Registry ID</div>
            <div style={{ fontSize: 28, fontWeight: 950, color: 'var(--crimson)', fontVariantNumeric: 'tabular-nums' }}>{result.incidentId}</div>
            
            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase' }}>Status</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>New / Pending</div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase' }}>Response SLA</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>24 Hours</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary" style={{ flex: 1, padding: 14 }} onClick={onClose}>Done</button>
            <button className="btn btn-primary" style={{ flex: 1, padding: 14 }} onClick={() => navigate('/tickets')}>Track Live</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Main Page ──────────────────────────────────────────────── */
export default function ReportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [category, setCategory] = useState<IssueCategory | ''>('');
  const [block, setBlock] = useState('');
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<CreateTicketResponse | null>(null);

  const isValid = phoneNumber.length >= 10 && category !== '' && block !== '' && description.length >= 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || loading) return;
    setLoading(true);
    try {
      const result = await ticketService.create({
        requestType: user?.role || 'student',
        phoneNumber,
        category,
        block,
        room,
        description,
      });
      setSuccessResult(result);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      {successResult && <SuccessModal result={successResult} onClose={() => setSuccessResult(null)} />}
      
      <div style={{ maxWidth: 840, margin: '0 auto', padding: '40px 24px 100px' }}>
        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 style={{ fontSize: 32, fontWeight: 950, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>Infrastructure Report Hub</h1>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', marginTop: 8, fontWeight: 500 }}>
              Secure bridge to Karpagam University's ServiceNow ITSM department.
            </p>
          </motion.div>
        </header>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Identity Info */}
          <section className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20, background: 'linear-gradient(to right, var(--surface), var(--bg-app))' }}>
            <div style={{ width: 56, height: 56, background: 'var(--crimson)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🛡️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{user?.name || 'Verified Identity'}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{user?.rollNumber} • {user?.department}</div>
            </div>
            <div style={{ background: 'var(--green-10)', color: 'var(--green)', padding: '6px 12px', borderRadius: 100, fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>Authenticated</div>
          </section>

          {/* Contact & Classification */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            {/* Category Select */}
            <div className="card" style={{ padding: 32 }}>
              <SectionHeader title="Issue Classification" subtitle="Choose the service category for routing." />
              <div style={{ display: 'grid', gap: 10 }}>
                {CATEGORIES.map((cat) => {
                  const active = category === cat;
                  const meta = CATEGORY_META[cat];
                  return (
                    <motion.div
                      key={cat}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCategory(cat)}
                      style={{
                        padding: '16px', borderRadius: 16, cursor: 'pointer',
                        background: active ? `${meta.color}10` : 'var(--bg-app)',
                        border: `1.5px solid ${active ? meta.color : 'var(--border)'}`,
                        display: 'flex', alignItems: 'center', gap: 14,
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      <span style={{ fontSize: 20, background: active ? '#fff' : 'transparent', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, boxShadow: active ? '0 4px 12px rgba(0,0,0,0.05)' : 'none' }}>{meta.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{cat}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>{meta.description}</div>
                      </div>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${active ? meta.color : 'var(--border)'}`, background: active ? meta.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {active && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Details & Location */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div className="card" style={{ padding: 32 }}>
                <SectionHeader title="Contact Information" subtitle="Used by dispatchers for on-site verification." />
                <div className="form-group">
                  <label className="form-label">Active Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>📞</span>
                    <input
                      type="tel" className="form-input" placeholder="+91 XXXXX XXXXX"
                      style={{ paddingLeft: 44 }}
                      value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: 32 }}>
                <SectionHeader title="Location Details" subtitle="Exact building and room coordinates." />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Campus Block</label>
                    <select className="form-select" value={block} onChange={(e) => setBlock(e.target.value)}>
                      <option value="">Select Block</option>
                      {BLOCKS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Room / Lab Number</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>📍</span>
                      <input
                        type="text" className="form-input" placeholder="e.g. 402"
                        style={{ paddingLeft: 44 }}
                        value={room} onChange={(e) => setRoom(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="card" style={{ padding: 32 }}>
            <SectionHeader title="Evidence & Narrative" subtitle="Describe the issue in detail. Min 10 characters." />
            <div className="form-group">
              <label className="form-label">Issue Description</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: 16, fontSize: 16, pointerEvents: 'none' }}>📝</span>
                <textarea
                  className="form-textarea" placeholder="Describe exactly what is happening..."
                  style={{ paddingLeft: 44 }}
                  value={description} onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Evidence Upload */}
            <div style={{ marginTop: 20 }}>
              <SectionHeader title="Evidence Attachment" subtitle="Upload a photo for faster resolution (optional)." />
              <input 
                ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={(e) => setAttachedFile(e.target.files?.[0] ?? null)} 
              />
              {attachedFile ? (
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', 
                  borderRadius: 16, background: 'var(--green-10)', border: '1.5px solid var(--green)' 
                }}>
                  <div style={{ fontSize: 24 }}>📸</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{attachedFile.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{(attachedFile.size / 1024).toFixed(1)} KB • Ready for sync</div>
                  </div>
                  <button type="button" onClick={() => setAttachedFile(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              ) : (
                <button 
                  type="button" onClick={() => fileRef.current?.click()}
                  style={{ 
                    width: '100%', padding: '24px', borderRadius: 16, border: '2px dashed var(--border)', 
                    background: 'var(--bg-app)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.borderColor = 'var(--crimson)'}
                  onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>Click to upload media evidence</span>
                </button>
              )}
            </div>
            
            {/* Power Dispatch Action Area */}
            <div style={{ marginTop: 40, borderTop: '1px solid var(--border-base)', paddingTop: 32 }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 500 }}>
                  You are about to initiate an official campus infrastructure dispatch.<br />
                  <span style={{ color: 'var(--crimson)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>High-priority reports are synchronized instantly with ServiceNow ITSM.</span>
                </p>
              </div>

              <div style={{ position: 'relative', borderRadius: 24, padding: 6, background: 'rgba(166,25,46,0.03)', border: '1px solid rgba(166,25,46,0.05)' }}>
                <button
                  type="submit" 
                  className="btn btn-primary-gradient" 
                  disabled={!isValid || loading}
                  style={{ height: 74, width: '100%', fontSize: 18, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {loading ? (
                    <span>SENDING REPORT...</span>
                  ) : (
                    <span>SUBMIT REPORT NOW</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
