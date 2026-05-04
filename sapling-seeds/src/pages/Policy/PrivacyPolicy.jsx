import React from 'react';
import { motion } from 'framer-motion';
import './Policy.css';

const PrivacyPolicy = () => {
    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="policy-container"
        >
            <div className="policy-card">
                <header className="policy-header">
                    <h1>Privacy Policy</h1>
                    <p className="policy-effective-date">Effective Date: 27th April 2026</p>
                </header>

                <section className="policy-section">
                    <h2>Data Collection</h2>
                    <p>We collect personal, transactional, and technical data to process your orders, improve our services, and communicate updates about your purchases and our sustainable initiatives.</p>
                </section>

                <section className="policy-section">
                    <h2>Data Usage & Sharing</h2>
                    <p>We do not sell your personal data. Your information is only shared with essential partners such as payment gateways, logistics providers, or legal authorities when required by law.</p>
                </section>

                <section className="policy-section">
                    <h2>Your Rights</h2>
                    <p>You have the right to request access to, correction of, or deletion of your personal data at any time. For such requests, please contact us at <strong>enquiry@saplingandseeds.com</strong>.</p>
                </section>

                <section className="policy-section">
                    <h2>Cookie Policy</h2>
                    <p>Cookies help us improve your browsing experience and analyze our website traffic. You can choose to disable cookies through your browser settings, though some features of the site may be affected.</p>
                </section>

                <section className="policy-section">
                    <h2>Accessibility Statement</h2>
                    <p>We aim to make our website accessible to everyone. If you encounter any accessibility issues while browsing, please reach out to us so we can improve your experience.</p>
                </section>

                <div className="grievance-box">
                    <h3>Grievance Officer</h3>
                    <div className="grievance-info">
                        <p><strong>Name:</strong> Daisy Sanchu</p>
                        <p><strong>Email:</strong> Daisy@saplingandseeds.com</p>
                        <p><strong>Phone:</strong> +91 9650690160</p>
                        <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
                            * Complaints are acknowledged within 48 hours and resolved within 30 days.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PrivacyPolicy;
