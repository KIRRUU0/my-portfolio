import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { projects } from '../../data/projects';
import './LoadingScreen.css';

const LoadingScreen = ({ onFinish }) => {
  const { language } = useApp();
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  
  // Kumpulkan semua tech stack dari semua project
  const allTech = [...new Set(projects.flatMap(p => p.tech_stack))].sort();

  const t = {
    en: {
      welcome: 'Welcome to my portfolio'
    },
    id: {
      welcome: 'Selamat datang di portfolio saya'
    }
  };

  const text = t[language] || t.en;

  useEffect(() => {
    // Timer untuk fade out
    const timer = setTimeout(() => {
      setFadeOut(true);
      
      setTimeout(() => {
        setShow(false);
        onFinish();
      }, 800);
    }, 2500); // Loading selama 2.5 detik

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!show) return null;

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : 'fade-in'}`}>
      <div className="matrix-bg"></div>
      
      <div className="loading-content">
        {/* Welcome Text */}
        <h1 className="welcome-text">
          <span className="welcome">{text.welcome}</span>
        </h1>
        
        {/* Tech Stack Marquee - Semua tech bergulir perlahan */}
        <div className="tech-marquee-container">
          <div className="tech-marquee-track">
            {/* Duplicate untuk infinite scroll */}
            {[...allTech, ...allTech, ...allTech].map((tech, index) => (
              <span key={`${tech}-${index}`} className="tech-marquee-item">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Tech Stack Cloud Background */}
        <div className="tech-cloud-bg">
          {allTech.slice(0, 15).map((tech, index) => (
            <span key={index} className="cloud-item" style={{
              animationDelay: `${index * 0.3}s`,
              left: `${(index * 7) % 100}%`,
              top: `${(index * 5) % 80}%`,
              fontSize: `${0.8 + (index % 3) * 0.2}rem`,
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