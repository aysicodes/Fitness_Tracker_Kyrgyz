import api from './axiosConfig';

export const ProfileService = {
    // GET /api/profile
    fetchProfile: async () => {
        const response = await api.get('/profile');
        return response.data;
    },

    updateProfile: async (profileData) => {

        const response = await api.put('/profile', profileData);
        return response.data;
    },

    deleteAccount: async () => {
        const response = await api.delete('/profile');
        return response.data;
    }
};