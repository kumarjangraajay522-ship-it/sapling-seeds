import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Play, CheckCircle, ArrowRight, Star } from 'lucide-react';
import './CourseCard.css';
import { resolveImageUrl } from '../utils/imageUtils';
import { assets } from '../assets/assets';
const CourseCard = ({ course }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const navigate = useNavigate();

  // ── Physics-Based Motion Tracking ───────────────────────────
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for a premium "heavy" feel
  const springConfig = { stiffness: 100, damping: 30, mass: 1 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  // Transform normalized mouse position to degrees and pixels
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  
  // Internal parallax layers
  const textTranslateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-15px", "15px"]);
  const textTranslateY = useTransform(mouseYSpring, [-0.5, 0.5], ["-15px", "15px"]);
  const imgScale = useTransform(isHovered ? mouseXSpring : x, [-0.5, 0.5], [1.1, 1.15]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Normalize mouse position from -0.5 to 0.5
    const width = rect.width;
    const height = rect.height;
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div className="card-perspective-wrapper">
      <motion.div 
        ref={cardRef}
        className="premium-course-card-3d"
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* LAYER 1: Media Preview (Deepest) */}
        <div className="card-media-section-3d">
          <motion.div className="media-container absolute inset-0 overflow-hidden" style={{ scale: imgScale }}>
            <img 
              src={resolveImageUrl(assets.cursor, course.title)} 
              alt={course.title} 
              loading="lazy"
              decoding="async"
              className="course-image-3d h-full w-full object-cover" 
            />
            {/* Play Button Overlay */}
            <AnimatePresence>
              {!isHovered && (
                <motion.div 
                  className="play-icon-overlay absolute inset-0 flex items-center justify-center bg-black/10 z-20"
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <button 
                    className="w-14 h-14 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors pointer-events-auto"
                    onClick={() => navigate('/collection')}
                    aria-label="Play Course Preview"
                  >
                    <Play fill="white" size={24} className="text-white ml-1" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* LAYER 2: Main Content (Middle Depth) */}
        <motion.div 
          className="card-content-section-3d relative z-10" 
          style={{ x: textTranslateX, y: textTranslateY }}
        >
          <div className="content-inner" style={{ transform: "translateZ(60px)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Star size={12} fill="#c8a84b" className="text-[#c8a84b]" />
              <span className="category-tag-3d">{course.category || "Featured Item"}</span>
            </div>
            
            <h3 className="course-title-3d">{course.title}</h3>
            
            <div className="features-grid-3d">
              {course.features.map((f, i) => (
                <div key={i} className="feature-item-3d">
                  <CheckCircle size={14} className="text-[#4caf50]" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LAYER 3: Call to Action (Frontmost Depth) */}
          <div className="card-footer-3d" style={{ transform: "translateZ(100px)" }}>
            <div className="pricing-box-3d">
              <span className="current-price-3d">{course.price}</span>
              <span className="old-price-3d">{course.oldPrice}</span>
            </div>
            
            <Link to="/collection" className="cta-button-3d group relative z-50">
              <span>Shop Now</span>
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
        
        {/* Dynamic Light/Glare Reflection */}
        <motion.div 
          className="card-glare"
          style={{
            opacity: isHovered ? 0.2 : 0,
            background: useTransform(
              mouseXSpring, 
              [-0.5, 0.5], 
              [
                "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.8) 0%, transparent 60%)",
                "radial-gradient(circle at 100% 100%, rgba(255,255,255,0.8) 0%, transparent 60%)"
              ]
            )
          }}
        />
      </motion.div>
    </div>
  );
};

export default CourseCard;
