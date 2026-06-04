import React, { useEffect, useState, useRef, useCallback } from 'react';

const ScrambleText = ({ text = '', className = '', duration = 1.0, delay = 0 }) => {
    const [displayText, setDisplayText] = useState(text);
    const isAnimating = useRef(false);
    const originalText = useRef(text);

    useEffect(() => {
        originalText.current = text;
        setDisplayText(text);
    }, [text]);

    const scramble = useCallback(() => {
        if (isAnimating.current || !originalText.current) return;
        isAnimating.current = true;

        const target = originalText.current;
        const validChars = target.replace(/[^a-zA-Z0-9]/g, '') || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let frame = 0;
        const totalFrames = Math.max(1, duration * 60); 
        const revealStep = target.length / totalFrames;

        const tick = () => {
            frame++;
            const revealedLength = Math.floor(frame * revealStep);
            
            let current = '';
            for (let i = 0; i < target.length; i++) {
                if (i < revealedLength) {
                    current += target[i];
                } else if (target[i] === ' ') {
                    current += ' ';
                } else {
                    current += validChars[Math.floor(Math.random() * validChars.length)];
                }
            }

            setDisplayText(current);

            if (frame < totalFrames) {
                requestAnimationFrame(tick);
            } else {
                setDisplayText(target);
                isAnimating.current = false;
            }
        };

        requestAnimationFrame(tick);
    }, [duration]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            scramble();
        }, delay * 1000);
        return () => clearTimeout(timeout);
    }, [text, delay, scramble]);

    return (
        <span 
            className={className} 
            onMouseEnter={scramble}
            style={{ display: 'inline-block' }}
        >
            {displayText}
        </span>
    );
};

export default ScrambleText;
