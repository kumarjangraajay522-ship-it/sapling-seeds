import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { assets } from '../assets/assets';
import './WhyBamboo.css';

const steps = [
  { 
    id: 1, 
    title: 'Share Needs', 
    subtitle: 'Step 01',
    desc: 'Tell us your needs and team size. We tailor our bamboo options to perfectly match your specific corporate requirements.',
    color: '#E8F5E9'
  },
  { 
    id: 2, 
    title: 'Get Mockups', 
    subtitle: 'Step 02',
    desc: 'Preview custom designs instantly. Our design lab creates digital mockups so you can visualize the final product on your desk.',
    color: '#F1F8E9'
  },
  { 
    id: 3, 
    title: 'Approve', 
    subtitle: 'Step 03',
    desc: 'Finalize designs for production. One click approval starts the sustainable manufacturing process in our dedicated facility.',
    color: '#FFF9C4'
  },
  { 
    id: 4, 
    title: 'Delivery', 
    subtitle: 'Step 04',
    desc: 'Fast delivery to your doorstep. We prioritize eco-friendly shipping methods to ensure your gift reaches you with minimal footprint.',
    color: '#E0F2F1'
  },
];

const WhyBamboo = () => {
  const [activeStep, setActiveStep] = useState(1);

  const activeData = steps.find(s => s.id === activeStep);

  return (
    <section className="premium-feature-showcase">
      <div className="showcase-container">
        
        {/* Main Framer-Style Card */}
        <div className="framer-main-card">
          
          {/* Left Column: Narrative & Selectors */}
          <div className="showcase-left">
            <header className="showcase-header">
              <span className="showcase-badge">PROCESS</span>
              <h2 className="showcase-main-title">Modern <span className="gifting">Gifting</span> <br/>Made Simple.</h2>
            </header>

            <div className="steps-selector-list">
              {steps.map((step) => (
                <button 
                  key={step.id} 
                  className={`step-selector-item ${activeStep === step.id ? 'active' : ''}`}
                  onClick={() => setActiveStep(step.id)}
                >
                  <div className="step-selector-content">
                    <span className="step-number">{step.subtitle}</span>
                    <h3 className="step-name">{step.title}</h3>
                    <AnimatePresence>
                      {activeStep === step.id && (
                        <motion.p 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="step-description-small"
                        >
                          {step.desc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  {activeStep === step.id && (
                    <motion.div layoutId="active-pill" className="active-pill-tracker" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Stage */}
          <div className="showcase-right" style={{ backgroundColor: activeData.color }}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeStep}
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="visual-stage-content"
              >
                {/* Dynamic Graphics for each step */}
                {activeStep === 1 && <ShareNeedsVisual />}
                {activeStep === 2 && <GetMockupsVisual />}
                {activeStep === 3 && <ApproveVisual />}
                {activeStep === 4 && <DeliveryVisual />}
              </motion.div>
            </AnimatePresence>

            {/* Floating Brand Elements */}
            <div className="floating-accent-1">🌿</div>
            <div className="floating-accent-2">✨</div>
          </div>

        </div>

      </div>
    </section>
  );
};

// --- SUB-COMPONENTS FOR VISUALS ---

const ShareNeedsVisual = () => (
  <div className="visual-mockup-canvas">
    <div className="canvas-main-preview" style={{ padding: '0', background: 'transparent', boxShadow: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
         <img 
           src={assets.websiteCstImage} 
           alt="Share Needs Visual" 
           loading="lazy"
           decoding="async"
           style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
         />
      </div>
    </div>
  </div>
);

const GetMockupsVisual = () => (
  <div className="visual-mockup-canvas">
    <div className="canvas-main-preview">
      <div className="bamboo-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '15px' }}>
           <img 
             src={assets.BOTTLE} 
             alt="Mockup Preview" 
             loading="lazy"
             decoding="async"
             style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
           />
      </div>
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }} 
        transition={{ repeat: Infinity, duration: 4 }}
        className="design-token"
      >
        <img src={assets.logo} alt="Sapling Logo" className="visual-logo-small" loading="lazy" decoding="async" />
      </motion.div>
    </div>
    <div className="mock-ui-layers">
      <div className="layer-item">Front Side</div>
      <div className="layer-item active">Texture Detail</div>
      <div className="layer-item">Packaging</div>
    </div>
  </div>
);

const ApproveVisual = () => (
  <div className="visual-success-seal">
    <motion.div 
      initial={{ scale: 0, rotate: -45 }} 
      animate={{ scale: 1, rotate: 0 }} 
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="bamboo-success-ring"
    >
      <div className="checkmark-inner">✓</div>
    </motion.div>
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="approval-text"
    >
       <div style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '4px' }}>DESIGN APPROVED</div>
       <p>Moving to Production</p>
    </motion.div>
    <div className="production-bars">
      <motion.div 
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ delay: 0.6, duration: 1.5, ease: "easeInOut" }}
        className="prod-bar-fill" 
        style={{ background: 'var(--color-accent)' }}
      />
    </div>
  </div>
);

const DeliveryVisual = () => (
  <div className="visual-tracking-stage">
     <div className="tracking-path">
        <motion.div 
          animate={{ x: ['0%', '600%'] }} 
          transition={{ repeat: Infinity, duration: 3, repeatType: "reverse", ease: "easeInOut" }}
          className="tracking-box"
        >
          📦
        </motion.div>
     </div>
     <div className="delivery-status-card">
        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>OUT FOR DELIVERY</div>
        <p>Your sustainable gifts are arriving today.</p>
     </div>
  </div>
);

export default WhyBamboo;