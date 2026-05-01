import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
    FaEdit, FaSave, FaTimes, FaArrowLeft, FaUserCircle,
    FaEnvelope, FaBirthdayCake, FaUser, FaRulerVertical,
    FaWeight, FaTrash
} from 'react-icons/fa';
import { ProfileService } from '../api/ProfileService';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext.jsx';
import { getGlobalStyles } from '../styles/AppStyles';

const DetailRow = ({ label, value, icon: Icon, unit = null, colors }) => {
    const { t } = useTranslation();
    const displayValue = value ? (unit ? `${value} ${t(unit)}` : value) : t('not_filled');
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '15px 0',
            borderBottom: `1px solid ${colors.border}`
        }}>
            <span style={{ color: colors.textMuted, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon color={colors.primary} /> {label}
            </span>
            <span style={{ fontWeight: 'bold', color: colors.textMain }}>{displayValue}</span>
        </div>
    );
};

const UserProfile = () => {
    const { t } = useTranslation();
    const { logout } = useAuth();
    const { colors, isDarkMode } = useTheme();
    const global = getGlobalStyles(colors, isDarkMode);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const data = await ProfileService.fetchProfile();
            setUser(data);
            setFormData(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchProfile(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await ProfileService.updateProfile(formData);
            await fetchProfile();
            setIsEditing(false);
        } catch (err) { alert(t('error.update_failed')); }
    };

    if (loading) return (
        <div style={{ ...global.container, display: 'flex', justifyContent: 'center', alignItems: 'center', color: colors.textMain }}>
            {t('loading')}
        </div>
    );

    return (
        <div style={{ ...global.container, padding: '40px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <button style={{
                        ...global.button('transparent'),
                        border: `1px solid ${colors.border}`,
                        color: colors.textMain,
                        marginBottom: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <FaArrowLeft /> {t('dashboard_heading')}
                    </button>
                </Link>

                <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                    {/* Левая карточка */}
                    <div style={{ ...global.card, flex: '1', minWidth: '300px', textAlign: 'center', padding: '40px 20px' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            {/* Аватар – цвет зависит от темы */}
                            <FaUserCircle size={120} color={isDarkMode ? colors.textMain : colors.primary} />
                            {!isEditing && (
                                <div onClick={() => setIsEditing(true)} style={{
                                    position: 'absolute', bottom: 5, right: 5,
                                    backgroundColor: colors.primary, borderRadius: '50%',
                                    padding: '8px', cursor: 'pointer', color: '#fff'
                                }}>
                                    <FaEdit size={14} />
                                </div>
                            )}
                        </div>
                        <h2 style={{ marginTop: '20px', color: colors.textMain }}>{user?.username}</h2>
                        <p style={{ color: colors.textMuted, marginBottom: '25px' }}><FaEnvelope /> {user?.email}</p>

                        <button onClick={() => logout()} style={{ ...global.button(colors.accent), width: '100%' }}>
                            <FaTrash style={{ marginRight: '8px' }} /> {t('delete_account_button')}
                        </button>
                    </div>

                    {/* Правая карточка */}
                    <div style={{ ...global.card, flex: '2', minWidth: '350px', padding: '40px' }}>
                        <h3 style={{
                            borderBottom: `1px solid ${colors.border}`,
                            paddingBottom: '15px',
                            marginBottom: '25px',
                            color: colors.textMain,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            {t('personal_data')}
                            {!isEditing && (
                                <button onClick={() => setIsEditing(true)} style={{ ...global.button(colors.primary), padding: '5px 15px', fontSize: '0.8rem' }}>
                                    {t('edit_button')}
                                </button>
                            )}
                        </h3>

                        {!isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <DetailRow label={t('first_name_label')} value={user?.firstName} icon={FaUser} colors={colors} />
                                <DetailRow label={t('age_label')} value={user?.age} icon={FaBirthdayCake} colors={colors} />
                                <DetailRow label={t('height_label')} value={user?.height} unit="height_unit" icon={FaRulerVertical} colors={colors} />
                                <DetailRow label={t('weight_label')} value={user?.weight} unit="weight_unit" icon={FaWeight} colors={colors} />
                            </div>
                        ) : (
                            <form onSubmit={handleSave}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ color: colors.textMuted, display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>{t('first_name_label')}</label>
                                    <input
                                        style={global.input}
                                        value={formData.firstName || ''}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        placeholder={t('first_name_label')}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ color: colors.textMuted, display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>{t('age_label')}</label>
                                        <input
                                            type="number"
                                            style={global.input}
                                            value={formData.age || ''}
                                            onChange={(e) => setFormData({...formData, age: e.target.value})}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ color: colors.textMuted, display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>{t('height_label')} ({t('height_unit')})</label>
                                        <input
                                            type="number"
                                            style={global.input}
                                            value={formData.height || ''}
                                            onChange={(e) => setFormData({...formData, height: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '30px' }}>
                                    <label style={{ color: colors.textMuted, display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>{t('weight_label')} ({t('weight_unit')})</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        style={global.input}
                                        value={formData.weight || ''}
                                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <button type="submit" style={{ ...global.button(colors.primary), flex: 1 }}>
                                        <FaSave style={{ marginRight: '8px' }} /> {t('save_changes_button')}
                                    </button>
                                    <button type="button" onClick={() => setIsEditing(false)} style={{ ...global.button(colors.accent), flex: 1 }}>
                                        <FaTimes style={{ marginRight: '8px' }} /> {t('cancel_button')}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;