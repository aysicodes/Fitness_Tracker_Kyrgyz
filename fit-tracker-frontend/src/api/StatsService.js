import api from './axiosConfig';

export const StatsService = {
    getStats: async () => {
        const response = await api.get('/stats');
        return response.data;
    },

    getDailyActivity: async () => {
        //calls /api/stats/daily-activity
        const response = await api.get('/stats/daily-activity');
        return response.data;
    },
};