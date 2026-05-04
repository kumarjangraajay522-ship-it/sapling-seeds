import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Footer.css';
import FeaturesBanner from './FeaturesBanner';

const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      {isHomePage && <FeaturesBanner />}

      <div className="footer-outer-wrapper">
        <div className="footer-card">
          <div className="footer-card-content">

            {/* Left Side: Newsletter */}
            <div className="footer-left">
              <h2 className="newsletter-title">Subscribe to our mailing list & earn a 20% off code</h2>

              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Enter Your Email" required aria-label="Email address" />
                <button type="submit" className="newsletter-submit" aria-label="Subscribe">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </form>

              <p className="newsletter-disclaimer">
                By joining our email list, you're saying yes to style updates, sustainable tips, and thoughtful emails. We'll always treat your info with care.
              </p>
            </div>

            {/* Right Side: Links Grid */}
            <div className="footer-right">
              <div className="footer-link-col">
                <h3>COMPANY</h3>
                <ul>
                  <li><Link to="/about">About Us</Link></li>
                  <li><a href="mailto:hello@saplingandseeds.com?subject=Careers">Careers</a></li>
                  <li><Link to="/about">Sustainability</Link></li>
                  <li><Link to="/contact">Contact Us</Link></li>
                </ul>
              </div>

              <div className="footer-link-col">
                <h3>SUPPORT</h3>
                <ul>
                  <li><Link to="/profile">Your Account</Link></li>
                  <li><Link to="/returns-policy">Returns Centre</Link></li>
                  <li><Link to="/shipping-policy">Shipping Policies</Link></li>
                  <li><Link to="/contact">Help / FAQs</Link></li>
                </ul>
              </div>

              <div className="footer-link-col">
                <h3>CONNECT</h3>
                <ul>
                  <li><a href="https://instagram.com/saplingandseeds" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                  <li><a href="https://twitter.com/saplingandseeds" target="_blank" rel="noopener noreferrer">Twitter/X</a></li>
                  <li><a href="https://facebook.com/saplingandseeds" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                  <li><a href="https://www.linkedin.com/company/saplingandseeds" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                </ul>
              </div>

              <div className="footer-link-col">
                <h3>LEGAL</h3>
                <ul>
                  <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
                  <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                  <li><Link to="/shipping-policy">Shipping Policy</Link></li>
                  <li><Link to="/returns-policy">Returns Policy</Link></li>
                </ul>
              </div>
            </div>

          </div>

          {/* Giant Watermark Text covering bottom */}
          <div className="footer-watermark">SHANAH ENTERPRISES</div>
        </div>

        {/* External Copyright Strip */}
        <div className="footer-external-bottom">
          <p>© Sapling &amp; Seeds, {new Date().getFullYear()}. A Shanah Enterprises Brand.</p>
          <address style={{ fontStyle: 'normal', fontSize: '0.78rem', opacity: 0.7, margin: '0.25rem 0' }}>
            GSTIN: 06AFCFS0110E1ZR &nbsp;|&nbsp; New Delhi 110001, India &nbsp;|&nbsp; <a href="tel:+919354361055" style={{ color: 'inherit' }}>+91 93543 61055</a>
          </address>
          <p className="made-in">All Rights Reserved</p>
        </div>
      </div>
    </>
  );
};

export default Footer;