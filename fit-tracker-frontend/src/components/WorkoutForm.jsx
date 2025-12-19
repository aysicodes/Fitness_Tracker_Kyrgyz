import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSave } from 'react-icons/fa';
import api from '../api/axiosConfig';
import { useTheme } from '../context/ThemeContext';
import { getGlobalStyles } from '../styles/AppStyles';

export const predefinedTypes = [
    { key: 'RUNNING', labelKey: 'workout.type.running' },
    { key: 'CYCLING', labelKey: 'workout.type.cycling' },
    { key: 'WEIGHTLIFTING', labelKey: 'workout.type.weightlifting' },
];

const WorkoutForm = ({ onWorkoutAdded }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const global = getGlobalStyles(colors);

    const [typeKey, setTypeKey] = useState('');
    const [customType, setCustomType] = useState('');
    const [duration, setDuration] = useState(30);
    const [caloriesBurned, setCaloriesBurned] = useState(200);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!typeKey && !customType) {
            setMessage(t('validation.type_required'));
            setIsError(true);
            return;
        }

        const payload = {
            typeKey: typeKey || null,
            customType: customType || null,
            duration: duration,
            caloriesBurned: caloriesBurned,
            date: new Date().toISOString()
        };

        try {
            const response = await api.post('/workout', payload);
            setMessage(t('success.workout_added', { type: response.data.type }));
            setIsError(false);
            setTypeKey(''); setCustomType(''); setDuration(30); setCaloriesBurned(200);
            onWorkoutAdded();
        } catch (err) {
            setMessage(err.response?.data?.errorMessage || t('error.saving_failed'));
            setIsError(true);
        }
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: colors.textMain
    };

    return (
        <div style={{ padding: '0px' }}>
            <h3 style={{ fontSize: '1.5em', marginBottom: '20px', color: colors.textMain }}>
                {t('add_new_workout')}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>

                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>{t('predefined_type_label')}:</label>
                    <select
                        value={typeKey}
                        onChange={(e) => { setTypeKey(e.target.value); setCustomType(''); }}
                        style={{
                            ...global.input,
                            backgroundColor: colors.card,
                            color: colors.textMain
                        }}
                    >
                        <option value="" style={{backgroundColor: colors.card, color: colors.text}}>-- {t('select_option')} --</option>
                        {predefinedTypes.map(item => (
                            <option key={item.key} value={item.key} style={{backgroundColor: colors.card, color: colors.text}}>
                                {t(item.labelKey)}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ gridColumn: '1 / -1', textAlign: 'center', margin: '-5px 0' }}>
                    <small style={{ color: colors.textMuted }}>{t('or_separator')}</small>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>{t('custom_type_label')}:</label>
                    <input
                        type="text"
                        value={customType}
                        onChange={(e) => { setCustomType(e.target.value); setTypeKey(''); }}
                        placeholder={t('placeholder.custom_workout')}
                        style={{
                            ...global.input,
                            backgroundColor: colors.card,
                            color: colors.textMain
                        }}
                    />
                </div>

                <div>
                    <label style={labelStyle}>{t('duration_label')} ({t('minutes_unit')}):</label>
                    <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                        style={{
                            ...global.input,
                            backgroundColor: colors.card,
                            color: colors.textMain
                        }}
                        min="1"
                    />
                </div>

                <div>
                    <label style={labelStyle}>{t('calories_label')} ({t('calories_unit')}):</label>
                    <input
                        type="number"
                        value={caloriesBurned}
                        onChange={(e) => setCaloriesBurned(parseInt(e.target.value) || 0)}
                        style={{
                            ...global.input,
                            backgroundColor: colors.card,
                            color: colors.textMain
                        }}
                        min="1"
                    />
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                    <button type="submit" style={global.button(colors.primary)}>
                        <FaSave style={{marginRight: '8px'}} /> {t('save_workout_button')}
                    </button>
                </div>

                {message && (
                    <p style={{
                        color: isError ? colors.accent : colors.primary,
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        marginTop: '10px',
                        fontWeight: 'bold'
                    }}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
};

export default WorkoutForm;