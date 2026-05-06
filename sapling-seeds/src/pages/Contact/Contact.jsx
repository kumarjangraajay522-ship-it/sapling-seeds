import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { assets } from '../../assets/assets';
import SEOHead from '../../utils/SEOHead';
import '../About/About.css';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch(`${API_URL}/enquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, type: 'contact' }),
            });

            if (res.ok) {
                setSuccess('Your message has been sent successfully. We will get back to you soon!');
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to send message.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page-wrapper">
            <SEOHead
                title="Contact Sapling &amp; Seeds | Enquiries &amp; Corporate Gifting"
                description="Get in touch with Sapling &amp; Seeds for product enquiries, bulk orders, or corporate bamboo gifting. Call +91 88007 99151 or email enquiry@saplingandseeds.com."
                canonical="https://www.saplingandseeds.com/contact"
            />
            {/* Same animated wave background as About page */}
            <div className="about-wave-bg" aria-hidden="true">
                <div className="wave-blob wb1" />
                <div className="wave-blob wb2" />
                <div className="wave-blob wb3" />
                <div className="wave-blob wb4" />
                <div className="wave-blob wb5" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8 }}
                className="contact-hero"
            >
                {/* <img src={assets.logo} alt="Sapling & Seeds Logo" className="contact-hero-logo" /> */}
                <h1 className="contact-title">Let's Grow Together</h1>
                <p className="contact-subtitle">Whether you have a question about our products, want to discuss a bulk order, or just want to say hello, we're here to listen.</p>
            </motion.div>

            <div className="contact-container">
                {/* Left Side: Contact Information */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="contact-info-panel"
                >
                    <div className="info-top">
                        <div className="info-header">
                            <h3>Get in Touch</h3>
                            <p>We'd love to hear from you. Our friendly team is always here to chat.</p>
                        </div>

                        <div className="info-list" style={{ marginTop: '30px' }}>
                            <div className="info-item">
                                <div className="info-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                </div>
                                <div className="info-content">
                                    <h4>Chat to us</h4>
                                    <p>Our friendly team is here to help.</p>
                                    <a href="mailto:enquiry@saplingandseeds.com"> enquiry@saplingandseeds.com</a>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                </div>
                                <div className="info-content">
                                    <h4>Call us</h4>
                                    <p>Mon-Fri from 9am to 6pm.</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <a href="tel:+918800799151">+91 88007 99151</a>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="info-item">
                                <div className="info-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </div>
                                <div className="info-content">
                                    <h4>Visit us</h4>
                                    <p>ground floor, backside, gate no 19,<br/>B/4101, Green Fields Colony,<br/>Haryana 121010</p>
                                </div>
                            </div>

                            <div className="info-item" style={{ marginTop: '10px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                <div className="info-icon" style={{ background: '#fdfaf3' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                </div>
                                <div className="info-content">
                                    <h4>A Brand By</h4>
                                    <p>Sapling & Seeds is powered by</p>
                                    <a href="https://www.google.com/search?q=shanah+enterprises" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '5px', fontWeight: 'bold', color: '#1a231a' }}>Shanah Enterprises ↗</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="social-links">
                        <a href="https://www.instagram.com/saplingandseeds" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Follow us on Instagram">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <a href="https://www.linkedin.com/company/saplingandseeds" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Connect on LinkedIn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        </a>
                        <a href="https://twitter.com/saplingandseeds" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Follow us on X (Twitter)">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                        </a>
                    </div>
                </motion.div>

                {/* Right Side: Contact Form */}
                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="contact-form-panel"
                >
                    <form className="contact-form" onSubmit={handleSubmit}>
                        {success && <div className="form-success" style={{ color: '#2e7d32', backgroundColor: '#e8f5e9', padding: '10px 14px', borderRadius: '8px', marginBottom: '10px', fontSize: '0.9rem', border: '1px solid #c8e6c9' }}>{success}</div>}
                        {error && <div className="form-error" style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px 14px', borderRadius: '8px', marginBottom: '10px', fontSize: '0.9rem', border: '1px solid #ffcdd2' }}>{error}</div>}

                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" placeholder="John Doe" value={formData.name} onChange={handleInput} required />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" placeholder="john@example.com" value={formData.email} onChange={handleInput} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number (Optional)</label>
                            <input type="tel" id="phone" placeholder="+91 00000 00000" value={formData.phone} onChange={handleInput} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea id="message" placeholder="How can we help you today?" value={formData.message} onChange={handleInput} required></textarea>
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
