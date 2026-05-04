import React from 'react';
import './GlobalGraphics.css';

const GlobalGraphics = () => {
    // Dynamic generation of organic floating elements
    const elements = [
        { id: 1, left: '5%',   delay: 0,  duration: 15, type: '🍃', size: '22px' },
        { id: 2, left: '15%',  delay: 8,  duration: 25, type: '🌱', size: '18px' },
        { id: 3, left: '35%',  delay: 2,  duration: 18, type: '🍃', size: '20px' },
        { id: 4, left: '55%',  delay: 12, duration: 22, type: '✨', size: '14px' },
        { id: 5, left: '75%',  delay: 4,  duration: 16, type: '🍃', size: '24px' },
        { id: 6, left: '90%',  delay: 10, duration: 20, type: '🌱', size: '16px' },
        { id: 7, left: '25%',  delay: 5,  duration: 28, type: '🍃', size: '19px' },
        { id: 8, left: '65%',  delay: 15, duration: 24, type: '✨', size: '12px' },
    ];

    return (
        <div className="global-graphics-layer">
            {elements.map((el) => (
                <div
                    key={el.id}
                    className="graphic-item"
                    style={{
                        left: el.left,
                        fontSize: `clamp(12px, 2vw, ${el.size})`,
                        animation: `floatGraphics ${el.duration}s linear infinite`,
                        animationDelay: `${el.delay}s`,
                    }}
                >
                    {el.type}
                </div>
            ))}
        </div>
    );
};

export default GlobalGraphics;
