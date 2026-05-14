/**
 * KCE Connect — My Tickets Page (Premium Native App Redesign)
 * Glass floating cards, pastel pill status badges, spring hover lift.
 */
import { useState, useEffect, useCallback } from 'react';
import { ticketService, type TicketItem } from '../services/ticketService';
import PageTransition from '../components/layout/PageTransition';
import { TicketSkeleton } from '../components/ui/SkeletonLoader';
import { motion } from 'framer-motion';

/* ── Category icons ─────────────────────────────────────────── */
const CATEGORY_ICON: Record<string, string> = {
  'Wifi issues': '📶', 'Lab': '🖥️', 'Electricity Issue': '⚡',
  'Hostel': '🏠', 'Transport': '🚌', 'Classroom': '🏫', 'General': '📋',
};

/* ── Pastel pill badge config per state ─────────────────────── */
const STATE_CONFIG: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  '1':  { label: 'Open',        bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B' },
  '-5': { label: 'Pending',     bg: '#F3F4F6', color: '#4B5563', dot: '#9CA3AF' },
  '2':  { label: 'In Progress', bg: '#DBEAFE', color: '#1E40AF', dot: '#3B82F6' },
  '3':  { label: 'On Hold',     bg: '#FFEDD5', color: '#9A3412', dot: '#F97316' },
  '6':  { label: 'Resolved',    bg: '#D1FAE5', color: '#065F46', dot: '#10B981' },
  '7':  { label: 'Closed',      bg: '#ECFDF5', color: '#047857', dot: '#059669' },
};
const DEFAULT_STATE = { label: 'Unknown', bg: '#F3F4F6', color: '#4B5563', dot: '#9CA3AF' };

/* ── Pastel Pill Status Badge ───────────────────────────────── */
function StatusBadge({ stateCode }: { stateCode: string }) {
  const cfg = STATE_CONFIG[stateCode] ?? DEFAULT_STATE;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px',
      borderRadius: 'var(--r-pill)',
      background: cfg.bg,
      color: cfg.color,
      fontSize: '11px',
      fontWeight: 600,
      whiteSpace: 'nowrap',
      letterSpacing: '0.01em',
      flexShrink: 0,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: cfg.dot, flexShrink: 0,
        ...(stateCode === '2' ? { animation: 'pulse-dot 1.4s ease infinite' } : {}),
      }} />
      {cfg.label}
    </span>
  );
}

/* ── Floating Ticket Card ───────────────────────────────────── */
function TicketCard({ ticket, index }: { ticket: TicketItem; index: number }) {
  const icon = CATEGORY_ICON[ticket.category] ?? '📋';
  const formattedDate = (() => {
    try { return new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); }
    catch { return ticket.createdAt; }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--r-lg)',
        border: '1px solid var(--border)',
        padding: '20px',
        display: 'flex', flexDirection: 'column', gap: 14,
        boxShadow: 'var(--shadow-md)',
        cursor: 'default', overflow: 'hidden',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Icon bubble */}
        <div style={{
          width: 44, height: 44, borderRadius: 'var(--r-md)',
          background: 'var(--bg-app)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, flexShrink: 0,
        }}>
          {icon}
        </div>

        {/* Number + category */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '14px', fontWeight: 700,
            color: 'var(--crimson)', letterSpacing: '-0.01em',
            fontFamily: 'var(--font)',
          }}>
            {ticket.number || '—'}
          </div>
          <div style={{
            fontSize: '11px', fontWeight: 500,
            color: 'var(--text-muted)', marginTop: 1,
            textTransform: 'uppercase', letterSpacing: '0.02em',
          }}>
            {ticket.category}
          </div>
        </div>

        <StatusBadge stateCode={ticket.stateCode} />
      </div>

      {/* Description */}
      {ticket.description && ticket.description !== '—' && (
        <div style={{
          fontSize: '13px', color: 'var(--text-secondary)',
          lineHeight: 1.5, fontWeight: 400,
          overflow: 'hidden', display: '-webkit-box',
          WebkitBoxOrient: 'vertical' as any, WebkitLineClamp: 2,
        }}>
          {ticket.description}
        </div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: '11px', color: 'var(--text-faint)', fontWeight: 500,
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {formattedDate}
        </span>
        {ticket.name && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            {ticket.name}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ── Empty State ────────────────────────────────────────────── */
function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '64px 24px', textAlign: 'center', gap: 16,
      background: 'rgba(255,255,255,0.88)', borderRadius: 'var(--r-lg)',
      border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{
        width: 88, height: 88, borderRadius: '50%',
        background: 'var(--crimson-10)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40,
      }}>🎫</div>
      <div>
        <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          No tickets yet
        </div>
        <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.6, maxWidth: 300 }}>
          Tickets you submit via the Report Issue form will appear here, synced live from ServiceNow.
        </div>
      </div>
      <button onClick={onRefresh} className="btn btn-secondary" style={{ marginTop: 4 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
        Check Again
      </button>
    </div>
  );
}

/* ── Error State ────────────────────────────────────────────── */
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '64px 24px', textAlign: 'center', gap: 16,
      background: 'rgba(255,255,255,0.88)', borderRadius: 'var(--r-lg)',
      border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'var(--crimson-06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
      }}>⚠️</div>
      <div>
        <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          Couldn't load tickets
        </div>
        <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.6, maxWidth: 340 }}>
          {message}
        </div>
      </div>
      <button onClick={onRetry} className="btn btn-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
        Try Again
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main Page
══════════════════════════════════════════════════════════════ */
export default function TicketsPage() {
  const [tickets,   setTickets]   = useState<TicketItem[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true); setError(null);
    try { setTickets(await ticketService.getUserTickets()); setLastFetch(new Date()); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unknown error.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const openCount     = tickets.filter(t => ['1','-5','2','3'].includes(t.stateCode)).length;
  const resolvedCount = tickets.filter(t => ['6','7'].includes(t.stateCode)).length;

  return (
    <PageTransition>
      <div style={{
        padding: 'var(--sp-8) var(--content-pad)',
        paddingBottom: 'calc(var(--nav-h) + var(--sp-8))',
        maxWidth: 'var(--feed-max)',
        margin: '0 auto',
      }}>

        {/* ── Page Header ──────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                My Tickets
              </h1>
              <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>
                Live status from ServiceNow ITSM
                {lastFetch && (
                  <span style={{ marginLeft: 6, color: 'var(--text-faint)' }}>
                    · {lastFetch.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </p>
            </div>

            <button onClick={fetchTickets} disabled={loading} className="btn btn-secondary" style={{ flexShrink: 0, gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.2" strokeLinecap="round"
                style={loading ? { animation: 'spin 0.9s linear infinite' } : undefined}>
                <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              Refresh
            </button>
          </div>

          {/* Summary chips */}
          {!loading && !error && tickets.length > 0 && (
            <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
              <span style={{
                padding: '6px 14px', borderRadius: 'var(--r-pill)',
                background: 'var(--surface)', border: '1px solid var(--border)',
                fontSize: 'var(--fs-xs)', fontWeight: 600, color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', gap: 6, boxShadow: 'var(--shadow-sm)',
              }}>
                <span style={{ color: 'var(--text-faint)', fontWeight: 500 }}>Total</span> {tickets.length}
              </span>
              {openCount > 0 && (
                <span style={{
                  padding: '6px 14px', borderRadius: 'var(--r-pill)',
                  background: '#EFF6FF', border: '1px solid #DBEAFE',
                  fontSize: 'var(--fs-xs)', fontWeight: 600, color: '#1E40AF',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3B82F6', animation: 'pulse-dot 1.4s ease infinite' }} />
                  {openCount} Active
                </span>
              )}
              {resolvedCount > 0 && (
                <span style={{
                  padding: '6px 14px', borderRadius: 'var(--r-pill)',
                  background: '#ECFDF5', border: '1px solid #D1FAE5',
                  fontSize: 'var(--fs-xs)', fontWeight: 600, color: '#047857',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  ✓ {resolvedCount} Resolved
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Loading ───────────────────────────────── */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[0,1,2,3].map((i) => <TicketSkeleton key={i} />)}
          </div>
        )}


        {/* ── Error ────────────────────────────────── */}
        {!loading && error && <ErrorState message={error} onRetry={fetchTickets} />}

        {/* ── Empty ────────────────────────────────── */}
        {!loading && !error && tickets.length === 0 && <EmptyState onRefresh={fetchTickets} />}

        {/* ── Cards ────────────────────────────────── */}
        {!loading && !error && tickets.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {tickets.map((ticket, i) => (
              <TicketCard key={ticket.sys_id || ticket.number} ticket={ticket} index={i} />
            ))}
          </div>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(0.85)} }`}</style>
      </div>
    </PageTransition>
  );
}
