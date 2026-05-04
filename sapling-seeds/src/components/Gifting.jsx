import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Gifting.css';
import { assets } from '../assets/assets';
import { resolveImageUrl } from '../utils/imageUtils';

const STATIC_GIFTING = [
  { id: 's1', name: 'Bamboo Diary with Pen', category: 'Stationery', image: assets.dairyWithPen },
  { id: 's2', name: 'Bamboo Notepad Combo', category: 'Stationery', image: assets.plantableA5Notebook },
  { id: 's3', name: 'Bamboo Diary, Bottle & Pen', category: 'Gift Set', image: assets.giftSet1 },
  { id: 's4', name: 'Bamboo Diary & Bottle (500 ML)', category: 'Gift Set', image: assets.giftSet2 },
  { id: 's5', name: 'Bamboo Tumbler (450 ML)', category: 'Drinkware', image: assets.tumbler1 },
  { id: 's6', name: 'Bamboo Coffee Mug (260 ML)', category: 'Drinkware', image: assets.coffeeMug },
  { id: 's7', name: 'Bamboo Wheat Fibre Mug (450 ML)', category: 'Drinkware', image: assets.corkMug },
  { id: 's8', name: 'Bamboo Pen with Box', category: 'Stationery', image: assets.penWithBox },
];

const Gifting = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [products, setProducts] = useState(STATIC_GIFTING);
  const [loading, setLoading] = useState(true);

  const API_URL = '/api/v1';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products?limit=100`);
        const data = await res.json();
        if (data.success) {
          // Filter for gifting items AND ensure they are in stock
          const dynamicGifting = data.data.filter(p => 
            (p.isGifting || ['Gift Set', 'Gifting', 'Combo'].includes(p.category)) && 
            p.stock > 0 && 
            p.isActive !== false
          );
          
          if (dynamicGifting.length > 0) {
            setProducts(dynamicGifting);
          } else {
            setProducts(STATIC_GIFTING);
          }
        }
      } catch (error) {
        console.error('Failed to fetch gifting products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="eco-container">
      {/* Header Section */}
      <header className="eco-header">
        <div className="brand-title">
          <h1>
            Eco <span style={{ color: '#436901' }}>Gifting</span>
          </h1>
        </div>
        <div className="brand-tagline">
          <p style={{ marginTop: '0', position: 'relative', zIndex: 2 }}>A Change for a Greener Tomorrow</p>
        </div>
      </header>

      {/* Main Products Catalog */}
      <section className="catalog-section">
        <h2 className="section-title">Our Eco-Friendly Collection</h2>
        <div className="product-grid">
          {loading ? (
            <p>Loading collection...</p>
          ) : products.length > 0 ? (
            products.map((product) => (
              <div className="product-card" key={product._id || product.id} onClick={() => setSelectedProduct(product)} style={{ cursor: 'pointer' }}>
                <div className="product-image-container">
                  <img src={resolveImageUrl(product.image, product.name)} alt={product.name} className="product-img" />
                </div>
                <div className="product-details">
                  <span className="product-category">{product.category}</span>
                  <h4>{product.name}</h4>
                </div>
              </div>
            ))
          ) : (
            <p>No eco-friendly items found in this category.</p>
          )}
              </div>
      </section>

      {/* Special Feature: Plantable Calendar */}
      <section className="special-feature-section">
        <div className="feature-image">
          <img src={assets.plantableCalendar} alt="Plantable Calendar" />
        </div>
        <div className="feature-content">
          <h3 style={{ }}>Plantable Calendar</h3>
          <p>Start the year right with our custom Amar Constructions January 2026 edition.</p>
          <p className="feature-note">Once the month is over, plant the page and watch it grow!</p>
        </div>
      </section>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="gifting-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div
              className="gifting-modal"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#fff', borderRadius: '24px', maxWidth: '800px', width: '100%', display: 'flex', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', position: 'relative' }}
            >
              <button onClick={() => setSelectedProduct(null)} aria-label="Close" style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.05)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>×</button>
              
              <div style={{ flex: '1', minHeight: '300px', backgroundColor: '#fdfaf3' }}>
                <img src={resolveImageUrl(selectedProduct.image, selectedProduct.name)} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              
              <div style={{ flex: '1.2', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p style={{ color: '#065306', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{selectedProduct.category}</p>
                <h2 style={{ fontSize: '2.4rem', color: '#1a231a', marginBottom: '16px', lineHeight: '1.2', }}>{selectedProduct.name}</h2>
                <p style={{ color: '#556b55', fontSize: '1rem', lineHeight: '1.6', marginBottom: '24px' }}>
                  Premium corporate gifting option meticulously crafted from sustainable materials. Give a gift that leaves a lasting impression without leaving a footprint on the planet.
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px' }}>
                  <span style={{ padding: '6px 12px', background: '#f1f8e9', color: '#2e7d32', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>🌿 Eco-Friendly</span>
                  <span style={{ padding: '6px 12px', background: '#e3f2fd', color: '#1565c0', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>✨ Premium Quality</span>
                  <span style={{ padding: '6px 12px', background: '#fff9c4', color: '#f57f17', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>🎁 Custom Branding</span>
                </div>
                <button 
                  onClick={() => navigate('/contact')}
                  style={{ background: '#065306', color: '#fff', border: 'none', padding: '16px 24px', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#0a730a'}
                  onMouseLeave={e => e.currentTarget.style.background = '#065306'}
                >
                  ✉️ Enquire for Bulk Pricing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gifting;