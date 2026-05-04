import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { assets } from '../assets/assets';
import './ProductPreview.css';
import { resolveImageUrl } from '../utils/imageUtils';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const STATIC_PRODUCTS = [
  { _id: '660f1b2b3f1a2c3d4e5f6001', name: 'Herbal Neem Combs', price: 150, image: assets.neemrubycomb, category: 'Hair Care' },
  { _id: '660f1b2b3f1a2c3d4e5f6002', name: 'Seed Pen', price: 15, image: assets.seedpen, category: 'Stationery' },
  { _id: '660f1b2b3f1a2c3d4e5f6003', name: 'Wooden Pen', price: 50, image: assets.penWithBox, category: 'Stationery' },
  { _id: '660f1b2b3f1a2c3d4e5f6004', name: 'Adult Toothbrush', price: 50, image: assets.bottomPaintCharcoal, category: 'Oral Care' },
  { _id: '660f1b2b3f1a2c3d4e5f6005', name: 'KIDS Toothbrush', price: 60, image: assets.kidsCharcoal, category: 'Oral Care' },
];

const CATEGORY_ICONS = {
  'Hair Care': '🌿',
  'Stationery': '✏️',
  'Oral Care': '🎋',
  'default': '🌱',
};

const ProductPreview = ({ categoryFilter = 'All', searchTerm = '', onCountChange }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addedIds, setAddedIds] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products?active=true&limit=20`);
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();
        if (data.success && data.data?.length > 0) {
          const backendItems = data.data;
          const remainingStatic = STATIC_PRODUCTS.filter(
            s => !backendItems.some(b => b.name === s.name)
          );
          setProducts([...backendItems, ...remainingStatic]);
        }
      } catch { /* use static fallback */ }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 18 } },
  };

  const getProductImage = (item) => {
    return resolveImageUrl(item.image, item.name);
  };

  const openProduct = (item) => {
    setSelectedProduct(item);
    setAddedToCart(false);
    window.dispatchEvent(new CustomEvent('bb:product', { detail: item }));
  };

  const filtered = products.filter(item => {
    // 🛡️ Hide gifting items from the main shop collection
    if (item.isGifting || ['Gift Set', 'Gifting', 'Combo'].includes(item.category)) return false;

    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch = searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    if (onCountChange) {
      onCountChange(filtered.length);
    }
  }, [filtered.length, onCountChange]);

  return (
    <>
      <section className="pp-section">

        {loading ? (
          <div className="pp-skeleton-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="pp-skeleton">
                <div className="pp-skeleton-shine" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="pp-empty">
            <span>🌿</span>
            <p>No products in this category yet.</p>
          </div>
        ) : (
          <motion.div
            key={categoryFilter}
            className="pp-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filtered.map((item, idx) => {
              const icon = CATEGORY_ICONS[item.category] ?? CATEGORY_ICONS.default;
              const isTall = idx % 4 === 1; // every 4th card starting at index 1 is tall
              const soldOut = item.stock === 0;

              return (
                <motion.article
                  key={item._id}
                  variants={cardVariants}
                  className={`pp-card${isTall ? ' pp-card--tall' : ''}${soldOut ? ' pp-card--oos' : ''}`}
                  onClick={() => openProduct(item)}
                  whileHover={{ y: -10 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                >
                  {/* ── IMAGE AREA ───────────────────────── */}
                  <div className="pp-img-wrap">
                    <img
                      src={getProductImage(item)}
                      alt={item.name}
                      className="pp-img"
                      loading="lazy"
                      decoding="async"
                      onError={e => {
                        e.target.src = 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?q=80&w=800';
                      }}
                    />

                    {/* Category pill */}
                    <div className="pp-pill">
                      <span aria-hidden="true">{icon}</span>
                      {item.category || 'Eco Product'}
                    </div>

                    {/* Hover overlay */}
                    <div className="pp-hover-layer">
                      {!soldOut ? (
                        <button
                          className={`pp-add-btn${addedIds[item._id] ? ' pp-add-btn--done' : ''}`}
                          onClick={e => {
                            e.stopPropagation();
                            if (item.price === 0) { openProduct(item); return; }
                            addToCart(item);
                            setAddedIds(prev => ({ ...prev, [item._id]: true }));
                            setTimeout(() => setAddedIds(prev => {
                              const next = { ...prev }; delete next[item._id]; return next;
                            }), 1500);
                          }}
                        >
                          {addedIds[item._id] ? '✅ Added!' : item.price === 0 ? 'View Details' : '+ Add to Cart'}
                        </button>
                      ) : (
                        <span className="pp-oos-label">Out of Stock</span>
                      )}
                    </div>
                  </div>

                  {/* ── FOOTER ───────────────────────────── */}
                  <div className="pp-foot">
                    <div className="pp-foot-left">
                      <h3 className="pp-name">{item.name}</h3>
                      <p className="pp-price">
                        {item.price > 0 ? <><span className="pp-currency">₹</span>{item.price}</> : <span style={{ fontSize: '0.9rem', color: '#556b55' }}>On Request</span>}
                      </p>
                    </div>
                    <div className="pp-foot-right">
                      <span className="pp-view-arrow" aria-label="View details">↗</span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* ════════════════════════════════════════
          PRODUCT MODAL
      ════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="pp-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              className="pp-modal"
              initial={{ scale: 0.88, opacity: 0, y: 48 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 32 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close */}
              <button className="pp-modal-close" onClick={() => setSelectedProduct(null)}
                aria-label="Close">
                ×
              </button>

              {/* Image panel */}
              <div className="pp-modal-img-panel">
                <img
                  src={getProductImage(selectedProduct)}
                  alt={selectedProduct.name}
                  className="pp-modal-img"
                  loading="lazy"
                  decoding="async"
                  onError={e => {
                    e.target.src = 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?q=80&w=800';
                  }}
                />
                <div className="pp-modal-img-pill">
                  {CATEGORY_ICONS[selectedProduct.category] ?? '🌱'} {selectedProduct.category || 'Eco'}
                </div>
              </div>

              {/* Info panel */}
              <div className="pp-modal-info">
                <p className="pp-modal-eco">🌿 Sustainably Crafted</p>
                <h2 className="pp-modal-title">{selectedProduct.name}</h2>
                <p className="pp-modal-price">
                  {selectedProduct.price > 0 ? <><span>₹</span>{selectedProduct.price}</> : 'Price on Request'}
                </p>
                <p className="pp-modal-desc">
                  {selectedProduct.description ||
                    'Experience the natural elegance of our sustainably sourced bamboo products. Crafted to minimize environmental impact without compromising on premium quality.'}
                </p>

                <div className="pp-modal-tags">
                  <span>🌱 Eco-Friendly</span>
                  <span>♻️ Biodegradable</span>
                  <span>✅ Premium Quality</span>
                </div>

                <button
                  className={`pp-modal-cta
                    ${selectedProduct.stock === 0 ? 'pp-modal-cta--oos' : ''}
                    ${addedToCart ? 'pp-modal-cta--success' : ''}`}
                  disabled={selectedProduct.stock === 0 || addedToCart}
                  onClick={() => {
                    if (selectedProduct.stock === 0) return;
                    if (selectedProduct.price === 0) {
                      window.location.href = '/contact';
                      return;
                    }
                    addToCart(selectedProduct);
                    setAddedToCart(true);
                    setTimeout(() => { setAddedToCart(false); setSelectedProduct(null); }, 1400);
                  }}
                >
                  {selectedProduct.stock === 0
                    ? '🚫 Out of Stock'
                    : selectedProduct.price === 0
                      ? '✉️ Enquire Now'
                      : addedToCart
                        ? '✅ Added to Cart!'
                        : '🛒 Add to Cart'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductPreview;
