import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const Login = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState(1); // 1 = Credentials, 2 = OTP
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [devHint, setDevHint] = useState('');
    const otpRefs = useRef([]);
    const googleClickedRef = useRef(false);

    // Check if we are running on Cloudflare Tunnel (Google OAuth will block this by default)
    const isCloudflareTunnel = typeof window !== 'undefined' && window.location.hostname.includes('trycloudflare.com');

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) navigate('/');
    }, [isAuthenticated, navigate]);

    // Handle Input Changes
    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    // Step 1: Request OTP
    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/auth/request-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    type: isLogin ? 'login' : 'signup'
                }),
            });

            const contentType = res.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) throw new Error('Server is unavailable. Please try again later.');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send OTP.');

            if (data.devCode) {
                setDevHint(data.devCode);
            }
            setStep(2);
        } catch (err) {
            setError(err instanceof SyntaxError ? 'Server is unavailable. Please try again later.' : err.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP & Finalize Auth
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) return setError('Please enter all 6 digits.');

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/auth/verify-auth-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    otp: code,
                    type: isLogin ? 'login' : 'signup'
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Invalid or expired OTP.');

            // Success! Store token & user in AuthContext
            login(data.user, data.token);

            // Redirect to home or previous page
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle Google Login Success
    const handleGoogleSuccess = async (credentialResponse) => {
        // Ignore One Tap auto-triggers — only proceed if user explicitly clicked
        if (!googleClickedRef.current) return;
        googleClickedRef.current = false;

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken: credentialResponse.credential }),
            });

            const contentType = res.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                throw new Error('Server is unavailable. Please use email login.');
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Google Authentication failed.');

            login(data.user, data.token);
            navigate('/');
        } catch (err) {
            setError(err instanceof SyntaxError ? 'Server is unavailable. Please use email login.' : err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (val, i) => {
        if (!/^\d*$/.test(val)) return;
        const newOtp = [...otp];
        newOtp[i] = val.slice(-1);
        setOtp(newOtp);
        if (val && i < 5) otpRefs.current[i + 1]?.focus();
    };

    const handleKeyDown = (e, i) => {
        if (e.key === 'Backspace' && !otp[i] && i > 0) {
            otpRefs.current[i - 1]?.focus();
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-orb orb-1" />
            <div className="auth-orb orb-2" />

            {/* Back button */}
            <button className="auth-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                </svg>
                Back
            </button>

            <div className="auth-card">
                <header className="auth-header">
                    <span className="auth-logo">🌿</span>
                    <h1 className="auth-title">
                        {step === 1 ? (isLogin ? 'Welcome Back' : 'Create Account') : 'Verify Email'}
                    </h1>
                    <p className="auth-subtitle">
                        {step === 1
                            ? (isLogin ? 'Access your eco-friendly world.' : 'Join the Sapling & Seeds community.')
                            : `We've sent a code to ${formData.email}`}
                    </p>
                </header>

                {step === 1 ? (
                    <form className="auth-form" onSubmit={handleRequestOTP}>
                        {!isLogin && (
                            <div className="auth-input-group">
                                <label>Full Name</label>
                                <div className="auth-input-wrapper">
                                    <input
                                        type="text" name="name"
                                        value={formData.name} onChange={handleInput}
                                        placeholder="John Doe" required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="auth-input-group">
                            <label>Email Address</label>
                            <div className="auth-input-wrapper">
                                <input
                                    type="email" name="email"
                                    value={formData.email} onChange={handleInput}
                                    placeholder="your@email.com" required
                                />
                            </div>
                        </div>

                        <div className="auth-input-group">
                            <label>Password</label>
                            <div className="auth-input-wrapper">
                                <input
                                    type="password" name="password"
                                    value={formData.password} onChange={handleInput}
                                    placeholder="••••••••" required
                                />
                            </div>
                        </div>

                        {error && <div className="auth-error"><span>⚠️</span> {error}</div>}

                        <button className="auth-btn-primary" disabled={loading}>
                            {loading ? <span className="loading-spinner" /> : (isLogin ? 'Login →' : 'Sign Up →')}
                        </button>

                        <div className="auth-divider">
                            <span>or join with</span>
                        </div>

                        <div
                            className="google-auth-wrapper"
                            onClickCapture={() => { googleClickedRef.current = true; }}
                        >
                            {isCloudflareTunnel ? (
                                <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#d32f2f', padding: '10px', background: '#ffebee', borderRadius: '8px', border: '1px solid #ffcdd2', lineHeight: '1.4' }}>
                                    <strong>Google Login Disabled</strong><br/>
                                    Google blocks login from preview tunnels. Please use the Email &amp; Password login above.
                                </div>
                            ) : (
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => { if (googleClickedRef.current) setError('Google Login failed. Please try email login.'); googleClickedRef.current = false; }}
                                    theme="filled_black"
                                    shape="pill"
                                    text="continue_with"
                                    width="320"
                                    auto_select={false}
                                />
                            )}
                        </div>

                        <div className="auth-toggle">
                            {isLogin ? "Don't have an account?" : "Already a member?"}
                            <button
                                type="button"
                                className="auth-toggle-btn"
                                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            >
                                {isLogin ? 'Create one' : 'Login here'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="auth-form" onSubmit={handleVerifyOTP}>
                        <div className="otp-display">
                            <div className="otp-inputs-grid">
                                {otp.map((d, i) => (
                                    <input
                                        key={i}
                                        ref={el => otpRefs.current[i] = el}
                                        className="otp-box"
                                        type="text" maxLength="1"
                                        value={d}
                                        onChange={e => handleOtpChange(e.target.value, i)}
                                        onKeyDown={e => handleKeyDown(e, i)}
                                    />
                                ))}
                            </div>

                            {devHint && (
                                <div className="dev-otp-hint">
                                    <span className="dev-badge">DEV MODE</span>
                                    <p>Email delivery failed. Use this code to test: <strong>{devHint}</strong></p>
                                </div>
                            )}
                        </div>

                        {error && <div className="auth-error"><span>⚠️</span> {error}</div>}

                        <button className="auth-btn-primary" disabled={loading}>
                            {loading ? <span className="loading-spinner" /> : '✓ Verify Code'}
                        </button>

                        <button
                            type="button"
                            className="auth-btn-primary"
                            style={{ background: 'transparent', color: 'var(--auth-muted)', marginTop: '0' }}
                            onClick={() => setStep(1)}
                        >
                            ← Use another email
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
