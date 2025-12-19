import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const currentLang = i18n.language;

    return (
        <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000, display: 'flex', gap: '5px' }}>
            <button
                onClick={() => changeLanguage('ky')}
                style={{
                    padding: '5px 10px',
                    cursor: 'pointer',
                    backgroundColor: currentLang === 'ky' ? '#007bff' : '#f0f0f0',
                    color: currentLang === 'ky' ? 'white' : 'black',
                    border: '1px solid #ccc'
                }}
            >
                KY
            </button>
            <button
                onClick={() => changeLanguage('ru')}
                style={{
                    padding: '5px 10px',
                    cursor: 'pointer',
                    backgroundColor: currentLang === 'ru' ? '#007bff' : '#f0f0f0',
                    color: currentLang === 'ru' ? 'white' : 'black',
                    border: '1px solid #ccc'
                }}
            >
                RU
            </button>
            <button
                onClick={() => changeLanguage('en')}
                style={{
                    padding: '5px 10px',
                    cursor: 'pointer',
                    backgroundColor: currentLang === 'en' ? '#007bff' : '#f0f0f0',
                    color: currentLang === 'en' ? 'white' : 'black',
                    border: '1px solid #ccc'
                }}
            >
                EN
            </button>
        </div>
    );
};

export default LanguageSwitcher;