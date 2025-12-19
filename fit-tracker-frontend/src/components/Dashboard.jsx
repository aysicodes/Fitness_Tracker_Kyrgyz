import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext.jsx';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getGlobalStyles } from '../styles/AppStyles';
import { StatsService } from '../api/StatsService';
import WorkoutForm from './WorkoutForm';
import LanguageSwitcher from './LanguageSwitcher';
import ActivityChart from './ActivityChart';
import ThemeToggle from './ThemeToggle';

import { FaUser, FaSignOutAlt, FaBullseye, FaCalendarAlt, FaFire, FaRunning, FaClock, FaChartLine } from 'react-icons/fa';

// statistics vidget
const StatWidget = ({ titleKey, value, unitKey, icon: Icon, color }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const global = getGlobalStyles(colors);

    const activeTextColor = colors.textMain || '#FFFFFF';

    return (
        <div style={global.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: colors.textMuted, fontSize: '1em' }}>{t(titleKey)}</h3>
                <Icon size={24} color={color} />
            </div>
            <p style={{
                fontSize: '2.5em',
                fontWeight: '900',
                color: activeTextColor,
                margin: '5px 0'
            }}>
                {value.toLocaleString()}
                <span style={{ fontSize: '0.4em', fontWeight: 'normal', color: colors.textMuted, marginLeft: '5px' }}>
                    {unitKey ? t(unitKey) : ''}
                </span>
            </p>
        </div>
    );
};

const Dashboard = () => {
    const { t, i18n } = useTranslation();
    const { logout } = useAuth();
    const { colors } = useTheme();
    const global = getGlobalStyles(colors);

    const [stats, setStats] = useState(null);
    const [dailyActivity, setDailyActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const statsResponse = await StatsService.getStats();
            setStats(statsResponse);
            const dailyData = await StatsService.getDailyActivity();
            setDailyActivity(dailyData);
        } catch (err) {
            setError(t('error.loading_failed'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDashboardData(); }, [i18n.language]);

    if (loading) return <p style={{ textAlign: 'center', color: colors.textMain, marginTop: '50px' }}>{t('loading')}</p>;

    return (
        <div style={{ ...global.page, backgroundColor: colors.background, minHeight: '100vh', padding: '20px', color: colors.textMain }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto 40px' }}>
                <h1 style={{ color: colors.textMain, margin: 0 }}>{t('dashboard_heading')}</h1>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <ThemeToggle />
                    <LanguageSwitcher />
                    <button onClick={() => logout()} style={global.button(colors.accent)}>
                        <FaSignOutAlt /> {t('logout_button')}
                    </button>
                </div>

            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/goals" style={{ textDecoration: 'none' }}><button style={global.button(colors.primary)}><FaBullseye /> {t('goals_heading')}</button></Link>
                <Link to="/activity" style={{ textDecoration: 'none' }}><button style={global.button(colors.primary)}><FaChartLine /> {t('activity_heading')}</button></Link>
                <Link to="/workouts" style={{ textDecoration: 'none' }}><button style={global.button(colors.primary)}><FaCalendarAlt /> {t('workouts_page_heading')}</button></Link>
                <Link to="/profile" style={{ textDecoration: 'none' }}><button style={global.button(colors.primary)}><FaUser /> {t('profile_heading')}</button></Link>
            </div>

            {dailyActivity.length > 0 && (
                <div style={{ maxWidth: '1200px', margin: '0 auto 30px' }}>
                    <ActivityChart data={dailyActivity} />
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '1200px', margin: 'auto' }}>
                <StatWidget titleKey="calories_burned_widget" value={stats?.totalCaloriesBurned || 0} unitKey="calories_unit" icon={FaFire} color={colors.accent} />
                <StatWidget titleKey="total_steps_widget" value={stats?.steps || 0} unitKey="steps_key" icon={FaRunning} color={colors.primary} />
                <StatWidget titleKey="total_duration_widget" value={stats?.duration || 0} unitKey="minutes_unit" icon={FaClock} color={colors.primary} />
                <div style={{ ...global.card, gridColumn: '1 / -1' }}>
                    <WorkoutForm onWorkoutAdded={fetchDashboardData} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;