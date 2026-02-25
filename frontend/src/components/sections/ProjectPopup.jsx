import React from 'react';
import ImageGallery from '../ImageGallery';
import './ProjectPopup.css';

const ProjectPopup = ({ selectedProject, closeProjectPopup, formatDate }) => {
  if (!selectedProject) return null;

  return (
    <div className="popup-overlay" onClick={closeProjectPopup}>
      <div className="popup-content project-popup" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={closeProjectPopup}>×</button>
        
        <div className="popup-body">
          <div className="popup-image">
            <ImageGallery 
              images={selectedProject.images || [selectedProject.image_url]} 
              title={selectedProject.title}
            />
          </div>
          
          <div className="popup-details">
            <div className="popup-header">
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
            </div>
            
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
            
            {selectedProject.description && (
              <div className="popup-description-section">
                <h3>Overview</h3>
                <p className="popup-description">
                  {selectedProject.description}
                </p>
              </div>
            )}
            
            {selectedProject.content && (
              <div className="popup-content-section">
                <h3>Details</h3>
                <div className="popup-content">
                  {selectedProject.content}
                </div>
              </div>
            )}
            
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
                <a href={selectedProject.github_link} target="_blank" rel="noopener noreferrer" className="popup-link">GitHub →</a>
              )}
              {selectedProject.live_link && (
                <a href={selectedProject.live_link} target="_blank" rel="noopener noreferrer" className="popup-link">Live Demo →</a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPopup;