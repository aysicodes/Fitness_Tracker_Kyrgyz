import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Auth = () => {
    //hook t
    const { t } = useTranslation();
    const { login } = useAuth();

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
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>

            <h2>{t('login_heading')}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    {/* 3. Переводим подпись */}
                    <label>{t('username_label')}:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}

                        placeholder={t('placeholder.enter_login')}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>

                    <label>{t('password_label')}:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}

                        placeholder={t('placeholder.enter_password')}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>{t('login_button')}</button>
            </form>
        </div>
    );
};

export default Auth;