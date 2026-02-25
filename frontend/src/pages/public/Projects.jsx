import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Projects.css';

const Projects = () => {
    const { language } = useApp();
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    const t = {
        en: {
            title: 'My Projects',
            subtitle: 'Here are some of my recent work',
            all: 'All',
            filter: 'Filter by category',
            viewProject: 'View Project',
            liveDemo: 'Live Demo',
            github: 'GitHub',
            noProjects: 'No projects found'
        },
        id: {
            title: 'Proyek Saya',
            subtitle: 'Berikut adalah beberapa karya terbaru saya',
            all: 'Semua',
            filter: 'Filter berdasarkan kategori',
            viewProject: 'Lihat Proyek',
            liveDemo: 'Demo Langsung',
            github: 'GitHub',
            noProjects: 'Tidak ada proyek ditemukan'
        }
    };

    const text = t[language] || t.en;

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterProjects();
    }, [selectedCategory, projects]);

    const fetchData = async () => {
        try {
            const [projectsRes, categoriesRes] = await Promise.all([
                projectsAPI.getAll(),
                // Assuming you have categoriesAPI
                Promise.resolve({ categories: [] })
            ]);

            setProjects(projectsRes.projects || []);
            setFilteredProjects(projectsRes.projects || []);
            setCategories(categoriesRes.categories || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterProjects = () => {
        if (selectedCategory === 'all') {
            setFilteredProjects(projects);
        } else {
            // Filter by category logic here
            setFilteredProjects(projects);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="projects-page">
            <div className="page-header">
                <h1>{text.title}</h1>
                <p>{text.subtitle}</p>
            </div>

            <div className="filter-section">
                <h3>{text.filter}</h3>
                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        {text.all}
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="projects-grid">
                {filteredProjects.map(project => (
                    <div key={project.id} className="project-card">
                        <div className="project-image">
                            {project.image_url ? (
                                <img src={project.image_url} alt={project.title} />
                            ) : (
                                <div className="image-placeholder">📁</div>
                            )}
                        </div>
                        <div className="project-content">
                            <h3>{project.title}</h3>
                            <p>{project.description.substring(0, 150)}...</p>
                            <div className="project-tech">
                                {project.tech_stack?.map((tech, i) => (
                                    <span key={i} className="tech-tag">{tech}</span>
                                ))}
                            </div>
                            <div className="project-links">
                                <Link to={`/projects/${project.slug}`} className="project-link">
                                    {text.viewProject} →
                                </Link>
                                {project.live_link && (
                                    <a href={project.live_link} target="_blank" rel="noopener" className="project-link external">
                                        {text.liveDemo}
                                    </a>
                                )}
                                {project.github_link && (
                                    <a href={project.github_link} target="_blank" rel="noopener" className="project-link external">
                                        {text.github}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="no-projects">
                    <p>{text.noProjects}</p>
                </div>
            )}
        </div>
    );
};

export default Projects;