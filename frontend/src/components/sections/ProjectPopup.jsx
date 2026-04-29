import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useApp } from '../../context/AppContext';
import ImageGallery from '../ImageGallery';
import './ProjectPopup.css';

const ProjectPopup = ({ selectedProject, closeProjectPopup, formatDate }) => {
  const { language } = useApp();
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  const t = {
    en: {
      categories: 'Categories',
      overview: 'Overview',
      details: 'Key Features',
      tech: 'Tech Stack',
      links: 'Project Links',
      visit: 'Visit Project',
      viewCode: 'Source Code',
      viewDesign: 'Design Mockup'
    },
    id: {
      categories: 'Kategori',
      overview: 'Ringkasan',
      details: 'Fitur Utama',
      tech: 'Teknologi',
      links: 'Tautan Proyek',
      visit: 'Kunjungi Situs',
      viewCode: 'Kode Sumber',
      viewDesign: 'Mockup Desain'
    }
  };

  const text = t[language] || t.en;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!selectedProject) return null;

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!selectedProject.images || selectedProject.images.length <= 1) return;
    const direction = touchStart - touchEnd > 50 ? 'left' : touchStart - touchEnd < -50 ? 'right' : null;
    if (direction) {
      window.dispatchEvent(new CustomEvent('swipe', { detail: { direction } }));
    }
  };

  return ReactDOM.createPortal(
    <div className="project-popup-overlay" onClick={closeProjectPopup}>
      <div className="popup-content project-popup" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={closeProjectPopup}>
          <i className="bi bi-x-lg"></i>
        </button>
        
        <div className="popup-body-scrollable">
          <div 
            className="popup-image-section"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <ImageGallery 
              images={selectedProject.images || [selectedProject.image_url]} 
              title={selectedProject.title}
              hideNavButtons={isMobile}
            />
          </div>
          
          <div className="popup-info-section">
            <div className="popup-header-main">
              <h2 className="popup-title">{selectedProject.title}</h2>
              <div className="popup-meta-badges">
                <span className="popup-date-badge">
                  <i className="bi bi-calendar3"></i> {formatDate(selectedProject.created_at)}
                </span>
                {selectedProject.status && (
                  <span className={`popup-status-badge ${selectedProject.status}`}>
                    {selectedProject.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            
            <div className="popup-details-grid">
              <div className="popup-main-content">
                <div className="popup-section">
                  <h3 className="section-subtitle"><i className="bi bi-info-circle"></i> {text.overview}</h3>
                  <p className="popup-description">{selectedProject.description}</p>
                </div>
                
                {selectedProject.content && (
                  <div className="popup-section">
                    <h3 className="section-subtitle"><i className="bi bi-stars"></i> {text.details}</h3>
                    <div className="popup-rich-content">{selectedProject.content}</div>
                  </div>
                )}
              </div>
              
              <div className="popup-side-content">
                <div className="popup-section">
                  <h3 className="section-subtitle"><i className="bi bi-tags"></i> {text.categories}</h3>
                  <div className="popup-tags">
                    {selectedProject.categories?.map((cat, i) => (
                      <span key={i} className="popup-tag-cat">{cat}</span>
                    ))}
                  </div>
                </div>

                <div className="popup-section">
                  <h3 className="section-subtitle"><i className="bi bi-cpu"></i> {text.tech}</h3>
                  <div className="popup-tags-tech">
                    {selectedProject.tech_stack?.map((tech, i) => (
                      <span key={i} className="popup-tag-tech">{tech}</span>
                    ))}
                  </div>
                </div>

                <div className="popup-section">
                  <h3 className="section-subtitle"><i className="bi bi-link-45deg"></i> {text.links}</h3>
                  <div className="popup-action-links">
                    {selectedProject.live_link && (
                      <a href={selectedProject.live_link} target="_blank" rel="noopener noreferrer" className="btn-popup-primary">
                        <i className="bi bi-globe"></i> {text.visit}
                      </a>
                    )}
                    {selectedProject.github_link && (
                      <a href={selectedProject.github_link} target="_blank" rel="noopener noreferrer" className="btn-popup-outline">
                        <i className="bi bi-github"></i> {text.viewCode}
                      </a>
                    )}
                    {selectedProject.desain_link && (
                      <a href={selectedProject.desain_link} target="_blank" rel="noopener noreferrer" className="btn-popup-outline">
                        <i className="bi bi-palette"></i> {text.viewDesign}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProjectPopup;