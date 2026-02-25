import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './Certificates.css';

const Certificates = () => {
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCert, setEditingCert] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        vendor: '',
        date: '',
        image_url: '',
        description: '',
        credential_id: '',
        credential_url: ''
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const response = await certificatesAPI.getAll();
            setCertificates(response.certificates || []);
        } catch (error) {
            console.error('Error fetching certificates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const response = await certificatesAPI.uploadImage(file);
            setFormData({
                ...formData,
                image_url: response.image_url
            });
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCert) {
                await certificatesAPI.update(editingCert.id, formData);
                alert('Certificate updated successfully!');
            } else {
                await certificatesAPI.create(formData);
                alert('Certificate created successfully!');
            }
            resetForm();
            fetchCertificates();
        } catch (error) {
            console.error('Error saving certificate:', error);
            alert('Failed to save certificate');
        }
    };

    const handleEdit = (cert) => {
        setEditingCert(cert);
        setFormData({
            name: cert.name || '',
            vendor: cert.vendor || '',
            date: cert.date ? cert.date.split('T')[0] : '',
            image_url: cert.image_url || '',
            description: cert.description || '',
            credential_id: cert.credential_id || '',
            credential_url: cert.credential_url || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this certificate?')) {
            try {
                await certificatesAPI.delete(id);
                fetchCertificates();
            } catch (error) {
                console.error('Error deleting certificate:', error);
            }
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingCert(null);
        setFormData({
            name: '',
            vendor: '',
            date: '',
            image_url: '',
            description: '',
            credential_id: '',
            credential_url: ''
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-content">
                <header className="content-header">
                    <h1>Certificates</h1>
                    <button 
                        className="btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancel' : '+ New Certificate'}
                    </button>
                </header>

                {showForm && (
                    <div className="form-container">
                        <h2>{editingCert ? 'Edit Certificate' : 'New Certificate'}</h2>
                        <form onSubmit={handleSubmit} className="certificate-form">
                            <div className="form-group">
                                <label>Certificate Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Vendor/Issuer</label>
                                    <input
                                        type="text"
                                        name="vendor"
                                        value={formData.vendor}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Issue Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Certificate Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                                {uploading && <p>Uploading...</p>}
                                {formData.image_url && (
                                    <div className="image-preview">
                                        <img src={formData.image_url} alt="Preview" />
                                        <p>Image uploaded ✓</p>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Description (Optional)</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Credential ID (Optional)</label>
                                    <input
                                        type="text"
                                        name="credential_id"
                                        value={formData.credential_id}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Credential URL (Optional)</label>
                                    <input
                                        type="url"
                                        name="credential_url"
                                        value={formData.credential_url}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-save">
                                    {editingCert ? 'Update' : 'Save'}
                                </button>
                                <button type="button" className="btn-cancel" onClick={resetForm}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="certificates-grid">
                    {certificates.length === 0 ? (
                        <p className="empty-state">No certificates yet. Add your first certificate!</p>
                    ) : (
                        certificates.map(cert => (
                            <div key={cert.id} className="certificate-card">
                                <div className="certificate-image">
                                    <img src={cert.image_url} alt={cert.name} />
                                </div>
                                <div className="certificate-info">
                                    <h3>{cert.name}</h3>
                                    <p className="certificate-vendor">{cert.vendor}</p>
                                    <p className="certificate-date">{formatDate(cert.date)}</p>
                                    {cert.description && (
                                        <p className="certificate-description">{cert.description}</p>
                                    )}
                                    <div className="certificate-actions">
                                        <button 
                                            className="btn-edit"
                                            onClick={() => handleEdit(cert)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn-delete"
                                            onClick={() => handleDelete(cert.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Certificates;