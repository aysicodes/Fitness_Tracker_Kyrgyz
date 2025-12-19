import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WorkoutService } from '../api/WorkoutService';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { getGlobalStyles } from '../styles/AppStyles';
import EditWorkoutForm from './EditWorkoutForm';
import { FaCalendarAlt, FaClock, FaArrowLeft, FaEdit, FaTrash, FaFire } from 'react-icons/fa';

const WorkoutsPage = () => {
    const { t, i18n } = useTranslation();
    const { colors } = useTheme();
    const global = getGlobalStyles(colors);

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

    // RESTORED EDIT LOGIC
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
        //forcing whole page to be dark
        <div style={{
            backgroundColor: colors.background,
            minHeight: '100vh',
            width: '100%',
            color: colors.textMain,
            transition: 'background-color 0.3s ease'
        }}>
            <div style={{
                display: 'flex',
                padding: '30px',
                maxWidth: '1200px',
                margin: 'auto',
                gap: '30px'
            }}>

                {/*sidebar*/}
                <aside style={{
                    width: '300px',
                    padding: '20px',
                    backgroundColor: colors.card,
                    borderRadius: '16px',
                    boxShadow: colors.shadow,
                    height: 'fit-content',
                    position: 'sticky',
                    top: '30px',
                    border: `1px solid ${colors.border}`
                }}>
                    <h3 style={{ marginBottom: '15px', color: colors.textMain }}>{t('select_date')}</h3>
                    <div style={{
                        padding: '15px',
                        backgroundColor: colors.background,
                        borderRadius: '8px',
                        border: `1px solid ${colors.border}`
                    }}>
                        <p style={{ fontWeight: 'bold', color: colors.primary, marginBottom: '10px' }}>
                            <FaCalendarAlt style={{ marginRight: '8px' }}/>
                            {selectedDate.toLocaleDateString(i18n.language)}
                        </p>
                        <input
                            type="date"
                            value={selectedDate.toISOString().split('T')[0]}
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                            style={{
                                ...global.input,
                                backgroundColor: colors.card,
                                color: colors.textMain,
                                border: `1px solid ${colors.border}`
                            }}
                        />
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <h1 style={{ margin: 0, color: colors.textMain }}>{t('workouts_for')}: {selectedDate.toLocaleDateString(i18n.language)}</h1>
                        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                            <button style={global.button(colors.primary)}>
                                <FaArrowLeft style={{ marginRight: '8px' }} /> {t('dashboard_heading')}
                            </button>
                        </Link>
                    </div>

                    {editingWorkoutId && editingWorkout && (
                        <div style={{ ...global.card, marginBottom: '25px', border: `2px solid ${colors.primary}` }}>
                            <EditWorkoutForm
                                workout={editingWorkout}
                                onUpdate={handleUpdate}
                                onCancel={() => { setEditingWorkoutId(null); setEditingWorkout(null); }}
                            />
                        </div>
                    )}

                    {loading ? (
                        <p style={{ color: colors.textMain }}>{t('loading')}</p>
                    ) : (
                        <div style={{
                            display: editingWorkoutId ? 'none' : 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '20px'
                        }}>
                            {workouts.map(w => (
                                <div key={w.id} style={{...global.card, border: `1px solid ${colors.border}`}}>
                                    <h3 style={{ marginTop: 0, color: colors.textMain }}>{w.type || t('type_not_specified')}</h3>

                                    <div style={{ color: colors.textMuted, fontSize: '0.95em' }}>
                                        <p style={{ display: 'flex', alignItems: 'center', color: colors.textMain }}>
                                            <FaClock style={{ marginRight: '8px', color: colors.primary }}/>
                                            {t('duration_label')}: {w.duration} {t('minutes_unit')}
                                        </p>
                                        <p style={{ display: 'flex', alignItems: 'center', color: colors.textMain }}>
                                            <FaFire style={{ marginRight: '8px', color: colors.accent }}/>
                                            {t('calories_label')}: {w.caloriesBurned} {t('calories_unit')}
                                        </p>
                                    </div>

                                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleEdit(w)} style={global.button(colors.primary)}><FaEdit /></button>
                                        <button onClick={() => handleDelete(w.id)} style={global.button(colors.accent)}><FaTrash /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default WorkoutsPage;