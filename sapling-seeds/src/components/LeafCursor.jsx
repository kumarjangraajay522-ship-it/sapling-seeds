import React, { useState, useEffect, useRef } from 'react';
import './LeafCursor.css';

const LeafCursor = () => {
    const [isVisible, setIsVisible] = useState(false);
    const cursorRef = useRef(null);

    useEffect(() => {
        // Don't run on touch devices
        if (typeof window !== 'undefined' && 'ontouchstart' in window) return;

        let rafId;
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        const handleMouseMove = (e) => {
            mouseX = e.clientX - 12;
            mouseY = e.clientY - 12;
            if (!isVisible) setIsVisible(true);
        };

        const updateCursor = () => {
            // Smooth lerp (linear interpolation) for floating feel
            currentX += (mouseX - currentX) * 0.15;
            currentY += (mouseY - currentY) * 0.15;
            
            if (cursorRef.current) {
                // Apply transform directly to DOM avoiding React render cycles
                cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(15deg)`;
            }
            rafId = requestAnimationFrame(updateCursor);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);
        
        rafId = requestAnimationFrame(updateCursor);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            cancelAnimationFrame(rafId);
        };
    }, [isVisible]);

    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
        return null;
    }

    return (
        <div
            ref={cursorRef}
            className="leaf-cursor"
            style={{ display: isVisible ? 'block' : 'none' }}
        >
            <div className="leaf-inner">🍃</div>
        </div>
    );
};

export default LeafCursor;
