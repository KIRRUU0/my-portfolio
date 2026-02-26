import React from 'react';
import { useApp } from '../../context/AppContext';
import './ExperiencesSection.css';

const ExperiencesSection = ({ experiencesRef, experiences, formatDate }) => {
  const { language } = useApp();
  
  const t = {
    en: { 
      experiencesTitle: 'experience', 
      present: 'present',
      location: 'Location',
      achievements: 'Key Achievements'
    },
    id: { 
      experiencesTitle: 'pengalaman', 
      present: 'sekarang',
      location: 'Lokasi',
      achievements: 'Pencapaian'
    }
  };

  const text = t[language] || t.en;

  return (
    <section id="experiences" ref={experiencesRef} className="experiences-section">
      <div className="section-header">
        <h2 className="section-title">{text.experiencesTitle}</h2>
      </div>
      <div className="experiences-list">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="experience-item" data-aos="fade-up" data-aos-delay={index * 100}>
            <div className="experience-period">
              {formatDate(exp.start_date)} — {exp.current ? text.present : formatDate(exp.end_date)}
            </div>
            <div className="experience-content">
              <h3 className="experience-position">{exp.position}</h3>
              <span className="experience-company">{exp.company}</span>
              
              {/* Hanya location, tanpa address terpisah */}
              {exp.location && (
                <div className="experience-location">
                  <span className="location-label">{text.location}:</span> {exp.location}
                </div>
              )}
              
              <p className="experience-description">{exp.description}</p>
              
              {exp.achievements?.length > 0 && (
                <div className="experience-achievements">
                  <h4 className="achievements-title">{text.achievements}</h4>
                  <ul className="achievements-list">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="achievement-item">{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperiencesSection;