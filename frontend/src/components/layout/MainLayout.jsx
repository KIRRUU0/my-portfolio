import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ThemeToggle from '../ThemeToggle';
import LanguageSelector from '../LanguageSelector';
import BackToTop from '../BackToTop';
import CustomCursor from '../CustomCursor';
import './MainLayout.css';

const MainLayout = () => {
    const { language } = useApp();
    const location = useLocation();
    const navigate = useNavigate();
    const isHomePage = location.pathname === '/';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    
    const t = {
        en: {
            home: 'Home',
            about: 'About',
            projects: 'Projects',
            experiences: 'Experiences',
            certificates: 'Certificates',
            tech: 'Tech Stack',
            contact: 'Contact',
            status: 'System Status: Optimized',
            copyright: '© 2026 M. Haekal Arrafi'
        },
        id: {
            home: 'Home',
            about: 'Tentang',
            projects: 'Proyek',
            experiences: 'Pengalaman',
            certificates: 'Sertifikat',
            tech: 'Teknologi',
            contact: 'Kontak',
            status: 'Status Sistem: Optimal',
            copyright: '© 2026 M. Haekal Arrafi'
        }
    };

    const text = t[language] || t.en;



    // Handle scroll for header state and active section
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Logic to determine active section
            const sections = ['home', 'about', 'projects', 'experiences', 'certificates', 'tech', 'contact'];
            const current = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 150 && rect.bottom >= 150;
                }
                return false;
            });
            if (current) setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        setMobileMenuOpen(false);
        if (!isHomePage) {
            navigate(`/#${sectionId}`);
            return;
        }
        
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setMobileMenuOpen(false);
            }
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="main-layout">
            {/* Abstract background decorations */}
            <div className="abstract-bg" aria-hidden="true">
                <div className="abstract-blob blob-1"></div>
                <div className="abstract-blob blob-2"></div>
                <div className="abstract-blob blob-3"></div>
                <div className="abstract-grid"></div>
            </div>
            <header className={`main-header ${scrolled ? 'scrolled' : ''}`}>
                <div className="header-container">
                    <div className="header-left-spacer"></div>

                    {/* Desktop Navigation */}
                    <nav className="desktop-nav">
                        {['home', 'about', 'projects', 'experiences', 'certificates', 'tech', 'contact'].map(section => (
                            <button 
                                key={section}
                                onClick={() => scrollToSection(section)} 
                                className={`nav-link ${activeSection === section ? 'active' : ''}`}
                            >
                                {text[section]}
                            </button>
                        ))}
                    </nav>
                    
                    <div className="header-controls">
                        <ThemeToggle />
                        <LanguageSelector />
                        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
                    <div className="mobile-nav-header">
                        <span className="mobile-nav-logo">MENU</span>
                        <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div className="mobile-nav-links">
                        {['home', 'about', 'projects', 'experiences', 'certificates', 'tech', 'contact'].map(section => (
                            <button 
                                key={section}
                                onClick={() => scrollToSection(section)} 
                                className={`mobile-nav-link ${activeSection === section ? 'active' : ''}`}
                            >
                                <span className="link-number">0{['home', 'about', 'projects', 'experiences', 'certificates', 'tech', 'contact'].indexOf(section) + 1}</span>
                                {text[section]}
                            </button>
                        ))}
                    </div>
                </div>
                
                {mobileMenuOpen && <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}></div>}
            </header>
            
            <main className="main-content">
                <Outlet />
            </main>
            
            <footer className="main-footer">
                <div className="footer-container">
                    <div className="footer-status">
                        <span className="status-indicator"></span>
                        {text.status}
                    </div>
                    
                    <div className="footer-copyright">
                        {text.copyright}
                    </div>
                    
                    <div className="footer-socials">
                        <a href="https://linkedin.com/in/muhammadhaekalarrafi" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <i className="bi bi-linkedin"></i>
                        </a>
                        <a href="https://github.com/haekalarrafi" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <i className="bi bi-github"></i>
                        </a>
                        <a href="mailto:haekalarrafi24@gmail.com" className="social-icon">
                            <i className="bi bi-envelope-fill"></i>
                        </a>
                    </div>
                </div>
            </footer>
            
            <BackToTop />
            <CustomCursor />
        </div>
    );
};

export default MainLayout;