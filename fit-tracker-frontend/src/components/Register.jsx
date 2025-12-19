import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import LanguageSwitcher from './LanguageSwitcher';
import { useTheme } from '../context/ThemeContext'; // Подключаем тему
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
        setGeneralError('');
        setFieldErrors({});
        setSuccess('');

        try {
            await api.post('/auth/signup', { username, email, password });
            setSuccess(t('success.registration_successful'));
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            const responseData = err.response?.data;
            if (err.response?.status === 400 && responseData?.errorCode === 'VALIDATION_FAILED') {
                setFieldErrors(responseData.errors || {});
                setGeneralError(t('error.validation_check_fields'));
            } else {
                setGeneralError(responseData?.errorMessage || t('error.registration_failed'));
            }
        }
    };

    const renderFieldError = (fieldName) => {
        if (fieldErrors[fieldName]) {
            return <p style={{ color: colors.accent, fontSize: '0.9em', marginTop: '5px' }}>{fieldErrors[fieldName]}</p>;
        }
        return null;
    };

    return (
        <div style={{ ...global.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ ...global.card, maxWidth: '400px', width: '100%', position: 'relative' }}>
                <LanguageSwitcher />

                <h2 style={{ textAlign: 'center', color: colors.primary, marginBottom: '25px' }}>{t('register_heading')}</h2>

                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>{t('username_label')}:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{
                                ...global.input,
                                borderColor: fieldErrors.username ? colors.accent : colors.border
                            }}
                            placeholder={t('placeholder.enter_login')}
                        />
                        {renderFieldError('username')}
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>{t('email_label')}:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                ...global.input,
                                borderColor: fieldErrors.email ? colors.accent : colors.border
                            }}
                            placeholder={t('placeholder.enter_email')}
                        />
                        {renderFieldError('email')}
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>{t('password_label')}:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                ...global.input,
                                borderColor: fieldErrors.password ? colors.accent : colors.border
                            }}
                            placeholder={t('placeholder.enter_password')}
                        />
                        {renderFieldError('password')}
                    </div>

                    {generalError && <p style={{ color: colors.accent, textAlign: 'center' }}>{generalError}</p>}
                    {success && <p style={{ color: colors.primary, textAlign: 'center' }}>{success}</p>}

                    <button type="submit" style={global.button(colors.primary)}>
                        {t('register_button')}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', borderTop: `1px solid ${colors.border}`, paddingTop: '15px' }}>
                    {t('already_registered_prompt')}{' '}
                    <Link to="/" style={{ color: colors.primary, textDecoration: 'none', fontWeight: 'bold' }}>
                        {t('login_link_text')}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;