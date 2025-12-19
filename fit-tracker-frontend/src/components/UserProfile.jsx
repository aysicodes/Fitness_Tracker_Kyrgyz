import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaEdit, FaSave, FaTimes, FaArrowLeft, FaUserCircle, FaEnvelope, FaBirthdayCake, FaUser, FaRulerVertical, FaWeight, FaTrash } from 'react-icons/fa';
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
            padding: '12px 0',
            borderBottom: `1px solid ${colors.border}`
        }}>
            <span style={{ color: colors.textMuted, display: 'flex', alignItems: 'center' }}>
                <Icon style={{ marginRight: '8px', color: colors.primary }}/> {label}
            </span>
            <span style={{ fontWeight: 'bold', color: colors.textMain }}>{displayValue}</span>
        </div>
    );
};

const UserProfile = () => {
    const { t } = useTranslation();
    const { logout } = useAuth();
    const { colors } = useTheme();
    const global = getGlobalStyles(colors);

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
        <div style={{ ...global.page, display: 'flex', justifyContent: 'center', alignItems: 'center', color: colors.textMain }}>
            {t('loading')}
        </div>
    );

    return (
        <div style={{
            ...global.page,
            backgroundColor: colors.background,
            minHeight: '100vh',
            color: colors.textMain
        }}>
            <div style={{
                ...global.card,
                backgroundColor: colors.card,
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <button style={{
                        ...global.button(colors.border),
                        backgroundColor: colors.card,
                        color: colors.textMain,
                        marginBottom: '20px',
                        border: `1px solid ${colors.border}`
                    }}>
                        <FaArrowLeft /> {t('dashboard_heading')}
                    </button>
                </Link>

                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <FaUserCircle size={80} color={colors.primary} />
                    <h2 style={{ color: colors.textMain, marginTop: '10px' }}>{user?.username}</h2>
                    <p style={{ color: colors.textMuted }}><FaEnvelope /> {user?.email}</p>
                </div>

                {!isEditing ? (
                    <>
                        <DetailRow label={t('first_name_label')} value={user?.firstName} icon={FaUser} colors={colors} />
                        <DetailRow label={t('age_label')} value={user?.age} icon={FaBirthdayCake} colors={colors} />
                        <DetailRow label={t('height_label')} value={user?.height} unit="height_unit" icon={FaRulerVertical} colors={colors} />
                        <DetailRow label={t('weight_label')} value={user?.weight} unit="weight_unit" icon={FaWeight} colors={colors} />

                        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                            <button onClick={() => setIsEditing(true)} style={{ ...global.button(colors.primary), flex: 1 }}>
                                <FaEdit /> {t('edit_button')}
                            </button>
                            <button onClick={() => logout()} style={{ ...global.button(colors.accent), flex: 1 }}>
                                <FaTrash /> {t('delete_account_button')}
                            </button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleSave}>
                        {/*name*/}
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ color: colors.textMain, display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('first_name_label')}</label>
                            <input
                                style={{
                                    ...global.input,
                                    backgroundColor: colors.background,
                                    color: colors.textMain,
                                    border: `1px solid ${colors.border}`
                                }}
                                value={formData.firstName || ''}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                placeholder={t('first_name_label')}
                            />
                        </div>
                        {/*age*/}
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ color: colors.textMain, display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('age_label')}</label>
                            <input
                                type="number"
                                style={{
                                    ...global.input,
                                    backgroundColor: colors.background,
                                    color: colors.textMain,
                                    border: `1px solid ${colors.border}`
                                }}
                                value={formData.age || ''}
                                onChange={(e) => setFormData({...formData, age: e.target.value})}
                                placeholder={t('age_label')}
                            />
                        </div>
                        {/*height*/}
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ color: colors.textMain, display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('height_label')} ({t('height_unit')})</label>
                            <input
                                type="number"
                                style={{
                                    ...global.input,
                                    backgroundColor: colors.background,
                                    color: colors.textMain,
                                    border: `1px solid ${colors.border}`
                                }}
                                value={formData.height || ''}
                                onChange={(e) => setFormData({...formData, height: e.target.value})}
                                placeholder={t('height_label')}
                            />
                        </div>
                        {/*weight*/}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ color: colors.textMain, display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('weight_label')} ({t('weight_unit')})</label>
                            <input
                                type="number"
                                step="0.1"
                                style={{
                                    ...global.input,
                                    backgroundColor: colors.background,
                                    color: colors.textMain,
                                    border: `1px solid ${colors.border}`
                                }}
                                value={formData.weight || ''}
                                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                placeholder={t('weight_label')}
                            />
                        </div>

                        {/*buttons*/}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" style={{ ...global.button(colors.primary), flex: 1 }}>
                                <FaSave /> {t('save_changes_button')}
                            </button>
                            <button type="button" onClick={() => setIsEditing(false)} style={{ ...global.button(colors.accent), flex: 1 }}>
                                <FaTimes /> {t('cancel_button')}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserProfile;