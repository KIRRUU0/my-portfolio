import React from 'react';
import { useApp } from '../../context/AppContext';
import './AboutSection.css';

const AboutSection = ({ aboutRef, expYears, projectCount, techCount }) => {
  const { language } = useApp();
  
  const t = {
    en: {
      about: 'About Me',
      role: 'Fullstack Developer & UI/UX Designer',
      aboutDesc: 'An Information Technology student at Bina Sarana Informatika University with expertise in Fullstack Web Development. Experienced in building robust backend systems with Laravel and REST APIs, while crafting intuitive frontend interfaces using React and Tailwind CSS. Proficient in UI/UX design with Figma and database management using MySQL.',
      yearsExp: 'Years Experience',
      projects: 'Projects Completed',
      technologies: 'Technologies Mastered',
      educationTitle: 'Education',
      educationDesc: 'Information Technology at Bina Sarana Informatika University',
      specializationTitle: 'Core Focus',
      specializationDesc: 'Fullstack Web Development & UI/UX Design'
    },
    id: {
      about: 'Tentang Saya',
      role: 'Fullstack Developer & UI/UX Designer',
      aboutDesc: 'Mahasiswa Teknologi Informasi Universitas Bina Sarana Informatika dengan keahlian dalam pengembangan Fullstack Web. Berpengalaman membangun sistem backend yang handal dengan Laravel dan REST API, serta merancang antarmuka frontend yang modern menggunakan React dan Tailwind CSS. Menguasai desain UI/UX dengan Figma dan manajemen basis data MySQL.',
      yearsExp: 'Tahun Pengalaman',
      projects: 'Proyek Selesai',
      technologies: 'Teknologi Dikuasai',
      educationTitle: 'Pendidikan',
      educationDesc: 'Teknologi Informasi di Universitas Bina Sarana Informatika',
      specializationTitle: 'Fokus Utama',
      specializationDesc: 'Pengembangan Fullstack Web & Desain UI/UX'
    }
  };

  const text = t[language] || t.en;

  return (
    <section id="about" ref={aboutRef} className="about-section">
      <div className="about-section-header">
        <h2 className="about-section-title">{text.about}</h2>
      </div>
      <div className="about-bento-grid">
        
        {/* Card 1: Portrait & Intro */}
        <div className="bento-card portrait-card">
          <div className="portrait-image-wrapper">
            <img src="/images/profile.jpeg" alt="Muhammad Haekal Arrafi" className="portrait-photo" />
          </div>
          <div className="portrait-info">
            <h3 className="portrait-name">M. Haekal Arrafi</h3>
            <p className="portrait-role">{text.role}</p>
          </div>
        </div>

        {/* Card 2: Biography */}
        <div className="bento-card bio-card">
          <span className="card-tag">BIOGRAPHY</span>
          <p className="bio-text">{text.aboutDesc}</p>
        </div>

        {/* Card 3: Key Statistics */}
        <div className="bento-card stats-card">
          <span className="card-tag">METRICS</span>
          <div className="bento-stats-grid">
            <div className="bento-stat-item">
              <span className="bento-stat-num">{expYears}</span>
              <span className="bento-stat-lbl">{text.yearsExp}</span>
            </div>
            <div className="bento-stat-item">
              <span className="bento-stat-num">{projectCount}</span>
              <span className="bento-stat-lbl">{text.projects}</span>
            </div>
            <div className="bento-stat-item">
              <span className="bento-stat-num">{techCount}</span>
              <span className="bento-stat-lbl">{text.technologies}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Education & Focus */}
        <div className="bento-card status-card">
          <div className="specialization-section">
            <span className="card-tag">{text.specializationTitle}</span>
            <p className="education-text">{text.specializationDesc}</p>
          </div>
          <div className="education-section">
            <span className="card-tag">{text.educationTitle}</span>
            <p className="education-text">{text.educationDesc}</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;