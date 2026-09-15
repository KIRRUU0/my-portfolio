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
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      
      tl.from(".hero-greeting", { opacity: 0, y: 15, duration: 0.5 })
        .from(".hero-title", { opacity: 0, y: 20, duration: 0.6 }, "-=0.3")
        .from(".hero-description", { opacity: 0, y: 15, duration: 0.5 }, "-=0.3")
        .from(".hero-cta-group", { opacity: 0, y: 15, duration: 0.5 }, "-=0.3")
        .from(".hero-code-window", { opacity: 0, y: 20, duration: 0.6 }, "-=0.4");
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
          <div className="hero-code-window">
            <div className="code-window-header">
              <div className="window-controls">
                <span className="window-dot dot-close"></span>
                <span className="window-dot dot-min"></span>
                <span className="window-dot dot-expand"></span>
              </div>
              <div className="window-tab">
                <span className="tab-ts-icon">TS</span>
                <span className="tab-title">haekal.config.ts</span>
              </div>
              <div className="window-badge">TypeScript</div>
            </div>
            
            <div className="code-window-body">
              <div className="code-line-numbers">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
              </div>
              <pre className="code-content">
                <code>
                  <span className="code-keyword">export const </span>
                  <span className="code-var">developer</span>
                  <span className="code-punct">: </span>
                  <span className="code-type">DeveloperProfile</span>
                  <span className="code-punct"> = </span>
                  <span className="code-bracket">{'{'}</span>
                  {'\n'}
                  {'  '}<span className="code-prop">name</span><span className="code-punct">: </span><span className="code-string">"M. Haekal Arrafi"</span><span className="code-punct">,</span>
                  {'\n'}
                  {'  '}<span className="code-prop">role</span><span className="code-punct">: </span><span className="code-string">"Fullstack Developer"</span><span className="code-punct">,</span>
                  {'\n'}
                  {'  '}<span className="code-prop">location</span><span className="code-punct">: </span><span className="code-string">"Indonesia"</span><span className="code-punct">,</span>
                  {'\n'}
                  {'  '}<span className="code-prop">stack</span><span className="code-punct">: [</span>
                  {'\n'}
                  {'    '}<span className="code-string">"Laravel"</span><span className="code-punct">, </span><span className="code-string">"React"</span><span className="code-punct">, </span><span className="code-string">"TypeScript"</span><span className="code-punct">,</span>
                  {'\n'}
                  {'    '}<span className="code-string">"Go"</span><span className="code-punct">, </span><span className="code-string">"Tailwind"</span><span className="code-punct">, </span><span className="code-string">"MySQL"</span>
                  {'\n'}
                  {'  '}<span className="code-punct">]</span>
                  {'\n'}
                  <span className="code-bracket">{'}'}</span><span className="code-punct">;</span>
                </code>
              </pre>
            </div>

            <div className="code-window-footer">
              <div className="footer-left">
                <span className="footer-check">✓</span>
                <span>0 errors, 0 warnings</span>
              </div>
              <div className="footer-right">
                <span>UTF-8</span>
                <span>Spaces: 2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
