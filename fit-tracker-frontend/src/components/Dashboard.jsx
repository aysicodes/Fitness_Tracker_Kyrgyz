import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useTranslation } from 'react-i18next';
import { getGlobalStyles } from '../styles/AppStyles';
import { StatsService } from '../api/StatsService';
import WorkoutForm from './WorkoutForm';
import ActivityChart from './ActivityChart';
import AIChat from './AIChat';

import {
    FaFire, FaRunning, FaClock, FaRobot, FaTimes
} from 'react-icons/fa';

/**
 * Статистикалык виджет - Салмак, калория же убакытты кооз көрсөтүү үчүн
 */
const StatWidget = ({ titleKey, value, unitKey, icon: Icon, color }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const global = getGlobalStyles(colors);

    return (
        <div style={{ ...global.card, flex: 1, minWidth: '250px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ margin: 0, color: colors.textMuted, fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase' }}>
                        {t(titleKey)}
                    </p>
                    <h2 style={{ fontSize: '2.2rem', margin: '10px 0', color: colors.textMain, fontWeight: '800' }}>
                        {value ? value.toLocaleString() : 0}
                        <span style={{ fontSize: '0.9rem', marginLeft: '5px', color: colors.textMuted, fontWeight: 'normal' }}>
                            {unitKey ? t(unitKey) : ''}
                        </span>
                    </h2>
                </div>
                <div style={{
                    backgroundColor: `${color}15`,
                    padding: '12px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon size={24} color={color} />
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { t, i18n } = useTranslation();
    const { colors, isDarkMode } = useTheme();
    const global = getGlobalStyles(colors);

    const [stats, setStats] = useState(null);
    const [dailyActivity, setDailyActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAiOpen, setIsAiOpen] = useState(false);

    // Маалыматтарды серверден алуу
    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const statsResponse = await StatsService.getStats();
            setStats(statsResponse);
            const dailyData = await StatsService.getDailyActivity();
            setDailyActivity(dailyData);
        } catch (err) {
            console.error("Dashboard Data Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [i18n.language]);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: colors.textMain }}>
            {t('loading')}...
        </div>
    );

    return (
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>

            {/* Башкы тема */}
            <h1 style={{ color: colors.textMain, marginBottom: '35px', fontWeight: '900', fontSize: '2rem' }}>
                {t('dashboard_heading')}
            </h1>

            {/* Статистика виджеттери - 3 катар */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '35px', flexWrap: 'wrap' }}>
                <StatWidget
                    titleKey="calories_burned_widget"
                    value={stats?.totalCaloriesBurned}
                    unitKey="calories_unit"
                    icon={FaFire}
                    color="#FF4D4D"
                />
                <StatWidget
                    titleKey="total_steps_widget"
                    value={stats?.steps}
                    unitKey="steps_key"
                    icon={FaRunning}
                    color={colors.primary}
                />
                <StatWidget
                    titleKey="total_duration_widget"
                    value={stats?.duration}
                    unitKey="minutes_unit"
                    icon={FaClock}
                    color="#4DA6FF"
                />
            </div>

            {/* Активдүүлүк графиги */}
            {dailyActivity.length > 0 && (
                <div style={{ ...global.card, marginBottom: '35px', padding: '25px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '25px', color: colors.textMain, fontWeight: '700' }}>
                        {t('activity_chart_title') || 'Прогресс'}
                    </h3>
                    <ActivityChart data={dailyActivity} />
                </div>
            )}

            {/* Жаңы машыгуу кошуу формасы */}
            <div style={{ ...global.card, padding: '35px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '30px', color: colors.textMain, fontWeight: '700' }}>
                    {t('new_workout_heading')}
                </h3>
                <WorkoutForm onWorkoutAdded={fetchDashboardData} />
            </div>

            {/* ИИ Чат (Floating Chat) */}
            <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
                {isAiOpen && (
                    <div style={{
                        marginBottom: '15px',
                        width: '380px',
                        height: '550px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        border: `1px solid ${colors.border}`,
                        backgroundColor: colors.card,
                        animation: 'fadeIn 0.3s ease'
                    }}>
                        <AIChat isDarkMode={isDarkMode} userStats={stats} />
                    </div>
                )}
                <button
                    onClick={() => setIsAiOpen(!isAiOpen)}
                    style={{
                        ...global.button(isAiOpen ? colors.accent : colors.primary),
                        width: '65px',
                        height: '65px',
                        borderRadius: '50%',
                        justifyContent: 'center',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {isAiOpen ? <FaTimes size={25} /> : <FaRobot size={32} />}
                </button>
            </div>
        </div>
    );
};

export default Dashboard;