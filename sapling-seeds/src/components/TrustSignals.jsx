import React from 'react';
import { motion } from 'framer-motion';
import './TrustSignals.css';

const STATS = [
  {
    value: "500+",
    label: "Happy Customers",
    desc: "Spreading eco-joy across 20+ countries."
  },
  {
    value: "50+",
    label: "Artisan Families",
    desc: "Empowering rural communities through fair trade."
  },
  {
    value: "100%",
    label: "Plastic-Free",
    desc: "Certified zero-plastic products and packaging."
  },
  {
    value: "4.9/5",
    label: "Average Rating",
    desc: "Trusted for quality and premium finish."
  }
];

const TrustSignals = () => {
  return (
    <section className="ts-section">
      <div className="ts-container">
        <header className="ts-header">
          <motion.span 
            className="ts-badge"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            CONFIDENCE
          </motion.span>
          <motion.h2 
            className="ts-title"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            Why Should You Trust Us?
          </motion.h2>
          <motion.p 
            className="ts-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            We believe in transparency, quality, and real impact.
          </motion.p>
        </header>

        <div className="ts-grid">
          {STATS.map((stat, index) => (
            <motion.div 
              key={index}
              className="ts-card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -12 }}
            >
              <p className="ts-value">{stat.value}</p>
              <h3 className="ts-label">{stat.label}</h3>
              <p className="ts-desc">{stat.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="ts-guarantee">
          <motion.div 
            className="ts-g-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -6, scale: 1.02 }}
          >
            <span className="ts-g-icon">🛡️</span>
            <span>Premium Quality Guarantee</span>
          </motion.div>
          <motion.div 
            className="ts-g-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -6, scale: 1.02 }}
          >
            <span className="ts-g-icon">🔄</span>
            <span>Easy Returns & Replacements</span>
          </motion.div>
          <motion.div 
            className="ts-g-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -6, scale: 1.02 }}
          >
            <span className="ts-g-icon">📦</span>
            <span>Eco-Friendly Secure Shipping</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;
