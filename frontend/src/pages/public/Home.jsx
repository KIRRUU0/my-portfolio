import React, { useState, useEffect, useRef } from 'react';
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

  // Efek counter untuk statistik
  useEffect(() => {
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
  }, [totalExpYears, totalProjects, totalTech]);

  // GSAP ScrollTrigger Effects
  useEffect(() => {
    const sections = [
      { ref: aboutRef, selector: ".about-container" },
      { ref: projectsRef, selector: ".projects-grid-2col" },
      { ref: experiencesRef, selector: ".experiences-list" },
      { ref: certificatesRef, selector: ".certificate-slider-section" },
      { ref: techRef, selector: ".tech-categories-grid" },
      { ref: contactRef, selector: ".contact-container" }
    ];

    const timer = setTimeout(() => {
      sections.forEach((section) => {
        if (section.ref.current) {
          const el = section.ref.current.querySelector(section.selector);
          if (el) {
            gsap.fromTo(el,
              { y: 60, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: section.ref.current,
                  start: "top 85%",
                  toggleActions: "play none none none"
                }
              }
            );
          }
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Handle URL hash for smooth scrolling on mount
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      setTimeout(() => scrollToSection(hash), 500);
    }
  }, []);

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