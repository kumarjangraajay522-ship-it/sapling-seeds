import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import '../styles/fonts.css';
import '../styles/theme.css';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

const FADE = 0.5;

const Hero = () => {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  useEffect(() => {
    if (isMobile) return; // Don't run video logic on mobile to save memory/CPU

    const video = videoRef.current;
    if (!video) return;

    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn && (conn.saveData || (conn.effectiveType && conn.effectiveType.includes('2g')))) {
      return;
    }

    const startVideo = () => {
      video.play().catch(() => { });
    };
    
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(startVideo, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }
    const timer = setTimeout(startVideo, 1500);
    return () => clearTimeout(timer);
  }, [isMobile]);

  return (
    <div className="relative w-full" style={{ isolation: 'isolate', backgroundColor: 'var(--color-bg)', overflow: 'hidden', minHeight: '100vh', transform: 'translateZ(0)' }}>
      {/* ── Background Layer ─────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          willChange: 'transform',
          transform: 'translateZ(0)'
        }}
      >
        {!isMobile ? (
          <video
            ref={videoRef}
            src={VIDEO_URL}
            loop
            muted
            playsInline
            preload="none"
            poster="/hero-poster.jpg"
            className="w-full h-full object-cover"
            style={{ opacity: 0, transition: 'opacity 1s ease-in', transform: 'translateZ(0)' }}
            onCanPlay={(e) => { e.currentTarget.style.opacity = 1; }}
          >
            <track kind="captions" srcLang="en" label="English" src="data:text/vtt,WEBVTT" default />
          </video>
        ) : (
          /* Use high-res optimized image for mobile to get 90+ speed score */
          <img 
            src="/hero-poster.jpg" 
            alt="Sapling & Seeds Hero" 
            className="w-full h-full object-cover" 
            loading="eager" 
            fetchpriority="high"
            decoding="async"
            style={{ transform: 'translateZ(0)' }}
          />
        )}
      </div>

      {/* ── Gradient Overlays ────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            'linear-gradient(to bottom, rgba(249,247,243,0.1) 0%, transparent 15%, transparent 85%, rgba(249,247,243,0.1) 100%)',
          transform: 'translateZ(0)'
        }}
      />

      {/* ── Hero Content ─────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 1.25rem',
          paddingTop: '6rem',
          paddingBottom: '4rem',
          minHeight: '100vh',
          transform: 'translateZ(0)'
        }}
      >
        <div
          className="animate-rise"
          style={{
            padding: '1.5rem 2rem',
            marginTop: '0.5vh',
            maxWidth: 'fit-content',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: 'translateZ(0)'
          }}
        >
          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(1.8rem, 9vw, 5rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-1.5px',
              color: '#000000',
              margin: 0,
              textAlign: 'center',
            }}
          >
            <span style={{ color: '#0056b3' }}>This</span> <span style={{ color: '#0056b3' }}>is the Earth</span>{' '}
            <em style={{ color: '#025819ff', fontStyle: 'normal' }}>
              We Can Restore.
            </em>
          </h1>
          <h2
            className="animate-fade-rise-delay"
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: 'clamp(0.6rem, 2vw, 0.72rem)',
              letterSpacing: '0.18em',
              fontWeight: '800',
              textTransform: 'uppercase',
              color: '#333',
              marginTop: '1.5rem',
              padding: '0 10px',
            }}
          >
            From plastic waste to eco friendly Bamboo &amp; Sustainable products
          </h2>
        </div>
        {/* CTA Button */}
        {user ? (
          <a href="https://wa.me/918800799151?text=Hi%20Sapling%20%26%20Seeds,%20I%20want%20to%20claim%20my%20free%20gift!" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button
              className="animate-fade-rise-delay-2"
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '1rem',
                backgroundColor: '#04572bff',
                color: '#FFFFFF',
                borderRadius: '9999px',
                padding: '1.1rem 3rem',
                border: 'none',
                cursor: 'pointer',
                marginTop: 'clamp(1.5rem, 6vh, 8rem)',
                transition: 'transform 0.2s',
                transform: 'translateZ(0)',
                boxShadow: '0 10px 30px rgba(4, 87, 43, 0.3)'
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05) translateZ(0)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1) translateZ(0)')}
            >
              Claim Your Gift
            </button>
          </a>
        ) : (
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button
              className="animate-fade-rise-delay-2"
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '1rem',
                backgroundColor: '#5D3A1A',
                color: '#FFFFFF',
                borderRadius: '9999px',
                padding: '1.1rem 3rem',
                border: 'none',
                cursor: 'pointer',
                marginTop: 'clamp(1.5rem, 6vh, 8rem)',
                transition: 'transform 0.2s',
                transform: 'translateZ(0)',
                boxShadow: '0 10px 30px rgba(93, 58, 26, 0.3)'
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05) translateZ(0)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1) translateZ(0)')}
            >
              Get Started →
            </button>
          </Link>
        )}
      </section>
    </div>
  );
};

export default Hero;
