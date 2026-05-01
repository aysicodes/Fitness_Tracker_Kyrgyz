import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WorkoutService } from '../api/WorkoutService';
import { useTheme } from '../context/ThemeContext.jsx';
import { getGlobalStyles } from '../styles/AppStyles';
import EditWorkoutForm from './EditWorkoutForm';
import { FaCalendarAlt, FaClock, FaEdit, FaTrash, FaFire, FaFilter } from 'react-icons/fa';

const WorkoutsPage = () => {
    const { t, i18n } = useTranslation();
    const { colors, isDarkMode } = useTheme();
    const global = getGlobalStyles(colors, isDarkMode);

    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [error, setError] = useState('');

    const [editingWorkoutId, setEditingWorkoutId] = useState(null);
    const [editingWorkout, setEditingWorkout] = useState(null);

    const fetchWorkoutsByDate = async (date) => {
        setLoading(true);
        const formattedDate = date.toISOString().split('T')[0];
        try {
            const response = await WorkoutService.getWorkoutsByDate(formattedDate);
            setWorkouts(response || []);
        } catch (err) {
            setError(t('error.loading_workouts_failed'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWorkoutsByDate(selectedDate); }, [selectedDate]);

    const handleEdit = (workout) => {
        setEditingWorkoutId(workout.id);
        setEditingWorkout(workout);
    };

    const handleUpdate = async (id, payload) => {
        try {
            await WorkoutService.updateWorkout(id, payload);
            setEditingWorkoutId(null);
            setEditingWorkout(null);
            fetchWorkoutsByDate(selectedDate);
        } catch (err) { setError(t('error.update_failed')); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('confirm_delete'))) return;
        try {
            await WorkoutService.deleteWorkout(id);
            fetchWorkoutsByDate(selectedDate);
        } catch (err) { setError(t('error.delete_failed')); }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.background }}>
            <aside style={{
                width: '300px',
                backgroundColor: colors.card,
                borderRight: `1px solid ${colors.border}`,
                padding: '35px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '25px'
            }}>
                <h3 style={{ color: colors.textMain, fontSize: '18px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaFilter size={16} color={colors.primary} /> {t('filter_options')}
                </h3>
                <div style={{ padding: '20px', backgroundColor: colors.background, borderRadius: '12px', border: `1px solid ${colors.border}` }}>
                    <label style={{ display: 'block', marginBottom: '12px', fontSize: '13px', fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase' }}>
                        {t('select_date')}
                    </label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="date"
                            value={selectedDate.toISOString().split('T')[0]}
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                            style={global.input}
                        />
                    </div>
                    <p style={{ marginTop: '15px', fontSize: '14px', color: colors.primary, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaCalendarAlt /> {selectedDate.toLocaleDateString(i18n.language)}
                    </p>
                </div>
                <div style={{ marginTop: 'auto', padding: '15px', backgroundColor: `${colors.success}20`, borderRadius: '10px' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: colors.success, fontWeight: 'bold' }}>
                        {t('total_workouts')}: {workouts.length}
                    </p>
                </div>
            </aside>

            <main style={{ flex: 1, padding: '40px' }}>
                <header style={{ marginBottom: '35px' }}>
                    <h1 style={{ fontSize: '26px', color: colors.textMain, fontWeight: '800', margin: 0 }}>
                        {t('workouts_for')}: {selectedDate.toLocaleDateString(i18n.language)}
                    </h1>
                    <p style={{ color: colors.textMuted, marginTop: '5px' }}>{t('manage_workouts_subtitle')}</p>
                </header>

                {editingWorkoutId && editingWorkout && (
                    <div style={{ ...global.card, marginBottom: '30px', borderLeft: `5px solid ${colors.primary}` }}>
                        <EditWorkoutForm
                            workout={editingWorkout}
                            onUpdate={handleUpdate}
                            onCancel={() => { setEditingWorkoutId(null); setEditingWorkout(null); }}
                        />
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: colors.textMuted }}>{t('loading')}...</div>
                ) : workouts.length > 0 ? (
                    <div style={{ display: editingWorkoutId ? 'none' : 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                        {workouts.map(w => (
                            <div key={w.id} style={{ ...global.card, transition: 'transform 0.2s ease', cursor: 'pointer' }}
                                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <h3 style={{ margin: 0, color: colors.textMain, fontSize: '18px', fontWeight: '700' }}>
                                        {w.type || t('type_not_specified')}
                                    </h3>
                                    <div style={{ backgroundColor: `${colors.primary}15`, padding: '8px', borderRadius: '50%' }}>
                                        <FaFire color={colors.accent} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: colors.textMuted }}>
                                        <FaClock color={colors.primary} />
                                        <span style={{ fontSize: '14px' }}><strong>{w.duration}</strong> {t('minutes_unit')}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: colors.textMuted }}>
                                        <FaFire color={colors.accent} />
                                        <span style={{ fontSize: '14px' }}><strong>{w.caloriesBurned}</strong> {t('calories_unit')}</span>
                                    </div>
                                </div>
                                <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                    <button onClick={() => handleEdit(w)} style={{ background: `${colors.primary}15`, border: 'none', padding: '8px 12px', borderRadius: '6px', color: colors.primary, cursor: 'pointer' }}>
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDelete(w.id)} style={{ background: `${colors.accent}15`, border: 'none', padding: '8px 12px', borderRadius: '6px', color: colors.accent, cursor: 'pointer' }}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ ...global.card, textAlign: 'center', padding: '80px 20px' }}>
                        <FaCalendarAlt size={50} style={{ marginBottom: '20px', opacity: 0.3, color: colors.textMuted }} />
                        <p style={{ color: colors.textMuted }}>{t('no_workouts_found')}</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default WorkoutsPage;