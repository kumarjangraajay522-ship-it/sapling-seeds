import React from 'react';
import './FeaturesBanner.css';
import { motion } from 'framer-motion';

const features = [
  {
    id: 1,
    icon: '🏷️',
    title: 'Best prices &\noffers',
    subtitle: 'From The Marketplace',
    color: 'green',
    rotate: -3
  },
  {
    id: 2,
    icon: '🚚',
    title: 'On time delivery',
    subtitle: '24/7 amazing services',
    color: 'blue',
    rotate: 2
  },
  {
    id: 3,
    icon: '💰',
    title: 'Great daily deals',
    subtitle: 'When you sign up',
    color: 'yellow',
    rotate: -2
  },
  {
    id: 4,
    icon: '😊',
    title: '500+ Happy Customers',
    subtitle: 'Worldwide',
    color: 'purple',
    rotate: 1
  },
  {
    id: 5,
    icon: '↩️',
    title: 'Easy returns',
    subtitle: 'Within 10 days',
    color: 'pink',
    rotate: 2
  },
  {
    id: 6,
    icon: '⏳',
    title: '  2+ Years ',
    subtitle: ' In Service',
    color: 'green',
    rotate: 2
  }
];

const FeaturesBanner = () => {
  return (
    <div className="features-banner-wrapper">
      <div className="features-banner-container">
        {features.map((feature, i) => (
          <motion.div
            key={feature.id}
            className={`feature-pill pill-${feature.color}`}
            initial={{ y: -400, opacity: 0, scale: 0.6, rotate: feature.rotate - 15 }}
            whileInView={{ y: 0, opacity: 1, scale: 1, rotate: feature.rotate }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 12,
              bounce: 0.6,
              delay: i * 0.2,
            }}
          >
            <div className="feature-icon-box">
              {feature.icon}
            </div>
            <div className="feature-text-stack">
              <h3 className="feature-title" style={{ whiteSpace: 'pre-line' }}>{feature.title}</h3>
              <p className="feature-subtitle">{feature.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesBanner;
