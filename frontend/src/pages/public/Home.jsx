import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { projects } from '../../data/projects';
import { experiences } from '../../data/experiences';
import { certificates } from '../../data/certificates';
import CertificateSlider from '../../components/CertificateSlider';
import ImageGallery from '../../components/ImageGallery';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Home.css';

const Home = () => {
  const { language } = useApp();
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  
  // State untuk counter statistik
  const [expYears, setExpYears] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [techCount, setTechCount] = useState(0);
  
  // Refs untuk scroll
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const experiencesRef = useRef(null);
  const certificatesRef = useRef(null);
  const techRef = useRef(null);
  const contactRef = useRef(null);

  // Data statistik real
  const totalProjects = projects.length;
  const totalTech = [...new Set(projects.flatMap(p => p.tech_stack))].length;
  
  // Hitung total tahun pengalaman
  const calculateTotalYears = () => {
    let total = 0;
    experiences.forEach(exp => {
      const start = new Date(exp.start_date);
      const end = exp.current ? new Date() : new Date(exp.end_date);
      const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
      total += years;
    });
    return Math.round(total * 10) / 10;
  };
  
  const totalExpYears = calculateTotalYears();

  // Efek counter untuk statistik
  useEffect(() => {
    // Counter untuk tahun pengalaman
    let startExp = 0;
    const expInterval = setInterval(() => {
      startExp += 0.1;
      if (startExp >= totalExpYears) {
        setExpYears(totalExpYears);
        clearInterval(expInterval);
      } else {
        setExpYears(Math.round(startExp * 10) / 10);
      }
    }, 50);

    // Counter untuk jumlah project
    let startProject = 0;
    const projectInterval = setInterval(() => {
      startProject += 1;
      if (startProject >= totalProjects) {
        setProjectCount(totalProjects);
        clearInterval(projectInterval);
      } else {
        setProjectCount(startProject);
      }
    }, 50);

    // Counter untuk jumlah tech
    let startTech = 0;
    const techInterval = setInterval(() => {
      startTech += 1;
      if (startTech >= totalTech) {
        setTechCount(totalTech);
        clearInterval(techInterval);
      } else {
        setTechCount(startTech);
      }
    }, 50);

    return () => {
      clearInterval(expInterval);
      clearInterval(projectInterval);
      clearInterval(techInterval);
    };
  }, []);

  const t = {
    en: {
      welcome: 'Welcome to my portfolio',
      about: 'About Me',
      role: 'WEB DEVELOPER & DESIGNER',
      aboutDesc: 'I am a passionate web developer and designer with experience in creating digital experiences. I love building applications that are both functional and beautiful.',
      yearsExp: 'Years Experience',
      projects: 'Projects',
      technologies: 'Technologies',
      viewWork: 'view work',
      contact: 'contact',
      featuredTitle: 'featured projects',
      experiencesTitle: 'experience',
      certificatesTitle: 'certificates',
      present: 'present',
      techTitle: 'tech stack',
      techDescription: 'technologies I work with',
      contactTitle: 'get in touch',
      contactSubtitle: 'Have a question or want to work together?',
      nameLabel: 'your name',
      messageLabel: 'message',
      send: 'send message',
      sending: 'sending...',
      success: 'message sent!',
      error: 'something went wrong. please try again.'
    },
    id: {
      welcome: 'Selamat datang di portfolio saya',
      about: 'Tentang Saya',
      role: 'WEB DEVELOPER & DESIGNER',
      aboutDesc: 'Saya adalah pengembang dan desainer web yang bersemangat dengan pengalaman dalam menciptakan pengalaman digital. Saya suka membangun aplikasi yang fungsional dan indah.',
      yearsExp: 'Tahun Pengalaman',
      projects: 'Proyek',
      technologies: 'Teknologi',
      viewWork: 'lihat karya',
      contact: 'kontak',
      featuredTitle: 'proyek unggulan',
      experiencesTitle: 'pengalaman',
      certificatesTitle: 'sertifikat',
      present: 'sekarang',
      techTitle: 'teknologi',
      techDescription: 'teknologi yang saya gunakan',
      contactTitle: 'hubungi saya',
      contactSubtitle: 'Punya pertanyaan atau ingin bekerja sama?',
      nameLabel: 'nama anda',
      messageLabel: 'pesan',
      send: 'kirim pesan',
      sending: 'mengirim...',
      success: 'pesan terkirim!',
      error: 'terjadi kesalahan. silakan coba lagi.'
    }
  };

  const text = t[language] || t.en;

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      offset: 100,
      easing: 'ease-in-out',
      delay: 100
    });

    const hash = window.location.hash.substring(1);
    if (hash) {
      setTimeout(() => {
        scrollToSection(hash);
      }, 500);
    }

    return () => {};
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [language]);

  const scrollToSection = (sectionId) => {
    const refs = {
      home: homeRef,
      about: aboutRef,
      projects: projectsRef,
      experiences: experiencesRef,
      certificates: certificatesRef,
      tech: techRef,
      contact: contactRef
    };
    const ref = refs[sectionId];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openProjectPopup = (project) => setSelectedProject(project);
  const closeProjectPopup = () => setSelectedProject(null);

  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const response = await fetch('https://formspree.io/f/mlgwayol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, message: formData.message })
      });
      
      if (response.ok) {
        setFormSuccess(true);
        setFormData({ name: '', message: '' });
        setTimeout(() => setFormSuccess(false), 5000);
      } else {
        setFormError(text.error);
      }
    } catch (error) {
      setFormError(text.error);
    } finally {
      setFormLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="home">
      {/* Hero Section - Welcome Center */}
      <section id="home" ref={homeRef} className="hero-section">
        <div className="hero-container">
          <h1 className="hero-welcome">{text.welcome}</h1>
        </div>
      </section>

      {/* About Section - Foto Kiri, Desc Kanan */}
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
            
            {/* Statistik dengan efek counter */}
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

      {/* Projects Section */}
      <section id="projects" ref={projectsRef} className="projects-section">
        <div className="section-header">
            <h2 className="section-title">{text.featuredTitle}</h2>
        </div>
        <div className="projects-grid-2col">
            {projects.map((project, index) => (
            <div key={project.id} className="project-card-2col" data-aos="fade-up" data-aos-delay={index * 100} onClick={() => openProjectPopup(project)}>
                <div className="project-card-content">
                <div className="project-card-image">
                    <img src={project.image_url} alt={project.title} loading="lazy" />
                    {/* Status Badge */}
                    {project.status && (
                    <span className={`status-badge ${project.status}`}>
                        {project.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    )}
                </div>
                <div className="project-card-info">
                    <div className="project-card-header">
                    <h3 className="project-card-title">{project.title}</h3>
                    <span className="project-card-date">{formatDate(project.created_at)}</span>
                    </div>
                    
                    {/* Categories */}
                    {project.categories && project.categories.length > 0 && (
                    <div className="project-card-categories">
                        {project.categories.map((category, i) => (
                        <span key={i} className="category-badge">{category}</span>
                        ))}
                    </div>
                    )}
                    
                    <p className="project-card-description">{project.description.slice(0, 100)}...</p>
                    <div className="project-card-tech">
                    {project.tech_stack.slice(0, 3).map((tech, i) => (
                        <span key={i} className="tech-badge">{tech}</span>
                    ))}
                    {project.tech_stack.length > 3 && (
                        <span className="tech-badge">+{project.tech_stack.length - 3}</span>
                    )}
                    </div>
                    <div className="project-card-links" onClick={(e) => e.stopPropagation()}>
                    {project.github_link && <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="project-card-link">GitHub →</a>}
                    {project.live_link && <a href={project.live_link} target="_blank" rel="noopener noreferrer" className="project-card-link">Live Demo →</a>}
                    </div>
                </div>
                </div>
            </div>
            ))}
        </div>
        </section>

      {/* Experiences Section */}
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
                <p className="experience-description">{exp.description}</p>
                {exp.achievements?.length > 0 && (
                  <ul className="experience-achievements">
                    {exp.achievements.slice(0, 2).map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certificates Section */}
      {certificates.length > 0 && (
        <section id="certificates" ref={certificatesRef} className="certificates-section">
          <CertificateSlider certificates={certificates} />
        </section>
      )}

      {/* Tech Stack Section */}
      <section id="tech" ref={techRef} className="tech-section">
        <div className="section-header">
          <h2 className="section-title">{text.techTitle}</h2>
          <p className="tech-description">{text.techDescription}</p>
        </div>
        <div className="tech-marquee">
          <div className="tech-marquee-track">
            {[...projects.flatMap(p => p.tech_stack), ...projects.flatMap(p => p.tech_stack)].map((tech, index) => (
              <span key={`${tech}-${index}`} className="tech-item">{tech}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="contact-section">
        <div className="section-header">
          <h2 className="section-title">{text.contactTitle}</h2>
          <p className="contact-subtitle">{text.contactSubtitle}</p>
        </div>
        <div className="contact-container" data-aos="fade-up" data-aos-duration="800">
          <form onSubmit={handleFormSubmit} className="contact-form">
            {formError && <div className="error-message">{formError}</div>}
            {formSuccess && <div className="success-message">{text.success}</div>}
            <div className="form-group">
              <input type="text" name="name" placeholder={text.nameLabel} value={formData.name} onChange={handleFormChange} required disabled={formLoading} className="form-input" />
            </div>
            <div className="form-group">
              <textarea name="message" rows="4" placeholder={text.messageLabel} value={formData.message} onChange={handleFormChange} required disabled={formLoading} className="form-input" />
            </div>
            <button type="submit" className="submit-btn" disabled={formLoading}>{formLoading ? text.sending : text.send}</button>
          </form>
        </div>
      </section>

      {/* Project Popup */}
        {selectedProject && (
        <div className="popup-overlay" onClick={closeProjectPopup}>
            <div className="popup-content project-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closeProjectPopup}>×</button>
            
            <div className="popup-body">
                <div className="popup-image">
                <ImageGallery 
                    images={selectedProject.images || [selectedProject.image_url]} 
                    title={selectedProject.title}
                />
                </div>
                
                <div className="popup-details">
                <div className="popup-header">
                    <h2>{selectedProject.title}</h2>
                    
                    <div className="popup-meta">
                    <span className="popup-date">
                        {formatDate(selectedProject.created_at)}
                    </span>
                    
                    {/* Status Badge di sebelah tanggal */}
                    {selectedProject.status && (
                        <span className={`popup-status-badge ${selectedProject.status}`}>
                        {selectedProject.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                    )}
                    </div>
                </div>
                
                {/* Categories di Popup */}
                {selectedProject.categories && selectedProject.categories.length > 0 && (
                    <div className="popup-categories">
                    <h3>Categories</h3>
                    <div className="popup-category-tags">
                        {selectedProject.categories.map((category, i) => (
                        <span key={i} className="category-badge-large">{category}</span>
                        ))}
                    </div>
                    </div>
                )}
                
                {selectedProject.description && (
                    <div className="popup-description-section">
                    <h3>Overview</h3>
                    <p className="popup-description">
                        {selectedProject.description}
                    </p>
                    </div>
                )}
                
                {selectedProject.content && (
                    <div className="popup-content-section">
                    <h3>Details</h3>
                    <div className="popup-content">
                        {selectedProject.content}
                    </div>
                    </div>
                )}
                
                <div className="popup-tech-stack">
                    <h3>Technologies</h3>
                    <div className="popup-tech-tags">
                    {selectedProject.tech_stack?.map((tech, i) => (
                        <span key={i} className="tech-badge-large">{tech}</span>
                    ))}
                    </div>
                </div>
                
                <div className="popup-links">
                    {selectedProject.github_link && (
                    <a href={selectedProject.github_link} target="_blank" rel="noopener noreferrer" className="popup-link">GitHub →</a>
                    )}
                    {selectedProject.live_link && (
                    <a href={selectedProject.live_link} target="_blank" rel="noopener noreferrer" className="popup-link">Live Demo →</a>
                    )}
                </div>
                </div>
            </div>
            </div>
        </div>
        )}
    </div>
  );
};

export default Home;