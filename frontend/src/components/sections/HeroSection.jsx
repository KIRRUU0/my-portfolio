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
                  <div className="window-dots">
                    <span className="window-dot red"></span>
                    <span className="window-dot yellow"></span>
                    <span className="window-dot green"></span>
                  </div>
                  <span className="status-text">developer.json</span>
                </div>
                <div className="card-body">
                  <pre className="code-block">
                    <span className="code-brace">{"{"}</span>{"\n"}
                    <span className="code-key">  "name"</span><span className="code-brace">:</span> <span className="code-value">"Haekal Arrafi"</span><span className="code-brace">,</span>{"\n"}
                    <span className="code-key">  "role"</span><span className="code-brace">:</span> <span className="code-value">"Fullstack Developer"</span><span className="code-brace">,</span>{"\n"}
                    <span className="code-key">  "status"</span><span className="code-brace">:</span> <span className="code-value">"Open to Work"</span><span className="code-brace">,</span>{"\n"}
                    <span className="code-key">  "stack"</span><span className="code-brace">:</span> <span className="code-brace">[</span>
                    <span className="code-value">"Laravel"</span><span className="code-brace">,</span> <span className="code-value">"React"</span><span className="code-brace">,</span> <span className="code-value">"Go"</span>
                    <span className="code-brace">]</span>{"\n"}
                    <span className="code-brace">{"}"}</span>
                  </pre>
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
