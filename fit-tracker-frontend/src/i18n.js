// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 1. Импортируем словари (создадим их на следующем шаге)
import enTranslations from './locales/en/translation.json';
import ruTranslations from './locales/ru/translation.json';
import kyTranslations from './locales/ky/translation.json';

i18n
    .use(LanguageDetector) // Автоматически определяет язык из браузера
    .use(initReactI18next) // Привязка i18next к React
    .init({
        resources: {
            en: {
                translation: enTranslations
            },
            ru: {
                translation: ruTranslations
            },
            ky: {
                translation: kyTranslations
            }
        },
        // Резервный язык, если выбранный не найден
        fallbackLng: 'ru',
        // Язык, который будет использоваться, пока не загрузится нужный
        lng: 'ky',
        interpolation: {
            escapeValue: false, // React по умолчанию защищен от XSS
        },
        // Настройки для определения языка
        detection: {
            order: ['cookie', 'localStorage', 'navigator'],
            caches: ['localStorage'],
        }
    });

export default i18n;