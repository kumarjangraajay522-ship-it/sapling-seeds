import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import './WhatWeSell.css';

const CATEGORIES = [
  {
    id: 1,
    title: "Bamboo Gifting",
    desc: "Curated gift sets for every occasion.",
    details: "Our premium bamboo gifting range is perfect for corporate events, weddings, or personal milestones. Each set is handcrafted and packaged beautifully in zero-waste materials, making it a thoughtful and sustainable choice.",
    image: assets.giftSet1,
    link: "/gifting"
  },
  {
    id: 2,
    title: "Natural Hair Care",
    desc: "Pure Neem wood combs for healthy hair.",
    details: "Experience the benefits of natural Neem wood. Our handcrafted combs stimulate the scalp, reduce dandruff, and prevent hair breakage. Treated with natural oils for a smooth, static-free experience.",
    image: assets.neemDualLily,
    link: "/collection"
  },
  {
    id: 3,
    title: "Eco-Stationery",
    desc: "Plantable notebooks and seed pencils.",
    details: "Transform the way you write. Our eco-stationery includes recycled paper notebooks and pencils that can be planted after use to grow herbs and vegetables, bringing nature right to your desk.",
    image: assets.plantableA5Notebook,
    link: "/collection"
  },
  {
    id: 4,
    title: "Sustainable Living",
    desc: "Bamboo bottles and reusable tumblers.",
    details: "Ditch single-use plastics with our durable and stylish bamboo bottles and tumblers. Designed to keep your beverages fresh while reducing your carbon footprint every single day.",
    image: assets.BOTTLE,
    link: "/collection"
  }
];

const WhatWeSell = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <section className="wws-section">
      <div className="wws-container">
        <header className="wws-header">
          <span className="wws-badge">OUR RANGE</span>
          <h2 className="wws-title">What We Sell?</h2>
          <p className="wws-subtitle">Explore our handcrafted range of sustainable essentials.</p>
        </header>

        <div className="wws-grid">
          {CATEGORIES.map((cat, index) => (
            <motion.div 
              key={cat.id}
              className="wws-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="wws-card-image">
                <img src={cat.image} alt={cat.title} width="651" height="651" loading="lazy" decoding="async" />
                <div className="wws-overlay">
                  <button onClick={() => setSelectedCategory(cat)} className="wws-view-btn">View Details</button>
                </div>
              </div>
              <div className="wws-card-content">
                <h3>{cat.title}</h3>
                <p>{cat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div 
            className="wws-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div 
              className="wws-modal-content"
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="wws-modal-close" onClick={() => setSelectedCategory(null)} aria-label="Close modal">&times;</button>
              <div className="wws-modal-image">
                <img src={selectedCategory.image} alt={selectedCategory.title} width="651" height="651" loading="lazy" decoding="async" />
              </div>
              <div className="wws-modal-text">
                <h3>{selectedCategory.title}</h3>
                <p>{selectedCategory.details}</p>
                <Link to={selectedCategory.link} className="wws-modal-btn" onClick={() => window.scrollTo(0, 0)}>
                  Explore Full Range
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default WhatWeSell;
