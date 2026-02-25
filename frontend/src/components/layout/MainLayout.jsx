import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ThemeToggle from '../ThemeToggle';
import LanguageSelector from '../LanguageSelector';
import './MainLayout.css';

const MainLayout = () => {
    const { language } = useApp();
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const t = {
        en: {
            home: 'Home',
            about: 'About',
            projects: 'Projects',
            experiences: 'Experiences',
            certificates: 'Certificates',
            tech: 'Tech Stack',
            contact: 'Contact'
        },
        id: {
            home: 'Beranda',
            about: 'Tentang',
            projects: 'Proyek',
            experiences: 'Pengalaman',
            certificates: 'Sertifikat',
            tech: 'Teknologi',
            contact: 'Kontak'
        }
    };

    const text = t[language] || t.en;

    const scrollToSection = (sectionId) => {
        setMobileMenuOpen(false);
        if (!isHomePage) {
            window.location.href = `/#${sectionId}`;
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

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    return (
        <div className="main-layout">
            <header className="main-header">
                <div className="header-container">
                    {/* <Link to="/" className="logo">
                        <span className="logo-text">MHA</span>
                    </Link> */}
                    
                    {/* Desktop Navigation */}
                    <nav className="desktop-nav">
                        <button onClick={() => scrollToSection('home')} className="nav-link">{text.home}</button>
                        <button onClick={() => scrollToSection('about')} className="nav-link">{text.about}</button>
                        <button onClick={() => scrollToSection('projects')} className="nav-link">{text.projects}</button>
                        <button onClick={() => scrollToSection('experiences')} className="nav-link">{text.experiences}</button>
                        <button onClick={() => scrollToSection('certificates')} className="nav-link">{text.certificates}</button>
                        <button onClick={() => scrollToSection('tech')} className="nav-link">{text.tech}</button>
                        <button onClick={() => scrollToSection('contact')} className="nav-link">{text.contact}</button>
                    </nav>
                    
                    <div className="header-controls">
                        <ThemeToggle />
                        <LanguageSelector />
                        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
                            {mobileMenuOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
                    {/* <div className="mobile-nav-header">
                        <span className="mobile-logo">MHA</span>
                        <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>✕</button>
                    </div> */}
                    <nav className="mobile-nav-links">
                        <button onClick={() => scrollToSection('home')} className="mobile-nav-link">{text.home}</button>
                        <button onClick={() => scrollToSection('about')} className="mobile-nav-link">{text.about}</button>
                        <button onClick={() => scrollToSection('projects')} className="mobile-nav-link">{text.projects}</button>
                        <button onClick={() => scrollToSection('experiences')} className="mobile-nav-link">{text.experiences}</button>
                        <button onClick={() => scrollToSection('certificates')} className="mobile-nav-link">{text.certificates}</button>
                        <button onClick={() => scrollToSection('tech')} className="mobile-nav-link">{text.tech}</button>
                        <button onClick={() => scrollToSection('contact')} className="mobile-nav-link">{text.contact}</button>
                    </nav>
                    <div className="mobile-nav-footer">
                        <ThemeToggle />
                        <LanguageSelector />
                    </div>
                </div>
                
                {mobileMenuOpen && <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}></div>}
            </header>
            
            <main className="main-content">
                <Outlet />
            </main>
            
            <footer className="main-footer">
                <div className="footer-container">
                    <p>© 2026 Muhammad Haekal Arrafi</p>
                    <div className="social-links">
                        <a href="https://github.com/yourusername" target="_blank" rel="noopener">GitHub</a>
                        <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;