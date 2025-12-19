import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GoalService } from '../api/GoalService';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { getGlobalStyles } from '../styles/AppStyles';
import { FaPlus, FaCheckCircle, FaTrash, FaCalendarAlt, FaBullseye, FaArrowLeft, FaEdit } from 'react-icons/fa';

const Goals = () => {
    const { t, i18n } = useTranslation();
    const { colors } = useTheme();
    const global = getGlobalStyles(colors);

    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [formData, setFormData] = useState({ description: '', startDate: '', endDate: '', targetSteps: '', targetDistance: '' });

    const fetchGoals = async () => {
        setLoading(true);
        try {
            const data = await GoalService.getGoals();
            setGoals(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchGoals(); }, []);

    const handleEdit = (goal) => {
        setEditingGoal(goal);
        setFormData({
            description: goal.description,
            startDate: goal.startDate ? new Date(goal.startDate).toISOString().split('T')[0] : '',
            endDate: goal.endDate ? new Date(goal.endDate).toISOString().split('T')[0] : '',
            targetSteps: String(goal.targetSteps || ''),
            targetDistance: String(goal.targetDistance || ''),
        });
        setIsFormVisible(true);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingGoal(null);
        setFormData({ description: '', startDate: '', endDate: '', targetSteps: '', targetDistance: '' });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            targetSteps: formData.targetSteps ? parseInt(formData.targetSteps) : null,
            targetDistance: formData.targetDistance ? parseFloat(formData.targetDistance) : null,
        };

        try {
            if (editingGoal) {
                await GoalService.updateGoal(editingGoal.id, { ...payload, achieved: editingGoal.achieved });
            } else {
                await GoalService.postGoal(payload);
            }
            fetchGoals();
            handleCancel();
        } catch (err) { console.error(err); }
    };

    if (loading) return <p style={{ textAlign: 'center', color: colors.textMain, marginTop: '50px' }}>{t('loading')}</p>;

    return (
        <div style={{ backgroundColor: colors.background, minHeight: '100vh', padding: '30px', transition: 'all 0.3s ease' }}>
            <div style={{ maxWidth: '1200px', margin: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h1 style={{ color: colors.primary, display: 'flex', alignItems: 'center', margin: 0 }}>
                        <FaBullseye style={{ marginRight: '15px' }} /> {t('goals_heading')}
                    </h1>
                    <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                        <button style={global.button(colors.primary)}><FaArrowLeft style={{marginRight: '8px'}}/> {t('dashboard_heading')}</button>
                    </Link>
                </div>

                <button
                    onClick={() => isFormVisible ? handleCancel() : setIsFormVisible(true)}
                    style={{ ...global.button(isFormVisible ? colors.accent : colors.success), marginBottom: '30px' }}
                >
                    <FaPlus style={{ marginRight: '8px' }} />
                    {isFormVisible ? t('hide_form_button') : t('add_new_goal_button')}
                </button>

                {isFormVisible && (
                    <div style={{ ...global.card, marginBottom: '30px' }}>
                        <h3 style={{ color: colors.primary, marginTop: 0 }}>{editingGoal ? t('edit_goal_heading') : t('add_new_goal')}</h3>
                        <form onSubmit={handleSave}>
                            <input type="text" placeholder={t('goal_description_placeholder')} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{...global.input, color: colors.textMain, backgroundColor: colors.card}} required />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} style={{...global.input, color: colors.textMain, backgroundColor: colors.card}} required />
                                <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} style={{...global.input, color: colors.textMain, backgroundColor: colors.card}} required />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={global.button(colors.primary)}>{t('save_changes_button')}</button>
                                <button type="button" onClick={handleCancel} style={global.button(colors.accent)}>{t('cancel_button')}</button>
                            </div>
                        </form>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                    {goals.map(goal => (
                        <div key={goal.id} style={{
                            ...global.card,
                            border: goal.achieved ? `2px solid ${colors.success}` : `1px solid ${colors.border}`,
                            position: 'relative'
                        }}>
                            <h3 style={{ color: colors.textMain, marginTop: 0 }}>{goal.description}</h3>
                            <p style={{ color: colors.textMuted }}><FaCalendarAlt /> {new Date(goal.startDate).toLocaleDateString(i18n.language)} - {new Date(goal.endDate).toLocaleDateString(i18n.language)}</p>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                {!goal.achieved && (
                                    <button onClick={() => GoalService.updateStatus(goal.id).then(fetchGoals)} style={global.button(colors.success)}>{t('mark_achieved_button')}</button>
                                )}
                                <button onClick={() => handleEdit(goal)} style={global.button(colors.primary)}><FaEdit /></button>
                                <button onClick={() => GoalService.deleteGoal(goal.id).then(fetchGoals)} style={global.button(colors.accent)}><FaTrash /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Goals;