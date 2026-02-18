import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { experiencesAPI } from '../../api/experiences';
import Sidebar from '../../components/Sidebar';
import './Experiences.css';

const Experiences = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingExp, setEditingExp] = useState(null);
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        description: '',
        location: '',
        start_date: '',
        end_date: '',
        current: false
    });

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const response = await experiencesAPI.getAll();
            setExperiences(response.experiences || []);
        } catch (error) {
            console.error('Error fetching experiences:', error);
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
            if (editingExp) {
                await experiencesAPI.update(editingExp.id, formData);
            } else {
                await experiencesAPI.create(formData);
            }
            
            resetForm();
            fetchExperiences();
        } catch (error) {
            console.error('Error saving experience:', error);
        }
    };

    const handleEdit = (exp) => {
        setEditingExp(exp);
        setFormData({
            company: exp.company || '',
            position: exp.position || '',
            description: exp.description || '',
            location: exp.location || '',
            start_date: exp.start_date?.split('T')[0] || '',
            end_date: exp.end_date?.split('T')[0] || '',
            current: exp.current || false
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this experience?')) {
            try {
                await experiencesAPI.delete(id);
                fetchExperiences();
            } catch (error) {
                console.error('Error deleting experience:', error);
            }
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingExp(null);
        setFormData({
            company: '',
            position: '',
            description: '',
            location: '',
            start_date: '',
            end_date: '',
            current: false
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-content">
                <header className="content-header">
                    <h1>Work Experiences</h1>
                    <button 
                        className="btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancel' : '+ New Experience'}
                    </button>
                </header>

                {showForm && (
                    <div className="form-container">
                        <h2>{editingExp ? 'Edit Experience' : 'New Experience'}</h2>
                        <form onSubmit={handleSubmit} className="experience-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Company</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Position</label>
                                    <input
                                        type="text"
                                        name="position"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
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
                                <label>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>End Date</label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleInputChange}
                                        disabled={formData.current}
                                    />
                                </div>
                            </div>

                            <div className="form-group checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="current"
                                        checked={formData.current}
                                        onChange={handleInputChange}
                                    />
                                    I currently work here
                                </label>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-save">
                                    {editingExp ? 'Update' : 'Save'}
                                </button>
                                <button type="button" className="btn-cancel" onClick={resetForm}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="experiences-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Position</th>
                                <th>Location</th>
                                <th>Period</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {experiences.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="empty-state">
                                        No experiences yet. Add your first work experience!
                                    </td>
                                </tr>
                            ) : (
                                experiences.map(exp => (
                                    <tr key={exp.id}>
                                        <td>
                                            <strong>{exp.company}</strong>
                                        </td>
                                        <td>{exp.position}</td>
                                        <td>{exp.location || '−'}</td>
                                        <td>
                                            {formatDate(exp.start_date)} - {exp.current ? 'Present' : formatDate(exp.end_date)}
                                        </td>
                                        <td className="actions-cell">
                                            <button 
                                                className="btn-edit"
                                                onClick={() => handleEdit(exp)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="btn-delete"
                                                onClick={() => handleDelete(exp.id)}
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

export default Experiences;