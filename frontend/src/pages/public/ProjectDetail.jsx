import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const ProjectDetail = () => {
    const { slug } = useParams();
    const { language } = useApp();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    const t = {
        en: {
            back: '← Back to Projects',
            liveDemo: 'Live Demo',
            github: 'GitHub',
            techStack: 'Tech Stack',
            overview: 'Overview',
            notFound: 'Project not found'
        },
        id: {
            back: '← Kembali ke Proyek',
            liveDemo: 'Demo Langsung',
            github: 'GitHub',
            techStack: 'Teknologi',
            overview: 'Ringkasan',
            notFound: 'Proyek tidak ditemukan'
        }
    };

    const text = t[language] || t.en;

    useEffect(() => {
        fetchProject();
    }, [slug]);

    const fetchProject = async () => {
        try {
            const response = await projectsAPI.getBySlug(slug);
            setProject(response.project);
        } catch (error) {
            console.error('Error fetching project:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!project) return <div className="not-found">{text.notFound}</div>;

    return (
        <div className="project-detail">
            <Link to="/projects" className="back-link">{text.back}</Link>
            
            <div className="project-header">
                <h1>{project.title}</h1>
                <div className="project-links">
                    {project.live_link && (
                        <a href={project.live_link} target="_blank" rel="noopener" className="btn-primary">
                            {text.liveDemo}
                        </a>
                    )}
                    {project.github_link && (
                        <a href={project.github_link} target="_blank" rel="noopener" className="btn-secondary">
                            {text.github}
                        </a>
                    )}
                </div>
            </div>

            {project.image_url && (
                <div className="project-image">
                    <img src={project.image_url} alt={project.title} />
                </div>
            )}

            <div className="project-tech">
                <h3>{text.techStack}</h3>
                <div className="tech-tags">
                    {project.tech_stack?.map((tech, i) => (
                        <span key={i} className="tech-tag">{tech}</span>
                    ))}
                </div>
            </div>

            <div className="project-description">
                <h3>{text.overview}</h3>
                <p>{project.description}</p>
                {project.content && <div dangerouslySetInnerHTML={{ __html: project.content }} />}
            </div>
        </div>
    );
};

export default ProjectDetail;