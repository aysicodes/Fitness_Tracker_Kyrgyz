import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme, colors } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            style={{
                background: isDarkMode ? colors.card : 'transparent',
                border: `2px solid ${colors.primary}`,
                color: colors.primary,
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: isDarkMode ? `0 0 0 1px ${colors.border}` : 'none'
            }}
        >
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
    );
};

export default ThemeToggle;