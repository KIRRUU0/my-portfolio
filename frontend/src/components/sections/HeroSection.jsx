import React, { useLayoutEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import gsap from 'gsap';
import './HeroSection.css';

const HeroSection = ({ homeRef }) => {
  const { language } = useApp();
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const visualRef = useRef(null);
  const bubblesRef = useRef([]);

  const t = {
    en: {
      greeting: "Hello, I'm Haekal",
      role: "Fullstack Developer & UI/UX Designer",
      description: "Developing robust backend systems and intuitive digital experiences. Specializing in Laravel, React, Tailwind, and modern UI/UX design.",
      ctaPrimary: "View Projects",
      ctaSecondary: "Contact Me"
    },
    id: {
      greeting: "Halo, Saya Haekal",
      role: "Fullstack Developer & UI/UX Designer",
      description: "Mengembangkan sistem backend yang handal dan pengalaman digital yang intuitif. Memiliki spesialisasi dalam Laravel, React, Tailwind, dan desain UI/UX.",
      ctaPrimary: "Lihat Proyek",
      ctaSecondary: "Hubungi Saya"
    }
  };

  const text = t[language] || t.en;

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Entrance
      gsap.from(".digital-canvas", { opacity: 0, scale: 0.95, duration: 1.5, ease: "power3.out" });
      
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const rect = heroRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const xPos = (clientX - centerX) / (rect.width / 2);
        const yPos = (clientY - centerY) / (rect.height / 2);

        // Simple Parallax
        gsap.to(".layer-1", { 
          x: xPos * 15, y: yPos * 15, rotateY: xPos * 5, rotateX: -yPos * 5, duration: 0.8 
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        gsap.killTweensOf("*");
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToRef = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" ref={(el) => { homeRef.current = el; heroRef.current = el; }} className="hero-section">
      <div className="hero-background-glow"></div>
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
          <div className="digital-canvas">
            <div className="dot-grid"></div>
            
            <div className="visual-layer layer-1">
              <div className="minimal-glass-card">
                <div className="card-header">
                  <div className="status-dot"></div>
                  <span className="status-text">System Active</span>
                </div>
                <div className="card-body">
                  <div className="user-info">
                    <span className="info-label">Developer ID</span>
                    <span className="info-value">#MHA-2026</span>
                  </div>
                  <div className="tech-pills">
                    <span className="pill">Laravel</span>
                    <span className="pill">React</span>
                    <span className="pill">UI/UX</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="ambient-glow"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
