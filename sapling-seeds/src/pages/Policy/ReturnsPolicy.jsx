import React from 'react';
import { motion } from 'framer-motion';
import './Policy.css';

const ReturnsPolicy = () => {
    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="policy-container"
        >
            <div className="policy-card">
                <header className="policy-header">
                    <h1>Return, Refund & Cancellation</h1>
                    <p className="policy-effective-date">Effective Date: 27th April 2026</p>
                </header>

                <section className="policy-section">
                    <h2>Returns</h2>
                    <p>We accept returns within <strong>7 days</strong> of delivery. To be eligible for a return, products must be unused, in their original condition, and kept in the original packaging.</p>
                </section>

                <section className="policy-section">
                    <h2>Refunds</h2>
                    <p>Once your return is received and inspected, refunds are processed within <strong>5–7 business days</strong> to your original payment method.</p>
                </section>

                <section className="policy-section">
                    <h2>Cancellations</h2>
                    <p>Orders can be cancelled at any time before they are dispatched. Once an order has left our facility, the standard return policy applies.</p>
                </section>

                <section className="policy-section">
                    <h2>Damaged Items</h2>
                    <p>If you receive a damaged item, please report it within <strong>48 hours</strong> of delivery. You must include an unboxing video as proof of damage to facilitate a replacement or refund.</p>
                </section>

                <div className="grievance-box">
                    <h3>Need help with a return?</h3>
                    <div className="grievance-info">
                        <p><strong>Email:</strong> enquiry@saplingandseeds.com</p>
                        <p><strong>WhatsApp:</strong> +91 9354361055</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ReturnsPolicy;
