// Константы, которые не меняются
export const BRAND_COLORS = {
    PRIMARY: '#00ADB5', // Твой Бирюзовый (Issyk-Kul)
    ACCENT: '#FF2E63',  // Твой Красный (Energy/Flag)
};

export const getThemeColors = (isDarkMode) => ({
    // Brand Identity
    primary: BRAND_COLORS.PRIMARY,
    accent: BRAND_COLORS.ACCENT,

    // Backgrounds & Surfaces
    background: isDarkMode ? '#121212' : '#F8F9FA',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    overlay: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)',

    // Typography
    textMain: isDarkMode ? '#F5F5F5' : '#1A1A1B',
    textMuted: isDarkMode ? '#A0A0A0' : '#6C757D',
    textInverse: isDarkMode ? '#1A1A1B' : '#FFFFFF',

    // Borders & Elevation
    border: isDarkMode ? '#2C2C2C' : '#E9ECEF',
    shadow: isDarkMode
        ? '0 8px 32px rgba(0, 0, 0, 0.8)'
        : '0 8px 15px rgba(0, 0, 0, 0.08)',

    // Semantic States
    success: '#28A745', // Standard green for clarity
    danger: '#DC3545',  // Standard red
    warning: '#FFC107',
    info: '#17A2B8',
});

// Базовые стили (принимают объект цветов)
export const getGlobalStyles = (colors) => ({
    container: {
        backgroundColor: colors.background,
        color: colors.textMain,
        minHeight: '100vh',
        transition: 'all 0.3s ease',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '8px',
        border: `1px solid ${colors.border}`,
        fontSize: '1rem',
        outline: 'none',
        boxSizing: 'border-box', // Чтобы паддинги не раздували инпут
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
    })
});