import React, { useState, useEffect } from 'react';
import ImageGallery from '../ImageGallery';
import './ProjectPopup.css';

const ProjectPopup = ({ selectedProject, closeProjectPopup, formatDate }) => {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Deteksi resize untuk mobile/tablet
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!selectedProject) return null;

  // Handle touch events untuk swipe gambar
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!selectedProject.images || selectedProject.images.length <= 1) return;
    
    // Dapatkan instance ImageGallery melalui event custom
    const event = new CustomEvent('swipe', {
      detail: {
        direction: touchStart - touchEnd > 50 ? 'left' : touchStart - touchEnd < -50 ? 'right' : null
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="popup-overlay" onClick={closeProjectPopup}>
      <div className="popup-content project-popup" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={closeProjectPopup}>×</button>
        
        <div className="popup-body-vertical">
          {/* GAMBAR DI ATAS - dengan touch events */}
          <div 
            className="popup-image-vertical"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <ImageGallery 
              images={selectedProject.images || [selectedProject.image_url]} 
              title={selectedProject.title}
              hideNavButtons={isMobile} // Prop baru untuk menyembunyikan tombol di mobile
            />
          </div>
          
          {/* DATA DI BAWAH GAMBAR */}
          <div className="popup-details-vertical">
            <h2>{selectedProject.title}</h2>
            
            <div className="popup-meta">
              <span className="popup-date">
                {formatDate(selectedProject.created_at)}
              </span>
              
              {selectedProject.status && (
                <span className={`popup-status-badge ${selectedProject.status}`}>
                  {selectedProject.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                </span>
              )}
            </div>
            
            {/* Categories */}
            {selectedProject.categories && selectedProject.categories.length > 0 && (
              <div className="popup-categories">
                <h3>Categories</h3>
                <div className="popup-category-tags">
                  {selectedProject.categories.map((category, i) => (
                    <span key={i} className="category-badge-large">{category}</span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Overview */}
            {selectedProject.description && (
              <div className="popup-description-section">
                <h3>Overview</h3>
                <p className="popup-description">
                  {selectedProject.description}
                </p>
              </div>
            )}
            
            {/* Details */}
            {selectedProject.content && (
              <div className="popup-content-section">
                <h3>Details</h3>
                <div className="popup-content">
                  {selectedProject.content}
                </div>
              </div>
            )}
            
            {/* Technologies */}
            <div className="popup-tech-stack">
              <h3>Technologies</h3>
              <div className="popup-tech-tags">
                {selectedProject.tech_stack?.map((tech, i) => (
                  <span key={i} className="tech-badge-large">{tech}</span>
                ))}
              </div>
            </div>
            
            {/* Links */}
            <div className="popup-links">
              {selectedProject.github_link && (
                <a href={selectedProject.github_link} target="_blank" rel="noopener noreferrer" className="popup-link">
                  GitHub →
                </a>
              )}
              {selectedProject.live_link && (
                <a href={selectedProject.live_link} target="_blank" rel="noopener noreferrer" className="popup-link">
                  Live Website →
                </a>
              )}
              {selectedProject.desain_link && (
                <a href={selectedProject.desain_link} target="_blank" rel="noopener noreferrer" className="popup-link">
                  Design →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPopup;