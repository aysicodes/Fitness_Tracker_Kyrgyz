import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { predefinedTypes } from './WorkoutForm';

const EditWorkoutForm = ({ workout, onUpdate, onCancel }) => {
    const { t } = useTranslation();

    const [typeKey, setTypeKey] = useState(workout.typeKey || '');
    const [customType, setCustomType] = useState(workout.customType || '');
    const [duration, setDuration] = useState(workout.duration);
    const [caloriesBurned, setCaloriesBurned] = useState(workout.caloriesBurned);
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');

        if (!typeKey && !customType) {
            setMessage(t('validation.type_required'));
            return;
        }

        const updatedPayload = {
            typeKey: typeKey || null,
            customType: customType || null,
            duration: duration,
            caloriesBurned: caloriesBurned,
            date: workout.date //saving data
        };

        onUpdate(workout.id, updatedPayload);
    };

    return (
        <div style={{ padding: '20px', border: '2px solid #ffc107', borderRadius: '8px', marginBottom: '30px' }}>
            <h3>{t('edit_workout_heading')}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>

                {/* form to fill in as in WorkoutForm.jsx) */}
                <div style={{ gridColumn: 'span 2' }}>
                    <label>{t('predefined_type_label')}:</label>
                    <select
                        value={typeKey}
                        onChange={(e) => { setTypeKey(e.target.value); setCustomType(''); }}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="">-- {t('select_option')} --</option>
                        {predefinedTypes.map(item => (
                            <option key={item.key} value={item.key}>{t(item.labelKey)}</option>
                        ))}
                    </select>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                    <label>{t('custom_type_label')}:</label>
                    <input
                        type="text"
                        value={customType}
                        onChange={(e) => { setCustomType(e.target.value); setTypeKey(''); }}
                        placeholder={t('placeholder.custom_workout')}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label>{t('duration_label')}: ({t('minutes_unit')})</label>
                    <input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value) || 0)} required style={{ width: '100%', padding: '8px' }} />
                </div>

                <div>
                    <label>{t('calories_label')}: ({t('calories_unit')})</label>
                    <input type="number" value={caloriesBurned} onChange={(e) => setCaloriesBurned(parseInt(e.target.value) || 0)} required style={{ width: '100%', padding: '8px' }} />
                </div>


                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ flexGrow: 1, padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
                        {t('update_button')}
                    </button>
                    <button type="button" onClick={onCancel} style={{ flexGrow: 1, padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}>
                        {t('cancel_button')}
                    </button>
                </div>
                {message && <p style={{ color: 'red', gridColumn: 'span 2', textAlign: 'center' }}>{message}</p>}
            </form>
        </div>
    );
};

export default EditWorkoutForm;