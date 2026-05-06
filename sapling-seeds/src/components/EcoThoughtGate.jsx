import React, { useState, useEffect } from 'react';
import './EcoThoughtGate.css';

const THOUGHTS = [
    "The greatest threat to our planet is the belief that someone else will save it. 🌍",
    "Small swaps, big impact. Every bamboo toothbrush counts. 🌱",
    "Sustainability is not a goal, it's a lifestyle. 🌿",
    "Choose earth-friendly today for a greener tomorrow. ✨",
    "Nurture nature, and nature will nurture you. 🍃"
];

const EcoThoughtGate = ({ children }) => {
    const [isVisible, setIsVisible] = useState(() => {
        // Only show once per session
        return !sessionStorage.getItem('thought_gate_shown');
    });
    const [thought] = useState(() => THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)]);

    const handleEnter = () => {
        sessionStorage.setItem('thought_gate_shown', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return children;

    return (
        <div className="thought-gate-overlay">
            <div className="thought-gate-content">
                <div className="thought-icon">🌿</div>
                <h2 className="thought-text">{thought}</h2>
                <button className="thought-enter-btn" onClick={handleEnter}>
                    Enter Website →
                </button>
            </div>
            <div className="thought-gate-footer">
                Sapling & Seeds · Eco-Friendly · Sustainable
            </div>
        </div>
    );
};

export default EcoThoughtGate;
