import api from './config';

export const experiencesAPI = {
    // Public
    getAll: async () => {
        const response = await api.get('/experiences');
        return response.data;
    },
    
    // Admin
    create: async (experienceData) => {
        const response = await api.post('/admin/experiences', experienceData);
        return response.data;
    },
    
    update: async (id, experienceData) => {
        const response = await api.put(`/admin/experiences/${id}`, experienceData);
        return response.data;
    },
    
    delete: async (id) => {
        const response = await api.delete(`/admin/experiences/${id}`);
        return response.data;
    }
};