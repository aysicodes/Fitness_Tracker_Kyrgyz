import axios from 'axios';
// 💡 Импорт  i18n
import i18n from '../i18n';

const API_URL = 'http://localhost:3030/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(config => {
    // 1. Добавляем токен
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Добавляем локаль, управляемую i18next
    config.headers['Accept-Language'] = i18n.language;

    return config;
}, error => {
    return Promise.reject(error);
});

export const AuthService = {
    // Вызов /api/auth/signin
    login: async (username, password) => {
        // Используем настроенный 'api' с интерсепторами
        const response = await api.post('/auth/signin', { username, password });
        const token = response.data.token;
        if (token) {
            localStorage.setItem('token', token);
        }
        return token;
    },

    logout: () => {
        localStorage.removeItem('token');
        // i18next сам управляет своим хранилищем языка
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // 🛑 Удалены getLocale/setLocale, т.к. язык управляется i18next.
};

export default api; // Экспортируем настроенный axios instance