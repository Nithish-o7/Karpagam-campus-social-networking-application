/**
 * KCE Connect — LoginPage v13 "Supercool"
 * Animated mesh bg · Glassmorphism form · Maroon glow
 */
import { useState } from 'react';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/layout/PageTransition';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';

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

function Spinner({ size = 18, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation:'spin .7s linear infinite' }}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeOpacity=".2" strokeWidth="3"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, signInWithGoogle } = useAuth();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [focused,  setFocused]  = useState<string|null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || loading) return;
    setLoading(true);
    try { await login(email, password); toast.success('Welcome back!'); navigate('/'); }
    catch (err: any) { toast.error(err.message || 'Login failed.'); }
    finally { setLoading(false); }
  }

  async function handleGoogleSignIn() {
    if (loading) return; setLoading(true);
    try { await signInWithGoogle(); toast.success('Signed in!'); navigate('/'); }
    catch (err: any) { toast.error(err.message || 'Google Sign-In failed.'); }
    finally { setLoading(false); }
  }

  return (
    <PageTransition>
      <div style={{
        minHeight:'100dvh', display:'flex', fontFamily:"'Inter',sans-serif",
        background:'#080C14', position:'relative', overflow:'hidden',
      }}>
        {/* ── Animated background orbs ── */}
        <div style={{ position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0 }}>
          {/* Orb 1 — maroon */}
          <div style={{ position:'absolute',top:'-10%',left:'-5%',width:'45%',height:'60%',background:'radial-gradient(circle,rgba(139,29,52,0.35) 0%,transparent 65%)',animation:'orbFloat1 12s ease-in-out infinite',borderRadius:'50%' }} />
          {/* Orb 2 — blue */}
          <div style={{ position:'absolute',bottom:'-10%',right:'-5%',width:'40%',height:'55%',background:'radial-gradient(circle,rgba(59,130,246,0.2) 0%,transparent 65%)',animation:'orbFloat2 15s ease-in-out infinite',borderRadius:'50%' }} />
          {/* Orb 3 — purple */}
          <div style={{ position:'absolute',top:'40%',right:'25%',width:'30%',height:'40%',background:'radial-gradient(circle,rgba(139,92,246,0.12) 0%,transparent 65%)',animation:'orbFloat3 18s ease-in-out infinite',borderRadius:'50%' }} />
          {/* Grid overlay */}
          <div style={{ position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)',backgroundSize:'40px 40px',maskImage:'radial-gradient(ellipse at center,rgba(0,0,0,0.6) 0%,transparent 80%)' }} />
        </div>

        <style>{`
          @keyframes orbFloat1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(3%,-4%) scale(1.06)} 66%{transform:translate(-2%,5%) scale(0.96)} }
          @keyframes orbFloat2 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(-4%,3%) scale(1.08)} 70%{transform:translate(3%,-5%) scale(0.95)} }
          @keyframes orbFloat3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(5%,-6%) scale(1.1)} }
        `}</style>

        {/* ── Left Hero ── */}
        <div style={{
          flex:'0 0 48%', display:'flex', flexDirection:'column', justifyContent:'center',
          alignItems:'flex-start', padding:'64px 72px', position:'relative', zIndex:1,
        }}>
          {/* Brand */}
          <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:52 }}>
            <div style={{
              width:48,height:48,borderRadius:12,overflow:'hidden',
              background:'rgba(139,29,52,0.15)',
              border:'1px solid rgba(139,29,52,0.3)',
              display:'flex',alignItems:'center',justifyContent:'center',
              boxShadow:'0 4px 24px rgba(139,29,52,0.25)',
              backdropFilter:'blur(8px)',
            }}>
              <img src={logoImg} alt="KCE" style={{ width:'80%',height:'80%',objectFit:'contain' }} />
            </div>
            <div>
              <div style={{ fontSize:13,fontWeight:800,color:'rgba(255,255,255,0.9)',letterSpacing:'-.03em',lineHeight:1 }}>
                KCE<span style={{ color:'#8B1D34' }}>Connect</span>
              </div>
              <div style={{ fontSize:9,color:'rgba(255,255,255,0.2)',letterSpacing:'.1em',textTransform:'uppercase',marginTop:2 }}>Campus Network</div>
            </div>
          </div>

          {/* Hero text */}
          <div style={{ marginBottom:40 }}>
            <h1 style={{
              fontSize:'clamp(40px,4.5vw,58px)', fontWeight:900,
              lineHeight:1.0, letterSpacing:'-0.05em', color:'#F0F4FF', marginBottom:20,
            }}>
              Your campus,<br/>
              <span style={{
                background:'linear-gradient(135deg,#8B1D34,#E53E3E,#8B5CF6)',
                backgroundSize:'200% 200%', animation:'gradShift 4s ease infinite',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
              }}>reimagined.</span>
            </h1>
            <style>{`@keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}`}</style>
            <p style={{ fontSize:16,color:'rgba(255,255,255,0.4)',lineHeight:1.7,fontWeight:400,maxWidth:380 }}>
              The professional digital ecosystem for Karpagam College of Engineering. Connect, collaborate, and excel together.
            </p>
          </div>

          {/* Feature bullets */}
          <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
            {[
              { icon:'⚡', label:'Real-time updates & announcements' },
              { icon:'🔐', label:'Secure institutional access' },
              { icon:'🤝', label:'Campus-wide networking' },
              { icon:'🎯', label:'ITSM ticket management' },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display:'flex',alignItems:'center',gap:12 }}>
                <div style={{
                  width:32,height:32,borderRadius:8,flexShrink:0,
                  background:'rgba(255,255,255,0.04)',
                  border:'1px solid rgba(255,255,255,0.07)',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:14,backdropFilter:'blur(8px)',
                }}>
                  {icon}
                </div>
                <span style={{ fontSize:13,fontWeight:500,color:'rgba(255,255,255,0.55)' }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop:'auto',paddingTop:60,fontSize:10,color:'rgba(255,255,255,0.15)',letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600 }}>
            © 2026 Karpagam College of Engineering
          </div>
        </div>

        {/* ── Right Form ── */}
        <div style={{
          flex:1, display:'flex', justifyContent:'center', alignItems:'center',
          padding:'48px 40px', position:'relative', zIndex:1,
        }}>
          <div style={{
            width:'100%', maxWidth:400,
            animation:'formSlide 0.5s cubic-bezier(.16,1,.3,1) both',
          }}>
            <style>{`@keyframes formSlide{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>

            {/* Glass form card */}
            <div style={{
              background:'rgba(255,255,255,0.05)',
              backdropFilter:'blur(24px) saturate(160%)',
              WebkitBackdropFilter:'blur(24px) saturate(160%)',
              border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:24, padding:'36px 32px',
              boxShadow:'0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
              position:'relative', overflow:'hidden',
            }}>
              {/* Top shimmer line */}
              <div style={{ position:'absolute',top:0,left:'10%',right:'10%',height:1,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)',pointerEvents:'none' }} />

              {/* Form header */}
              <div style={{ marginBottom:28 }}>
                <h2 style={{ fontSize:24,fontWeight:800,color:'#F0F4FF',letterSpacing:'-.04em',marginBottom:6 }}>
                  Sign in
                </h2>
                <p style={{ fontSize:13,color:'rgba(255,255,255,0.35)',fontWeight:400 }}>
                  Use your institutional credentials to continue
                </p>
              </div>

              {/* Google SSO — primary CTA */}
              <button type="button" onClick={handleGoogleSignIn} disabled={loading}
                style={{
                  width:'100%',height:48,
                  background:'rgba(255,255,255,0.08)',
                  border:'1px solid rgba(255,255,255,0.12)',
                  borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',gap:10,
                  fontSize:14,fontWeight:600,color:'rgba(255,255,255,0.85)',
                  cursor:'pointer',fontFamily:"'Inter',sans-serif",
                  transition:'all .15s ease',marginBottom:20,
                  backdropFilter:'blur(8px)',
                }}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background='rgba(255,255,255,0.13)';el.style.borderColor='rgba(255,255,255,0.2)';}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background='rgba(255,255,255,0.08)';el.style.borderColor='rgba(255,255,255,0.12)';}}
              >
                {loading?<Spinner color="rgba(255,255,255,0.8)"/>:<><GoogleLogo size={18}/> Continue with Karpagam ID</>}
              </button>

              {/* Divider */}
              <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:20 }}>
                <div style={{ flex:1,height:1,background:'rgba(255,255,255,0.07)' }} />
                <span style={{ fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.2)',textTransform:'uppercase',letterSpacing:'.1em' }}>or email</span>
                <div style={{ flex:1,height:1,background:'rgba(255,255,255,0.07)' }} />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'.08em',display:'block',marginBottom:6 }}>
                    Email
                  </label>
                  <div style={{ position:'relative' }}>
                    <svg style={{ position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.2)',pointerEvents:'none' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <input type="email" placeholder="name@kce.ac.in"
                      value={email} onChange={e=>setEmail(e.target.value)} required
                      onFocus={()=>setFocused('email')} onBlur={()=>setFocused(null)}
                      style={{
                        width:'100%',height:46,paddingLeft:40,paddingRight:14,
                        background: focused==='email'?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.04)',
                        border:`1px solid ${focused==='email'?'rgba(139,29,52,0.6)':'rgba(255,255,255,0.08)'}`,
                        borderRadius:10,fontSize:13,color:'#F0F4FF',
                        outline:'none',fontFamily:"'Inter',sans-serif",
                        transition:'all .15s',
                        boxShadow: focused==='email'?'0 0 0 3px rgba(139,29,52,0.1)':'none',
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'.08em',display:'block',marginBottom:6 }}>
                    Password
                  </label>
                  <div style={{ position:'relative' }}>
                    <svg style={{ position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.2)',pointerEvents:'none' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input type="password" placeholder="••••••••"
                      value={password} onChange={e=>setPassword(e.target.value)} required
                      onFocus={()=>setFocused('password')} onBlur={()=>setFocused(null)}
                      style={{
                        width:'100%',height:46,paddingLeft:40,paddingRight:14,
                        background: focused==='password'?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.04)',
                        border:`1px solid ${focused==='password'?'rgba(139,29,52,0.6)':'rgba(255,255,255,0.08)'}`,
                        borderRadius:10,fontSize:14,color:'#F0F4FF',
                        outline:'none',fontFamily:"'Inter',sans-serif",
                        transition:'all .15s',
                        boxShadow: focused==='password'?'0 0 0 3px rgba(139,29,52,0.1)':'none',
                      }}
                    />
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading}
                  style={{
                    width:'100%',height:48,
                    background:'linear-gradient(135deg,#A52444,#6B1528)',
                    color:'#fff',border:'none',borderRadius:12,
                    fontSize:14,fontWeight:700,cursor:'pointer',
                    fontFamily:"'Inter',sans-serif",
                    boxShadow:'0 4px 20px rgba(139,29,52,0.4)',
                    transition:'all .15s',display:'flex',alignItems:'center',justifyContent:'center',gap:8,
                    position:'relative',overflow:'hidden',
                  }}
                  onMouseEnter={e=>{ if(!loading){const el=e.currentTarget as HTMLElement;el.style.transform='translateY(-1px)';el.style.boxShadow='0 6px 28px rgba(139,29,52,0.5)';el.style.filter='brightness(1.08)';} }}
                  onMouseLeave={e=>{ const el=e.currentTarget as HTMLElement;el.style.transform='translateY(0)';el.style.boxShadow='0 4px 20px rgba(139,29,52,0.4)';el.style.filter='none'; }}
                >
                  {loading ? <Spinner /> : <>Sign In →</>}
                </button>
              </form>

              {/* Footer */}
              <div style={{ textAlign:'center',marginTop:20,fontSize:12,color:'rgba(255,255,255,0.25)' }}>
                No account?{' '}
                <Link to="/register" style={{ color:'rgba(165,36,68,0.9)',fontWeight:700 }}>
                  Create one
                </Link>
              </div>
            </div>

            {/* Trust indicators */}
            <div style={{ display:'flex',justifyContent:'center',gap:20,marginTop:20,flexWrap:'wrap' }}>
              {['🔒 Encrypted','🏛️ Institutional','✓ Verified'].map(t => (
                <span key={t} style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,0.2)',letterSpacing:'.04em' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile — full width form */}
        <style>{`
          @media(max-width:768px){
            div[style*="flex: 0 0 48%"]{display:none!important;}
            div[style*="flex: 1"]{padding:24px 16px!important;}
          }
        `}</style>
      </div>
    </PageTransition>
  );
}
