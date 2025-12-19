
import api from './axiosConfig';

export const ActivityService = {

    getActivities: async () => {
        const response = await api.get('/activities');
        return response.data;
    },

    postActivity: async (activityData) => {
        const response = await api.post('/activity', activityData);
        return response.data;
    },

    // Обновить существующую запись
    updateActivity: async (id, activityData) => {
        const response = await api.put(`/activity/${id}`, activityData);
        return response.data;
    },

    deleteActivity: async (id) => {
        const response = await api.delete(`/activity/${id}`);
        return response.data; // Ожидаем сообщение об успехе (String)
    },
};