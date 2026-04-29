import React from 'react';
import { useApp } from '../../context/AppContext';
import './AboutSection.css';

const AboutSection = ({ aboutRef, expYears, projectCount, techCount }) => {
  const { language } = useApp();
  
  const t = {
    en: {
      about: 'About Me',
      role: 'FULLSTACK DEVELOPER & UI/UX DESIGNER',
      aboutDesc: 'An Information Technology student at Bina Sarana Informatika University with expertise in Fullstack Web Development. Experienced in building robust backend systems with Laravel and REST APIs, while crafting intuitive frontend interfaces using React and Tailwind CSS. Proficient in UI/UX design with Figma and database management using MySQL.',
      yearsExp: 'Years Experience',
      projects: 'Projects',
      technologies: 'Technologies'
    },
    id: {
      about: 'Tentang Saya',
      role: 'FULLSTACK DEVELOPER & UI/UX DESIGNER',
      aboutDesc: 'Mahasiswa Teknologi Informasi Universitas Bina Sarana Informatika dengan keahlian dalam pengembangan Fullstack Web. Berpengalaman membangun sistem backend yang handal dengan Laravel dan REST API, serta merancang antarmuka frontend yang modern menggunakan React dan Tailwind CSS. Menguasai desain UI/UX dengan Figma dan manajemen basis data MySQL.',
      yearsExp: 'Tahun Pengalaman',
      projects: 'Proyek',
      technologies: 'Teknologi'
    }
  };

  const text = t[language] || t.en;

  return (
    <section id="about" ref={aboutRef} className="about-section">
      <div className="about-container">
        <div className="about-image">
          <div className="about-image-border">
            <img src="/images/profile.jpeg" alt="Muhammad Haekal Arrafi" className="about-photo" />
          </div>
        </div>
        
        <div className="about-content">
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