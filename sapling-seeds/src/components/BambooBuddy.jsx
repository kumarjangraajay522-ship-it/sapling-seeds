import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './BambooBuddy.css';

/* ════════════════════════════════════════════
   SPROUT SMART — Full Conversion-Optimized Bot
   10 triggers · A/B entry · Exit intent · Idle
════════════════════════════════════════════ */

// ── A/B variant (deterministic per session) ──
const AB_VARIANT = Math.random() > 0.5 ? 'A' : 'B';

// ── All message banks ──
const MESSAGES = {
  // 1. Entry greeting (A/B tested)
  entryA: [
    "Hi 🌿 Welcome to Sapling & Seeds.",
    "You're not just shopping… you're helping the planet breathe.",
    "Ready to explore something sustainable? 🌍"
  ],
  entryB: [
    "Hi there! 👋 Welcome to Sapling & Seeds.",
    "Looking for eco-friendly products? 🌿",
    "I'll help you find the perfect sustainable choice!"
  ],

  // 2. First robot click
  firstClick: [
    "Hi Earth Saver 🌍 How may I help you?",
    "I can help you choose eco-friendly products, gifts, or bestsellers 🌿"
  ],

  // 4. Add to cart
  addToCart: [
    "Wow 💚 You just took a step to save the Earth!",
    "Small choices like this create big change 🌍",
    "Proud of you, Earth Saver! 🌱"
  ],
  addToCartProduct: (name) => [
    `💚 "${name}" is a brilliant eco choice!`,
    "1 sustainable product = less plastic waste 🌱",
    "You're making a real difference!"
  ],

  // 5. Product view
  productView: (name) => [
    `Great choice 👀 "${name}" is eco-friendly and sustainable.`,
    "Did you know? Bamboo grows 30x faster than trees 🌿"
  ],

  // 6. Gifting page
  gifting: [
    "Gifts that don't harm the planet 🎁🌍",
    "Perfect for people who care about the future 💚"
  ],

  // 7. Idle (no action 12 sec)
  idle: [
    "Still exploring? I can help you find the best product 😊",
    "Need help choosing? I'm here 🌱"
  ],

  // 8. Exit intent
  exitIntent: [
    "Wait! Your eco-choice is still in your cart 🌍",
    "Complete it and make a difference today 💚"
  ],

  // 9. Post-purchase
  postPurchase: [
    "You did something amazing today 🌱",
    "Thank you for choosing sustainability 💚",
    "The Earth appreciates you 🌍"
  ],

  // 10. Micro personality lines
  micro: [
    "Every small step counts 🌿",
    "You + us = greener future 💚",
    "Let's reduce plastic together 🌍",
    "Nature says thank you 🌿",
    "Sustainability is the future — you're already there! 🌱"
  ],
};

// ── Page-aware messages ──
const PAGE_CONTEXT = {
  '/':          { greeting: "Hi Earth Saver 🌍 How may I help you?", sub: "Products · Gifts · Sustainability tips" },
  '/collection':{ greeting: "Find your perfect eco product! 🌿", sub: "Everything here is sustainably made" },
  '/gifting':   { greeting: "Gifts that don't harm the planet 🎁🌍", sub: "Perfect for people who care about the future" },
  '/contact':   { greeting: "Got a question? I'm all ears 📬", sub: "Our team replies within 24 hours" },
  '/cart':      { greeting: "Your cart is full of good choices 💚", sub: "Ready to make a difference?" },
  '/orders':    { greeting: "Tracking your impact 📦", sub: "Every order plants a better future" },
};

// ── Smart reply engine ──
const getSmartReply = (text) => {
  const t = text.toLowerCase();
  if (t.includes('product') || t.includes('buy') || t.includes('best'))
    return "Our bestsellers are bamboo toothbrushes, reusable bags, and beeswax wraps 🌿 Want me to filter by category?";
  if (t.includes('bamboo'))
    return "Bamboo grows 30x faster than trees, needs no pesticides, and biodegrades naturally 🌱 It's nature's superplant!";
  if (t.includes('gift') || t.includes('gifting'))
    return "Our eco gift sets start at ₹299 🎁 They come in recycled packaging — perfect for birthdays, anniversaries, or just because 💚";
  if (t.includes('sustain') || t.includes('eco') || t.includes('planet'))
    return "Start small: reusable bags, bamboo toothbrush, bar soap instead of plastic bottles 🌿 Each swap removes ~400g of plastic from the world!";
  if (t.includes('ship') || t.includes('deliver'))
    return "Carbon-neutral shipping ♻️🚚 — 3–5 days pan-India. Free above ₹499. We use recycled packaging too!";
  if (t.includes('return') || t.includes('refund'))
    return "Hassle-free 30-day returns 🔄 Just reach us at hello@saplingandseed.in and we'll sort it out!";
  if (t.includes('price') || t.includes('cost') || t.includes('₹') || t.includes('rs'))
    return "Our products start at ₹99 💚 Sustainability shouldn't be a luxury — we keep it accessible for everyone!";
  if (t.includes('material') || t.includes('made'))
    return "Everything is made from bamboo, recycled materials, organic cotton, and beeswax 🌱 No virgin plastic, ever!";
  if (t.includes('hi') || t.includes('hello') || t.includes('hey'))
    return "Hi Earth Saver! 👋 Great to meet you 🌿 Ask me about our products, gifting, or sustainability tips!";
  if (t.includes('plastic'))
    return "We're 100% plastic-free in packaging 🌍 Our mailers are kraft paper, tapes are water-based. Zero plastic promise!";
  if (t.includes('discount') || t.includes('offer') || t.includes('coupon'))
    return "Use code EARTHDAY for 10% off your first order 🌿 Also, subscribe to our newsletter for exclusive eco-deals!";
  if (t.includes('impact') || t.includes('tree') || t.includes('carbon'))
    return "This year alone we've offset 12 tonnes of CO₂ and planted 840 trees 🌳 Every purchase adds to this!";
  const fallbacks = [
    "Should I arrange a callback from our team so that we can help you choose the product?",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

/* ── SVG Sprout Robot (same realistic design) ── */
const SproutSVG = ({ blink, expression = 'happy' }) => {
  const smilePaths = {
    happy:   "M48 112 Q65 124 82 112",
    excited: "M44 110 Q65 128 86 110",
    thinking:"M50 113 Q65 117 80 113",
    sad:     "M50 116 Q65 110 80 116",
  };
  const smilePath = smilePaths[expression] || smilePaths.happy;
  const eyeRy = blink ? 0.4 : (expression === 'excited' ? 9 : 7);

  return (
    <svg width="85" height="188" viewBox="0 0 130 280" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="S_hg" cx="38%" cy="28%" r="65%"><stop offset="0%" stopColor="#f5edd8"/><stop offset="40%" stopColor="#e8d8b8"/><stop offset="75%" stopColor="#d0be98"/><stop offset="100%" stopColor="#b89e78"/></radialGradient>
        <radialGradient id="S_bg" cx="35%" cy="25%" r="68%"><stop offset="0%" stopColor="#f0e8d0"/><stop offset="45%" stopColor="#ddc8a8"/><stop offset="80%" stopColor="#c4a880"/><stop offset="100%" stopColor="#a88a60"/></radialGradient>
        <radialGradient id="S_ag" cx="35%" cy="20%" r="70%"><stop offset="0%" stopColor="#f0e8d0"/><stop offset="55%" stopColor="#d4b888"/><stop offset="100%" stopColor="#a88868"/></radialGradient>
        <radialGradient id="S_lg" cx="35%" cy="20%" r="70%"><stop offset="0%" stopColor="#e8d8b8"/><stop offset="55%" stopColor="#c8a878"/><stop offset="100%" stopColor="#9a7a50"/></radialGradient>
        <radialGradient id="S_btg" cx="35%" cy="25%" r="68%"><stop offset="0%" stopColor="#c4a87a"/><stop offset="60%" stopColor="#9a7848"/><stop offset="100%" stopColor="#6a5030"/></radialGradient>
        <radialGradient id="S_eg" cx="38%" cy="30%" r="65%"><stop offset="0%" stopColor="#c8a87a"/><stop offset="60%" stopColor="#9a7848"/><stop offset="100%" stopColor="#7a5830"/></radialGradient>
        <radialGradient id="S_sg" cx="40%" cy="35%" r="65%"><stop offset="0%" stopColor="#1a2a1a"/><stop offset="60%" stopColor="#0e180e"/><stop offset="100%" stopColor="#050d05"/></radialGradient>
        <radialGradient id="S_eyeg" cx="38%" cy="32%" r="62%"><stop offset="0%" stopColor="#c8ff90"/><stop offset="35%" stopColor="#70ee20"/><stop offset="70%" stopColor="#38c808"/><stop offset="100%" stopColor="#107800"/></radialGradient>
        <radialGradient id="S_lfg" cx="30%" cy="25%" r="70%"><stop offset="0%" stopColor="#c8f080"/><stop offset="45%" stopColor="#78c830"/><stop offset="100%" stopColor="#3a7010"/></radialGradient>
        <radialGradient id="S_lfg2" cx="30%" cy="25%" r="70%"><stop offset="0%" stopColor="#a8d860"/><stop offset="45%" stopColor="#58a010"/><stop offset="100%" stopColor="#286000"/></radialGradient>
        <radialGradient id="S_spec" cx="30%" cy="25%" r="55%"><stop offset="0%" stopColor="rgba(255,255,255,0.45)"/><stop offset="100%" stopColor="rgba(255,255,255,0)"/></radialGradient>
        <radialGradient id="S_moss" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#90c050"/><stop offset="70%" stopColor="#508020"/><stop offset="100%" stopColor="#305010"/></radialGradient>
        <filter id="S_glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <pattern id="S_stip" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="0.7" fill="rgba(100,70,30,0.09)"/><circle cx="4.5" cy="4.5" r="0.5" fill="rgba(100,70,30,0.06)"/></pattern>
      </defs>
      <ellipse cx="65" cy="272" rx="36" ry="5" fill="rgba(0,0,0,0.12)"/>
      {/* Plant */}
      <path d="M65 54 Q64 46 63 36" stroke="#4a7a20" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M63 42 Q52 30 44 26 Q50 34 58 40 Z" fill="url(#S_lfg2)"/>
      <path d="M64 38 Q75 25 84 21 Q78 32 68 37 Z" fill="url(#S_lfg)"/>
      <path d="M63 36 Q59 22 58 10 Q64 20 68 28 Q68 16 70 8 Q74 20 69 32 Z" fill="url(#S_lfg)"/>
      <path d="M66 14 Q68 8 70 4 Q70 10 68 14 Z" fill="#90d040"/>
      {/* Ears */}
      <rect x="5" y="75" width="16" height="28" rx="8" fill="url(#S_eg)"/>
      <rect x="5" y="75" width="16" height="28" rx="8" fill="url(#S_stip)"/>
      <rect x="8" y="80" width="8" height="18" rx="4" fill="rgba(0,0,0,0.08)"/>
      <text x="13" y="90" textAnchor="middle" fontSize="9" fill="#4a7a20">🌿</text>
      <rect x="109" y="75" width="16" height="28" rx="8" fill="url(#S_eg)"/>
      <rect x="109" y="75" width="16" height="28" rx="8" fill="url(#S_stip)"/>
      <rect x="114" y="80" width="8" height="18" rx="4" fill="rgba(0,0,0,0.08)"/>
      <text x="117" y="90" textAnchor="middle" fontSize="9" fill="#4a7a20">🌿</text>
      {/* Head */}
      <rect x="14" y="58" width="102" height="84" rx="22" fill="url(#S_hg)"/>
      <rect x="14" y="58" width="102" height="84" rx="22" fill="url(#S_stip)"/>
      <rect x="14" y="58" width="102" height="84" rx="22" fill="none" stroke="rgba(100,70,30,0.3)" strokeWidth="1.2"/>
      <ellipse cx="38" cy="72" rx="18" ry="10" fill="url(#S_spec)" transform="rotate(-20,38,72)"/>
      <rect x="26" y="134" width="78" height="14" rx="5" fill="#b89878"/>
      <path d="M14 80 Q14 62 36 58 Q25 62 20 72 Z" fill="url(#S_moss)" opacity="0.55"/>
      <path d="M116 80 Q116 62 94 58 Q105 62 110 72 Z" fill="url(#S_moss)" opacity="0.45"/>
      {/* Screen */}
      <rect x="26" y="68" width="78" height="60" rx="13" fill="url(#S_sg)"/>
      <rect x="26" y="68" width="78" height="60" rx="13" fill="none" stroke="rgba(150,120,70,0.4)" strokeWidth="1.5"/>
      <ellipse cx="44" cy="76" rx="12" ry="6" fill="rgba(255,255,255,0.06)" transform="rotate(-20,44,76)"/>
      {/* Eyes */}
      <ellipse cx="48" cy="93" rx="12" ry="9" fill="rgba(76,200,20,0.18)"/>
      <ellipse cx="48" cy="93" rx="9" ry={eyeRy} fill="url(#S_eyeg)" filter="url(#S_glow)" style={{transition:'ry 0.12s'}}/>
      <ellipse cx="45" cy="91" rx="3" ry="2" fill="rgba(255,255,255,0.35)"/>
      <ellipse cx="82" cy="93" rx="12" ry="9" fill="rgba(76,200,20,0.18)"/>
      <ellipse cx="82" cy="93" rx="9" ry={eyeRy} fill="url(#S_eyeg)" filter="url(#S_glow)" style={{transition:'ry 0.12s'}}/>
      <ellipse cx="79" cy="91" rx="3" ry="2" fill="rgba(255,255,255,0.35)"/>
      {/* Smile */}
      <path d={smilePath} stroke="rgba(76,200,20,0.18)" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <path d={smilePath} stroke="url(#S_eyeg)" strokeWidth="3.5" fill="none" strokeLinecap="round" filter="url(#S_glow)" style={{transition:'d 0.4s'}}/>
      {/* Body */}
      <rect x="18" y="146" width="94" height="76" rx="18" fill="url(#S_bg)"/>
      <rect x="18" y="146" width="94" height="76" rx="18" fill="url(#S_stip)"/>
      <rect x="18" y="146" width="94" height="76" rx="18" fill="none" stroke="rgba(100,70,30,0.28)" strokeWidth="1.2"/>
      <ellipse cx="42" cy="162" rx="16" ry="9" fill="url(#S_spec)" transform="rotate(-20,42,162)"/>
      <path d="M18 164 Q18 148 36 146 Q26 150 22 162 Z" fill="url(#S_moss)" opacity="0.5"/>
      <path d="M112 164 Q112 148 94 146 Q104 150 108 162 Z" fill="url(#S_moss)" opacity="0.4"/>
      <path d="M22 165 Q19 180 22 195" stroke="#5a8020" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
      <path d="M108 170 Q111 185 108 198" stroke="#5a8020" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
      <ellipse cx="21" cy="178" rx="5" ry="3.5" fill="#7aaa30" transform="rotate(-30,21,178)" opacity="0.75"/>
      <ellipse cx="109" cy="182" rx="4.5" ry="3" fill="#7aaa30" transform="rotate(35,109,182)" opacity="0.65"/>
      {/* Recycle */}
      <g transform="translate(65,185)" opacity="0.85">
        <path d="M0,-18 L6,-10 L-6,-10 Z" fill="#4a7a20"/>
        <path d="M0,-18 Q14,0 6,16" stroke="#4a7a20" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
        <path d="M6,16 L-2,10 L8,6 Z" fill="#4a7a20"/>
        <path d="M6,16 Q-14,12 -12,-6" stroke="#4a7a20" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
        <path d="M-12,-6 L-8,-14 L-2,-6 Z" fill="#4a7a20"/>
        <path d="M-12,-6 Q-8,-20 0,-18" stroke="#4a7a20" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
        <circle cx="0" cy="0" r="5" fill="#5a9030" opacity="0.6"/>
      </g>
      <circle cx="30" cy="158" r="3.5" fill="#c4a878" stroke="rgba(80,50,20,0.3)" strokeWidth="0.8"/>
      <circle cx="100" cy="158" r="3.5" fill="#c4a878" stroke="rgba(80,50,20,0.3)" strokeWidth="0.8"/>
      {/* Arms */}
      <g transform="translate(5,150) rotate(14,10,6)">
        <rect x="0" y="0" width="22" height="44" rx="11" fill="url(#S_ag)"/>
        <rect x="0" y="0" width="22" height="44" rx="11" fill="url(#S_stip)"/>
        <ellipse cx="8" cy="8" rx="6" ry="4" fill="url(#S_spec)" transform="rotate(-15,8,8)"/>
        <circle cx="11" cy="50" r="10" fill="url(#S_ag)"/>
        <circle cx="11" cy="50" r="10" fill="url(#S_stip)"/>
        <ellipse cx="8" cy="47" rx="4" ry="3" fill="url(#S_spec)"/>
      </g>
      <g transform="translate(103,148) rotate(-18,11,6)">
        <rect x="0" y="0" width="22" height="44" rx="11" fill="url(#S_ag)"/>
        <rect x="0" y="0" width="22" height="44" rx="11" fill="url(#S_stip)"/>
        <ellipse cx="8" cy="8" rx="6" ry="4" fill="url(#S_spec)" transform="rotate(-15,8,8)"/>
        <circle cx="11" cy="50" r="10" fill="url(#S_ag)"/>
        <circle cx="11" cy="50" r="10" fill="url(#S_stip)"/>
        <ellipse cx="8" cy="47" rx="4" ry="3" fill="url(#S_spec)"/>
      </g>
      {/* Legs */}
      <rect x="28" y="218" width="28" height="38" rx="10" fill="url(#S_lg)"/>
      <rect x="28" y="218" width="28" height="38" rx="10" fill="url(#S_stip)"/>
      <ellipse cx="36" cy="226" rx="7" ry="4" fill="url(#S_spec)" transform="rotate(-15,36,226)"/>
      <rect x="22" y="248" width="36" height="16" rx="9" fill="url(#S_btg)"/>
      <rect x="74" y="218" width="28" height="38" rx="10" fill="url(#S_lg)"/>
      <rect x="74" y="218" width="28" height="38" rx="10" fill="url(#S_stip)"/>
      <ellipse cx="82" cy="226" rx="7" ry="4" fill="url(#S_spec)" transform="rotate(-15,82,226)"/>
      <rect x="68" y="248" width="36" height="16" rx="9" fill="url(#S_btg)"/>
    </svg>
  );
};

/* ── Mini Sprout for panel header ── */
const MiniSprout = () => (
  <svg width="42" height="50" viewBox="0 0 44 52">
    <defs>
      <radialGradient id="M_hg"><stop offset="0%" stopColor="#f0ead8"/><stop offset="100%" stopColor="#c8b898"/></radialGradient>
      <radialGradient id="M_sg"><stop offset="0%" stopColor="#141e14"/><stop offset="100%" stopColor="#060d06"/></radialGradient>
    </defs>
    <ellipse cx="22" cy="6" rx="8" ry="10" fill="#5a9030"/>
    <ellipse cx="22" cy="6" rx="5" ry="7" fill="#7ab850"/>
    <line x1="22" y1="14" x2="22" y2="20" stroke="#5a7a30" strokeWidth="2" strokeLinecap="round"/>
    <rect x="6" y="19" width="32" height="26" rx="9" fill="url(#M_hg)"/>
    <rect x="2" y="24" width="7" height="14" rx="4" fill="#b89878"/>
    <rect x="35" y="24" width="7" height="14" rx="4" fill="#b89878"/>
    <rect x="10" y="23" width="24" height="18" rx="6" fill="url(#M_sg)"/>
    <ellipse cx="17" cy="32" rx="4" ry="3" fill="#4cdd1a" opacity="0.9"/>
    <ellipse cx="27" cy="32" rx="4" ry="3" fill="#4cdd1a" opacity="0.9"/>
    <path d="M15 38 Q22 44 29 38" stroke="#4cdd1a" strokeWidth="2" fill="none" strokeLinecap="round"/>
  </svg>
);

/* ── Typing dots ── */
const TypingDots = () => (
  <div className="sp-typing"><span/><span/><span/></div>
);

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const BambooBuddy = () => {
  const location = useLocation();
  const [open, setOpen]           = useState(false);
  const [input, setInput]         = useState('');
  const [blink, setBlink]         = useState(false);
  const [expression, setExpr]     = useState('happy');
  const [intro, setIntro]         = useState(false);
  const [bubbleMsgs, setBubbleMsgs] = useState([]);
  const [typing, setTyping]       = useState(false);
  const [showQR, setShowQR]       = useState(true);
  const [firstClick, setFirstClick] = useState(true);
  const [notif, setNotif]         = useState(true);
  const [triggerLabel, setTriggerLabel] = useState('');

  const bottomRef  = useRef(null);
  const idleTimer  = useRef(null);
  const microTimer = useRef(null);

  const pageCtx = PAGE_CONTEXT[location.pathname] ?? PAGE_CONTEXT['/'];

  const [chat, setChat] = useState([{
    from: 'buddy',
    text: pageCtx.greeting,
    sub: pageCtx.sub
  }]);

  /* ── Utility: add buddy message ── */
  const addBuddy = useCallback((text, delay = 0) => {
    setTimeout(() => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setChat(c => [...c, { from: 'buddy', text }]);
      }, 900);
    }, delay);
  }, []);

  /* ── Utility: multi-message sequence ── */
  const sendSequence = useCallback((msgs, startDelay = 0) => {
    msgs.forEach((msg, i) => addBuddy(msg, startDelay + i * 1100));
  }, [addBuddy]);

  /* ── Utility: show floating bubble ── */
  const showBubble = useCallback((msgs, label = '') => {
    setBubbleMsgs(msgs);
    setTriggerLabel(label);
    setIntro(true);
    const t = setTimeout(() => setIntro(false), 8000);
    return () => clearTimeout(t);
  }, []);

  /* ── TRIGGER 1: Entry (A/B tested) ── */
  useEffect(() => {
    const variant = AB_VARIANT === 'A' ? MESSAGES.entryA : MESSAGES.entryB;
    const t = setTimeout(() => showBubble(variant, 'entry'), 2500);
    return () => clearTimeout(t);
  }, []);

  /* ── TRIGGER 7: Idle detection ── */
  const resetIdleTimer = useCallback(() => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      if (!open) {
        const msg = MESSAGES.idle[Math.floor(Math.random() * MESSAGES.idle.length)];
        showBubble([msg], 'idle');
      }
    }, 12000);
  }, [open, showBubble]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(e => window.addEventListener(e, resetIdleTimer, { passive: true }));
    resetIdleTimer();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetIdleTimer));
      clearTimeout(idleTimer.current);
    };
  }, [resetIdleTimer]);

  /* ── TRIGGER 8: Exit intent ── */
  useEffect(() => {
    const handleMouseOut = (e) => {
      if (e.clientY < 10 && !open) {
        showBubble(MESSAGES.exitIntent, 'exit');
      }
    };
    document.addEventListener('mouseleave', handleMouseOut);
    return () => document.removeEventListener('mouseleave', handleMouseOut);
  }, [open, showBubble]);

  /* ── TRIGGER 4: Add to Cart event ── */
  useEffect(() => {
    const handler = (e) => {
      const msgs = e.detail?.name
        ? MESSAGES.addToCartProduct(e.detail.name)
        : MESSAGES.addToCart;
      showBubble(msgs, 'cart');
      setExpr('excited');
      setTimeout(() => setExpr('happy'), 4000);
      if (open) {
        sendSequence(msgs, 300);
      }
    };
    window.addEventListener('sprout:addToCart', handler);
    return () => window.removeEventListener('sprout:addToCart', handler);
  }, [open, showBubble, sendSequence]);

  /* ── TRIGGER 5: Product view event ── */
  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.name && !open) {
        showBubble(MESSAGES.productView(e.detail.name), 'product');
      }
    };
    window.addEventListener('sprout:productView', handler);
    return () => window.removeEventListener('sprout:productView', handler);
  }, [open, showBubble]);

  /* ── TRIGGER 9: Post purchase ── */
  useEffect(() => {
    const handler = () => {
      showBubble(MESSAGES.postPurchase, 'purchase');
      setExpr('excited');
      if (open) sendSequence(MESSAGES.postPurchase, 300);
    };
    window.addEventListener('sprout:purchased', handler);
    return () => window.removeEventListener('sprout:purchased', handler);
  }, [open, showBubble, sendSequence]);

  /* ── TRIGGER: Manual Open event ── */
  useEffect(() => {
    const handler = () => {
      setOpen(true);
      setNotif(false);
      setIntro(false);
    };
    window.addEventListener('sprout:open', handler);
    return () => window.removeEventListener('sprout:open', handler);
  }, []);

  /* ── Page change: reset + context message ── */
  useEffect(() => {
    setChat([{ from: 'buddy', text: pageCtx.greeting, sub: pageCtx.sub }]);
    setOpen(false); setIntro(false); setShowQR(true); setFirstClick(true);

    if (location.pathname === '/gifting') {
      setTimeout(() => showBubble(MESSAGES.gifting, 'gifting'), 1500);
    }
  }, [location.pathname]);

  /* ── TRIGGER 10: Micro personality (random interval) ── */
  useEffect(() => {
    const schedule = () => {
      microTimer.current = setTimeout(() => {
        if (!open && !intro) {
          const msg = MESSAGES.micro[Math.floor(Math.random() * MESSAGES.micro.length)];
          showBubble([msg], 'micro');
        }
        schedule();
      }, 30000 + Math.random() * 20000);
    };
    schedule();
    return () => clearTimeout(microTimer.current);
  }, [open, intro, showBubble]);

  /* ── Eye blink ── */
  useEffect(() => {
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  /* ── Auto scroll ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, typing]);

  /* ── Send message ── */
  const send = async (overrideText) => {
    const txt = (overrideText || input).trim();
    if (!txt) return;
    setShowQR(false);
    setChat(c => [...c, { from: 'user', text: txt }]);
    setInput('');
    setExpr('thinking');
    setTyping(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || '/api/v1'}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: txt })
      });
      const data = await res.json();
      
      setTyping(false);
      setExpr('happy');

      if (data.success) {
        setChat(c => [...c, { from: 'buddy', text: data.reply }]);
      } else {
        setChat(c => [...c, { from: 'buddy', text: getSmartReply(txt) }]);
      }
    } catch (err) {
      console.error('AI Error:', err);
      setTyping(false);
      setExpr('sad');
      setChat(c => [...c, { from: 'buddy', text: "Should I arrange a callback from our team so that we can help you choose the product?" }]);
    }
  };

  /* ── TRIGGER 2: First click ── */
  const handleRobotClick = () => {
    if (firstClick && !open) {
      setFirstClick(false);
      setOpen(true);
      setIntro(false);
      setNotif(false);
      setTimeout(() => {
        sendSequence(MESSAGES.firstClick, 200);
      }, 400);
      return;
    }
    setOpen(o => !o);
    setIntro(false);
    setNotif(false);
  };

  const bubbleIcon = {
    entry: '🌿', cart: '💚', product: '👀', gifting: '🎁',
    idle: '😊', exit: '🌍', purchase: '🌱', micro: '🌿', '': '🌿'
  };

  const quickReplies = [
    { label: '🌿 Best eco products', msg: 'Show me your best eco products' },
    { label: '🎁 Gift ideas', msg: 'I need gift ideas' },
    { label: '🚚 Shipping info', msg: 'Tell me about shipping' },
    { label: '♻️ How you help the planet', msg: 'What is your environmental impact' },
  ];

  return (
    <div className="sp-wrap">

      {/* ── CHAT PANEL ── */}
      {open && (
        <div className="sp-panel">
          <div className="sp-header">
            <MiniSprout/>
            <div className="sp-hinfo">
              <span className="sp-hname">Sapling Seeds Assistant</span>
              <span className="sp-hsub">Your Eco Companion 🌿</span>
              <span className="sp-honline">● Online — always here for you</span>
            </div>
            <button className="sp-hclose" onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* A/B badge */}
          <div className="sp-ab-badge">
            {AB_VARIANT === 'A' ? '💚 Emotional journey mode' : '🎯 Direct mode'} · Powered by Real-time AI
          </div>

          {showQR && (
            <div className="sp-qr">
              {quickReplies.map((qr, i) => (
                <button key={i} className="sp-qbtn" onClick={() => send(qr.msg)}>{qr.label}</button>
              ))}
            </div>
          )}

          <div className="sp-msgs">
            {chat.map((m, i) => (
              <div key={i} className={`sp-msg${m.from === 'user' ? ' user' : ''}`}>
                {m.from === 'buddy' && <div className="sp-av">🌿</div>}
                <div className="sp-bbl-wrap">
                  <span className="sp-bbl">{m.text}</span>
                  {m.sub && <span className="sp-bbl-sub">{m.sub}</span>}
                </div>
              </div>
            ))}
            {typing && (
              <div className="sp-msg">
                <div className="sp-av">🌿</div>
                <TypingDots/>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          <div className="sp-inp-row">
            <input
              className="sp-inp"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask Sprout anything…"
              autoFocus
            />
            <button className="sp-send" onClick={() => send()}>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
            </button>
          </div>
          <div className="sp-footer">🌱 Small swaps · Big impact · Carbon-neutral delivery</div>
        </div>
      )}

      {/* ── FLOATING BUBBLE ── */}
      {!open && intro && bubbleMsgs.length > 0 && (
        <div className="sp-bubble" onClick={() => { setOpen(true); setIntro(false); setNotif(false); }}>
          <div className="sp-bubble-inner">
            <span className="sp-bubble-icon">{bubbleIcon[triggerLabel]}</span>
            <div className="sp-bubble-text">
              {bubbleMsgs.map((msg, i) => (
                <p key={i} className={i === 0 ? 'sp-bubble-main' : 'sp-bubble-line'}>{msg}</p>
              ))}
            </div>
          </div>
          <button className="sp-bx" onClick={e => { e.stopPropagation(); setIntro(false); }}>✕</button>
        </div>
      )}

      {/* ══ SPROUT ROBOT ══ */}
      <div
        className={`sp-robot ${expression}`}
        onClick={handleRobotClick}
        title="Chat with Sprout"
      >
        <SproutSVG blink={blink} expression={expression}/>
        {notif && !open && <div className="sp-notif"/>}
      </div>
    </div>
  );
};

export default BambooBuddy;

/* ══════════════════════════════════════════
   HOW TO FIRE EVENTS FROM YOUR WEBSITE:

   // When user adds to cart:
   window.dispatchEvent(new CustomEvent('sprout:addToCart', {
     detail: { name: 'Bamboo Toothbrush Set' }
   }));

   // When user views a product:
   window.dispatchEvent(new CustomEvent('sprout:productView', {
     detail: { name: 'Beeswax Wrap' }
   }));

   // After successful purchase:
   window.dispatchEvent(new CustomEvent('sprout:purchased'));
══════════════════════════════════════════ */