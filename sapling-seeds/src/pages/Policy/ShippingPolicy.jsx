import React from 'react';
import { motion } from 'framer-motion';
import './Policy.css';

const ShippingPolicy = () => {
    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="policy-container"
        >
            <div className="policy-card">
                <header className="policy-header">
                    <h1>Shipping Policy</h1>
                    <p className="policy-effective-date">Effective Date: 27th April 2026</p>
                </header>

                <section className="policy-section">
                    <h2>Processing & Delivery</h2>
                    <p>Orders are typically processed within <strong>2–4 business days</strong>. Once dispatched, delivery usually takes <strong>5–7 business days</strong> depending on your location.</p>
                </section>

                <section className="policy-section">
                    <h2>Shipping Charges</h2>
                    <p>Shipping charges will be informed in advance based on your state and the weight of the goods. We strive to provide the most transparent and fair shipping rates possible.</p>
                </section>

                <section className="policy-section">
                    <h2>Tracking</h2>
                    <p>Tracking details will be shared with you via email or WhatsApp immediately after your order has been dispatched from our facility.</p>
                </section>

                <div className="grievance-box">
                    <h3>Shipping Queries</h3>
                    <div className="grievance-info">
                        <p><strong>Email:</strong> sanchu@saplingandseeds.com</p>
                        <p><strong>Phone:</strong> +91 8800799151</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ShippingPolicy;
