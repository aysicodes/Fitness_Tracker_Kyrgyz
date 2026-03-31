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
        } catch (err) { console.error(err); }
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>{t('loading')}...</p>;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            {/* Сол жактагы кошумча панель (Filter/Action) */}
            <aside style={{ width: '280px', backgroundColor: '#fff', borderRight: '1px solid #eee', padding: '30px 20px' }}>
                <h3 style={{ color: '#32325d', fontSize: '18px', marginBottom: '25px', display: 'flex', alignItems: 'center' }}>
                    <FaHistory style={{ marginRight: '10px' }} /> {t('activity_stats')}
                </h3>

                <button
                    onClick={() => setIsFormVisible(!isFormVisible)}
                    style={{
                        ...global.button('#5e72e4'),
                        width: '100%',
                        justifyContent: 'center',
                        marginBottom: '30px',
                        boxShadow: '0 4px 6px rgba(50,50,93,.11)'
                    }}
                >
                    <FaPlus style={{ marginRight: '8px' }} /> {t('add_new_activity_button')}
                </button>

                <div style={{ backgroundColor: '#f6f9fc', padding: '20px', borderRadius: '12px' }}>
                    <p style={{ fontSize: '13px', color: '#8898aa', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '15px' }}>
                        {t('total_records')}
                    </p>
                    <h2 style={{ color: '#32325d', margin: 0 }}>{activities.length}</h2>
                </div>
            </aside>

            {/* Негизги мазмун */}
            <main style={{ flex: 1, padding: '40px' }}>
                <header style={{ marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '24px', color: '#32325d', fontWeight: '700', margin: 0 }}>
                        {t('activity_heading')}
                    </h1>
                </header>

                {/* Жаңы активдүүлүк кошуу формасы (Card) */}
                {isFormVisible && (
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '30px',
                        borderRadius: '12px',
                        boxShadow: '0 0 2rem 0 rgba(136,152,170,.15)',
                        marginBottom: '30px'
                    }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#5e72e4' }}>
                            {editingActivity ? t('edit_activity_heading') : t('add_new_activity')}
                        </h3>
                        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} style={global.input} required />
                            <input type="number" placeholder={t('steps_placeholder')} value={formData.steps} onChange={(e) => setFormData({...formData, steps: e.target.value})} style={global.input} required />
                            <input type="number" step="0.1" placeholder="km" value={formData.distance} onChange={(e) => setFormData({...formData, distance: e.target.value})} style={global.input} required />
                            <input type="number" placeholder="kcal" value={formData.caloriesBurned} onChange={(e) => setFormData({...formData, caloriesBurned: e.target.value})} style={global.input} required />

                            <div style={{ gridColumn: '1 / span 2', display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={global.button('#5e72e4')}>{t('save')}</button>
                                <button type="button" onClick={() => {setIsFormVisible(false); setEditingActivity(null);}} style={global.button('#f5365c')}>{t('cancel')}</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Активдүүлүктөр тизмеси (Table Style) */}
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 0 2rem 0 rgba(136,152,170,.15)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f6f9fc', color: '#8898aa', textTransform: 'uppercase', fontSize: '12px' }}>
                        <tr>
                            <th style={{ padding: '15px 25px' }}>{t('date_label')}</th>
                            <th style={{ padding: '15px 25px' }}>{t('steps_widget')}</th>
                            <th style={{ padding: '15px 25px' }}>{t('distance_label')}</th>
                            <th style={{ padding: '15px 25px' }}>{t('calories_label')}</th>
                            <th style={{ padding: '15px 25px', textAlign: 'right' }}>{t('actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {activities.map(act => (
                            <tr key={act.id} style={{ borderTop: '1px solid #eee' }}>
                                <td style={{ padding: '20px 25px', color: '#32325d', fontWeight: '600' }}>
                                    <FaCalendarAlt style={{ marginRight: '8px', color: '#adb5bd' }} />
                                    {new Date(act.date).toLocaleDateString(i18n.language)}
                                </td>
                                <td style={{ padding: '20px 25px' }}>
                                    <span style={{ color: '#2dce89', fontWeight: '700' }}><FaRunning /> {act.steps}</span>
                                </td>
                                <td style={{ padding: '20px 25px', color: '#525f7f' }}>
                                    <FaRoad style={{ marginRight: '5px', color: '#5e72e4' }} /> {act.distance} km
                                </td>
                                <td style={{ padding: '20px 25px', color: '#f5365c' }}>
                                    <FaFire style={{ marginRight: '5px' }} /> {act.caloriesBurned} kcal
                                </td>
                                <td style={{ padding: '20px 25px', textAlign: 'right' }}>
                                    <button onClick={() => handleEdit(act)} style={{ border: 'none', background: 'none', color: '#5e72e4', cursor: 'pointer', marginRight: '15px' }}>
                                        <FaEdit size={18} />
                                    </button>
                                    <button onClick={() => ActivityService.deleteActivity(act.id).then(fetchActivities)} style={{ border: 'none', background: 'none', color: '#f5365c', cursor: 'pointer' }}>
                                        <FaTrash size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default ActivityPage;