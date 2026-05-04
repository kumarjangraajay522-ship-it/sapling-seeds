import React from 'react';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets'; // Ensure assets.js exports individual logos
import './OurClients.css';

const OurClients = () => {
  // Data structure for individual client logos
  const clientsData = [
    { src: assets.namanLogo, alt: "NAMAN Corporate Services" },
    { src: assets.unitedLogo, alt: "United Consultancy Services" },
    { src: assets.amritaLogo, alt: "Amrita Hospital" },
    { src: assets.sarvodayaLogo, alt: "Sarvodaya Healthcare" },
    { src: assets.gubbLogo, alt: "GUBB" },
    { src: assets.midazzleLogo, alt: "MiDazzle Mi Makeup Mi Way" },
    { src: assets.cvent, alt: "Cvent Event Management Platform" },
    { src: assets.sf, alt: "SF — Sapling & Seeds Partner" }
    // Add more clients here as needed
  ];

  // Framer Motion variants for stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Increased stagger time for more dramatic effect
        delayChildren: 0.2, // Delay before starting children animations
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.8,
      },
    },
  };

  return (
    <motion.section
      className="our-clients-section"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div className="our-clients-container">
        <motion.div
          className="our-clients-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <span className="clients-badge">PARTNERSHIPS</span>
          <h2 className="clients-title">Trusted by <span className="highlight-green">Industry Leaders</span></h2>
        </motion.div>

        <motion.div
          className="clients-logo-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }} // Trigger when 20% of the grid is visible
        >
          {clientsData.map((client, index) => (
            <motion.div
              key={index}
              className="client-logo-tile"
              variants={logoVariants}
              whileHover={{
                scale: 1.05,
                rotate: 2,
                boxShadow: "0px 15px 40px rgba(6, 83, 6, 0.2)", // Enhanced green-tinted shadow on hover
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src={client.src}
                alt={client.alt}
                className="client-logo-img"
                width="200"
                height="100"
                loading="lazy"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default OurClients;