import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityService } from '../api/ActivityService';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { getGlobalStyles } from '../styles/AppStyles';
import { FaPlus, FaEdit, FaTrash, FaRunning, FaRoad, FaFire, FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';

const ActivityPage = () => {
    const { t, i18n } = useTranslation();
    const { colors } = useTheme();
    const global = getGlobalStyles(colors);

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState({ text: '', isError: false });
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
            setStatusMessage({ text: t('error.loading_activities_failed'), isError: true });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchActivities(); }, []);

    const handleEdit = (activity) => {
        setEditingActivity(activity);
        const formattedDate = activity.date ? new Date(activity.date).toISOString().split('T')[0] : '';
        setFormData({
            date: formattedDate,
            steps: String(activity.steps),
            distance: String(activity.distance),
            caloriesBurned: String(activity.caloriesBurned),
        });
        setIsFormVisible(true);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingActivity(null);
        setFormData({ date: '', steps: '', distance: '', caloriesBurned: '' });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            steps: parseInt(formData.steps) || 0,
            distance: parseFloat(formData.distance) || 0.0,
            caloriesBurned: parseInt(formData.caloriesBurned) || 0,
            date: formData.date ? new Date(formData.date) : new Date(),
        };

        try {
            if (editingActivity) {
                await ActivityService.updateActivity(editingActivity.id, payload);
            } else {
                await ActivityService.postActivity(payload);
            }
            fetchActivities();
            handleCancel();
        } catch (err) {
            setStatusMessage({ text: t('error.save_activity_failed'), isError: true });
        }
    };

    if (loading) return <p style={{ textAlign: 'center', color: colors.textMain, marginTop: '50px' }}>{t('loading')}</p>;

    return (
        <div style={{ backgroundColor: colors.background, minHeight: '100vh', padding: '30px', transition: 'all 0.3s ease' }}>
            <div style={{ maxWidth: '1000px', margin: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1 style={{ color: colors.primary, display: 'flex', alignItems: 'center', margin: 0 }}>
                        <FaRunning style={{ marginRight: '15px' }} /> {t('activity_heading')}
                    </h1>
                    <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                        <button style={global.button(colors.primary)}>
                            <FaArrowLeft style={{ marginRight: '8px' }} /> {t('dashboard_heading')}
                        </button>
                    </Link>
                </div>

                <button
                    onClick={() => isFormVisible ? handleCancel() : setIsFormVisible(true)}
                    style={{ ...global.button(isFormVisible ? colors.accent : colors.success), marginBottom: '30px' }}
                >
                    <FaPlus style={{ marginRight: '8px' }} />
                    {isFormVisible ? t('hide_form_button') : t('add_new_activity_button')}
                </button>

                {isFormVisible && (
                    <div style={{ ...global.card, marginBottom: '30px' }}>
                        <h3 style={{ color: colors.primary, marginTop: 0 }}>
                            {editingActivity ? t('edit_activity_heading') : t('add_new_activity')}
                        </h3>
                        <form onSubmit={handleSave}>
                            <label style={{ color: colors.textMain, fontWeight: 'bold' }}>{t('date_label')}</label>
                            <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} style={{...global.input, color: colors.textMain, backgroundColor: colors.card}} required />

                            <input type="number" placeholder={t('steps_placeholder')} value={formData.steps} onChange={(e) => setFormData({...formData, steps: e.target.value})} style={{...global.input, color: colors.textMain, backgroundColor: colors.card}} required />

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={global.button(colors.primary)}>{t('save_workout_button')}</button>
                                <button type="button" onClick={handleCancel} style={global.button(colors.accent)}>{t('cancel_button')}</button>
                            </div>
                        </form>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {activities.map(act => (
                        <div key={act.id} style={{ ...global.card, borderLeft: `5px solid ${colors.primary}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, color: colors.textMain }}>
                                    <FaCalendarAlt style={{ marginRight: '8px' }}/> {new Date(act.date).toLocaleDateString(i18n.language)}
                                </h3>
                                <div style={{ display: 'flex', gap: '20px', marginTop: '10px', color: colors.textMuted }}>
                                    <span><FaRunning color={colors.success}/> {act.steps}</span>
                                    <span><FaRoad color={colors.primary}/> {act.distance} km</span>
                                    <span><FaFire color={colors.accent}/> {act.caloriesBurned}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => handleEdit(act)} style={global.button(colors.primary)}><FaEdit /></button>
                                <button onClick={() => ActivityService.deleteActivity(act.id).then(fetchActivities)} style={global.button(colors.accent)}><FaTrash /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActivityPage;