import api from './config';

export const authAPI = {
    login: async (username, password) => {
        try {
            const response = await api.post('/login', { username, password });
            return response.data;
        } catch (error) {
            console.error('Auth API error:', error);
            throw error;
        }
    },
    
    validateToken: async () => {
        const response = await api.get('/admin/validate');
        return response.data;
    },
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};