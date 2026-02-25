import React from 'react';
import { useApp } from '../../context/AppContext';
import './AboutSection.css';

const AboutSection = ({ aboutRef, expYears, projectCount, techCount }) => {
  const { language } = useApp();
  
  const t = {
    en: {
      about: 'About Me',
      role: 'WEB DEVELOPER & DESIGNER',
      aboutDesc: 'I am a passionate web developer and designer with experience in creating digital experiences. I love building applications that are both functional and beautiful.',
      yearsExp: 'Years Experience',
      projects: 'Projects',
      technologies: 'Technologies'
    },
    id: {
      about: 'Tentang Saya',
      role: 'WEB DEVELOPER & DESIGNER',
      aboutDesc: 'Saya adalah pengembang dan desainer web yang bersemangat dengan pengalaman dalam menciptakan pengalaman digital. Saya suka membangun aplikasi yang fungsional dan indah.',
      yearsExp: 'Tahun Pengalaman',
      projects: 'Proyek',
      technologies: 'Teknologi'
    }
  };

  const text = t[language] || t.en;

  return (
    <section id="about" ref={aboutRef} className="about-section">
      <div className="about-container">
        <div className="about-image" data-aos="fade-right">
          <div className="about-image-border">
            <img src="/images/profile.jpg" alt="Muhammad Haekal Arrafi" className="about-photo" />
          </div>
        </div>
        
        <div className="about-content" data-aos="fade-left">
          <h2 className="about-title">{text.about}</h2>
          <p className="about-role">{text.role}</p>
          <p className="about-description">{text.aboutDesc}</p>
          
          <div className="about-stats">
            <div className="stat-item">
              <span className="stat-number">{expYears}</span>
              <span className="stat-label">{text.yearsExp}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{projectCount}</span>
              <span className="stat-label">{text.projects}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{techCount}</span>
              <span className="stat-label">{text.technologies}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;