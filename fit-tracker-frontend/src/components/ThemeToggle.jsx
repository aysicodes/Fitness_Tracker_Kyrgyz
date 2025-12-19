import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme, colors } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            style={{
                background: 'transparent',
                border: `1px solid ${colors.primary}`,
                color: colors.primary,
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
            }}
        >
            {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
    );
};

export default ThemeToggle;