import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GoalService } from '../api/GoalService';
import { useTheme } from '../context/ThemeContext.jsx';
import { getGlobalStyles } from '../styles/AppStyles';
import { FaPlus, FaTrash, FaCalendarAlt, FaBullseye, FaEdit, FaCheck } from 'react-icons/fa';

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

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>

            <aside style={{ width: '280px', backgroundColor: '#fff', borderRight: '1px solid #eee', padding: '40px 20px' }}>
                <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <img src="/logo.png" alt="Ala-Too Fit" style={{ width: '120px' }} />
                </div>
                <nav>
                    <button
                        onClick={() => setIsFormVisible(!isFormVisible)}
                        style={{ ...global.button('#5e72e4'), width: '100%', justifyContent: 'center', marginBottom: '20px' }}
                    >
                        <FaPlus style={{ marginRight: '10px' }} /> {t('add_goal_button')}
                    </button>
                    <div style={{ color: '#8898aa', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', paddingLeft: '10px' }}>
                        {t('statistics')}
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '40px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '24px', color: '#32325d', fontWeight: '700' }}>{t('goals_heading')}</h1>
                </header>

                {isFormVisible && (
                    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 0 2rem 0 rgba(136,152,170,.15)', marginBottom: '30px' }}>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <input type="text" placeholder={t('description')} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{...global.input, flex: '1 1 100%'}} required />
                            <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} style={{...global.input, flex: '1'}} required />
                            <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} style={{...global.input, flex: '1'}} required />
                            <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
                                <button type="submit" style={global.button('#5e72e4')}>{t('save')}</button>
                                <button type="button" onClick={() => setIsFormVisible(false)} style={global.button('#f5365c')}>{t('cancel')}</button>
                            </div>
                        </form>
                    </div>
                )}

                <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 0 2rem 0 rgba(136,152,170,.15)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f6f9fc', color: '#8898aa', textTransform: 'uppercase', fontSize: '12px' }}>
                        <tr>
                            <th style={{ padding: '15px 25px' }}>{t('goal_description_placeholder')}</th>
                            <th style={{ padding: '15px 25px' }}>{t('date_range_label')}</th>
                            <th style={{ padding: '15px 25px' }}>{t('status')}</th>
                            <th style={{ padding: '15px 25px' }}>{t('actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {goals.map(goal => (
                            <tr key={goal.id} style={{ borderTop: '1px solid #eee' }}>
                                <td style={{ padding: '20px 25px', color: '#32325d', fontWeight: '600' }}>{goal.description}</td>
                                <td style={{ padding: '20px 25px', color: '#525f7f' }}>
                                    <FaCalendarAlt style={{ marginRight: '8px', color: '#adb5bd' }} />
                                    {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '20px 25px' }}>
                                        <span style={{
                                            padding: '5px 10px', borderRadius: '20px', fontSize: '12px',
                                            backgroundColor: goal.achieved ? '#e2f9ed' : '#fef1f2',
                                            color: goal.achieved ? '#2dce89' : '#f5365c'
                                        }}>
                                            {goal.achieved ? t('status_achieved') : t('status_in_progress')}
                                        </span>
                                </td>
                                <td style={{ padding: '20px 25px', display: 'flex', gap: '10px' }}>
                                    {!goal.achieved && <button onClick={() => GoalService.updateStatus(goal.id).then(fetchGoals)} style={{ border: 'none', background: 'none', color: '#2dce89' }}><FaCheck /></button>}
                                    <button onClick={() => GoalService.deleteGoal(goal.id).then(fetchGoals)} style={{ border: 'none', background: 'none', color: '#f5365c' }}><FaTrash /></button>
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

export default Goals;