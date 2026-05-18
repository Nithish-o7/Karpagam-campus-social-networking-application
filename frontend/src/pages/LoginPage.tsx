/**
 * KCE Connect — LoginPage v14 "Cinematic"
 * Split-screen · Animated orbs · Glassmorphism · Maroon glow
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/layout/PageTransition';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';

/* ── Helpers ─────────────────────────────────────────────────── */
function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

function Spinner() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={{ animation: 'kce-spin .7s linear infinite' }}>
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="3"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Feature list ────────────────────────────────────────────── */
const FEATURES = [
  { icon: '⚡', label: 'Real-time campus announcements' },
  { icon: '🔐', label: 'Secure institutional access' },
  { icon: '🤝', label: 'Campus-wide professional networking' },
  { icon: '🎯', label: 'ITSM ticket management' },
];

/* ── Stats ───────────────────────────────────────────────────── */
const STATS = [
  { value: '5,000+', label: 'Members' },
  { value: '200+', label: 'Clubs' },
  { value: '99.9%', label: 'Uptime' },
];

/* ── Main Component ──────────────────────────────────────────── */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login, signInWithGoogle } = useAuth();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [focused,  setFocused]  = useState<string | null>(null);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || loading) return;
    setLoading(true);
    try { await login(email, password); toast.success('Welcome back! 👋'); navigate('/'); }
    catch (err: any) { toast.error(err.message || 'Login failed.'); }
    finally { setLoading(false); }
  }

  async function handleGoogle() {
    if (loading) return;
    setLoading(true);
    try { await signInWithGoogle(); toast.success('Signed in! 🎉'); navigate('/'); }
    catch (err: any) { toast.error(err.message || 'Google Sign-In failed.'); }
    finally { setLoading(false); }
  }

  const S: Record<string, React.CSSProperties> = {
    page: {
      minHeight: '100dvh', display: 'flex', fontFamily: "'Inter',sans-serif",
      background: '#080C14', position: 'relative', overflow: 'hidden',
    },
    /* Animated orb backdrop */
    orb1: {
      position: 'absolute', top: '-15%', left: '-8%',
      width: '55%', height: '65%', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(139,29,52,0.38) 0%, transparent 65%)',
      animation: 'kce-float1 13s ease-in-out infinite', pointerEvents: 'none',
    },
    orb2: {
      position: 'absolute', bottom: '-12%', right: '-6%',
      width: '45%', height: '55%', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 65%)',
      animation: 'kce-float2 17s ease-in-out infinite', pointerEvents: 'none',
    },
    orb3: {
      position: 'absolute', top: '45%', right: '28%',
      width: '32%', height: '38%', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 65%)',
      animation: 'kce-float3 20s ease-in-out infinite', pointerEvents: 'none',
    },
    grid: {
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)',
      backgroundSize: '44px 44px',
      maskImage: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.55) 0%, transparent 78%)',
    },
    /* ── Left hero panel ── */
    hero: {
      flex: '0 0 48%', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'flex-start',
      padding: '72px 80px', position: 'relative', zIndex: 1,
      opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(-24px)',
      transition: 'opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1)',
    },
    /* ── Right form panel ── */
    formPanel: {
      flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '48px 40px', position: 'relative', zIndex: 1,
      opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(24px)',
      transition: 'opacity .6s .1s cubic-bezier(.16,1,.3,1), transform .6s .1s cubic-bezier(.16,1,.3,1)',
    },
    /* Glass form card */
    card: {
      width: '100%', maxWidth: 420,
      background: 'rgba(255,255,255,0.045)',
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 28, padding: '40px 36px',
      boxShadow: '0 8px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.09)',
      position: 'relative', overflow: 'hidden',
    },
  };

  /* Input style factory */
  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%', height: 48, paddingLeft: 44, paddingRight: field === 'password' ? 44 : 14,
    background: focused === field ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.038)',
    border: `1px solid ${focused === field ? 'rgba(139,29,52,0.65)' : 'rgba(255,255,255,0.09)'}`,
    borderRadius: 12, fontSize: 14, color: '#F0F4FF', outline: 'none',
    fontFamily: "'Inter',sans-serif", transition: 'all .18s',
    boxShadow: focused === field ? '0 0 0 3px rgba(139,29,52,0.12)' : 'none',
  });

  return (
    <PageTransition>
      <div style={S.page}>

        {/* ── Keyframes ── */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          @keyframes kce-float1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(3%,-5%) scale(1.07)} 66%{transform:translate(-2%,4%) scale(0.95)} }
          @keyframes kce-float2 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(-4%,4%) scale(1.09)} 70%{transform:translate(3%,-5%) scale(0.94)} }
          @keyframes kce-float3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(5%,-7%) scale(1.12)} }
          @keyframes kce-spin    { to{transform:rotate(360deg)} }
          @keyframes kce-grad    { 0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%} }
          @keyframes kce-shimmer { from{left:-100%} to{left:200%} }
          @keyframes kce-pulse   { 0%,100%{opacity:1}50%{opacity:.6} }
          @media(max-width:768px){
            .kce-hero{display:none!important}
            .kce-form-panel{padding:24px 16px!important}
          }
        `}</style>

        {/* ── Background ── */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
          <div style={S.orb1}/>
          <div style={S.orb2}/>
          <div style={S.orb3}/>
          <div style={S.grid}/>
        </div>

        {/* ── Left hero ── */}
        <div className="kce-hero" style={S.hero}>

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 56 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, overflow: 'hidden',
              background: 'rgba(139,29,52,0.18)', border: '1px solid rgba(139,29,52,0.32)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 28px rgba(139,29,52,0.3)', backdropFilter: 'blur(8px)',
            }}>
              <img src={logoImg} alt="KCE" style={{ width: '80%', height: '80%', objectFit: 'contain' }}/>
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#F0F4FF', letterSpacing: '-.03em', lineHeight: 1 }}>
                KCE<span style={{ color: '#C0334E' }}>Connect</span>
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 3, fontWeight: 600 }}>
                Campus Network
              </div>
            </div>
          </div>

          {/* Hero headline */}
          <div style={{ marginBottom: 44 }}>
            <h1 style={{
              fontSize: 'clamp(38px,4.2vw,56px)', fontWeight: 900,
              lineHeight: 1.02, letterSpacing: '-0.05em', color: '#F0F4FF', marginBottom: 18,
            }}>
              Your campus,<br/>
              <span style={{
                background: 'linear-gradient(135deg,#C0334E,#E05470,#8B5CF6)',
                backgroundSize: '200% 200%', animation: 'kce-grad 4s ease infinite',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                reimagined.
              </span>
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.38)', lineHeight: 1.75, fontWeight: 400, maxWidth: 380 }}>
              The professional digital ecosystem for Karpagam College of Engineering.
              Connect, collaborate, and excel together.
            </p>
          </div>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 52 }}>
            {FEATURES.map(({ icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                  backdropFilter: 'blur(8px)',
                }}>
                  {icon}
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 500, color: 'rgba(255,255,255,0.52)' }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 36, marginBottom: 'auto' }}>
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#F0F4FF', letterSpacing: '-.03em' }}>{value}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div style={{ paddingTop: 48, fontSize: 10, color: 'rgba(255,255,255,0.14)', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 600 }}>
            © 2026 Karpagam College of Engineering
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="kce-form-panel" style={S.formPanel}>
          <div style={{ width: '100%', maxWidth: 420 }}>

            {/* Glass card */}
            <div style={S.card}>

              {/* Top shimmer line */}
              <div style={{
                position: 'absolute', top: 0, left: '8%', right: '8%', height: 1,
                background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)',
                pointerEvents: 'none',
              }}/>

              {/* Card header */}
              <div style={{ marginBottom: 30 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px',
                  background: 'rgba(139,29,52,0.15)', border: '1px solid rgba(139,29,52,0.28)',
                  borderRadius: 100, marginBottom: 16,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C0334E', animation: 'kce-pulse 2s ease-in-out infinite' }}/>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(192,51,78,0.9)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                    Secure Portal
                  </span>
                </div>
                <h2 style={{ fontSize: 26, fontWeight: 800, color: '#F0F4FF', letterSpacing: '-.045em', marginBottom: 6 }}>
                  Sign in
                </h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', fontWeight: 400 }}>
                  Use your institutional credentials to continue
                </p>
              </div>

              {/* Google SSO */}
              <button
                type="button"
                id="kce-google-signin"
                onClick={handleGoogle}
                disabled={loading}
                style={{
                  width: '100%', height: 50,
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.13)',
                  borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.88)',
                  cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Inter',sans-serif",
                  transition: 'all .18s ease', marginBottom: 22,
                  backdropFilter: 'blur(8px)', position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.13)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                {loading ? <Spinner/> : <><GoogleIcon size={18}/> Continue with Karpagam ID</>}
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }}/>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '.1em' }}>or email</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }}/>
              </div>

              {/* Email + password form */}
              <form onSubmit={handleSubmit}>

                {/* Email */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '.08em', display: 'block', marginBottom: 7 }}>
                    Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.22)', pointerEvents: 'none' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input
                      id="kce-email"
                      type="email"
                      placeholder="name@kce.ac.in"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                      style={inputStyle('email')}
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                      Password
                    </label>
                    <a href="#" style={{ fontSize: 11, fontWeight: 600, color: 'rgba(192,51,78,0.8)' }}>Forgot?</a>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.22)', pointerEvents: 'none' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <input
                      id="kce-password"
                      type={showPwd ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      onFocus={() => setFocused('password')}
                      onBlur={() => setFocused(null)}
                      style={inputStyle('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(v => !v)}
                      style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'rgba(255,255,255,0.25)', padding: 4, display: 'flex',
                      }}
                    >
                      {showPwd ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  id="kce-login-submit"
                  disabled={loading}
                  style={{
                    width: '100%', height: 50,
                    background: 'linear-gradient(135deg,#C0334E,#8B1D34)',
                    color: '#fff', border: 'none', borderRadius: 14,
                    fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: "'Inter',sans-serif",
                    boxShadow: '0 4px 24px rgba(139,29,52,0.45)',
                    transition: 'all .18s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    position: 'relative', overflow: 'hidden', letterSpacing: '-.01em',
                  }}
                  onMouseEnter={e => { if (!loading) { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-1px)'; el.style.boxShadow = '0 8px 32px rgba(139,29,52,0.55)'; el.style.filter = 'brightness(1.1)'; }}}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 4px 24px rgba(139,29,52,0.45)'; el.style.filter = 'none'; }}
                >
                  {loading ? <Spinner/> : 'Sign In →'}
                </button>
              </form>

              {/* Register link */}
              <div style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>
                New to KCE Connect?{' '}
                <Link to="/register" style={{ color: '#C0334E', fontWeight: 700, textDecoration: 'none' }}>
                  Create account
                </Link>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 22, flexWrap: 'wrap' }}>
                {['🔒 SSL Encrypted', '🏛️ Institutional', '✓ Verified'].map(t => (
                  <span key={t} style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.18)', letterSpacing: '.03em' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
