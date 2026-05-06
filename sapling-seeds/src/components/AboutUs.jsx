import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import './AboutUs.css';

const AboutUs = () => {
  const navigate = useNavigate();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60, damping: 15 } }
  };

  return (
    <section className="premium-about-container" id="about-us">
      {/* --- Visual Hero Section --- */}
      <motion.div 
        className="about-hero-image-wrapper"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <img src={assets.aboutHero} alt="Premium Bamboo Products" className="about-hero-img" />
        <div className="about-hero-overlay" />
      </motion.div>

      {/* --- Main Text Content --- */}
      <motion.div
        className="about-content-wrapper"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="about-glass-card">
          <motion.h1 variants={itemVariants} className="premium-about-title">About Us</motion.h1>

          <motion.div variants={itemVariants} className="premium-about-text">
            <p>
              Welcome to <span className="text-highlight">Sapling & Seeds</span> by <span className="text-highlight">Shanah Enterprises</span>, where sustainability meets innovation in every product we create. We are dedicated to crafting high-quality bamboo products that are both eco-friendly and stylish, offering a natural solution to everyday needs.
            </p>
          </motion.div>

          {/* ── ORNAMENT DIVIDER ──────────────────────────────── */}
          <motion.div variants={itemVariants} className="about-ornament" aria-hidden="true">
            <svg viewBox="0 0 320 24" xmlns="http://www.w3.org/2000/svg" fill="none">
              <path d="M0,12 C40,2 80,22 120,12" strokeLinecap="round" />
              <circle cx="160" cy="12" r="3.5" />
              <path d="M200,12 C240,2 280,22 320,12" strokeLinecap="round" />
            </svg>
          </motion.div>

          <motion.h2 variants={itemVariants} className="premium-mission-title">Our Mission</motion.h2>

          <motion.div variants={itemVariants} className="premium-about-text">
            <p>
              At <span className="text-highlight">Sapling & Seeds</span>, our mission is to make sustainable living accessible and enjoyable for everyone. We believe in harnessing the power of bamboo—a versatile, renewable resource—to create products that are not only environmentally responsible but also practical and beautiful.
            </p>
          </motion.div>
        </div>
      </motion.div>

    </section>
  );
};

export default AboutUs;
