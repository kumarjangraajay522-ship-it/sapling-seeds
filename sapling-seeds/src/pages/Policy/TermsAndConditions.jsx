import React from 'react';
import { motion } from 'framer-motion';
import './Policy.css';

const TermsAndConditions = () => {
    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="policy-container"
        >
            <div className="policy-card">
                <header className="policy-header">
                    <h1>Terms & Conditions</h1>
                    <p className="policy-effective-date">Effective Date: 27th April 2026</p>
                </header>

                <section className="policy-section">
                    <h2>1. Eligibility</h2>
                    <p>You must be at least 10 years old or using the website under the supervision of a legal guardian to browse or shop on Sapling & Seeds.</p>
                </section>

                <section className="policy-section">
                    <h2>2. User Responsibilities</h2>
                    <p>By using this website, you agree not to provide false information, use the website for any unlawful purposes, or disrupt its technical functionality and security.</p>
                </section>

                <section className="policy-section">
                    <h2>3. Product Information</h2>
                    <p>All product images are for representation purposes only. Since we use natural materials like bamboo, minor variations in color, texture, and finish may occur between the images and the actual product.</p>
                </section>

                <section className="policy-section">
                    <h2>4. Pricing & Payments</h2>
                    <p>All prices listed are in Indian Rupees (INR). We reserve the right to change prices without prior notice. All payments are processed through secure, encrypted gateways to ensure your financial safety.</p>
                </section>

                <section className="policy-section">
                    <h2>5. Order Acceptance & Cancellation</h2>
                    <p>Orders are officially confirmed only after a partial or full payment is received. We reserve the right to cancel any order due to product unavailability, pricing errors, or suspected fraudulent activity, with proper notice to the customer.</p>
                </section>

                <section className="policy-section">
                    <h2>6. Intellectual Property</h2>
                    <p>All content on this website, including designs, text, and graphics, belongs exclusively to Sapling & Seeds (A Shanah Enterprises Brand) and cannot be reused, copied, or redistributed without our explicit written permission.</p>
                </section>

                <section className="policy-section">
                    <h2>7. Limitation of Liability</h2>
                    <p>Sapling & Seeds shall not be held liable for any indirect damages or delays caused by third-party logistics partners, natural disasters, or other external factors beyond our reasonable control.</p>
                </section>

                <section className="policy-section">
                    <h2>8. Governing Law</h2>
                    <p>These terms are governed by the laws of India. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the courts in Faridabad, Haryana.</p>
                </section>

                <div className="grievance-box">
                    <h3>Contact for Terms</h3>
                    <div className="grievance-info">
                        <p><strong>Business Name:</strong> Sapling & Seeds</p>
                        <p><strong>Email:</strong> sanchu@saplingandseeds.com</p>
                        <p><strong>Phone:</strong> +91 9354361055</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TermsAndConditions;
