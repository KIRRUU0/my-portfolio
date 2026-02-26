import React from 'react';
import { useApp } from '../../context/AppContext';
import './HeroSection.css';

const HeroSection = ({ homeRef }) => {
  const { language } = useApp();
  
  const t = {
    en: {
      description: 'Creating digital experiences with simplicity and purpose.'
    },
    id: {
      description: 'Menciptakan pengalaman digital dengan kesederhanaan dan tujuan.'
    }
  };

  const text = t[language] || t.en;

  return (
    <section id="home" ref={homeRef} className="hero-section">
      <div className="hero-container">
        <div className="hero-text" data-aos="fade-right">
          <h1 className="hero-title">WEBSITE DEVELOPMENT</h1>
          <p className="hero-description">{text.description}</p>
        </div>
        
        <div className="hero-animation" data-aos="fade-left">
          <div className="animation-container">
            <div className="code-animation-bubble bubble-1">
              <span className="code-icon">{'{ }'}</span>
              <span className="code-label">React</span>
            </div>
            <div className="code-animation-bubble bubble-2">
              <span className="code-icon">{'</>'}</span>
              <span className="code-label">HTML</span>
            </div>
            <div className="code-animation-bubble bubble-3">
              <span className="code-icon">{'() =>'}</span>
              <span className="code-label">JS</span>
            </div>
            <div className="code-animation-bubble bubble-4">
              <span className="code-icon">{'<?'}</span>
              <span className="code-label">PHP</span>
            </div>
            <div className="code-animation-bubble bubble-5">
              <span className="code-icon">{'[ ]'}</span>
              <span className="code-label">Array</span>
            </div>
            <div className="code-animation-bubble bubble-6">
              <span className="code-icon">{'{}'}</span>
              <span className="code-label">Object</span>
            </div>
            <div className="code-animation-bubble bubble-7">
              <span className="code-icon">{'<div>'}</span>
              <span className="code-label">Div</span>
            </div>
            <div className="code-animation-bubble bubble-8">
              <span className="code-icon">{'@media'}</span>
              <span className="code-label">CSS</span>
            </div>
            <div className="code-animation-bubble bubble-9">
              <span className="code-icon">{'git'}</span>
              <span className="code-label">Git</span>
            </div>
            <div className="code-animation-bubble bubble-10">
              <span className="code-icon">{'npm'}</span>
              <span className="code-label">Node</span>
            </div>
            <div className="code-animation-bubble bubble-11">
              <span className="code-icon">{'🐹'}</span>
              <span className="code-label">Go</span>
            </div>
            <div className="code-animation-bubble bubble-12">
              <span className="code-icon">{'🐘'}</span>
              <span className="code-label">PHP</span>
            </div>
            <div className="code-animation-bubble bubble-13">
              <span className="code-icon">{'📱'}</span>
              <span className="code-label">Android</span>
            </div>
            <div className="code-animation-bubble bubble-14">
              <span className="code-icon">{'🍎'}</span>
              <span className="code-label">iOS</span>
            </div>
            <div className="code-animation-bubble bubble-15">
              <span className="code-icon">{'🗄️'}</span>
              <span className="code-label">MySQL</span>
            </div>
            <div className="code-animation-bubble bubble-16">
              <span className="code-icon">{'🍃'}</span>
              <span className="code-label">Mongo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;// Force redeploy
