import React, { useState, useRef, useEffect } from 'react';
import './AdminLogin.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const ADMIN_EMAIL = 'ajayk283703@gmail.com';
const ADMIN_PASSWORD = 'admin123';

const AdminLogin = ({ onLoginSuccess }) => {
  const [step, setStep] = useState('login'); // 'login' | 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const [devHint, setDevHint] = useState('');

  const otpRefs = useRef([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  // ── Step 1: Verify credentials then send OTP via backend ──────────────────
  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in both fields.'); return; }

    // Client-side credential check
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
      setError('Invalid email or password.');
      return;
    }

    setLoading(true);
    try {
      // Call backend to generate + email the OTP
      const res = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to send OTP.');

      if (data.devCode) {
        setDevHint(data.devCode);
      } else {
        setDevHint('');
      }

      setStep('otp');
      setCountdown(60);
      setEmailSent(true);
    } catch (err) {
      // Backend might be offline — show helpful message but still proceed
      // (for dev convenience, we fallback to console mode)
      if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
        setError('Backend offline. Start the backend server to receive OTP on email.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP via backend ────────────────────────────────────────
  const handleVerifyOTP = async e => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter all 6 digits.'); return; }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid OTP.');
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
      } else {
        // ✅ Verified!
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_email', email);
        if (data.user) {
          localStorage.setItem('admin_data', JSON.stringify(data.user));
        }
        onLoginSuccess();
      }
    } catch {
      setError('Backend offline. Cannot verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setError('');
    setOtp(['', '', '', '', '', '']);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCountdown(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input handlers ─────────────────────────────────────────────────────
  const handleOTPChange = (val, index) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...otp];
    updated[index] = val.slice(-1);
    setOtp(updated);
    setError('');
    if (val && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOTPKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPPaste = e => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const updated = ['', '', '', '', '', ''];
    pasted.split('').forEach((ch, i) => { updated[i] = ch; });
    setOtp(updated);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="login-page">
      {/* Ambient orbs */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      {/* Floating leaves */}
      <div className="login-leaf l1">🍃</div>
      <div className="login-leaf l2">🌿</div>
      <div className="login-leaf l3">🍃</div>

      <div className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <div className="login-logo">🌿</div>
          <h1 className="login-brand-name">Sapling &amp; Seeds</h1>
          <p className="login-brand-sub">Admin Portal</p>
        </div>

        {/* Step indicator */}
        <div className="step-indicator">
          <div className={`step-dot ${step === 'login' ? 'active' : 'done'}`}>
            {step === 'otp' ? '✓' : '1'}
          </div>
          <div className={`step-line ${step === 'otp' ? 'done' : ''}`} />
          <div className={`step-dot ${step === 'otp' ? 'active' : ''}`}>2</div>
        </div>
        <p className="step-label">
          {step === 'login' ? 'Enter Credentials' : 'Verify OTP'}
        </p>

        {/* ── LOGIN FORM ── */}
        {step === 'login' && (
          <form className="login-form" onSubmit={handleLogin}>
            <div className="login-field">
              <label htmlFor="admin-email">Email Address</label>
              <div className="field-wrap">
                <span className="field-icon">✉</span>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ajayk283703@gmail.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="admin-password">Password</label>
              <div className="field-wrap">
                <span className="field-icon">🔒</span>
                <input
                  id="admin-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPass(p => !p)}
                  tabIndex={-1}
                  title={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error">
                <span>⚠</span> {error}
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading
                ? <><span className="btn-spinner" /> Sending OTP...</>
                : <>Send OTP →</>
              }
            </button>
          </form>
        )}

        {/* ── OTP FORM ── */}
        {step === 'otp' && (
          <form className="login-form" onSubmit={handleVerifyOTP}>
            <div className="otp-info">
              <div className="otp-email-icon">📧</div>
              <p>OTP sent to</p>
              <p className="otp-email">{email}</p>
              <p className="otp-sub">Check your Gmail inbox and enter the 6-digit code</p>
              {devHint && (
                <div className="dev-otp-hint">
                  <span>🛠 Dev Mode:</span> Use this code: <strong>{devHint}</strong>
                </div>
              )}
            </div>

            <div className="otp-inputs">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => otpRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  className={`otp-box ${digit ? 'filled' : ''}`}
                  onChange={e => handleOTPChange(e.target.value, i)}
                  onKeyDown={e => handleOTPKeyDown(e, i)}
                  onPaste={i === 0 ? handleOTPPaste : undefined}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {error && (
              <div className="login-error">
                <span>⚠</span> {error}
              </div>
            )}

            <button
              type="submit"
              className="login-btn"
              disabled={loading || otp.join('').length < 6}
            >
              {loading
                ? <><span className="btn-spinner" /> Verifying...</>
                : <>✓ Verify &amp; Enter Portal</>
              }
            </button>

            <div className="otp-resend">
              {countdown > 0 ? (
                <p className="resend-countdown">Resend in <strong>{countdown}s</strong></p>
              ) : (
                <button type="button" className="resend-btn" onClick={handleResendOTP} disabled={loading}>
                  ↺ Resend OTP
                </button>
              )}
              <button
                type="button"
                className="back-btn"
                onClick={() => { setStep('login'); setError(''); setOtp(['','','','','','']); }}
              >
                ← Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
