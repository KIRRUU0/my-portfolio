import api from './config';

export const projectsAPI = {
    // Public
    getAll: async () => {
        const response = await api.get('/projects');
        return response.data;
    },
    
    getBySlug: async (slug) => {
        const response = await api.get(`/projects/${slug}`);
        return response.data;
    },
    
    // Admin
    create: async (projectData) => {
        const response = await api.post('/admin/projects', projectData);
        return response.data;
    },
    
    update: async (id, projectData) => {
        const response = await api.put(`/admin/projects/${id}`, projectData);
        return response.data;
    },
    
    delete: async (id) => {
        const response = await api.delete(`/admin/projects/${id}`);
        return response.data;
    },
    
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await api.post('/admin/projects/upload-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};