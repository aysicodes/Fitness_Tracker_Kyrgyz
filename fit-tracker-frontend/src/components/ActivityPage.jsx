import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityService } from '../api/ActivityService';
import { useTheme } from '../context/ThemeContext.jsx';
import { getGlobalStyles } from '../styles/AppStyles';
import {
    FaPlus, FaEdit, FaTrash, FaRunning,
    FaRoad, FaFire, FaCalendarAlt, FaHistory
} from 'react-icons/fa';

const ActivityPage = () => {
    const { t, i18n } = useTranslation();
    const { colors } = useTheme();
    const global = getGlobalStyles(colors);

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [formData, setFormData] = useState({ date: '', steps: '', distance: '', caloriesBurned: '' });

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const data = await ActivityService.getActivities();
            data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setActivities(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchActivities(); }, []);

    const handleEdit = (activity) => {
        setEditingActivity(activity);
        setFormData({
            date: activity.date ? new Date(activity.date).toISOString().split('T')[0] : '',
            steps: String(activity.steps),
            distance: String(activity.distance),
            caloriesBurned: String(activity.caloriesBurned),
        });
        setIsFormVisible(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            steps: parseInt(formData.steps),
            distance: parseFloat(formData.distance),
            caloriesBurned: parseInt(formData.caloriesBurned),
            date: new Date(formData.date),
        };

        try {
            if (editingActivity) {
                await ActivityService.updateActivity(editingActivity.id, payload);
            } else {
                await ActivityService.postActivity(payload);
            }
            fetchActivities();
            setIsFormVisible(false);
            setEditingActivity(null);
            setFormData({ date: '', steps: '', distance: '', caloriesBurned: '' });
        } catch (err) { console.error(err); }
    };

    if (loading) return (
        <div style={{ textAlign: 'center', marginTop: '50px', color: colors.textMain }}>
            {t('loading')}...
        </div>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.background }}>

            {/* LEFT SIDEBAR - С ТЕМОЙ */}
            <aside style={{
                width: '280px',
                backgroundColor: colors.card,
                borderRight: `1px solid ${colors.border}`,
                padding: '30px 20px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <h3 style={{
                    color: colors.textMain,
                    fontSize: '18px',
                    marginBottom: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <FaHistory style={{ color: colors.primary }} /> {t('activity_stats')}
                </h3>

                <button
                    onClick={() => {
                        setIsFormVisible(!isFormVisible);
                        setEditingActivity(null);
                        setFormData({ date: '', steps: '', distance: '', caloriesBurned: '' });
                    }}
                    style={{
                        ...global.button(colors.primary),
                        width: '100%',
                        justifyContent: 'center',
                        marginBottom: '30px'
                    }}
                >
                    <FaPlus style={{ marginRight: '8px' }} /> {t('add_new_activity_button')}
                </button>

                <div style={{
                    backgroundColor: colors.background,
                    padding: '20px',
                    borderRadius: '12px',
                    border: `1px solid ${colors.border}`
                }}>
                    <p style={{
                        fontSize: '13px',
                        color: colors.textMuted,
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        marginBottom: '15px'
                    }}>
                        {t('total_records')}
                    </p>
                    <h2 style={{ color: colors.textMain, margin: 0, fontSize: '32px' }}>{activities.length}</h2>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main style={{ flex: 1, padding: '40px' }}>
                <header style={{ marginBottom: '30px' }}>
                    <h1 style={{
                        fontSize: '24px',
                        color: colors.textMain,
                        fontWeight: '700',
                        margin: 0
                    }}>
                        {t('activity_heading')}
                    </h1>
                </header>

                {/* Add/Edit Form */}
                {isFormVisible && (
                    <div style={{ ...global.card, marginBottom: '30px' }}>
                        <h3 style={{
                            marginTop: 0,
                            marginBottom: '20px',
                            color: colors.primary,
                            fontSize: '18px'
                        }}>
                            {editingActivity ? t('edit_activity_heading') : t('add_new_activity')}
                        </h3>
                        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                                style={global.input}
                                required
                            />
                            <input
                                type="number"
                                placeholder={t('steps_placeholder')}
                                value={formData.steps}
                                onChange={(e) => setFormData({...formData, steps: e.target.value})}
                                style={global.input}
                                required
                            />
                            <input
                                type="number"
                                step="0.1"
                                placeholder={t('distance_placeholder')}
                                value={formData.distance}
                                onChange={(e) => setFormData({...formData, distance: e.target.value})}
                                style={global.input}
                                required
                            />
                            <input
                                type="number"
                                placeholder={t('calories_burned_placeholder')}
                                value={formData.caloriesBurned}
                                onChange={(e) => setFormData({...formData, caloriesBurned: e.target.value})}
                                style={global.input}
                                required
                            />

                            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={global.button(colors.primary)}>{t('save')}</button>
                                <button type="button" onClick={() => { setIsFormVisible(false); setEditingActivity(null); }} style={global.button(colors.accent)}>{t('cancel')}</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Activities Table */}
                <div style={{ ...global.card, overflow: 'hidden', padding: 0 }}>
                    {activities.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: colors.textMuted }}>
                            {t('no_activities_logged')}
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ backgroundColor: colors.background, borderBottom: `2px solid ${colors.border}` }}>
                                    <th style={{ padding: '15px 20px', textAlign: 'left', color: colors.textMuted }}>{t('date_label')}</th>
                                    <th style={{ padding: '15px 20px', textAlign: 'left', color: colors.textMuted }}>{t('steps_widget')}</th>
                                    <th style={{ padding: '15px 20px', textAlign: 'left', color: colors.textMuted }}>{t('distance_label')}</th>
                                    <th style={{ padding: '15px 20px', textAlign: 'left', color: colors.textMuted }}>{t('calories_label')}</th>
                                    <th style={{ padding: '15px 20px', textAlign: 'center', color: colors.textMuted }}>{t('actions')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {activities.map(act => (
                                    <tr key={act.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                                        <td style={{ padding: '15px 20px', color: colors.textMain }}>
                                            <FaCalendarAlt style={{ marginRight: '8px', color: colors.primary, verticalAlign: 'middle' }} />
                                            {new Date(act.date).toLocaleDateString(i18n.language)}
                                        </td>
                                        <td style={{ padding: '15px 20px' }}>
                                                <span style={{ color: colors.success, fontWeight: '600' }}>
                                                    <FaRunning style={{ marginRight: '5px' }} /> {act.steps}
                                                </span>
                                        </td>
                                        <td style={{ padding: '15px 20px', color: colors.textMuted }}>
                                            <FaRoad style={{ marginRight: '5px', color: colors.primary }} /> {act.distance} km
                                        </td>
                                        <td style={{ padding: '15px 20px', color: colors.textMuted }}>
                                            <FaFire style={{ marginRight: '5px', color: colors.accent }} /> {act.caloriesBurned} kcal
                                        </td>
                                        <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleEdit(act)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: colors.primary,
                                                    cursor: 'pointer',
                                                    padding: '8px',
                                                    marginRight: '10px'
                                                }}
                                            >
                                                <FaEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => ActivityService.deleteActivity(act.id).then(fetchActivities)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: colors.accent,
                                                    cursor: 'pointer',
                                                    padding: '8px'
                                                }}
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ActivityPage;