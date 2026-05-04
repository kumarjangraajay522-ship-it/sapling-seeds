import React from 'react';
import GiftingSection from '../../components/Gifting';
import { motion } from 'framer-motion';
import SEOHead from '../../utils/SEOHead';

const Gifting = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="gifting-page"
            style={{ paddingTop: '80px' }}
        >
            <SEOHead
                title="Eco Corporate Gifting | Bamboo Gift Sets — Sapling &amp; Seeds"
                description="Premium eco-friendly corporate gifting with custom-branded bamboo products. Zero-plastic sustainable gift sets from ₹150. Perfect for corporate events &amp; festivals."
                canonical="https://www.saplingandseeds.com/gifting"
            />
            <GiftingSection />
        </motion.div>
    );
};

export default Gifting;
