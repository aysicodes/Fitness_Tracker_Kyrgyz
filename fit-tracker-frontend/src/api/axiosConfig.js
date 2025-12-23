import axios from 'axios';
import i18n from '../i18n'; // Убедись, что путь к i18n верный

// Динамический URL:
// 1. Ищет переменную окружения в Vercel (VITE_API_URL)
// 2. Если её нет, использует твой бэкенд на Render
// 3. Если и его нет (например, нет интернета), использует localhost
const API_URL = import.meta.env.VITE_API_URL || 'https://fitness-tracker-kyrgyz.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Интерцептор для добавления токена и языка к каждому запросу
api.interceptors.request.use(config => {
    // 1. Добавляем токен из localStorage
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Добавляем текущий язык для бэкенда
    config.headers['Accept-Language'] = i18n.language;

    return config;
}, error => {
    return Promise.reject(error);
});

export const AuthService = {
    // Авторизация
    login: async (username, password) => {
        try {
            const response = await api.post('/auth/signin', { username, password });
            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);
            }
            return token;
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            throw error;
        }
    },

    // Выход
    logout: () => {
        localStorage.removeItem('token');
    },

    // Проверка, залогинен ли пользователь
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    }
};

export default api;