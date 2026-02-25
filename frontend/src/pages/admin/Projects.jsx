import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './Projects.css';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tech_stack: '',
        github_link: '',
        live_link: '',
        featured: false,
        status: 'published'
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await projectsAPI.getAll();
            setProjects(response.projects || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert tech_stack string to array
            const projectData = {
                ...formData,
                tech_stack: formData.tech_stack.split(',').map(tech => tech.trim())
            };

            if (editingProject) {
                await projectsAPI.update(editingProject.id, projectData);
            } else {
                await projectsAPI.create(projectData);
            }
            
            // Reset form and refresh
            resetForm();
            fetchProjects();
        } catch (error) {
            console.error('Error saving project:', error);
        }
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            title: project.title || '',
            description: project.description || '',
            tech_stack: project.tech_stack?.join(', ') || '',
            github_link: project.github_link || '',
            live_link: project.live_link || '',
            featured: project.featured || false,
            status: project.status || 'published'
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await projectsAPI.delete(id);
                fetchProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingProject(null);
        setFormData({
            title: '',
            description: '',
            tech_stack: '',
            github_link: '',
            live_link: '',
            featured: false,
            status: 'published'
        });
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-content">
                <header className="content-header">
                    <h1>Projects</h1>
                    <button 
                        className="btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancel' : '+ New Project'}
                    </button>
                </header>

                {showForm && (
                    <div className="form-container">
                        <h2>{editingProject ? 'Edit Project' : 'New Project'}</h2>
                        <form onSubmit={handleSubmit} className="project-form">
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Tech Stack (comma separated)</label>
                                <input
                                    type="text"
                                    name="tech_stack"
                                    value={formData.tech_stack}
                                    onChange={handleInputChange}
                                    placeholder="React, Go, PostgreSQL"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>GitHub Link</label>
                                    <input
                                        type="url"
                                        name="github_link"
                                        value={formData.github_link}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Live Link</label>
                                    <input
                                        type="url"
                                        name="live_link"
                                        value={formData.live_link}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group checkbox">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleInputChange}
                                        />
                                        Featured Project
                                    </label>
                                </div>

                                <div className="form-group">
                                    <label>Status</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange}>
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-save">
                                    {editingProject ? 'Update' : 'Save'}
                                </button>
                                <button type="button" className="btn-cancel" onClick={resetForm}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="projects-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Tech Stack</th>
                                <th>Status</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="empty-state">
                                        No projects yet. Create your first project!
                                    </td>
                                </tr>
                            ) : (
                                projects.map(project => (
                                    <tr key={project.id}>
                                        <td>{project.title}</td>
                                        <td className="description-cell">
                                            {project.description?.substring(0, 50)}...
                                        </td>
                                        <td>
                                            <div className="tech-stack">
                                                {project.tech_stack?.map((tech, i) => (
                                                    <span key={i} className="tech-tag">{tech}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${project.status}`}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td>
                                            {project.featured ? '✓' : '−'}
                                        </td>
                                        <td className="actions-cell">
                                            <button 
                                                className="btn-edit"
                                                onClick={() => handleEdit(project)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="btn-delete"
                                                onClick={() => handleDelete(project.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Projects;