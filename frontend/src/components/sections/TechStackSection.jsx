import React from 'react';
import { useApp } from '../../context/AppContext';
import { projects } from '../../data/projects';
import './TechStackSection.css';

const TechStackSection = ({ techRef }) => {
  const { language } = useApp();
  
  const allTech = [...new Set(projects.flatMap(p => p.tech_stack))].sort();
  
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
      
      <div className="tech-cloud">
        {allTech.map((tech, index) => (
          <span key={index} className="tech-cloud-item">{tech}</span>
        ))}
      </div>
    </section>
  );
};

export default TechStackSection;