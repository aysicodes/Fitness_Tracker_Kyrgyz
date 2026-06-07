import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useTheme } from '../context/ThemeContext';
import { getGlobalStyles } from '../styles/AppStyles';

const Auth = () => {
    const { t } = useTranslation();
    const { login } = useAuth();
    const { colors, isDarkMode } = useTheme();
    const global = getGlobalStyles(colors, isDarkMode); // ← передаём isDarkMode

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!username || !password) {
            setError(t('validation.login_required'));
            return;
        }
        try {
            await login(username, password);
        } catch (err) {
            setError(t('error.login_failed'));
            console.error("Login Error:", err);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.background }}>
            {/* Левая панель с логотипом */}
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

            {/* Правая панель с формой */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                    <LanguageSwitcher />
                </div>

                <div style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                    <h2 style={{ color: colors.textMain, marginBottom: '30px', fontSize: '2.2rem', fontWeight: '700' }}>
                        {t('login_heading')}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ color: colors.textMain, display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                {t('username_label')} *
                            </label>
                            <input
                                type="text"
                                name="username"                     
                                autoComplete="username"              
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={global.input}
                                placeholder={t('placeholder.enter_login')}
                                />
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ color: colors.textMain, display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                {t('password_label')} *
                            </label>
                            <input
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={global.input}
                                placeholder={t('placeholder.enter_password')}
                                />
                        </div>

                        {error && <p style={{ color: colors.accent, marginBottom: '15px' }}>{error}</p>}

                        <button
                            type="submit"
                            style={{ ...global.button(colors.primary), width: '100%', padding: '15px', fontSize: '1.1rem' }}
                        >
                            {t('login_button')}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '25px', color: colors.textMuted }}>
                        {t('no_account_prompt')}{' '}
                        <Link to="/register" style={{ color: isDarkMode ? '#FFFFFF' : colors.primary, fontWeight: 'bold' }}>
                            {t('register_link_text')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
