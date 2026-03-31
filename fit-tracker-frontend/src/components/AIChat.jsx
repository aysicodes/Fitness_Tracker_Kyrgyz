import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; // Текстти сулуу көрсөтүү үчүн
import { BRAND_COLORS, getThemeColors, getGlobalStyles } from '../styles/AppStyles';

const AIChat = ({ isDarkMode = false, userStats = null }) => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        {
            text: "Саламатсызбы! Мен **Ala-Too Fit** жардамчымын. Бүгүнкү статистикаңызды талдап, сизге кеңеш берүүгө даярмын. Кандай сурооңуз бар?",
            isAi: true
        }
    ]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    const colors = getThemeColors(isDarkMode);
    const globalStyles = getGlobalStyles(colors);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const userMsg = { text: message, isAi: false };
        setChatHistory(prev => [...prev, userMsg]);
        setLoading(true);
        const currentMessage = message;
        setMessage('');

        // --- АКЫЛДУУ ЛОГИКА ---
        // Эгер статистика жок болсо, ИИге жөн эле суроону жиберебиз
        let contextPrompt = "Сен профессионал фитнес тренерсиң. ТАЗА КЫРГЫЗ ТИЛИНДЕ жооп бер. Жоопторуң кыска, так жана мотивациялуу болсун. ";

        if (userStats && userStats.steps > 0) {
            contextPrompt += `Колдонуучунун бүгүнкү көрсөткүчтөрү: ${userStats.steps} кадам, ${userStats.totalCaloriesBurned} калория. Ушуну эске алып кеңеш бер. `;
        }

        try {
            const response = await axios.post('http://localhost:3030/api/ai/chat', {
                message: `${contextPrompt} \n Суроо: ${currentMessage}`
            });

            setChatHistory(prev => [...prev, { text: response.data, isAi: true }]);
        } catch (error) {
            setChatHistory(prev => [...prev, { text: "Кечириңиз, байланыш үзүлдү. Кайра аракет кылып көрүңүз.", isAi: true }]);
        } finally {
            setLoading(false);
        }
    };

    const chatStyles = {
        container: {
            ...globalStyles.card,
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '15px',
            boxSizing: 'border-box'
        },
        window: {
            flex: 1,
            overflowY: 'auto',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#fcfcfc',
            borderRadius: '12px'
        },
        bubble: (isAi) => ({
            padding: '2px 14px', // Markdown өзү ички паддинг берет
            borderRadius: '15px',
            maxWidth: '90%',
            alignSelf: isAi ? 'flex-start' : 'flex-end',
            backgroundColor: isAi ? (isDarkMode ? '#2d2d2d' : '#f0f2f5') : colors.primary,
            color: isAi ? colors.textMain : '#FFFFFF',
            fontSize: '0.92rem',
            lineHeight: '1.5',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        })
    };

    return (
        <div style={chatStyles.container}>
            <div style={{ textAlign: 'center', paddingBottom: '10px', borderBottom: `1px solid ${colors.border}` }}>
                <strong style={{ color: colors.primary }}>AI Кеңешчи</strong>
            </div>

            <div style={chatStyles.window}>
                {chatHistory.map((msg, index) => (
                    <div key={index} style={chatStyles.bubble(msg.isAi)}>
                        {/* Markdown иштетүү бул жерде */}
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                ))}
                {loading && (
                    <div style={{ color: colors.textMuted, fontSize: '0.8rem', fontStyle: 'italic' }}>
                        Жооп даярдалууда...
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                <input
                    style={{ ...globalStyles.input, borderRadius: '20px' }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Суроо жазыңыз..."
                />
                <button
                    style={{ ...globalStyles.button(colors.primary), borderRadius: '50%', width: '45px', height: '45px', padding: 0, justifyContent: 'center' }}
                    onClick={sendMessage}
                    disabled={loading}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>
        </div>
    );
};

export default AIChat;