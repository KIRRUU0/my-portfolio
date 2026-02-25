import React from 'react';
import { useApp } from '../../context/AppContext';
import './HeroSection.css';

const HeroSection = ({ homeRef }) => {
  const { language } = useApp();
  
  const t = {
    en: { welcome: 'Welcome to my portfolio' },
    id: { welcome: 'Selamat datang di portfolio saya' }
  };

  const text = t[language] || t.en;

  return (
    <section id="home" ref={homeRef} className="hero-section">
      <div className="hero-container">
        <h1 className="hero-welcome">{text.welcome}</h1>
      </div>
    </section>
  );
};

export default HeroSection;