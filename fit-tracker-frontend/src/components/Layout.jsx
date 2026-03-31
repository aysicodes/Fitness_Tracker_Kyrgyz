import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext.jsx';
import { getGlobalStyles } from '../styles/AppStyles';
import {
    FaBullseye, FaChartLine, FaCalendarAlt, FaUser,
    FaBars, FaChevronLeft, FaSignOutAlt, FaThLarge
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { logout } = useAuth();
    const global = getGlobalStyles(colors);
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { path: '/dashboard', label: t('dashboard_heading'), icon: <FaThLarge /> },
        { path: '/goals', label: t('goals_heading'), icon: <FaBullseye /> },
        { path: '/activity', label: t('activity_heading'), icon: <FaChartLine /> },
        { path: '/workouts', label: t('workouts_page_heading'), icon: <FaCalendarAlt /> },
        { path: '/profile', label: t('profile_heading'), icon: <FaUser /> },
    ];

    const sidebarWidth = isSidebarOpen ? '260px' : '80px';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.background }}>
            <aside style={{
                width: sidebarWidth,
                backgroundColor: colors.card,
                borderRight: `1px solid ${colors.border}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 1000,
            }}>
                {/* Logo & Toggle */}
                <div style={{ padding: '25px', display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'space-between' : 'center', minHeight: '80px' }}>
                    {isSidebarOpen && <span style={{ color: colors.primary, fontWeight: '900', fontSize: '1.1rem' }}>ALA-TOO FIT</span>}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer' }}>
                        {isSidebarOpen ? <FaChevronLeft size={18} /> : <FaBars size={20} />}
                    </button>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '10px' }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path} style={{
                                display: 'flex', alignItems: 'center', gap: '15px', padding: '14px 18px', textDecoration: 'none', borderRadius: '12px', marginBottom: '4px',
                                backgroundColor: isActive ? `${colors.primary}15` : 'transparent', color: isActive ? colors.primary : colors.textMain,
                                borderLeft: isActive ? `4px solid ${colors.primary}` : '4px solid transparent'
                            }}>
                                <span style={{ fontSize: '1.2rem', display: 'flex' }}>{item.icon}</span>
                                {isSidebarOpen && <span style={{ fontWeight: '500' }}>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer of Sidebar: Settings & Logout */}
                <div style={{ padding: '20px', borderTop: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    {/* Тил жана Тема - Sidebar ачык болгондо гана көрүнөт */}
                    {isSidebarOpen && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                            <ThemeToggle />
                            <LanguageSwitcher customStyle={{ position: 'relative', top: 0, right: 0 }} />
                        </div>
                    )}

                    <button onClick={logout} style={{ ...global.button(colors.accent), width: '100%', justifyContent: 'center' }}>
                        <FaSignOutAlt /> {isSidebarOpen && <span style={{marginLeft: '10px'}}>{t('logout_button')}</span>}
                    </button>
                </div>
            </aside>

            <main style={{ flex: 1, marginLeft: sidebarWidth, transition: 'margin-left 0.3s ease', padding: '40px' }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;