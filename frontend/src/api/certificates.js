import api from './config';

export const certificatesAPI = {
    // Public
    getAll: async () => {
        const response = await api.get('/certificates');
        return response.data;
    },
    
    getById: async (id) => {
        const response = await api.get(`/certificates/${id}`);
        return response.data;
    },
    
    // Admin
    create: async (certificateData) => {
        const response = await api.post('/admin/certificates', certificateData);
        return response.data;
    },
    
    update: async (id, certificateData) => {
        const response = await api.put(`/admin/certificates/${id}`, certificateData);
        return response.data;
    },
    
    delete: async (id) => {
        const response = await api.delete(`/admin/certificates/${id}`);
        return response.data;
    },
    
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await api.post('/admin/certificates/upload-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};