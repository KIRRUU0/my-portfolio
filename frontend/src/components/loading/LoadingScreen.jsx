import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { projects } from '../../data/projects';
import './LoadingScreen.css';

const LoadingScreen = ({ onFinish }) => {
  const { language } = useApp();
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [currentTech, setCurrentTech] = useState(0);
  const [dotCount, setDotCount] = useState(1);
  
  // Kumpulkan semua tech stack dari semua project
  const allTech = [...new Set(projects.flatMap(p => p.tech_stack))].sort();

  const t = {
    en: { loading: 'Loading' },
    id: { loading: 'Memuat' }
  };

  const text = t[language] || t.en;

  useEffect(() => {
    // Timer untuk ganti tech stack setiap 400ms (lebih lambat)
    const techInterval = setInterval(() => {
      setCurrentTech((prev) => (prev + 1) % allTech.length);
    }, 400);

    // Timer untuk animasi titik loading
    const dotInterval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 500);

    // Timer untuk fade out (2.5 detik)
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
      
      setTimeout(() => {
        setShow(false);
        onFinish();
        clearInterval(techInterval);
        clearInterval(dotInterval);
      }, 800);
    }, 2500);

    return () => {
      clearInterval(techInterval);
      clearInterval(dotInterval);
      clearTimeout(fadeTimer);
    };
  }, [onFinish, allTech.length]);

  if (!show) return null;

  // Ambil 3 tech stack berdasarkan current index
  const getVisibleTech = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentTech + i) % allTech.length;
      result.push(allTech[index]);
    }
    return result;
  };

  const visibleTech = getVisibleTech();

  // Buat string titik loading
  const dots = '.'.repeat(dotCount);

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : 'fade-in'}`}>
      <div className="matrix-bg"></div>
      
      <div className="loading-content">
        {/* 3 Tech Stack Bergulir */}
        <div className="tech-stack-container">
          <div className="tech-stack-wrapper">
            {visibleTech.map((tech, index) => (
              <div 
                key={index} 
                className={`tech-stack-item ${index === 1 ? 'center' : 'side'}`}
                style={{
                  transform: `translateX(${(index - 1) * 120}px) scale(${index === 1 ? 1 : 0.8})`,
                  opacity: index === 1 ? 1 : 0.6,
                  zIndex: index === 1 ? 3 : 2 - index,
                }}
              >
                <span className="tech-text">{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Text dengan Animasi Titik */}
        <div className="loading-text-container">
          <span className="loading-text">{text.loading}</span>
          <span className="loading-dots">{dots}</span>
        </div>

        {/* Tech Stack Cloud Background */}
        <div className="tech-cloud-bg">
          {allTech.slice(0, 10).map((tech, index) => (
            <span key={index} className="cloud-item" style={{
              animationDelay: `${index * 0.3}s`,
              left: `${(index * 7) % 100}%`,
              top: `${(index * 5) % 80}%`,
              fontSize: `${0.7 + (index % 3) * 0.2}rem`,
            }}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;