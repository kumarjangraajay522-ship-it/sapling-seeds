import React from 'react';
import { motion } from 'framer-motion';
import './OurStory.css';

const OurStory = () => {
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60, damping: 15 } } };

  return (
    <section className="premium-story-container">
      <motion.div className="floating-leaf leaf-a" animate={{ y: [0, -25, 0], rotate: [0, 8, -8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>🍃</motion.div>
      <motion.div className="floating-leaf leaf-b" animate={{ y: [0, 35, 0], x: [0, -15, 0], rotate: [0, -12, 6, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>🌿</motion.div>

      <motion.div className="story-content-wrapper" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
        <motion.h2 variants={itemVariants} className="premium-story-title">Our Story and Team</motion.h2>
        <motion.div variants={itemVariants} className="premium-story-text">
          <p>Founded by Sanchu & Daisy in 2023, <span className="text-highlight">SHANAH ENTERPRISES</span> emerged from a passion for environmental stewardship and a desire to provide eco-friendly alternatives to conventional products. What started as a small initiative has grown into a thriving business, thanks to our commitment to quality, sustainability, and innovation.</p>
        </motion.div>

        <motion.h2 variants={itemVariants} className="premium-story-title">Our Commitment</motion.h2>
        <motion.div variants={itemVariants} className="premium-story-text">
          <p>We are committed to transparency, quality, and ethical practices. From the sourcing of raw materials to the final product, we take every step to ensure our processes are sustainable and our products meet the highest standards. Our goal is to inspire a shift towards more eco-conscious living, one bamboo product at a time.</p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default OurStory;