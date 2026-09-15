import React, { useLayoutEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import gsap from 'gsap';
import './HeroSection.css';

const HeroSection = ({ homeRef }) => {
  const { language } = useApp();
  const heroRef = useRef(null);

  const t = {
    en: {
      greeting: "Hello, I'm Haekal",
      role: "Fullstack Developer & UI/UX Designer",
      description: "Developing robust backend systems and intuitive digital experiences. Specializing in Laravel, React, Tailwind, and modern UI/UX design.",
      ctaPrimary: "View Projects",
      ctaSecondary: "Contact Me",
      statusText: "Open to Work",
      techTitle: "Core Focus",
      experienceTag: "Verified & Certified"
    },
    id: {
      greeting: "Halo, Saya Haekal",
      role: "Fullstack Developer & UI/UX Designer",
      description: "Mengembangkan sistem backend yang handal dan pengalaman digital yang intuitif. Memiliki spesialisasi dalam Laravel, React, Tailwind, dan desain UI/UX.",
      ctaPrimary: "Lihat Proyek",
      ctaSecondary: "Hubungi Saya",
      statusText: "Terbuka untuk Peluang Kerja",
      techTitle: "Fokus Keahlian",
      experienceTag: "Tersertifikasi BNSP"
    }
  };

  const text = t[language] || t.en;

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      
      tl.from(".hero-greeting", { opacity: 0, y: 15, duration: 0.5 })
        .from(".hero-title", { opacity: 0, y: 20, duration: 0.6 }, "-=0.3")
        .from(".hero-description", { opacity: 0, y: 15, duration: 0.5 }, "-=0.3")
        .from(".hero-cta-group", { opacity: 0, y: 15, duration: 0.5 }, "-=0.3")
        .from(".hero-card-minimal", { opacity: 0, y: 20, duration: 0.6 }, "-=0.4");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToRef = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" ref={(el) => { homeRef.current = el; heroRef.current = el; }} className="hero-section">
      <div className="hero-container">
        <div className="hero-text">
          <span className="hero-greeting">{text.greeting}</span>
          <h1 className="hero-title">{text.role}</h1>
          <p className="hero-description">{text.description}</p>
          <div className="hero-cta-group">
            <button className="cta-primary" onClick={() => scrollToRef('projects')}>
              {text.ctaPrimary}
            </button>
            <button className="cta-secondary" onClick={() => scrollToRef('contact')}>
              {text.ctaSecondary}
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="hero-card-minimal">
            <div className="hero-card-header">
              <div className="status-badge">
                <span className="status-dot"></span>
                <span>{text.statusText}</span>
              </div>
              <span className="hero-card-tag">{text.experienceTag}</span>
            </div>
            
            <div className="hero-card-body">
              <div className="dev-identity">
                <div className="dev-avatar">
                  <span>MHA</span>
                </div>
                <div className="dev-meta">
                  <h3>M. Haekal Arrafi</h3>
                  <p>Software Engineer</p>
                </div>
              </div>

              <div className="hero-divider"></div>

              <div className="tech-focus">
                <span className="focus-label">{text.techTitle}</span>
                <div className="tech-pills-grid">
                  <span className="tech-pill">Laravel</span>
                  <span className="tech-pill">PHP</span>
                  <span className="tech-pill">React.js</span>
                  <span className="tech-pill">Go (Golang)</span>
                  <span className="tech-pill">MySQL</span>
                  <span className="tech-pill">Figma</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
