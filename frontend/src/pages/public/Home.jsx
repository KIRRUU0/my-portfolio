import React, { useState, useEffect, useRef } from 'react';
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

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false, // false agar animasi muncul setiap kali scroll
      mirror: true, // true agar animasi muncul saat scroll naik juga
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    // Validasi
    if (!formData.name.trim() || !formData.message.trim()) {
      setFormError('Nama dan pesan harus diisi');
      setFormLoading(false);
      return;
    }

    // Nomor WhatsApp Anda (format internasional tanpa +)
    const phoneNumber = '6285158125501';
    
    // Format pesan
    const message = `*Pesan Baru dari Portfolio*\n\n*Nama:* ${formData.name}\n*Pesan:* ${formData.message}`;
    
    // Encode untuk URL
    const encodedMessage = encodeURIComponent(message);
    
    // Buat link WhatsApp
    const waLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Redirect ke WhatsApp
    window.open(waLink, '_blank');
    
    // Reset form
    setFormData({ name: '', message: '' });
    setFormSuccess(true);
    setFormLoading(false);
    
    // Hilangkan pesan sukses setelah 3 detik
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