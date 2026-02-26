import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { projects } from '../../data/projects';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './TechStackSection.css';

const TechStackSection = ({ techRef }) => {
  const { language } = useApp();
  
  // Kumpulkan semua tech stack dari semua project
  const allTech = [...new Set(projects.flatMap(p => p.tech_stack))].sort();
  
  const t = {
    en: { techTitle: 'tech stack' },
    id: { techTitle: 'teknologi' }
  };

  const text = t[language] || t.en;

  // Refresh AOS saat komponen dimuat
  useEffect(() => {
    AOS.refresh();
  }, []);

  return (
    <section id="tech" ref={techRef} className="tech-section">
      <div className="section-header" data-aos="fade-up" data-aos-duration="800">
        <h2 className="section-title">{text.techTitle}</h2>
      </div>
      
      <div className="tech-cloud" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
        {allTech.map((tech, index) => (
          <span 
            key={index} 
            className="tech-cloud-item"
            data-aos="fade-up"
            data-aos-delay={index * 50}
            data-aos-duration="600"
          >
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
};

export default TechStackSection;