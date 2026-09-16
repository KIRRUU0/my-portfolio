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
        .from(".hero-cta-group", { opacity: 0, y: 15, duration: 0.5 }, "-=0.3");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToRef = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" ref={(el) => { homeRef.current = el; heroRef.current = el; }} className="hero-section">
      <div className="hero-container hero-centered">
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
      </div>
    </section>
  );
};

export default HeroSection;
