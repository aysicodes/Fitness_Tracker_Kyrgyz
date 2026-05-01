import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = ({ customStyle }) => {
    const { i18n } = useTranslation();
    const changeLanguage = (lng) => i18n.changeLanguage(lng);
    const currentLang = i18n.language;

    const defaultStyle = {
        display: 'flex', gap: '5px',
        position: 'absolute', top: 20, right: 20, zIndex: 1000 // эски стиль
    };

    return (
        <div style={customStyle || defaultStyle}>
            {['ky', 'ru', 'en'].map(lng => (
                <button
                    key={lng}
                    onClick={() => changeLanguage(lng)}
                    style={{
                        padding: '5px 8px', borderRadius: '4px', cursor: 'pointer',
                        backgroundColor: currentLang === lng ? '#007bff' : 'transparent',
                        color: currentLang === lng ? 'white' : '#888',
                        border: `1px solid ${currentLang === lng ? '#007bff' : '#ccc'}`,
                        fontSize: '0.8rem'
                    }}
                >
                    {lng.toUpperCase()}
                </button>
            ))}
        </div>
    );
};
export default LanguageSwitcher;