import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import ProjectFilter from './ProjectFilter';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ProjectsSection.css';

gsap.registerPlugin(ScrollTrigger);

const ProjectsSection = ({ projectsRef, projects, formatDate, openProjectPopup }) => {
  const { language } = useApp();
  const [filter, setFilter] = useState('newest');
  const t = {
    en: { featuredTitle: 'featured projects' },
    id: { featuredTitle: 'proyek unggulan' }
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

  // Project Image Parallax Scroll
  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ctx;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        const projectImages = document.querySelectorAll('.project-card-image img');
        projectImages.forEach(img => {
          gsap.fromTo(img,
            { y: "-10%" },
            {
              y: "10%",
              ease: "none",
              scrollTrigger: {
                trigger: img.closest('.project-card-3col'),
                start: "top bottom",
                end: "bottom top",
                scrub: true
              }
            }
          );
        });
      });
    }, 150); // slight delay to allow React DOM render to finish

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, [filter, sortedProjects]);

  return (
    <section id="projects" ref={projectsRef} className="projects-section">
      <div className="section-header">
        <h2 className="section-title">{text.featuredTitle}</h2>
        <ProjectFilter currentFilter={filter} onFilterChange={setFilter} />
      </div>
      
      <div className="projects-grid-3col">
        {sortedProjects.map((project) => (
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