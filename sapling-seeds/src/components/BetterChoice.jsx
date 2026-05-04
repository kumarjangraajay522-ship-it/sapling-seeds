import React from 'react';
import { motion } from 'framer-motion';
import './BetterChoice.css';

const BENEFITS = [
  {
    title: "Handcrafted Artisanship",
    desc: "Every piece is carved by rural artisans, preserving traditional crafts.",
    icon: "🎨"
  },
  {
    title: "Zero Plastic Policy",
    desc: "From the product core to the final tape on the box, we are 100% plastic-free.",
    icon: "🚫"
  },
  {
    title: "Seed-Infused Magic",
    desc: "Most of our stationery products are infused with seeds so that they can be planted after use.",
    icon: "🌱"
  },
  {
    title: "Carbon Negative",
    desc: "Bamboo absorbs 35% more CO2 than trees, making your choice a win for the climate.",
    icon: "🌍"
  }
];

const BetterChoice = () => {
  return (
    <section className="bc-section">
      <div className="bc-container">
        <div className="bc-content">
          <header className="bc-header">
            <span className="bc-badge">THE ADVANTAGE</span>
            <h2 className="bc-title">Why is it Better?</h2>
            <p className="bc-subtitle">We don't just replace plastic; we offer a superior, soulful alternative.</p>
          </header>

          <div className="bc-grid">
            {BENEFITS.map((benefit, index) => (
              <motion.div 
                key={index}
                className="bc-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bc-icon">{benefit.icon}</div>
                <div className="bc-text">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="bc-visual">
          <div className="bc-image-stack">
            <div className="bc-blob"></div>
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop" alt="Sustainability" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BetterChoice;
