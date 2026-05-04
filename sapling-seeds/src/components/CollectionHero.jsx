import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { assets } from '../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';
import './CollectionHero.css';

const PRODUCTS = [
  {
    id: 1,
    tag: "FEATURED COLLECTION",
    title: "Premium Bamboo Gift Sets",
    description: "Thoughtfully curated bamboo gifting experiences — perfect for corporate events, festivals, and loved ones who value the planet.",
    features: ["100% Natural Bamboo", "Zero Plastic Packaging", "Corporate Ready", "Custom Branding"],
    price: "Starting from ₹150",
    originalPrice: "",
    image: assets.giftSet1,
    bg: "#ddccb8ff",
  },
  {
    id: 2,
    tag: "BEST SELLER",
    title: "Neem Hair Care Collection",
    description: "Handcrafted from pure Neem wood, our combs and hair tools strengthen roots, reduce breakage, and keep plastic out of your routine.",
    features: ["Pure Neem Wood", "Anti-Bacterial", "Eco Certified", "Plastic-Free"],
    price: "Starting from ₹49",
    originalPrice: "",
    image: assets.neemDualLily,
    bg: "#ddccb8ff",
  },
  {
    id: 3,
    tag: "NEW ARRIVAL",
    title: "Eco Stationery Range",
    description: "From plantable notebooks to seed pencils — stationery that grows when you're done with it. Write today, plant tomorrow.",
    features: ["Plantable Paper", "Seed Pencils", "Recycled Packaging", "School & Office"],
    price: "Starting from ₹99",
    originalPrice: "",
    image: assets.plantableA5Notebook,
    bg: "#ddccb8ff",
  },
];

const CheckIcon = () => (
  <svg className="ch-check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
  </svg>
);

const CartIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ArrowIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const CollectionHero = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [toast, setToast] = useState({ show: false, product: null });
  const timeoutRef = useRef(null);

  const handleAddToCart = (product) => {
    const cartItem = {
      _id: `ch-${product.id}`,
      name: product.title,
      price: parseInt(product.price.replace(/\D/g, ''), 10),
      image: product.image,
      category: 'Collection',
    };
    addToCart(cartItem);
    
    // Dispatch custom event for BambooBuddy to acknowledge
    window.dispatchEvent(new CustomEvent('sprout:addToCart', { detail: { name: product.title } }));
    
    // Show Awesome Toast
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast({ show: true, product });
    timeoutRef.current = setTimeout(() => setToast({ show: false, product: null }), 3500);
  };

  const handleShopNow = (product) => {
    handleAddToCart(product);
    navigate('/cart');
  };

  return (
    <div className="ch-root">
      {/* ── Intro ── */}
      <div className="ch-intro">
        <h2 className="ch-intro-title">Our Bestselling Collections</h2>
        <p className="ch-intro-sub">
          Each product is a step towards a plastic-free world — crafted with care, bamboo, and purpose.
        </p>
      </div>

      {/* ── Anti-Gravity Stacking Stage ── */}
      <div className="ch-stage">
        {PRODUCTS.map((product, index) => (
          <div
            key={product.id}
            className="ch-card"
            style={{ 
              backgroundColor: product.bg,
              // The sticky offset logic: each card stops slightly lower than the one before it
              top: `calc(10vh + ${index * 30}px)` 
            }}
          >
            {/* Left: Image */}
            <div className="ch-card-image-col">
              <div className="ch-card-image-wrap">
                <img src={product.image} alt={product.title} className="ch-card-img" width="651" height="651" loading="lazy" decoding="async" />
              </div>
            </div>

            {/* Right: Content */}
            <div className="ch-card-content">
              <div className="ch-tag">
                <span className="ch-tag-star">✦</span> {product.tag}
              </div>

              <h3 className="ch-card-title">{product.title}</h3>
              <p className="ch-card-desc">{product.description}</p>

              <ul className="ch-features">
                {product.features.map((f, i) => (
                  <li key={i} className="ch-feature-item">
                    <span className="ch-feature-dot"><CheckIcon /></span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="ch-footer">
                <div className="ch-prices">
                  <span className="ch-price-current">{product.price}</span>
                  <span className="ch-price-original">{product.originalPrice}</span>
                </div>
                <div className="ch-actions">
                  <button className="ch-btn-icon" aria-label="Add to cart" onClick={() => handleAddToCart(product)}>
                    <CartIcon />
                  </button>
                  <button className="ch-btn-primary" onClick={() => handleShopNow(product)}>
                    SHOP NOW <ArrowIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Awesome Custom Toast ── */}
      <div className="ch-toast-container">
        <AnimatePresence>
          {toast.show && toast.product && (
            <motion.div
              className="ch-toast"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="ch-toast-img-wrap">
                <img src={toast.product.image} alt={toast.product.title} />
              </div>
              <div className="ch-toast-content">
                <span className="ch-toast-title">Added to Cart! 🌿</span>
                <span className="ch-toast-name">{toast.product.title}</span>
              </div>
              <button className="ch-toast-close" onClick={() => setToast({ show: false, product: null })}>✕</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CollectionHero;