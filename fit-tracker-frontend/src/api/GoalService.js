// src/api/GoalService.js
import api from './axiosConfig';

export const GoalService = {
    postGoal: async (goalData) => {
        const response = await api.post('/goal', goalData);
        return response.data;
    },
    getGoals: async () => {
        const response = await api.get('/goals');
        return response.data;
    },
    updateGoal: async (id, goalData) => {
        const response = await api.put(`/goal/${id}`, goalData);
        return response.data;
    },
    deleteGoal: async (id) => {
        const response = await api.delete(`/goal/${id}`);
        return response.data;
    },
    updateStatus: async (id) => {
        const response = await api.get(`/goal/status/${id}`);
        return response.data;
    }
};