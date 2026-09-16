import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import ProjectFilter from './ProjectFilter';
import './ProjectsSection.css';

const ProjectsSection = ({ projectsRef, projects, formatDate, openProjectPopup }) => {
  const { language } = useApp();
  const [filter, setFilter] = useState('newest');

  const t = {
    en: {
      featuredTitle: 'Featured Projects',
      spotlightTag: 'Spotlight Project',
      viewDetails: 'View Details',
      otherProjects: 'All Projects'
    },
    id: {
      featuredTitle: 'Proyek Unggulan',
      spotlightTag: 'Proyek Utama',
      viewDetails: 'Lihat Detail',
      otherProjects: 'Semua Proyek'
    }
  };

  const text = t[language] || t.en;

  // Urutkan project berdasarkan filter
  const sortedProjects = useMemo(() => {
    const sorted = [...projects].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      
      if (filter === 'newest') {
        return dateB - dateA; // Terbaru dulu (descending)
      } else {
        return dateA - dateB; // Terlama dulu (ascending)
      }
    });
    return sorted;
  }, [projects, filter]);

  const spotlightProject = sortedProjects[0];
  const gridProjects = sortedProjects.slice(1);

  return (
    <section id="projects" ref={projectsRef} className="projects-section">
      <div className="section-header">
        <h2 className="section-title">{text.featuredTitle}</h2>
        <ProjectFilter currentFilter={filter} onFilterChange={setFilter} />
      </div>

      {spotlightProject && (
        <div 
          className="project-spotlight-card"
          onClick={() => openProjectPopup(spotlightProject)}
        >
          <div className="spotlight-image-wrapper">
            <img 
              src={spotlightProject.image_url} 
              alt={spotlightProject.title} 
              loading="lazy" 
              className="spotlight-img"
            />
            <div className="spotlight-badge-container">
              <span className="spotlight-tag">
                <i className="bi bi-star-fill"></i> {text.spotlightTag}
              </span>
              {spotlightProject.status && (
                <span className={`status-badge ${spotlightProject.status}`}>
                  {spotlightProject.status === 'published' ? 'Published' : 'Draft'}
                </span>
              )}
            </div>
          </div>

          <div className="spotlight-info">
            <div className="spotlight-meta-header">
              {spotlightProject.categories && spotlightProject.categories.length > 0 && (
                <div className="project-card-categories">
                  {spotlightProject.categories.map((category, i) => (
                    <span key={i} className="category-badge">{category}</span>
                  ))}
                </div>
              )}
              <span className="project-card-date">{formatDate(spotlightProject.created_at)}</span>
            </div>

            <h3 className="spotlight-title">{spotlightProject.title}</h3>
            <p className="spotlight-description">{spotlightProject.description.slice(0, 220)}...</p>

            <div className="spotlight-tech">
              {spotlightProject.tech_stack.map((tech, i) => (
                <span key={i} className="tech-badge">{tech}</span>
              ))}
            </div>

            <div className="spotlight-actions" onClick={(e) => e.stopPropagation()}>
              <div className="spotlight-links">
                {spotlightProject.github_link && (
                  <a href={spotlightProject.github_link} target="_blank" rel="noopener noreferrer" className="project-card-link">
                    GitHub →
                  </a>
                )}
                {spotlightProject.live_link && (
                  <a href={spotlightProject.live_link} target="_blank" rel="noopener noreferrer" className="project-card-link">
                    Live Demo →
                  </a>
                )}
                {spotlightProject.desain_link && (
                  <a href={spotlightProject.desain_link} target="_blank" rel="noopener noreferrer" className="project-card-link">
                    Desain →
                  </a>
                )}
              </div>
              <button 
                type="button" 
                className="btn-spotlight-detail"
                onClick={() => openProjectPopup(spotlightProject)}
              >
                {text.viewDetails} <i className="bi bi-arrow-up-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="projects-grid-3col">
        {gridProjects.map((project) => (
          <div key={project.id} className="project-card-3col" onClick={() => openProjectPopup(project)}>
            <div className="project-card-content">
              <div className="project-card-image">
                <img src={project.image_url} alt={project.title} loading="lazy" />
                {project.status && (
                  <span className={`status-badge ${project.status}`}>
                    {project.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                )}
              </div>
              <div className="project-card-info">
                <div className="project-card-header">
                  <h3 className="project-card-title">{project.title}</h3>
                  <span className="project-card-date">{formatDate(project.created_at)}</span>
                </div>
                
                {project.categories && project.categories.length > 0 && (
                  <div className="project-card-categories">
                    {project.categories.map((category, i) => (
                      <span key={i} className="category-badge">{category}</span>
                    ))}
                  </div>
                )}
                
                <p className="project-card-description">{project.description.slice(0, 100)}...</p>
                <div className="project-card-tech">
                  {project.tech_stack.slice(0, 3).map((tech, i) => (
                    <span key={i} className="tech-badge">{tech}</span>
                  ))}
                  {project.tech_stack.length > 3 && (
                    <span className="tech-badge">+{project.tech_stack.length - 3}</span>
                  )}
                </div>
                <div className="project-card-links" onClick={(e) => e.stopPropagation()}>
                  {project.github_link && <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="project-card-link">GitHub →</a>}
                  {project.live_link && <a href={project.live_link} target="_blank" rel="noopener noreferrer" className="project-card-link">Live Website →</a>}
                  {project.desain_link && <a href={project.desain_link} target="_blank" rel="noopener noreferrer" className="project-card-link">Desain →</a>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;