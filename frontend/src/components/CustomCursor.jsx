import React, { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const [hidden, setHidden] = useState(true);
    const [clicked, setClicked] = useState(false);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        const mouseXRef = { current: 0 };
        const mouseYRef = { current: 0 };
        const ringXRef = { current: 0 };
        const ringYRef = { current: 0 };
        let animationFrameId = null;

        const onMouseMove = (e) => {
            mouseXRef.current = e.clientX;
            mouseYRef.current = e.clientY;
            setHidden(false);
        };

        const onMouseEnter = () => setHidden(false);
        const onMouseLeave = () => setHidden(true);
        const onMouseDown = () => setClicked(true);
        const onMouseUp = () => setClicked(false);

        // Track hovers
        const addHoverListeners = () => {
            const targets = document.querySelectorAll(
                'a, button, input, textarea, select, .project-card-3col, .certificate-card, .tech-item, .social-icon, .nav-link, .mobile-nav-link'
            );
            targets.forEach((target) => {
                target.addEventListener('mouseenter', () => setHovered(true));
                target.addEventListener('mouseleave', () => setHovered(false));
            });
        };

        // Render loop for smooth lag effect
        const tick = () => {
            // Direct dot movement
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${mouseXRef.current}px, ${mouseYRef.current}px, 0)`;
            }

            // Smooth ring tracking (lerp)
            const ease = 0.15; // smoothness
            ringXRef.current += (mouseXRef.current - ringXRef.current) * ease;
            ringYRef.current += (mouseYRef.current - ringYRef.current) * ease;

            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ringXRef.current}px, ${ringYRef.current}px, 0)`;
            }

            animationFrameId = requestAnimationFrame(tick);
        };

        window.addEventListener('mousemove', onMouseMove);
        document.body.addEventListener('mouseenter', onMouseEnter);
        document.body.addEventListener('mouseleave', onMouseLeave);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);

        // Initial setup and observer for dynamic elements
        addHoverListeners();
        const observer = new MutationObserver(addHoverListeners);
        observer.observe(document.body, { childList: true, subtree: true });

        animationFrameId = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            document.body.removeEventListener('mouseenter', onMouseEnter);
            document.body.removeEventListener('mouseleave', onMouseLeave);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            observer.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    if (hidden && typeof window !== 'undefined' && window.innerWidth > 768) {
        return null;
    }

    return (
        <>
            <div 
                ref={dotRef} 
                className={`cursor-dot ${clicked ? 'clicked' : ''} ${hovered ? 'hovered' : ''}`}
            />
            <div 
                ref={ringRef} 
                className={`cursor-ring ${clicked ? 'clicked' : ''} ${hovered ? 'hovered' : ''}`}
            />
        </>
    );
};

export default CustomCursor;
