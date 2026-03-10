import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { projects } from '../../data/projects';
import './LoadingScreen.css';

const LoadingScreen = ({ onFinish }) => {
  const { language } = useApp();
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [activeTechIndex, setActiveTechIndex] = useState(0);
  
  // Kumpulkan semua tech stack dari projects
  const allTech = [...new Set(projects.flatMap(p => p.tech_stack))].sort();
  
  const t = {
    en: {
      loading: 'Loading',
      complete: 'Ready'
    },
    id: {
      loading: 'Memuat',
      complete: 'Siap'
    }
  };

  const text = t[language] || t.en;

  useEffect(() => {
    // Rotasi tech stack setiap 200ms
    const techInterval = setInterval(() => {
      setActiveTechIndex((prev) => (prev + 1) % allTech.length);
    }, 200);

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(techInterval);
          
          setFadeOut(true);
          
          setTimeout(() => {
            setShow(false);
            onFinish();
          }, 800);
          
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => {
      clearInterval(progressInterval);
      clearInterval(techInterval);
    };
  }, [onFinish, allTech.length]);

  if (!show) return null;

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : 'fade-in'}`}>
      <div className="matrix-bg"></div>
      
      <div className="loading-content">
        {/* Tech Stack Micro Animation */}
        <div className="tech-micro-container">
          <div className="tech-micro-wrapper">
            {allTech.map((tech, index) => (
              <div
                key={index}
                className={`tech-micro-item ${index === activeTechIndex ? 'active' : ''}`}
                style={{
                  transform: `translateX(${index - activeTechIndex}00%) scale(${index === activeTechIndex ? 1 : 0.7})`,
                  opacity: index === activeTechIndex ? 1 : 0.2,
                  zIndex: index === activeTechIndex ? 10 : 1,
                }}
              >
                <span className="tech-micro-text">{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar-wrapper">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">
            <span className="progress-percentage">{progress}%</span>
            <span className="progress-status">
              {progress < 100 ? text.loading : text.complete}
            </span>
          </div>
        </div>

        {/* Tech Stack Cloud (background effect) */}
        <div className="tech-cloud-bg">
          {allTech.slice(0, 10).map((tech, index) => (
            <span key={index} className="cloud-item" style={{
              animationDelay: `${index * 0.5}s`,
              left: `${(index * 7) % 100}%`,
              top: `${(index * 3) % 80}%`,
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