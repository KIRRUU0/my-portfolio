import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    
    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Hamburger Menu Button - hanya muncul saat sidebar tertutup */}
            {!isOpen && (
                <button className="hamburger-btn" onClick={toggleSidebar}>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>
            )}

            {/* Overlay gelap saat sidebar terbuka di mobile */}
            {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
            
            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>ADMIN</h2>
                    <button className="close-btn" onClick={closeSidebar}>✕</button>
                </div>
                
                <nav className="sidebar-nav">
                    <Link to="/admin" className={`nav-link ${isActive('/admin')}`} onClick={closeSidebar}>
                        Dashboard
                    </Link>
                    <Link to="/admin/projects" className={`nav-link ${isActive('/admin/projects')}`} onClick={closeSidebar}>
                        Projects
                    </Link>
                    <Link to="/admin/experiences" className={`nav-link ${isActive('/admin/experiences')}`} onClick={closeSidebar}>
                        Experiences
                    </Link>
                    <Link to="/admin/contacts" className={`nav-link ${isActive('/admin/contacts')}`} onClick={closeSidebar}>
                        Messages
                    </Link>
                    <Link to="/admin/certificates" className={`nav-link ${isActive('/admin/certificates')}`} onClick={closeSidebar}>
                        Certificates
                    </Link>
                </nav>
                
                <div className="sidebar-footer">
                    <Link to="/" target="_blank" className="nav-link" onClick={closeSidebar}>
                        View Site
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Sidebar;