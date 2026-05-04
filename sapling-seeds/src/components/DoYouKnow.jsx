import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// --- Assuming TOOTHBRUSH.png is in your assets/images folder ---
import toothbrushImg from '../assets/TOOTHBRUSH.png';
import toothbrushImg1 from '../assets/TOOTHBRUSH_1.png';
import './DoYouKnow.css';

const DidYouKnow = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60, damping: 15 } }
  };

  // Add a simple animation for the toothbrush image itself
  const toothbrushVariants = {
    animate: {
      rotate: [0, -5, 5, 0], // Subtle back-and-forth tilt
      y: [0, -10, 10, 0], // Subtle up-and-down movement
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="dyk-container">
      {/* Background ambient glow and giant quotes */}
      <div className="dyk-glow-blob"></div>
      <div className="dyk-bg-quote dyk-quote-left">"</div>
      <div className="dyk-bg-quote dyk-quote-right">"</div>

      {/* Floating Leaves */}
      <motion.div className="floating-leaf leaf-a" animate={{ y: [0, -25, 0], rotate: [0, 8, -8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>🍃</motion.div>
      <motion.div className="floating-leaf leaf-b" animate={{ y: [0, 35, 0], x: [0, -15, 0], rotate: [0, -12, 6, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>🌿</motion.div>

      <motion.div
        className="dyk-content"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          variants={itemVariants}
          className="dyk-heading"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Do you know ?
        </motion.h2>

        {/* Updated Showcase with Toothbrush Image on the left */}
        <motion.div variants={itemVariants} className="dyk-impact-showcase-wrapper">
          <motion.img
            src={toothbrushImg}
            alt="Bamboo Toothbrush"
            className="dyk-toothbrush-img dyk-toothbrush-left"
            variants={toothbrushVariants}
            animate="animate"
            style={{ zIndex: 12 }}
            width="263"
            height="263"
            loading="lazy"
            decoding="async"
          />
          <div className="dyk-impact-showcase">
            <motion.div
              className="dyk-impact-left"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h3 className="dyk-impact-statement">
                Your <span className="dyk-text-red">Plastic</span> <br /> toothbrush will <br />
                <span className="dyk-strike-through">outlive you.</span>
              </h3>
              <p className="dyk-impact-sub">
                It takes over <strong>500 years</strong> to decompose. Every single toothbrush ever made still exists today in our soil or oceans.
              </p>
            </motion.div>

            <div className="dyk-impact-divider"></div>

            <motion.div
              className="dyk-impact-right"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div>
                <span className="dyk-offer-badge">BE PART OF THE SOLUTION</span>

                <h3 className="dyk-offer-text" style={{ textAlign: 'center' }}>
                  Choose Better <br />
                  Get a <span className="dyk-text-green">FREE</span> Bamboo&nbsp;Toothbrush <br />
                  Today
                </h3>
              </div>
            </motion.div>

            {/* Call to Action Button inside the showcase box - Moved to bottom center */}
            <motion.div
              variants={itemVariants}
              className="dyk-button-wrapper"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <a
                href="https://wa.me/919354361055?text=Hi%20Sapling%20%26%20Seeds,%20I%20want%20to%20claim%20my%20free%20gift!"
                target="_blank" 
                rel="noopener noreferrer"
                className="dyk-signup-btn dyk-signup-btn-inside"
                style={{ display: 'inline-block', textDecoration: 'none' }}
              >
                CLAIM YOURS NOW
              </a>
            </motion.div>
          </div>
          <motion.img
            src={toothbrushImg1}
            alt="Bamboo Toothbrush 1"
            className="dyk-toothbrush-img dyk-toothbrush-right"
            variants={toothbrushVariants}
            animate="animate"
            style={{ zIndex: 12 }}
            width="263"
            height="263"
            loading="lazy"
            decoding="async"
          />
        </motion.div>

        {/* Call to Action Button - moved inside showcase */}
      </motion.div>
    </section>
  );
};

export default DidYouKnow;