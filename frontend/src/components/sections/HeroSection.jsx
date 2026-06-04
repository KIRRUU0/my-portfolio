import React, { useLayoutEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import ScrambleText from '../ScrambleText';
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
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ctx = gsap.context(() => {
      // Staggered text reveal timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      tl.from(".hero-greeting", { 
        opacity: 0, x: -30, duration: 0.6 
      })
      .from(".hero-title", { 
        opacity: 0, y: 30, duration: 0.7 
      }, "-=0.3")
      .from(".hero-description", { 
        opacity: 0, y: 20, duration: 0.6 
      }, "-=0.3")
      .from(".hero-cta-group .cta-primary", { 
        opacity: 0, y: 20, duration: 0.5 
      }, "-=0.2")
      .from(".hero-cta-group .cta-secondary", { 
        opacity: 0, y: 20, duration: 0.5 
      }, "-=0.3")
      .from(".digital-canvas", { 
        opacity: 0, scale: 0.88, duration: 1, ease: "power2.out" 
      }, "-=0.8");

      // Mouse parallax on glass card
      const handleMouseMove = (e) => {
        if (!heroRef.current) return;
        const { clientX, clientY } = e;
        const rect = heroRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const xPos = (clientX - centerX) / (rect.width / 2);
        const yPos = (clientY - centerY) / (rect.height / 2);

        gsap.to(".layer-1", { 
          x: xPos * 12, y: yPos * 12, 
          rotateY: xPos * 4, rotateX: -yPos * 4, 
          duration: 0.8, ease: "power2.out"
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
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
          <span className="hero-greeting">
            <ScrambleText text={text.greeting} duration={1.0} delay={0.1} />
          </span>
          <h1 className="hero-title">
            <ScrambleText text={text.role} duration={1.4} delay={0.3} />
          </h1>
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
