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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Defer video loading until browser is idle — prevents video from competing
    // with critical JS/CSS on first load, which was the primary cause of TTI ~10s
    const startVideo = () => {
      video.play().catch(() => {});
    };
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(startVideo, { timeout: 1500 });
      return () => cancelIdleCallback(id);
    }
    const timer = setTimeout(startVideo, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full" style={{ isolation: 'isolate', backgroundColor: '#F9F7F3', overflow: 'hidden', minHeight: '100vh' }}>



      {/* ── Video Background ─────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
        <video
          ref={videoRef}
          src={VIDEO_URL}
          loop
          muted
          playsInline
          preload="none"
          poster="/hero-poster.jpg"
          className="w-full h-full object-cover"
          style={{ opacity: 0, transition: 'opacity 1.5s ease-in' }}
          onCanPlay={(e) => { e.currentTarget.style.opacity = 1; }}
        >
          <track kind="captions" srcLang="en" label="English" src="data:text/vtt,WEBVTT" default />
        </video>
      </div>

      {/* ── Gradient Overlays ────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            'linear-gradient(to bottom, rgba(249,247,243,0.2) 0%, rgba(249,247,243,0.0) 15%, rgba(249,247,243,0.0) 85%, rgba(249,247,243,0.2) 100%)',
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
          padding: '0 1.5rem',
          paddingTop: '7rem',
          paddingBottom: '10rem',
          minHeight: '100vh',
        }}
      >
        <div
          className="animate-rise"
          style={{
            // background: 'rgba(255, 255, 255, 0)',
            // backdropFilter: 'blur(12px)',
            // WebkitBackdropFilter: 'blur(12px)',
            // border: '1px solid rgba(255, 255, 255, 0.4)',
            // borderRadius: '24px',
            padding: '2rem 3rem',
            marginTop: '0.5vh',
            maxWidth: 'fit-content',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.8rem, 8vw, 6rem)',
              fontWeight: 600,
              lineHeight: 0.95,
              letterSpacing: '-4.46px',
              color: '#000000',
              margin: 0,
              textAlign: 'center',
            }}
          >
            <span style={{ color: '#0056b3' }}>This</span> <span style={{ color: '#0056b3' }}>is the Earth</span>{' '}
            <em style={{ color: '#025819ff' }}>
              We Can Restore.
            </em>
          </h1>
          <h2
          className="animate-fade-rise-delay"
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.72rem',
            letterSpacing: '0.24em',
            fontWeight: '900',
            textTransform: 'uppercase',
            color: '#1e1c1cff',
            marginTop: '2rem',
          }}
        >
          From plastic waste to eco friendly Bamboo &amp; Sustainable products
        </h2>
        </div>
        {/* CTA Button */}
        <a href="https://wa.me/919354361055?text=Hi%20Sapling%20%26%20Seeds,%20I%20want%20to%20claim%20my%20free%20gift!" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <button
            className="animate-fade-rise-delay-2"
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '1rem',
              backgroundColor: '#04572bff',
              color: '#FFFFFF',
              borderRadius: '9999px',
              padding: '1.25rem 3.5rem',
              border: 'none',
              cursor: 'pointer',
              marginTop: 'clamp(2rem, 10vh, 15rem)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Claim Your Gift
          </button>
        </a>
      </section>
    </div>
  );
};

export default Hero;
