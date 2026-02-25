import React from 'react';
import { useApp } from '../../context/AppContext';
import './TechStackSection.css';

const TechStackSection = ({ techRef, projects }) => {
  const { language } = useApp();
  
  const t = {
    en: { techTitle: 'tech stack' },
    id: { techTitle: 'teknologi' }
  };

  const text = t[language] || t.en;

  return (
    <section id="tech" ref={techRef} className="tech-section">
      <div className="section-header">
        <h2 className="section-title">{text.techTitle}</h2>
      </div>
      <div className="tech-marquee">
        <div className="tech-marquee-track">
          {[...projects.flatMap(p => p.tech_stack), ...projects.flatMap(p => p.tech_stack)].map((tech, index) => (
            <span key={`${tech}-${index}`} className="tech-item">{tech}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;