import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useApp } from '../../context/AppContext';
import { projects } from '../../data/projects';
import { experiences } from '../../data/experiences';
import { certificates } from '../../data/certificates';
import HeroSection from '../../components/sections/HeroSection';
import AboutSection from '../../components/sections/AboutSection';
import ProjectsSection from '../../components/sections/ProjectsSection';
import ExperiencesSection from '../../components/sections/ExperiencesSection';
import CertificatesSection from '../../components/sections/CertificatesSection';
import TechStackSection from '../../components/sections/TechStackSection';
import ContactSection from '../../components/sections/ContactSection';
import ProjectPopup from '../../components/sections/ProjectPopup';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Home.css';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

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
  const [counterStarted, setCounterStarted] = useState(false);
  
  // Refs untuk scroll dan GSAP
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

  // Counter animation function — triggered by ScrollTrigger
  const startCounter = useCallback(() => {
    if (counterStarted) return;
    setCounterStarted(true);

    // Experience years counter
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

    // Project counter
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

    // Tech counter
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
  }, [counterStarted, totalExpYears, totalProjects, totalTech]);

  // GSAP ScrollTrigger Effects — unique animation per section
  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Set final values immediately
      const reduceMotionTimer = setTimeout(() => {
        setExpYears(totalExpYears);
        setProjectCount(totalProjects);
        setTechCount(totalTech);
        setCounterStarted(true);
      }, 0);
      return () => clearTimeout(reduceMotionTimer);
    }

    const timer = setTimeout(() => {
      // --- About Section: Bento Grid Staggered entrance ---
      if (aboutRef.current) {
        const bentoCards = aboutRef.current.querySelectorAll('.bento-card');
        
        if (bentoCards.length) {
          gsap.fromTo(bentoCards,
            { y: 50, opacity: 0, scale: 0.96 },
            {
              y: 0, opacity: 1, scale: 1,
              duration: 0.7, ease: "power3.out",
              stagger: 0.15,
              scrollTrigger: {
                trigger: aboutRef.current,
                start: "top 80%",
                toggleActions: "play none none none"
              }
            }
          );
        }

        // Counter triggered when About section enters viewport
        ScrollTrigger.create({
          trigger: aboutRef.current,
          start: "top 75%",
          onEnter: startCounter,
          once: true
        });
      }

      // --- Projects Section: Staggered card grid ---
      if (projectsRef.current) {
        const projectCards = projectsRef.current.querySelectorAll('.project-card');
        if (projectCards.length) {
          gsap.fromTo(projectCards,
            { y: 40, opacity: 0, scale: 0.95 },
            {
              y: 0, opacity: 1, scale: 1,
              duration: 0.6, ease: "power3.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: projectsRef.current,
                start: "top 80%",
                toggleActions: "play none none none"
              }
            }
          );
        }
      }

      // --- Experiences Section: Timeline cascade ---
      if (experiencesRef.current) {
        const expItems = experiencesRef.current.querySelectorAll('.experience-item');
        if (expItems.length) {
          gsap.fromTo(expItems,
            { y: 30, opacity: 0, x: -20 },
            {
              y: 0, opacity: 1, x: 0,
              duration: 0.6, ease: "power3.out",
              stagger: 0.15,
              scrollTrigger: {
                trigger: experiencesRef.current,
                start: "top 80%",
                toggleActions: "play none none none"
              }
            }
          );
        }
      }

      // --- Certificates Section: Smooth slide-in ---
      if (certificatesRef.current) {
        const certSlider = certificatesRef.current.querySelector('.certificate-slider-section');
        if (certSlider) {
          gsap.fromTo(certSlider,
            { y: 50, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
              scrollTrigger: {
                trigger: certificatesRef.current,
                start: "top 80%",
                toggleActions: "play none none none"
              }
            }
          );
        }
      }

      // --- Tech Stack Section: Category cards fan-in with subtle rotation ---
      if (techRef.current) {
        const techCards = techRef.current.querySelectorAll('.tech-category-card');
        if (techCards.length) {
          gsap.fromTo(techCards,
            { y: 40, opacity: 0, rotateX: 8 },
            {
              y: 0, opacity: 1, rotateX: 0,
              duration: 0.7, ease: "power3.out",
              stagger: 0.12,
              scrollTrigger: {
                trigger: techRef.current,
                start: "top 80%",
                toggleActions: "play none none none"
              }
            }
          );
        }
      }

      // --- Contact Section: Form scale + fade ---
      if (contactRef.current) {
        const contactForm = contactRef.current.querySelector('.contact-container');
        if (contactForm) {
          gsap.fromTo(contactForm,
            { y: 40, opacity: 0, scale: 0.97 },
            {
              y: 0, opacity: 1, scale: 1,
              duration: 0.8, ease: "power3.out",
              scrollTrigger: {
                trigger: contactRef.current,
                start: "top 80%",
                toggleActions: "play none none none"
              }
            }
          );
        }
      }

      // --- Section headers: Text mask reveal ---
      const sectionTitles = document.querySelectorAll('.section-title, .about-section-title, .slider-header h2');
      sectionTitles.forEach(title => {
        if (!title.querySelector('.mask-span')) {
          const originalText = title.innerHTML;
          title.innerHTML = `<span class="mask-span" style="display: inline-block; will-change: transform;">${originalText}</span>`;
        }
      });

      const titleSpans = document.querySelectorAll('.section-title .mask-span, .about-section-title .mask-span, .slider-header h2 .mask-span');
      if (titleSpans.length) {
        titleSpans.forEach(span => {
          gsap.fromTo(span,
            { y: "105%", opacity: 0 },
            {
              y: "0%", opacity: 1, duration: 0.8, ease: "power3.out",
              scrollTrigger: {
                trigger: span.parentElement,
                start: "top 90%",
                toggleActions: "play none none none"
              }
            }
          );
        });
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [startCounter, totalExpYears, totalProjects, totalTech]);



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

  // Handle URL hash for smooth scrolling on mount
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      setTimeout(() => scrollToSection(hash), 500);
    }
  }, []);

  const openProjectPopup = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };
  const closeProjectPopup = () => {
    setSelectedProject(null);
    document.body.style.overflow = '';
  };

  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    if (!formData.name.trim() || !formData.message.trim()) {
      setFormError('Nama dan pesan harus diisi');
      setFormLoading(false);
      return;
    }

    const phoneNumber = '6285158125501';
    const message = `*Pesan Baru dari Portfolio*\n\n*Nama:* ${formData.name}\n*Pesan:* ${formData.message}`;
    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(waLink, '_blank');
    setFormData({ name: '', message: '' });
    setFormSuccess(true);
    setFormLoading(false);
    setTimeout(() => setFormSuccess(false), 3000);
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
      <Helmet>
        <title>Portfolio | Haekal Arrafi</title>
        <meta name="description" content="Portfolio of Haekal Arrafi, a Frontend Developer and UI/UX Designer showcasing projects, experiences, and certificates." />
      </Helmet>
      <HeroSection homeRef={homeRef} />
      <AboutSection 
        aboutRef={aboutRef}
        expYears={expYears}
        projectCount={projectCount}
        techCount={techCount}
      />
      <ProjectsSection 
        projectsRef={projectsRef}
        projects={projects}
        formatDate={formatDate}
        openProjectPopup={openProjectPopup}
      />
      <ExperiencesSection 
        experiencesRef={experiencesRef}
        experiences={experiences}
        formatDate={formatDate}
      />
      <CertificatesSection 
        certificatesRef={certificatesRef}
        certificates={certificates}
      />
      <TechStackSection 
        techRef={techRef}
        projects={projects}
      />
      <ContactSection 
        contactRef={contactRef}
        formData={formData}
        formError={formError}
        formSuccess={formSuccess}
        formLoading={formLoading}
        handleFormChange={handleFormChange}
        handleFormSubmit={handleFormSubmit}
      />
      <ProjectPopup 
        selectedProject={selectedProject}
        closeProjectPopup={closeProjectPopup}
        formatDate={formatDate}
      />
    </div>
  );
};

export default Home;