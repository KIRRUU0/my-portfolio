import api from './config';

export const contactsAPI = {
    // Public - submit pesan sederhana
    submit: async (contactData) => {
        // Kirim hanya name dan message
        const payload = {
            name: contactData.name,
            message: contactData.message
        };
        
        console.log('Sending contact data:', payload);
        
        const response = await api.post('/contact', payload);
        return response.data;
    },
    
    // Admin
    getAll: async () => {
        const response = await api.get('/admin/contacts');
        return response.data;
    },
    
    getById: async (id) => {
        const response = await api.get(`/admin/contacts/${id}`);
        return response.data;
    },
    
    delete: async (id) => {
        const response = await api.delete(`/admin/contacts/${id}`);
        return response.data;
    }
};