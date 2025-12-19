import api from './axiosConfig';

export const WorkoutService = {
    getWorkoutsByDate: async (dateString) => {
        // dateString должен быть в формате YYYY-MM-DD
        const response = await api.get(`/workouts/date?date=${dateString}`);
        return response.data;
    },

    getAllWorkouts: async () => {
        const response = await api.get('/workouts');
        return response.data;
    },

    postWorkout: async (workoutData) => {
        const response = await api.post('/workout', workoutData);
        return response.data;
    },

    deleteWorkout: async (id) => {
        const response = await api.delete(`/workout/${id}`);
        return response.data;
    },

    updateWorkout: async (id, updatedData) => {
        const response = await api.put(`/workout/${id}`, updatedData);
        return response.data;
    }
};