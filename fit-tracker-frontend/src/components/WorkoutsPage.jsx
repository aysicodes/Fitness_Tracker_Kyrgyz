import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WorkoutService } from '../api/WorkoutService';
import { useTheme } from '../context/ThemeContext.jsx';
import { getGlobalStyles } from '../styles/AppStyles';
import EditWorkoutForm from './EditWorkoutForm';
import { FaCalendarAlt, FaClock, FaEdit, FaTrash, FaFire, FaFilter } from 'react-icons/fa';

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
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>

            {/* --- LEFT SIDEBAR (Filter Section) --- */}
            <aside style={{
                width: '300px',
                backgroundColor: '#fff',
                borderRight: '1px solid #eee',
                padding: '35px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '25px'
            }}>
                <h3 style={{
                    color: '#32325d',
                    fontSize: '18px',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <FaFilter size={16} color="#5e72e4" /> {t('filter_options') || 'Фильтр'}
                </h3>

                <div style={{
                    padding: '20px',
                    backgroundColor: '#f6f9fc',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef'
                }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '12px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8898aa',
                        textTransform: 'uppercase'
                    }}>
                        {t('select_date')}
                    </label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="date"
                            value={selectedDate.toISOString().split('T')[0]}
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #dee2e6',
                                fontSize: '14px',
                                color: '#525f7f',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <p style={{
                        marginTop: '15px',
                        fontSize: '14px',
                        color: '#5e72e4',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <FaCalendarAlt /> {selectedDate.toLocaleDateString(i18n.language)}
                    </p>
                </div>

                <div style={{ marginTop: 'auto', padding: '15px', backgroundColor: '#e2f9ed', borderRadius: '10px' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#2dce89', fontWeight: 'bold' }}>
                        {t('total_workouts') || 'Жалпы машыгуулар'}: {workouts.length}
                    </p>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main style={{ flex: 1, padding: '40px' }}>
                <header style={{ marginBottom: '35px' }}>
                    <h1 style={{ fontSize: '26px', color: '#32325d', fontWeight: '800', margin: 0 }}>
                        {t('workouts_for')}: {selectedDate.toLocaleDateString(i18n.language)}
                    </h1>
                    <p style={{ color: '#8898aa', marginTop: '5px' }}>{t('manage_workouts_subtitle') || 'Машыгууларыңызды карап чыгыңыз жана башкарыңыз'}</p>
                </header>

                {/* Edit Form Overlay/Card */}
                {editingWorkoutId && editingWorkout && (
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '30px',
                        borderRadius: '15px',
                        boxShadow: '0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07)',
                        marginBottom: '30px',
                        borderLeft: '5px solid #5e72e4'
                    }}>
                        <EditWorkoutForm
                            workout={editingWorkout}
                            onUpdate={handleUpdate}
                            onCancel={() => { setEditingWorkoutId(null); setEditingWorkout(null); }}
                        />
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#8898aa' }}>{t('loading')}...</div>
                ) : workouts.length > 0 ? (
                    <div style={{
                        display: editingWorkoutId ? 'none' : 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '25px'
                    }}>
                        {workouts.map(w => (
                            <div key={w.id} style={{
                                backgroundColor: '#fff',
                                padding: '25px',
                                borderRadius: '12px',
                                boxShadow: '0 0 2rem 0 rgba(136,152,170,.15)',
                                transition: 'transform 0.2s ease',
                                border: '1px solid #eee'
                            }}
                                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <h3 style={{ margin: 0, color: '#32325d', fontSize: '18px', fontWeight: '700' }}>
                                        {w.type || t('type_not_specified')}
                                    </h3>
                                    <div style={{ backgroundColor: '#f6f9fc', padding: '8px', borderRadius: '50%' }}>
                                        <FaFire color="#f5365c" />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#525f7f' }}>
                                        <FaClock color="#5e72e4" />
                                        <span style={{ fontSize: '14px' }}>
                                            <strong>{w.duration}</strong> {t('minutes_unit')}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#525f7f' }}>
                                        <FaFire color="#fb6340" />
                                        <span style={{ fontSize: '14px' }}>
                                            <strong>{w.caloriesBurned}</strong> {t('calories_unit')}
                                        </span>
                                    </div>
                                </div>

                                <div style={{
                                    marginTop: '25px',
                                    paddingTop: '20px',
                                    borderTop: '1px solid #f2f2f2',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '12px'
                                }}>
                                    <button
                                        onClick={() => handleEdit(w)}
                                        style={{
                                            background: '#f6f9fc',
                                            border: 'none',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            color: '#5e72e4',
                                            cursor: 'pointer'
                                        }}>
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(w.id)}
                                        style={{
                                            background: '#fee7e7',
                                            border: 'none',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            color: '#f5365c',
                                            cursor: 'pointer'
                                        }}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '100px 20px',
                        backgroundColor: '#fff',
                        borderRadius: '15px',
                        color: '#8898aa',
                        boxShadow: '0 0 2rem 0 rgba(136,152,170,.1)'
                    }}>
                        <FaCalendarAlt size={50} style={{ marginBottom: '20px', opacity: 0.3 }} />
                        <p>{t('no_workouts_found') || 'Бул күнү машыгуулар табылган жок'}</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default WorkoutsPage;