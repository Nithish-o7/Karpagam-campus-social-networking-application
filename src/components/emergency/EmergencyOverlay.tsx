import { useEmergency } from '../../contexts/EmergencyContext';

/**
 * Phase 13 — Emergency Mode Lockdown UI
 * 
 * High-visibility interactive overlay that locks the app 
 * when an emergency is triggered. Provides instructions 
 * and a direct call button.
 */
export default function EmergencyOverlay() {
  const { isEmergencyMode, resetEmergency } = useEmergency();

  if (!isEmergencyMode) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'var(--crimson)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      color: '#fff',
      fontFamily: 'var(--font)',
      animation: 'pulse-bg 2s infinite',
    }}>
      {/* ── Blinking Icon ─────────────────────────── */}
      <div style={{
        fontSize: 80,
        marginBottom: 24,
        animation: 'blink 1s ease-in-out infinite',
      }}>🚨</div>

      <h1 style={{
        fontSize: 32,
        fontWeight: 900,
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: '-0.02em',
      }}>
        Emergency Alert Sent
      </h1>

      <p style={{
        fontSize: 18,
        textAlign: 'center',
        opacity: 0.9,
        lineHeight: 1.5,
        maxWidth: 320,
        marginBottom: 40,
      }}>
        Campus Security has been dispatched with your identity and location.
        <strong> Stay calm and stay where you are.</strong>
      </p>

      {/* ── Action Card ────────────────────────────── */}
      <div className="card" style={{
        width: '100%',
        maxWidth: 340,
        padding: 24,
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        border: '1.5px solid rgba(255,255,255,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Immediate Instructions
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: 20 }}>📞</span>
          <div style={{ fontSize: 14 }}>Call Campus security if the situation escalates.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: 20 }}>🏃</span>
          <div style={{ fontSize: 14 }}>Ensure your own safety and helper others if possible.</div>
        </div>
        
        <a 
          href="tel:+919159900000" 
          className="btn btn-primary"
          style={{
            background: '#fff',
            color: 'var(--crimson)',
            fontWeight: 900,
            fontSize: 16,
            padding: '16px 24px',
            marginTop: 8,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        >
          <span>📱</span> CALL SECURITY NOW
        </a>
      </div>

      {/* ── Admin Dismiss (Hidden for normal users) ── */}
      <button 
        onClick={resetEmergency}
        style={{
          marginTop: 'auto',
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.4)',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          padding: 12,
        }}
      >
        Dismiss Alert (Admin)
      </button>

      <style>{`
        @keyframes pulse-bg {
          0%, 100% { background: #A6192E; }
          50%       { background: #8B1526; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
