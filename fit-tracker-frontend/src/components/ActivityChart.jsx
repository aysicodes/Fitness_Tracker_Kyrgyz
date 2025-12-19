import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    Label
} from 'recharts';
import { useTheme } from '../context/ThemeContext.jsx';

const ActivityChart = ({ data }) => {
    const { t } = useTranslation();
    const { colors, isDarkMode } = useTheme();

    const formatXAxis = (tickItem) => {
        const date = new Date(tickItem);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    return (
        <div style={{
            backgroundColor: colors.card,
            padding: '25px',
            borderRadius: '16px',
            boxShadow: colors.shadow,
            border: `1px solid ${colors.border}`,
            marginTop: '30px'
        }}>

            <h2 style={{ color: colors.textMain, marginBottom: '30px', fontSize: '1.5em' }}>
                {t('daily_activity_last_30_days')}
            </h2>

            <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDarkMode ? "#444" : "#e0e0e0"}
                        vertical={false}
                    />

                    <XAxis
                        dataKey="date"
                        tickFormatter={formatXAxis}
                        stroke={colors.textMuted}
                        tick={{ fill: colors.textMuted }}
                    />

                    {/* left side-speps */}
                    <YAxis
                        yAxisId="left"
                        stroke={colors.primary}
                        tick={{ fill: colors.primary }}
                    >
                        <Label
                            value={t('steps_key') || 'Steps'}
                            angle={-90}
                            position="insideLeft"
                            style={{ textAnchor: 'middle', fill: colors.primary, fontWeight: 'bold' }}
                        />
                    </YAxis>

                    {/* right side-calories_burned */}
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke={colors.accent}
                        tick={{ fill: colors.accent }}
                    >
                        <Label
                            value={t('calories_unit') || 'Kcal'}
                            angle={90}
                            position="insideRight"
                            style={{ textAnchor: 'middle', fill: colors.accent, fontWeight: 'bold' }}
                        />
                    </YAxis>

                    <Tooltip
                        contentStyle={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            borderRadius: '10px',
                            color: colors.textMain
                        }}
                        itemStyle={{ color: colors.textMain }}
                    />

                    {/* using Legend*/}
                    <Legend verticalAlign="top" height={36}/>

                    {/* steps */}
                    <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="steps"
                        name={t('steps_key') || 'Steps'}
                        stroke={colors.primary}
                        strokeWidth={3}
                        fillOpacity={0.2}
                        fill={colors.primary}
                    />

                    {/* calories_burned */}
                    <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="caloriesBurned"
                        name={t('calories_burned_widget') || 'Calories'}
                        stroke={colors.accent}
                        strokeWidth={3}
                        fillOpacity={0.1}
                        fill={colors.accent}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ActivityChart;