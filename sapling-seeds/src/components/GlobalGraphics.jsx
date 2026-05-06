import React from 'react';
import './GlobalGraphics.css';

const GlobalGraphics = () => {
    // Dynamic generation of organic floating elements
    const elements = [
        { id: 1, left: '5%', delay: 0, duration: 15, type: '🍃', size: '32px' },
        { id: 2, left: '15%', delay: 8, duration: 25, type: '🌱', size: '28px' },
        { id: 3, left: '35%', delay: 2, duration: 18, type: '🍃', size: '30px' },
        { id: 4, left: '55%', delay: 12, duration: 22, type: '✨', size: '24px' },
        { id: 5, left: '75%', delay: 4, duration: 16, type: '🍃', size: '34px' },
        { id: 6, left: '90%', delay: 10, duration: 20, type: '🌱', size: '26px' },
        { id: 7, left: '25%', delay: 5, duration: 28, type: '🍃', size: '29px' },
        { id: 8, left: '65%', delay: 15, duration: 24, type: '✨', size: '22px' },
        { id: 9, left: '45%', delay: 7, duration: 20, type: '🍃', size: '31px' },
        { id: 10, left: '80%', delay: 3, duration: 19, type: '🌱', size: '27px' },
        { id: 11, left: '10%', delay: 11, duration: 23, type: '✨', size: '25px' },
        { id: 12, left: '70%', delay: 9, duration: 21, type: '🍃', size: '33px' },
        { id: 13, left: '50%', delay: 6, duration: 17, type: '🍃', size: '30px' },
        { id: 14, left: '20%', delay: 14, duration: 26, type: '🌱', size: '25px' },
        { id: 15, left: '40%', delay: 1, duration: 19, type: '✨', size: '23px' },
        { id: 16, left: '85%', delay: 13, duration: 22, type: '🍃', size: '32px' },
        { id: 17, left: '60%', delay: 16, duration: 25, type: '🌱', size: '29px' },
        { id: 18, left: '30%', delay: 4, duration: 18, type: '✨', size: '21px' },
    ];

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    if (isMobile) return null;

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
