import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { projects } from '../../data/projects';
import './LoadingScreen.css';

const LoadingScreen = ({ onFinish }) => {
  const { language } = useApp();
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dotCount, setDotCount] = useState(1);
  const [slideDirection, setSlideDirection] = useState('right');
  
  // Kumpulkan semua tech stack
  const allTech = [...new Set(projects.flatMap(p => p.tech_stack))].sort();

  const t = {
    en: { loading: 'Loading' },
    id: { loading: 'Memuat' }
  };

  const text = t[language] || t.en;

  useEffect(() => {
    // Timer untuk ganti tech stack dengan efek smooth
    const techInterval = setInterval(() => {
      setSlideDirection('right');
      setCurrentIndex((prev) => (prev + 1) % allTech.length);
    }, 500);

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
        clearInterval(techInterval);
        clearInterval(dotInterval);
      }, 800);
    }, 2800);

    return () => {
      clearInterval(techInterval);
      clearInterval(dotInterval);
      clearTimeout(fadeTimer);
    };
  }, [onFinish, allTech.length]);

  if (!show) return null;

  // Ambil 3 tech stack dengan efek melingkar
  const getVisibleTech = () => {
    const result = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + allTech.length) % allTech.length;
      result.push(allTech[index]);
    }
    return result;
  };

  const visibleTech = getVisibleTech();

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : 'fade-in'}`}>
      <div className="matrix-bg"></div>
      
      <div className="loading-content">
        {/* Tech Stack dengan Animasi Circular */}
        <div className="tech-carousel">
          {visibleTech.map((tech, idx) => {
            const position = idx - 1; // -1, 0, 1
            
            return (
              <div
                key={`${tech}-${idx}`}
                className={`tech-card ${position === 0 ? 'center' : 'side'}`}
                style={{
                  '--direction': slideDirection,
                  '--position': position,
                  '--delay': `${Math.abs(position) * 0.1}s`,
                  transform: `
                    translateX(${position * 120}%)
                    scale(${position === 0 ? 1 : 0.7})
                    rotateY(${position * 15}deg)
                  `,
                  opacity: position === 0 ? 1 : 0.4,
                  zIndex: position === 0 ? 3 : 2 - Math.abs(position),
                  filter: `blur(${Math.abs(position) * 2}px)`,
                }}
              >
                <span className="tech-name">{tech}</span>
                {position === 0 && (
                  <div className="tech-glow"></div>
                )}
              </div>
            );
          })}
        </div>

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

        {/* Particle Effects */}
        <div className="tech-particles">
          {allTech.slice(0, 8).map((tech, index) => (
            <div
              key={index}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${index * 0.2}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;