// Константы брендовых цветов (взяты из логотипа)
export const BRAND_COLORS = {
    PRIMARY: '#102f6c',
    ACCENT: '#d12225',
};

export const getThemeColors = (isDarkMode) => ({
    primary: BRAND_COLORS.PRIMARY,
    accent: BRAND_COLORS.ACCENT,

    background: isDarkMode ? '#1a2538' : '#F8F9FA',
    card: isDarkMode ? '#243144' : '#FFFFFF',
    overlay: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.05)',

    textMain: isDarkMode ? '#F0F4F8' : '#1A2A3A',
    textMuted: isDarkMode ? '#A0AAB8' : '#5A6A7A',
    textInverse: isDarkMode ? '#1A1A1B' : '#FFFFFF',

    border: isDarkMode ? '#2C3A50' : '#E2E8F0',
    shadow: isDarkMode
        ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',

    success: '#2E7D32',
    danger: '#C62828',
    warning: '#F57F17',
    info: '#1565C0',
});

// Базовые стили – принимают isDarkMode
export const getGlobalStyles = (colors, isDarkMode) => ({
    container: {
        backgroundColor: colors.background,
        color: colors.textMain,
        minHeight: '100vh',
        transition: 'all 0.3s ease',
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        // В тёмной теме – светлый фон полей
        backgroundColor: isDarkMode ? '#f3eff1' : colors.card,
        color: isDarkMode ? '#1A2A3A' : colors.textMain,
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'all 0.2s',
        boxSizing: 'border-box',
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: '16px',
        padding: '20px',
        boxShadow: colors.shadow,
        border: `1px solid ${colors.border}`,
    },
    button: (bgColor) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '10px 18px',
        backgroundColor: bgColor || colors.primary,
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'transform 0.1s',
    }),
});