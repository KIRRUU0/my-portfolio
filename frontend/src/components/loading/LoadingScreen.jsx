import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import './LoadingScreen.css';

const LoadingScreen = ({ onFinish }) => {
  const { language } = useApp();
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [dotCount, setDotCount] = useState(1);

  const t = {
    en: { loading: 'Loading' },
    id: { loading: 'Memuat' }
  };

  const text = t[language] || t.en;

  useEffect(() => {
    // Timer untuk animasi titik loading
    const dotInterval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 500);

    // Timer untuk fade out
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
      
      setTimeout(() => {
        setShow(false);
        onFinish();
        clearInterval(dotInterval);
      }, 800);
    }, 2800);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(fadeTimer);
    };
  }, [onFinish]);

  if (!show) return null;

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : 'fade-in'}`}>
      <div className="matrix-bg"></div>
      
      <div className="loading-content">
        {/* Progress Ring */}
        <div className="progress-ring">
          <svg className="progress-svg" viewBox="0 0 120 120">
            <circle
              className="progress-track"
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
            />
            <circle
              className="progress-fill"
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#4CAF50"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="339.292"
              strokeDashoffset="339.292"
              style={{
                animation: 'fillProgress 2.8s linear forwards',
              }}
            />
          </svg>
          <div className="progress-dots">
            {[1, 2, 3].map((num) => (
              <span
                key={num}
                className={`dot ${dotCount >= num ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Loading Text */}
        <div className="loading-wrapper">
          <span className="loading-label">{text.loading}</span>
          <div className="loading-wave">
            <span style={{ '--i': 1 }}></span>
            <span style={{ '--i': 2 }}></span>
            <span style={{ '--i': 3 }}></span>
          </div>
        </div>

        {/* Particle Effects (Minimal) */}
        <div className="minimal-particles">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="minimal-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${index * 0.3}s`,
                animationDuration: `${3 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;