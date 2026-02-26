import React from 'react';
import { useApp } from '../../context/AppContext';
import './AboutSection.css';

const AboutSection = ({ aboutRef, expYears, projectCount, techCount }) => {
  const { language } = useApp();
  
  const t = {
    en: {
      about: 'About Me',
      role: 'WEB DEVELOPER & DESIGNER',
      aboutDesc: 'An Information Technology student at Bina Sarana Informatika University with expertise in backend development using Laravel, UI/UX design, and web layout using Figma. He has a foundation in Python programming and experience in web-based system development. He is proficient in Git, MySQL database management, and REST API development. He also understands network design using Cisco Packet Tracer.',
      yearsExp: 'Years Experience',
      projects: 'Projects',
      technologies: 'Technologies'
    },
    id: {
      about: 'Tentang Saya',
      role: 'WEB DEVELOPER & DESIGNER',
      aboutDesc: 'Mahasiswa TeknologiInformasi Universitas Bina Sarana Informatika dengan keahlian dalam pengembangan backend menggunakan Laravel serta perancangan UI/UX dan tata letak web melalui Figma. Memiliki dasar pemrograman Python dan pengalaman dalam pembuatan sistem berbasis web. Menguasai penggunaan Git, manajemen basis data MySQL, serta pengembangan REST API. Juga memahami perancangan jaringan menggunakan Cisco Packet Tracer.',
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
            <img src="/images/profile/profile.jpeg" alt="Muhammad Haekal Arrafi" className="about-photo" />
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