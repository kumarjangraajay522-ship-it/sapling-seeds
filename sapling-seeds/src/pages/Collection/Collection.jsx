import { useState } from 'react';
import ProductPreview from '../../components/ProductPreview';
import { motion } from 'framer-motion';
import SEOHead from '../../utils/SEOHead';
import './Collection.css';

const CATEGORIES = ['All', 'Hair Care', 'Oral Care', 'Stationery'];

const Collection = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [count, setCount] = useState(0);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="collection-page"
        >
            <SEOHead
                title="Bamboo Products Collection | Eco-Friendly Shop — Sapling &amp; Seeds"
                description="Shop our full range of eco-friendly bamboo products — toothbrushes, neem wood combs, plantable stationery &amp; more. 100% plastic-free. Starting from ₹49."
                canonical="https://www.saplingandseeds.com/collection"
            />

            {/* ══ HERO ══════════════════════════════════════════════ */}
            <div className="coll-hero">
                <div className="coll-hero__glow" aria-hidden="true" />
                <div className="coll-hero__grain" aria-hidden="true" />

                <motion.div
                    className="coll-hero__inner"
                    initial={{ opacity: 0, y: 44 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                >
                    <p className="coll-hero__eyebrow">
                        <span className="coll-hero__rule" aria-hidden="true" />
                        Premium Goods
                        <span className="coll-hero__rule" aria-hidden="true" />
                    </p>
                    <h1 className="coll-hero__title">
                        Our<br />
                        <em>Collection</em>
                    </h1>
                    <p className="coll-hero__sub">
                        Sustainably crafted bamboo products — zero plastic, pure intention.
                    </p>
                    
                    {/* Search Bar */}
                    <div className="coll-search">
                        <input 
                            type="text" 
                            placeholder="Search our sustainable goods..." 
                            className="coll-search__input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="coll-search__icon">🔍</span>
                    </div>
                </motion.div>
            </div>

            {/* ── Category filter bar ── */}
            <div className="coll-controls">
                <motion.div
                    className="coll-filter"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    role="tablist"
                    aria-label="Filter by category"
                >
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            role="tab"
                            aria-selected={activeCategory === cat}
                            className={`coll-filter__pill${activeCategory === cat ? ' coll-filter__pill--active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>
                
                <div className="coll-info">
                    <span className="coll-info__count">Showing {count} sustainable items</span>
                </div>
            </div>

            {/* ── SEO intro — visible text for crawlers & users ── */}
            <p style={{
                textAlign: 'center',
                maxWidth: '680px',
                margin: '0 auto 2rem',
                padding: '0 1.5rem',
                fontSize: '0.92rem',
                color: '#556b55',
                lineHeight: 1.75,
            }}>
                Discover our handcrafted range of eco-friendly bamboo products —
                bamboo toothbrushes, pure neem wood hair combs, plantable stationery,
                seed pencils, bamboo bottles, and sustainable gifting sets. Every item
                is 100% plastic-free and biodegradable, crafted by skilled artisans
                using natural materials.
            </p>

            {/* ══ PRODUCTS ══════════════════════════════════════════ */}
            <div className="coll-products" role="tabpanel">
                <ProductPreview 
                    categoryFilter={activeCategory} 
                    searchTerm={searchTerm} 
                    onCountChange={setCount} 
                />
            </div>
        </motion.div>
    );
};

export default Collection;
