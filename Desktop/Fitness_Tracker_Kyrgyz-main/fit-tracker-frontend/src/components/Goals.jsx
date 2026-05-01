import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GoalService } from '../api/GoalService';
import { useTheme } from '../context/ThemeContext.jsx';
import { getGlobalStyles } from '../styles/AppStyles';
import { FaPlus, FaTrash, FaCalendarAlt, FaCheck } from 'react-icons/fa';

const Goals = () => {
    const { t, i18n } = useTranslation();
    const { colors } = useTheme();
    const global = getGlobalStyles(colors);

    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [formData, setFormData] = useState({ description: '', startDate: '', endDate: '' });

    const fetchGoals = async () => {
        setLoading(true);
        try {
            const data = await GoalService.getGoals();
            setGoals(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchGoals(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingGoal) {
                await GoalService.updateGoal(editingGoal.id, { ...formData, achieved: editingGoal.achieved });
            } else {
                await GoalService.postGoal(formData);
            }
            fetchGoals();
            setIsFormVisible(false);
            setEditingGoal(null);
        } catch (err) { console.error(err); }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: colors.textMain }}>{t('loading')}...</div>;

    return (
        <div style={{ backgroundColor: colors.background, minHeight: '100vh', padding: '40px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1 style={{ color: colors.textMain, fontSize: '28px', fontWeight: '700' }}>{t('goals_heading')}</h1>
                    <button
                        onClick={() => setIsFormVisible(true)}
                        style={global.button(colors.primary)}
                    >
                        <FaPlus style={{ marginRight: '8px' }} /> {t('add_goal_button')}
                    </button>
                </div>

                {isFormVisible && (
                    <div style={{ ...global.card, marginBottom: '30px' }}>
                        <h3 style={{ color: colors.textMain, marginBottom: '20px' }}>
                            {editingGoal ? t('edit_goal_heading') : t('add_new_goal')}
                        </h3>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <input
                                type="text"
                                placeholder={t('goal_description_placeholder')}
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                style={{ ...global.input, flex: '1 1 100%' }}
                                required
                            />
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                style={{ ...global.input, flex: 1 }}
                                required
                            />
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                style={{ ...global.input, flex: 1 }}
                                required
                            />
                            <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
                                <button type="submit" style={global.button(colors.primary)}>{t('save')}</button>
                                <button type="button" onClick={() => setIsFormVisible(false)} style={global.button(colors.accent)}>{t('cancel')}</button>
                            </div>
                        </form>
                    </div>
                )}

                <div style={{ ...global.card, overflow: 'hidden', padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: colors.background, borderBottom: `1px solid ${colors.border}` }}>
                        <tr>
                            <th style={{ padding: '15px 20px', textAlign: 'left', color: colors.textMuted }}>{t('goal_description_placeholder')}</th>
                            <th style={{ padding: '15px 20px', textAlign: 'left', color: colors.textMuted }}>{t('date_range_label')}</th>
                            <th style={{ padding: '15px 20px', textAlign: 'left', color: colors.textMuted }}>{t('status')}</th>
                            <th style={{ padding: '15px 20px', textAlign: 'center', color: colors.textMuted }}>{t('actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {goals.map(goal => (
                            <tr key={goal.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                                <td style={{ padding: '15px 20px', color: colors.textMain }}>{goal.description}</td>
                                <td style={{ padding: '15px 20px', color: colors.textMuted }}>
                                    <FaCalendarAlt style={{ marginRight: '8px' }} />
                                    {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '15px 20px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            backgroundColor: goal.achieved ? `${colors.success}20` : `${colors.warning}20`,
                                            color: goal.achieved ? colors.success : colors.warning
                                        }}>
                                            {goal.achieved ? t('status_achieved') : t('status_in_progress')}
                                        </span>
                                </td>
                                <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                                    {!goal.achieved && (
                                        <button onClick={() => GoalService.updateStatus(goal.id).then(fetchGoals)} style={{ background: 'none', border: 'none', color: colors.success, cursor: 'pointer' }}>
                                            <FaCheck />
                                        </button>
                                    )}
                                    <button onClick={() => GoalService.deleteGoal(goal.id).then(fetchGoals)} style={{ background: 'none', border: 'none', color: colors.accent, cursor: 'pointer', marginLeft: '10px' }}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {goals.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: colors.textMuted }}>
                            {t('no_goals_found') || 'Максаттар табылган жок'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Goals;