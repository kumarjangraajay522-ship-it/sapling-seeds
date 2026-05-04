import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { resolveImageUrl } from '../../utils/imageUtils';
import './Cart.css';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const Cart = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [loading, setLoading]             = useState(false);
    const [error, setError]                 = useState('');
    const [success, setSuccess]             = useState(false);

    const [shipping, setShipping] = useState({
        address: '', city: '', postalCode: '', phone: ''
    });

    const shippingCost = cartTotal > 0 && cartTotal < 499 ? 50 : 0;
    const finalTotal = cartTotal + shippingCost;

    useEffect(() => {
        const hasLegacyIds = cartItems.some(item => item._id.length < 10);
        if (hasLegacyIds) {
            cartItems.forEach(item => { if (item._id.length < 10) removeFromCart(item._id); });
        }
    }, [cartItems, removeFromCart]);

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!user) { navigate('/login'); return; }
        setLoading(true); setError('');
        
        const orderData = {
            orderItems: [
                ...cartItems.map(item => ({
                    product: item._id, name: item.name,
                    price: item.price, quantity: item.quantity, image: item.image
                }))
            ],
            shippingAddress: shipping,
            totalPrice: finalTotal,
            // Keeping paymentMethod as COD for database compatibility, but acting as WhatsApp
            paymentMethod: 'COD' 
        };
        
        try {
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(orderData)
            });
            if (res.ok) { 
                setSuccess(true); 
                clearCart(); 
                
                // Construct WhatsApp message
                let itemsList = cartItems.map(item => `${item.quantity}x ${item.name} (₹${item.price})`).join('\n');
                
                let message = `*New Order Placed!*\n\n`;
                message += `*Items:*\n${itemsList}\n`;
                message += `\n*Subtotal:* ₹${cartTotal.toLocaleString()}\n`;
                if (shippingCost > 0) message += `*Shipping:* ₹${shippingCost}\n`;
                message += `*Total:* ₹${finalTotal.toLocaleString()}\n\n`;
                message += `*Shipping Address:*\n`;
                message += `${shipping.address}, ${shipping.city}, ${shipping.postalCode}\n`;
                message += `Phone: ${shipping.phone}\n\n`;
                message += `Please confirm my order.`;

                const encodedMessage = encodeURIComponent(message);
                const waUrl = `https://wa.me/8800799151?text=${encodedMessage}`;
                
                // Open WhatsApp in new tab
                window.open(waUrl, '_blank');
                
                setTimeout(() => navigate('/profile'), 3000); 
            }
            else { const d = await res.json(); throw new Error(d.error || 'Failed to place order.'); }
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    /* ── Success screen ── */
    if (success) return (
        <div className="cart-page success-view">
            <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                className="success-card"
            >
                <div className="success-rings">
                    <div className="success-ring r1" /><div className="success-ring r2" /><div className="success-ring r3" />
                    <div className="success-emoji">🌿</div>
                </div>
                <h1>Order Placed!</h1>
                <p>Redirecting to WhatsApp to confirm your order...<br/>Then returning to your profile.</p>
                <button onClick={() => navigate('/profile')} className="btn-green">View My Orders</button>
            </motion.div>
        </div>
    );

    /* ── Empty screen ── */
    if (cartItems.length === 0) return (
        <div className="cart-page empty-view">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="empty-card"
            >
                <div className="empty-icon-box">
                    <div className="empty-glow" />
                    <span className="empty-icon">🌱</span>
                </div>
                <h2 className="empty-title">Your Cart is Empty</h2>
                <p className="empty-text">
                    Looks like you haven't added any eco-friendly treasures yet. 
                    Let's start building your sustainable lifestyle!
                </p>
                <button onClick={() => navigate('/collection')} className="empty-btn">
                    Explore Our Collection
                    <span>→</span>
                </button>
            </motion.div>
        </div>
    );

    const itemCount    = cartItems.reduce((s, i) => s + i.quantity, 0);
    const savings      = Math.round(cartTotal * 0.15);

    return (
        <div className="cart-page">
            {/* ── Steps Indicator ── */}
            <div className="checkout-steps">
                <div className={`step-item ${!isCheckingOut ? 'active' : ''} ${isCheckingOut ? 'completed' : ''}`}>
                    <div className="step-circle">1</div>
                    <span className="step-label">Cart</span>
                </div>
                <div className="step-line" />
                <div className={`step-item ${isCheckingOut ? 'active' : ''}`}>
                    <div className="step-circle">2</div>
                    <span className="step-label">Shipping</span>
                </div>
            </div>

            {/* Header */}
            <motion.header
                className="cart-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="cart-title">
                    {itemCount} Item{itemCount !== 1 ? 's' : ''} &nbsp;
                    <span className="cart-title-accent">in your cart</span>
                </h1>
                <button className="cart-continue-btn" onClick={() => navigate('/')}>
                    ← Continue Shopping
                </button>
            </motion.header>

            <div className="cart-grid">
                {/* ── Items ── */}
                <section className="cart-items-section">
                    <AnimatePresence>
                        {cartItems.map((item, idx) => (
                            <motion.div
                                key={item._id}
                                className="cart-item-card"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 60, scale: 0.9 }}
                                transition={{ delay: idx * 0.06, type: 'spring', stiffness: 120, damping: 16 }}
                                layout
                            >
                                {/* image */}
                                <div className="cart-img-wrap">
                                    <img src={resolveImageUrl(item.image, item.name)} alt={item.name}
                                        className="cart-item-img"
                                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?q=80&w=400'; }}
                                    />
                                    <div className="cart-img-shine" />
                                </div>

                                {/* details */}
                                <div className="cart-item-details">
                                    {item.category && <p className="cart-item-cat">🌿 {item.category}</p>}
                                    <h3 className="cart-item-name">{item.name}</h3>
                                    <p className="cart-item-unit">₹{item.price.toLocaleString()} / piece</p>
                                </div>

                                {/* controls */}
                                <div className="cart-item-right">
                                    <p className="cart-item-subtotal">₹{(item.price * item.quantity).toLocaleString()}</p>

                                    <div className="cart-qty-control">
                                        <button className="cart-qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                                        <span className="cart-qty-num">{item.quantity}</span>
                                        <button className="cart-qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                    </div>

                                    <button className="cart-remove-btn" onClick={() => removeFromCart(item._id)}>
                                        🗑 Remove
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Eco message */}
                    <div className="cart-eco-banner">
                        <span>🌍</span>
                        <p>Every bamboo product you buy saves <strong>~500 years</strong> of plastic from entering our oceans.</p>
                    </div>
                </section>

                {/* ── Sidebar ── */}
                <aside className="cart-sidebar">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Summary */}
                        {!isCheckingOut && (
                            <motion.div
                                key="summary"
                                className="summary-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <h3 className="summary-title">Order Summary</h3>

                                <div className="summary-rows">
                                    <div className="summary-row">
                                        <span>Subtotal ({itemCount} items)</span>
                                        <span>₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Shipping</span>
                                        {shippingCost === 0 ? (
                                            <span className="free-badge">FREE 🚚</span>
                                        ) : (
                                            <span>₹{shippingCost}</span>
                                        )}
                                    </div>
                                    {shippingCost > 0 && (
                                        <div style={{ fontSize: '0.8rem', color: '#4caf50', textAlign: 'right', marginTop: '-8px', marginBottom: '8px' }}>
                                            SHIPPING FREE ABOVE Rs. 499
                                        </div>
                                    )}
                                    <div className="summary-row savings-row">
                                        <span>🎉 You're saving</span>
                                        <span className="savings-amt">₹{savings.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="summary-total">
                                    <span>Total</span>
                                    <span className="total-amt">₹{finalTotal.toLocaleString()}</span>
                                </div>

                                <button className="btn-checkout" onClick={() => setIsCheckingOut(true)}>
                                    <span>Proceed to Shipping</span>
                                    <span className="checkout-arrow">→</span>
                                </button>

                                <div className="trust-badges">
                                    <span>🔒 Secure</span>
                                    <span>✅ Verified</span>
                                    <span>♻️ Eco-Friendly</span>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Shipping */}
                        {isCheckingOut && (
                            <motion.div
                                key="form"
                                className="checkout-form-card"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                            >
                                <button className="back-btn" onClick={() => setIsCheckingOut(false)}>← Back to Cart</button>
                                <h3 className="summary-title">Shipping Details</h3>
                                <form onSubmit={handleCheckout}>
                                    <div className="form-group">
                                        <label>📍 Address</label>
                                        <input type="text" required placeholder="Street & House No."
                                            value={shipping.address}
                                            onChange={e => setShipping({ ...shipping, address: e.target.value })} />
                                    </div>
                                    <div className="form-grid-2">
                                        <div className="form-group">
                                            <label>🏙 City</label>
                                            <input type="text" required value={shipping.city}
                                                onChange={e => setShipping({ ...shipping, city: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label>📮 Postal Code</label>
                                            <input type="text" required value={shipping.postalCode}
                                                onChange={e => setShipping({ ...shipping, postalCode: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>📱 Phone</label>
                                        <input type="tel" required placeholder="10-digit number"
                                            value={shipping.phone}
                                            onChange={e => setShipping({ ...shipping, phone: e.target.value })} />
                                    </div>

                                    {error && (
                                        <motion.p className="error-msg"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            ⚠️ {error}
                                        </motion.p>
                                    )}

                                    <button className="btn-confirm" disabled={loading} style={{ background: '#25D366' }}>
                                        {loading
                                            ? <span className="btn-loading"><span />Processing…</span>
                                            : `💬 Order via WhatsApp · ₹${finalTotal.toLocaleString()}`}
                                    </button>
                                    <p className="cod-note" style={{ textAlign: 'center', marginTop: '12px' }}>📲 Fast Checkout · Confirm order directly on WhatsApp</p>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </aside>
            </div>
        </div>
    );
};

export default Cart;