import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { projectsAPI } from '../../api/projects';
import { experiencesAPI } from '../../api/experiences';
import { certificatesAPI } from '../../api/certificates';
import { contactsAPI } from '../../api/contacts';
import CertificateSlider from '../../components/CertificateSlider';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Home.css';

const Home = () => {
    const { language } = useApp();
    const [allProjects, setAllProjects] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [techStack, setTechStack] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        message: ''
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);
    const [formError, setFormError] = useState('');

    // Refs untuk scroll
    const homeRef = useRef(null);
    const projectsRef = useRef(null);
    const experiencesRef = useRef(null);
    const certificatesRef = useRef(null);
    const techRef = useRef(null);
    const contactRef = useRef(null);

    const t = {
        en: {
            name: 'Muhammad Haekal Arrafi',
            role: 'WEB DEVELOPER & DESIGNER',
            description: 'Creating digital experiences with simplicity and purpose.',
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
            name: 'Muhammad Haekal Arrafi',
            role: 'WEB DEVELOPER & DESIGNER',
            description: 'Menciptakan pengalaman digital dengan kesederhanaan dan tujuan.',
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

        fetchData();
        
        const hash = window.location.hash.substring(1);
        if (hash) {
            setTimeout(() => {
                scrollToSection(hash);
            }, 500);
        }

        return () => {
            AOS.refresh();
        };
    }, []);

    useEffect(() => {
        AOS.refresh();
    }, [language]);

    const fetchData = async () => {
        try {
            const [projectsRes, experiencesRes, certificatesRes] = await Promise.all([
                projectsAPI.getAll(),
                experiencesAPI.getAll(),
                certificatesAPI.getAll()
            ]);

            const projects = projectsRes.projects || [];
            const sortedProjects = [...projects].sort((a, b) => 
                new Date(b.created_at) - new Date(a.created_at)
            );
            
            setAllProjects(sortedProjects);

            setExperiences(
                (experiencesRes.experiences || [])
                    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
            );

            setCertificates(certificatesRes.certificates || []);

            // Kumpulkan semua tech stack
            const allTech = new Set();
            projects.forEach(project => {
                if (project.tech_stack && Array.isArray(project.tech_stack)) {
                    project.tech_stack.forEach(tech => allTech.add(tech));
                }
            });
            
            const sortedTech = Array.from(allTech).sort();
            setTechStack(sortedTech);
            
        } catch (error) {
            console.error('Error fetching home data:', error);
        } finally {
            setLoading(false);
            setTimeout(() => AOS.refresh(), 100);
        }
    };

    const scrollToSection = (sectionId) => {
        const refs = {
            home: homeRef,
            projects: projectsRef,
            experiences: experiencesRef,
            certificates: certificatesRef,
            tech: techRef,
            contact: contactRef
        };
        
        const ref = refs[sectionId];
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const openProjectPopup = (project) => {
        setSelectedProject(project);
    };

    const closeProjectPopup = () => {
        setSelectedProject(null);
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');

        try {
            // Kirim data sesuai format yang diharapkan backend
            const response = await contactsAPI.submit({
                name: formData.name,
                message: formData.message,
                subject: 'New Message from Portfolio' // Optional
            });
            
            setFormSuccess(true);
            
            if (response.data?.whatsapp_link) {
                window.open(response.data.whatsapp_link, '_blank');
            }
            
            setFormData({
                name: '',
                message: ''
            });
            
            setTimeout(() => setFormSuccess(false), 5000);
        } catch (error) {
            console.error('Error submitting contact:', error);
            setFormError(text.error);
        } finally {
            setFormLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', {
            year: 'numeric',
            month: 'long'
        });
    };

    if (loading) {
        return <div className="loading">...</div>;
    }

    return (
        <div className="home">
            {/* Hero Section */}
            <section id="home" ref={homeRef} className="hero-section">
                <div className="hero-container">
                    <div className="hero-content">
                        <h1 className="hero-name">{text.name}</h1>
                        <p className="hero-role">{text.role}</p>
                        <p className="hero-description">{text.description}</p>
                    </div>
                    <div className="hero-image-wrapper">
                        <div className="hero-image-border">
                            <img 
                                src="/images/profile.jpg" 
                                alt="Muhammad Haekal Arrafi"
                                className="profile-photo"
                            />
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
                    {allProjects.map((project, index) => (
                        <div 
                            key={project.id}
                            className="project-card-2col"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                            onClick={() => openProjectPopup(project)}
                        >
                            <div className="project-card-content">
                                <div className="project-card-image">
                                    {project.image_url ? (
                                        <img 
                                            src={project.image_url} 
                                            alt={project.title}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="image-placeholder">
                                            <span>📁</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="project-card-info">
                                    <div className="project-card-header">
                                        <h3 className="project-card-title">{project.title}</h3>
                                        <span className="project-card-date">
                                            {formatDate(project.created_at)}
                                        </span>
                                    </div>
                                    
                                    <p className="project-card-description">
                                        {project.description.length > 100 
                                            ? project.description.substring(0, 100) + '...' 
                                            : project.description}
                                    </p>
                                    
                                    <div className="project-card-tech">
                                        {project.tech_stack?.slice(0, 3).map((tech, i) => (
                                            <span key={i} className="tech-badge">{tech}</span>
                                        ))}
                                        {project.tech_stack?.length > 3 && (
                                            <span className="tech-badge">+{project.tech_stack.length - 3}</span>
                                        )}
                                    </div>
                                    
                                    <div className="project-card-links" onClick={(e) => e.stopPropagation()}>
                                        {project.github_link && (
                                            <a 
                                                href={project.github_link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="project-card-link"
                                            >
                                                GitHub →
                                            </a>
                                        )}
                                        {project.live_link && (
                                            <a 
                                                href={project.live_link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="project-card-link"
                                            >
                                                Live Demo →
                                            </a>
                                        )}
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
                        <div 
                            key={exp.id} 
                            className="experience-item"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="experience-period">
                                {formatDate(exp.start_date)} — {exp.current ? text.present : formatDate(exp.end_date)}
                            </div>
                            <div className="experience-content">
                                <h3 className="experience-position">{exp.position}</h3>
                                <span className="experience-company">{exp.company}</span>
                                <p className="experience-description">{exp.description}</p>
                                {exp.achievements && exp.achievements.length > 0 && (
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

            {/* Tech Stack Section - Marquee */}
            <section id="tech" ref={techRef} className="tech-section">
                <div className="section-header">
                    <h2 className="section-title">{text.techTitle}</h2>
                    <p className="tech-description">{text.techDescription}</p>
                </div>
                
                <div className="tech-marquee">
                    <div className="tech-marquee-track">
                        {[...techStack, ...techStack].map((tech, index) => (
                            <span 
                                key={`${tech}-${index}`} 
                                className="tech-item"
                            >
                                {tech}
                            </span>
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
                
                <div 
                    className="contact-container"
                    data-aos="fade-up"
                    data-aos-duration="800"
                >
                    <form onSubmit={handleFormSubmit} className="contact-form">
                        {formError && <div className="error-message">{formError}</div>}
                        {formSuccess && <div className="success-message">{text.success}</div>}
                        
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                placeholder={text.nameLabel}
                                value={formData.name}
                                onChange={handleFormChange}
                                required
                                disabled={formLoading}
                                className="form-input"
                            />
                        </div>
                        
                        <div className="form-group">
                            <textarea
                                name="message"
                                rows="4"
                                placeholder={text.messageLabel}
                                value={formData.message}
                                onChange={handleFormChange}
                                required
                                disabled={formLoading}
                                className="form-input"
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={formLoading}
                        >
                            {formLoading ? text.sending : text.send}
                        </button>
                    </form>
                </div>
            </section>

            {/* Project Popup Modal */}
            {selectedProject && (
                <div className="popup-overlay" onClick={closeProjectPopup}>
                    <div className="popup-content project-popup" onClick={(e) => e.stopPropagation()}>
                        <button className="popup-close" onClick={closeProjectPopup}>×</button>
                        
                        <div className="popup-body">
                            <div className="popup-image">
                                {selectedProject.image_url ? (
                                    <img src={selectedProject.image_url} alt={selectedProject.title} />
                                ) : (
                                    <div className="image-placeholder-large">📁</div>
                                )}
                            </div>
                            
                            <div className="popup-details">
                                <h2>{selectedProject.title}</h2>
                                
                                <div className="popup-meta">
                                    <span className="popup-date">
                                        {formatDate(selectedProject.created_at)}
                                    </span>
                                </div>
                                
                                <div className="popup-full-description">
                                    <p>{selectedProject.description}</p>
                                    {selectedProject.content && (
                                        <div className="popup-content">
                                            <h3>Overview</h3>
                                            <p>{selectedProject.content}</p>
                                        </div>
                                    )}
                                </div>
                                
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
                                        <a 
                                            href={selectedProject.github_link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="popup-link"
                                        >
                                            GitHub Repository →
                                        </a>
                                    )}
                                    {selectedProject.live_link && (
                                        <a 
                                            href={selectedProject.live_link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="popup-link"
                                        >
                                            Live Demo →
                                        </a>
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