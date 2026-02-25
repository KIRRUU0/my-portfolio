import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import ProjectFilter from './ProjectFilter';
import './ProjectsSection.css';

const ProjectsSection = ({ projectsRef, projects, formatDate, openProjectPopup }) => {
  const { language } = useApp();
  const [filter, setFilter] = useState('newest'); // 'newest' atau 'oldest'
  
  const t = {
    en: { featuredTitle: 'featured projects' },
    id: { featuredTitle: 'proyek unggulan' }
  };

  const text = t[language] || t.en;

  // Urutkan project berdasarkan filter
  const sortedProjects = useMemo(() => {
    const sorted = [...projects].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      
      if (filter === 'newest') {
        return dateB - dateA; // Terbaru dulu (descending)
      } else {
        return dateA - dateB; // Terlama dulu (ascending)
      }
    });
    return sorted;
  }, [projects, filter]);

  return (
    <section id="projects" ref={projectsRef} className="projects-section">
      <div className="section-header">
        <h2 className="section-title">{text.featuredTitle}</h2>
        <ProjectFilter currentFilter={filter} onFilterChange={setFilter} />
      </div>
      
      <div className="projects-grid-2col">
        {sortedProjects.map((project, index) => (
          <div key={project.id} className="project-card-2col" data-aos="fade-up" data-aos-delay={index * 100} onClick={() => openProjectPopup(project)}>
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
                  {project.live_link && <a href={project.live_link} target="_blank" rel="noopener noreferrer" className="project-card-link">Live Demo →</a>}
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