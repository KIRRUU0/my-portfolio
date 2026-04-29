import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import './LoadingScreen.css';

const LoadingScreen = ({ onFinish }) => {
  const { language } = useApp();
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const t = {
    en: { loading: 'Loading' },
    id: { loading: 'Memuat' }
  };

  const text = t[language] || t.en;

  useEffect(() => {
    // Timer untuk fade out
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
      
      setTimeout(() => {
        setShow(false);
        if (typeof onFinish === 'function') {
          onFinish();
        }
      }, 500); // 500ms fade transition
    }, 800); // Tampil selama 800ms

    return () => {
      clearTimeout(fadeTimer);
    };
  }, [onFinish]);

  if (!show) return null;

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : 'fade-in'}`}>
      <div className="loading-content">
        
        {/* Modern Spinner */}
        <div className="spinner-container">
          <div className="spinner-ring"></div>
        </div>

        {/* Loading Text */}
        <div className="loading-wrapper">
          <span className="loading-label">{text.loading}</span>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default LoadingScreen;