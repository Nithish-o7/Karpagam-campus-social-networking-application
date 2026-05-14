import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/layout/PageTransition';
import toast from 'react-hot-toast';
import logoImg from '../assets/logo.png';

const DEPARTMENTS = [
  'Computer Science and Technology',
  'Computer Science and Engineering',
  'Information Technology',
  'Electronics and Communication Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Artificial Intelligence and Machine Learning',
  'Cyber Security',
  'MBA',
  'MCA',
  'Other',
];

/* ── Spinner ─────────────────────────────────────────────────── */
function Spinner({ size = 18, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ animation: 'spin 0.7s linear infinite', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeOpacity="0.25" strokeWidth="3"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

/* ── Eye icon ────────────────────────────────────────────────── */
function EyeOpenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   RegisterPage — 2-step wizard
══════════════════════════════════════════════════════════════ */
export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  // Step 1 State
  const [name,       setName]       = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email,      setEmail]      = useState('');
  const [role,       setRole]       = useState('student');
  const [department, setDepartment] = useState('');

  // Step 2 State
  const [password,    setPassword]    = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // UI state
  const [step,       setStep]       = useState<1 | 2>(1);
  const [loading,    setLoading]    = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validateStep1(): boolean {
    const errs: Record<string, string> = {};
    if (!name.trim())           errs.name       = 'Full name required.';
    if (!rollNumber.trim())     errs.rollNumber  = 'Roll number required.';
    if (!email.trim())          errs.email       = 'Institutional email required.';
    else if (!email.endsWith('@kce.ac.in')) errs.email = 'Use @kce.ac.in address.';
    if (!department)            errs.department  = 'Select department.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep2(): boolean {
    const errs: Record<string, string> = {};
    if (password.length < 8)              errs.password = 'Must be 8+ characters.';
    if (password !== confirmPass)         errs.confirmPass = 'Passwords mismatch.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep1()) return;
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep2() || loading) return;
    setLoading(true);
    try {
      await register({ name, email, password, rollNumber, role, department });
      toast.success('Identity Created Successfully! 🎉');
      navigate('/');
    } catch (err) {
      toast.error('Identity collision or server error.');
    } finally {
      setLoading(false);
    }
  }

  function fieldSet(field: string, value: string) {
    setFieldErrors((p) => ({ ...p, [field]: undefined as any }));
    return value;
  }

  return (
    <PageTransition>
      <div className="register-page-container">
        {/* Hero Branding Section (Matches Login) */}
        <div className="register-hero-side">
          <div className="hero-glow" />
          <div className="hero-content">
            <div className="hero-logo-box">
              <img src={logoImg} alt="KCE Logo" className="hero-logo" />
            </div>
            <h1 className="hero-title">
              KCE<span className="accent">CONNECT</span>
            </h1>
            <div className="hero-badge">IDENTITY INITIALIZATION</div>
            <p className="hero-subtitle">
              Join the official digital ecosystem of Karpagam College of Engineering. 
              Secure your account and access all campus services.
            </p>
            
            <div className="hero-steps-visual">
              <div className={`step-viz-item ${step >= 1 ? 'active' : ''}`}>
                <div className="viz-dot" />
                <div className="viz-label">Institutional Profile</div>
              </div>
              <div className="viz-line" />
              <div className={`step-viz-item ${step >= 2 ? 'active' : ''}`}>
                <div className="viz-dot" />
                <div className="viz-label">Access Encryption</div>
              </div>
            </div>
          </div>
          <div className="hero-footer">
            Institutional Protocol v1.4 • © 2026 KCE
          </div>
        </div>

        {/* Form Wizard Section */}
        <div className="register-form-side">
          <div className="register-form-box">
            
            {/* Step Progress Header */}
            <div className="step-progress-header">
              <div className="step-indicator">PHASE {step} / 2</div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${step * 50}%` }} />
              </div>
            </div>

            <div className="form-content-area">
              {step === 1 ? (
                <form onSubmit={handleNext} className="premium-form">
                  <div className="form-header-box">
                    <h2 className="content-title">Institutional Profile</h2>
                    <p className="content-subtitle">Register your official campus identity</p>
                  </div>

                  <div className="input-row">
                    <div className="input-group full">
                      <label className="premium-label">Full Name</label>
                      <input type="text" className={`premium-input ${fieldErrors.name ? 'error' : ''}`}
                        value={name} placeholder="e.g. Nithish Kanna"
                        onChange={(e) => setName(fieldSet('name', e.target.value))} />
                      {fieldErrors.name && <span className="error-hint">{fieldErrors.name}</span>}
                    </div>
                  </div>

                  <div className="input-row split">
                    <div className="input-group">
                      <label className="premium-label">Roll Number</label>
                      <input type="text" className={`premium-input ${fieldErrors.rollNumber ? 'error' : ''}`}
                        value={rollNumber} placeholder="20CST01"
                        onChange={(e) => setRollNumber(fieldSet('rollNumber', e.target.value.toUpperCase()))} />
                    </div>
                    <div className="input-group">
                      <label className="premium-label">Classification</label>
                      <select className="premium-select" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="alumni">Alumni</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="premium-label">Institutional Email</label>
                    <input type="email" className={`premium-input ${fieldErrors.email ? 'error' : ''}`}
                      value={email} placeholder="name@kce.ac.in"
                      onChange={(e) => setEmail(fieldSet('email', e.target.value.toLowerCase()))} />
                    {fieldErrors.email && <span className="error-hint">{fieldErrors.email}</span>}
                  </div>

                  <div className="input-group">
                    <label className="premium-label">Department Hub</label>
                    <select className={`premium-select ${fieldErrors.department ? 'error' : ''}`}
                      value={department} onChange={(e) => setDepartment(fieldSet('department', e.target.value))}>
                      <option value="">Choose Department...</option>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <button type="submit" className="next-step-btn">
                    Advance to Encryption →
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="premium-form">
                  <div className="form-header-box">
                    <h2 className="content-title">Access Encryption</h2>
                    <p className="content-subtitle">Secure your institutional account gateway</p>
                  </div>

                  {/* Summary Card */}
                  <div className="identity-card">
                    <div className="id-avatar">{name[0]}</div>
                    <div className="id-info">
                      <div className="id-name">{name}</div>
                      <div className="id-sub">{rollNumber} • {department}</div>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="premium-label">Access Encryption Key</label>
                    <div className="pass-wrapper">
                      <input
                        type={showPass ? 'text' : 'password'}
                        className={`premium-input ${fieldErrors.password ? 'error' : ''}`}
                        value={password} placeholder="Min. 8 characters"
                        onChange={(e) => setPassword(fieldSet('password', e.target.value))}
                      />
                      <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                        {showPass ? <EyeOffIcon /> : <EyeOpenIcon />}
                      </button>
                    </div>
                    {fieldErrors.password && <span className="error-hint">{fieldErrors.password}</span>}
                  </div>

                  <div className="input-group">
                    <label className="premium-label">Verify Encryption Key</label>
                    <div className="pass-wrapper">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        className={`premium-input ${fieldErrors.confirmPass ? 'error' : ''}`}
                        value={confirmPass} placeholder="Must match key"
                        onChange={(e) => setConfirmPass(fieldSet('confirmPass', e.target.value))}
                      />
                      <button type="button" className="pass-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                        {showConfirm ? <EyeOffIcon /> : <EyeOpenIcon />}
                      </button>
                    </div>
                    {fieldErrors.confirmPass && <span className="error-hint">{fieldErrors.confirmPass}</span>}
                  </div>

                  <div className="button-group">
                    <button type="button" className="back-btn" onClick={() => setStep(1)}>
                      Back
                    </button>
                    <button type="submit" className="finish-btn" disabled={loading}>
                      {loading ? <Spinner /> : 'Create Final Identity'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="form-footer">
              Member already? <Link to="/login" className="login-link">Direct Access</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .register-page-container {
          min-height: 100dvh;
          display: flex;
          background: #fff;
          font-family: var(--font);
        }

        /* ── Hero Side ── */
        .register-hero-side {
          flex: 0 0 40%;
          background: #0B0F1A;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px;
          position: relative;
          overflow: hidden;
        }
        .hero-glow {
          position: absolute;
          top: -20%;
          right: -20%;
          width: 80%;
          height: 80%;
          background: radial-gradient(circle, rgba(166,25,46,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-logo-box {
          width: 64px;
          height: 64px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
          backdrop-filter: blur(10px);
        }
        .hero-logo { width: 80%; height: 80%; object-fit: contain; }
        .hero-title {
          font-size: 42px;
          font-weight: 950;
          letter-spacing: -0.05em;
          line-height: 1;
          margin-bottom: 12px;
        }
        .hero-title .accent { color: var(--crimson); }
        .hero-badge {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(166,25,46,0.1);
          color: var(--crimson);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.15em;
          border-radius: 4px;
          margin-bottom: 24px;
        }
        .hero-subtitle {
          font-size: 16px;
          color: rgba(255,255,255,0.4);
          line-height: 1.6;
          margin-bottom: 48px;
          max-width: 340px;
        }
        .hero-steps-visual {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .step-viz-item {
          display: flex;
          align-items: center;
          gap: 16px;
          opacity: 0.3;
          transition: all 0.4s;
        }
        .step-viz-item.active { opacity: 1; }
        .viz-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--crimson);
          box-shadow: 0 0 15px var(--crimson);
        }
        .viz-label { font-size: 14px; font-weight: 700; }
        .viz-line {
          width: 2px;
          height: 24px;
          background: rgba(255,255,255,0.1);
          margin-left: 4px;
        }
        .hero-footer {
          position: absolute;
          bottom: 40px;
          left: 80px;
          font-size: 10px;
          color: rgba(255,255,255,0.2);
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        /* ── Form Side ── */
        .register-form-side {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          background: #F8FAFC;
        }
        .register-form-box {
          width: 100%;
          max-width: 480px;
        }
        .step-progress-header {
          margin-bottom: 40px;
        }
        .step-indicator {
          font-size: 11px;
          font-weight: 900;
          color: #94A3B8;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
        }
        .progress-bar-bg {
          height: 4px;
          background: #E2E8F0;
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: var(--crimson);
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .form-header-box {
          margin-bottom: 32px;
        }
        .content-title {
          font-size: 32px;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.04em;
          margin-bottom: 8px;
        }
        .content-subtitle {
          font-size: 15px;
          color: #64748B;
          font-weight: 500;
        }
        .premium-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: #fff;
          padding: 32px;
          border-radius: 24px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          animation: slideFadeIn 0.5s var(--ease-out);
        }
        @keyframes slideFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .input-row.split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .premium-label {
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          margin-bottom: 8px;
          display: block;
        }
        .premium-input, .premium-select {
          width: 100%;
          height: 50px;
          padding: 0 16px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          outline: none;
          transition: all 0.2s;
        }
        .premium-input:focus, .premium-select:focus {
          background: #fff;
          border-color: #0F172A;
          box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.05);
        }
        .premium-input.error { border-color: var(--crimson); }
        .error-hint { font-size: 11px; color: var(--crimson); font-weight: 700; margin-top: 4px; display: block; }
        .next-step-btn, .finish-btn {
          height: 54px;
          background: #0F172A;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 12px;
        }
        .next-step-btn:hover, .finish-btn:hover { background: #1E293B; transform: translateY(-1px); }
        .identity-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #F8FAFC;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          margin-bottom: 8px;
        }
        .id-avatar {
          width: 44px;
          height: 44px;
          background: var(--crimson);
          color: #fff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 900;
        }
        .id-name { font-size: 15px; font-weight: 800; color: #0F172A; }
        .id-sub { font-size: 12px; color: #64748B; font-weight: 600; }
        .pass-wrapper { position: relative; }
        .pass-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
        }
        .button-group { display: flex; gap: 12px; margin-top: 12px; }
        .back-btn {
          padding: 0 24px;
          background: #fff;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .finish-btn { flex: 1; }
        .form-footer {
          margin-top: 32px;
          text-align: center;
          font-size: 14px;
          color: #64748B;
          font-weight: 500;
        }
        .login-link { color: var(--crimson); font-weight: 700; text-decoration: none; }

        @media (max-width: 1024px) {
          .register-hero-side { display: none; }
          .register-form-side { background: #fff; padding: 24px; }
        }
      `}</style>
    </PageTransition>
  );
}
