import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import LanguageSwitcher from './LanguageSwitcher';
import { useTheme } from '../context/ThemeContext';
import { getGlobalStyles } from '../styles/AppStyles';

const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { colors } = useTheme();
    const global = getGlobalStyles(colors);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setGeneralError(''); setFieldErrors({}); setSuccess('');
        try {
            await api.post('/auth/signup', { username, email, password });
            setSuccess(t('success.registration_successful'));
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            const responseData = err.response?.data;
            if (err.response?.status === 400 && responseData?.errorCode === 'VALIDATION_FAILED') {
                setFieldErrors(responseData.errors || {});
            } else {
                setGeneralError(responseData?.errorMessage || t('error.registration_failed'));
            }
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.background }}>
            {/* СОЛ ТАРАП: Логотип (Avenir стилинде) */}
            <div style={{
                flex: 1,
                backgroundColor: colors.primary,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#FFFFFF',
                padding: '20px'
            }}>
                <h1 style={{ fontSize: '5rem', fontWeight: '900', margin: 0, letterSpacing: '-3px' }}>ALA-TOO</h1>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '300', marginTop: '-15px', letterSpacing: '5px' }}>FIT</h2>
            </div>

            {/* ОҢ ТАРАП: Форма */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '20px', right: '20px' }}><LanguageSwitcher /></div>

                <div style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                    <h2 style={{ color: colors.textMain, marginBottom: '30px', fontSize: '2.2rem', fontWeight: '700' }}>{t('register_heading')}</h2>

                    <form onSubmit={handleRegister}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ color: colors.textMain, display: 'block', marginBottom: '8px', fontWeight: '600' }}>{t('username_label')} *</label>
                            <input
                                style={{ ...global.input, borderColor: fieldErrors.username ? colors.accent : colors.border }}
                                value={username} onChange={(e) => setUsername(e.target.value)} required
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ color: colors.textMain, display: 'block', marginBottom: '8px', fontWeight: '600' }}>{t('email_label')} *</label>
                            <input
                                type="email" style={{ ...global.input, borderColor: fieldErrors.email ? colors.accent : colors.border }}
                                value={email} onChange={(e) => setEmail(e.target.value)} required
                            />
                        </div>
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ color: colors.textMain, display: 'block', marginBottom: '8px', fontWeight: '600' }}>{t('password_label')} *</label>
                            <input
                                type="password" style={{ ...global.input, borderColor: fieldErrors.password ? colors.accent : colors.border }}
                                value={password} onChange={(e) => setPassword(e.target.value)} required
                            />
                        </div>

                        {generalError && <p style={{ color: colors.accent }}>{generalError}</p>}
                        {success && <p style={{ color: colors.primary }}>{success}</p>}

                        <button type="submit" style={{ ...global.button(colors.primary), width: '100%', padding: '15px', fontSize: '1.1rem' }}>
                            {t('register_button')}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '25px', color: colors.textMuted }}>
                        {t('already_registered_prompt')} <Link to="/" style={{ color: colors.primary, fontWeight: 'bold' }}>{t('login_link_text')}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;