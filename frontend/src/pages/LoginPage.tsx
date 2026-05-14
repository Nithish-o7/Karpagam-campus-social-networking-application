/**
 * KCE Connect — Hybrid Login Page
 * 
 * Supports both legacy Email/Password and modern Google SSO.
 */
import { useState } from 'react';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/layout/PageTransition';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';

/* ── Components ──────────────────────────────────────────────── */
function GoogleLogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

function Spinner({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.7s linear infinite' }}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeOpacity="0.25" strokeWidth="3"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, signInWithGoogle } = useAuth();
  
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || loading) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    if (loading) return;
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Signed in with Google!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      <div className="login-page-container">
        {/* Left Side — Hero/Branding */}
        <div className="login-hero-side">
          <div className="hero-glow" />
          <div className="hero-content">
            <div className="hero-logo-box">
              <img src={logoImg} alt="KCE Logo" className="hero-logo" />
            </div>
            <h1 className="hero-title">
              KCE<span className="accent">CONNECT</span>
            </h1>
            <p className="hero-subtitle">
              The professional digital ecosystem for Karpagam College of Engineering. 
              Connect, collaborate, and excel.
            </p>
            
            <div className="hero-features">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <span>Campus-wide Networking</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <span>Secure Institutional Access</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <span>Real-time Support Hub</span>
              </div>
            </div>
          </div>
          
          <div className="hero-footer">
            © 2026 Karpagam College of Engineering • Institutional Protocol
          </div>
        </div>

        {/* Right Side — Authentication Form */}
        <div className="login-form-side">
          <div className="login-form-box">
            <div className="form-header">
              <h2 className="form-title">Account Sign-in</h2>
              <p className="form-subtitle">Enter your official credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <label className="input-label">Institutional Email</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                  <input
                    type="email"
                    className="premium-input"
                    placeholder="name@kce.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Security Password</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input
                    type="password"
                    className="premium-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? <Spinner color="#fff" /> : 'Sign In'}
              </button>
            </form>

            <div className="form-divider">
              <span className="divider-text">Institutional SSO</span>
            </div>

            <button
              type="button"
              className="google-sso-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              {loading ? <Spinner color="var(--text-primary)" /> : <><GoogleLogo /> Sign in with Karpagam ID</>}
            </button>

            <div className="form-footer">
              Don't have an account? <Link to="/register" className="register-link">Create an account</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .login-page-container {
          min-height: 100dvh;
          display: flex;
          background: #fff;
          font-family: var(--font);
        }

        /* ── Hero Side ── */
        .login-hero-side {
          flex: 0 0 45%;
          background: var(--navy);
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 60px 80px;
          position: relative;
          overflow: hidden;
        }
        .hero-glow {
          position: absolute;
          top: -20%;
          left: -20%;
          width: 80%;
          height: 80%;
          background: radial-gradient(circle, rgba(166,25,46,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 440px;
        }
        .hero-logo-box {
          width: 80px;
          height: 80px;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .hero-logo {
          width: 80%;
          height: 80%;
          object-fit: contain;
        }
        .hero-title {
          font-size: 52px;
          font-weight: 950;
          letter-spacing: -0.05em;
          line-height: 0.9;
          margin-bottom: 24px;
        }
        .hero-title .accent {
          color: var(--crimson);
        }
        .hero-subtitle {
          font-size: 17px;
          color: rgba(255,255,255,0.5);
          line-height: 1.6;
          margin-bottom: 48px;
          font-weight: 500;
        }
        .hero-features {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 15px;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
        }
        .feature-icon {
          width: 32px;
          height: 32px;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        .hero-footer {
          position: absolute;
          bottom: 40px;
          left: 80px;
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 700;
        }

        /* ── Form Side ── */
        .login-form-side {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
          background: #fff;
        }
        .login-form-box {
          width: 100%;
          max-width: 400px;
          animation: formEnter 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        @keyframes formEnter {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-header {
          margin-bottom: 40px;
        }
        .form-title {
          font-size: 32px;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.04em;
          margin-bottom: 8px;
        }
        .form-subtitle {
          color: #64748B;
          font-weight: 500;
          font-size: 15px;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .input-label {
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          letter-spacing: 0.02em;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 16px;
          color: #94A3B8;
          pointer-events: none;
        }
        .premium-input {
          width: 100%;
          height: 52px;
          padding: 0 16px 0 48px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          color: #1E293B;
          transition: all 0.2s;
          outline: none;
        }
        .premium-input:focus {
          background: #fff;
          border-color: #0F172A;
          box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.05);
        }
        .login-submit-btn {
          height: 52px;
          background: #0F172A;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 8px;
        }
        .login-submit-btn:hover {
          background: #1E293B;
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .login-submit-btn:active {
          transform: translateY(0);
        }
        .form-divider {
          display: flex;
          align-items: center;
          margin: 32px 0;
        }
        .form-divider::before,
        .form-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #E2E8F0;
        }
        .divider-text {
          padding: 0 16px;
          font-size: 12px;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .google-sso-btn {
          width: 100%;
          height: 52px;
          background: #fff;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 15px;
          font-weight: 600;
          color: #1E293B;
          cursor: pointer;
          transition: all 0.2s;
        }
        .google-sso-btn:hover {
          background: #F8FAFC;
          border-color: #CBD5E1;
        }
        .form-footer {
          text-align: center;
          margin-top: 32px;
          font-size: 14px;
          color: #64748B;
          font-weight: 500;
        }
        .register-link {
          color: var(--crimson);
          font-weight: 700;
          text-decoration: none;
        }
        .register-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .login-hero-side { display: none; }
          .login-form-side { padding: 24px 20px; }
          .login-form-box { max-width: 100%; }
        }
      `}</style>
    </PageTransition>
  );
}
