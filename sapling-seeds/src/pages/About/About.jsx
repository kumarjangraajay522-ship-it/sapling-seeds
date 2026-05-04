import React from 'react';
import AboutUs from '../../components/AboutUs';
import OurStory from '../../components/OurStory';
import { motion } from 'framer-motion';
import Team from '../Team/Team.jsx';
import SEOHead from '../../utils/SEOHead';
import './About.css';

const About = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="about-page"
            style={{ paddingTop: '80px' }}
        >
            {/* Wave blob background — covers the full page */}
            <div className="about-wave-bg" aria-hidden="true">
                <div className="wave-blob wb1" />
                <div className="wave-blob wb2" />
                <div className="wave-blob wb3" />
                <div className="wave-blob wb4" />
                <div className="wave-blob wb5" />
            </div>

            <SEOHead
                title="About Sapling &amp; Seeds | Eco Mission, Team &amp; Bamboo Story"
                description="Learn about Sapling &amp; Seeds — our mission to replace single-use plastics with sustainable bamboo products, our team, and our commitment to eco-friendly living."
                canonical="https://www.saplingandseeds.com/about"
            />
            <AboutUs />
            <OurStory />
            <Team />
        </motion.div>
    );
};

export default About;
