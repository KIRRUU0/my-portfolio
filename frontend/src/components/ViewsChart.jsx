import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useApp } from '../context/AppContext';
import './ViewsChart.css';

// Register ChartJS components including datalabels plugin
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartDataLabels
);

const ViewsChart = ({ data, period = 'week', onPeriodChange, translations = {} }) => {
    const { theme } = useApp();
    const [chartType, setChartType] = useState('line');
    const [chartKey, setChartKey] = useState(0);
    
    const t = {
        daily: translations.daily || 'Daily',
        weekly: translations.weekly || 'Weekly',
        monthly: translations.monthly || 'Monthly',
        line: translations.line || 'Line',
        bar: translations.bar || 'Bar'
    };

    // Update chart when theme changes
    useEffect(() => {
        setChartKey(prev => prev + 1);
    }, [theme]);

    // Warna berdasarkan theme
    const getColors = () => {
        const isDark = theme === 'dark';
        
        return {
            text: isDark ? '#ffffff' : '#333333',
            textSecondary: isDark ? '#cccccc' : '#666666',
            textMuted: isDark ? '#999999' : '#999999',
            border: isDark ? '#404040' : '#e0e0e0',
            primary: isDark ? '#ffffff' : '#333333',
            primaryLight: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(51, 51, 51, 0.8)',
            primaryVeryLight: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(51, 51, 51, 0.1)',
            pointBorder: isDark ? '#333333' : '#ffffff',
            barColor: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(51, 51, 51, 0.9)',
            labelColor: isDark ? '#333333' : '#ffffff'
        };
    };

    const colors = getColors();
    
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Page Views',
                data: data.values,
                borderColor: colors.primary,
                backgroundColor: chartType === 'bar' 
                    ? colors.barColor
                    : colors.primaryVeryLight,
                tension: 0.3,
                fill: false,
                borderWidth: 2,
                pointBackgroundColor: colors.primary,
                pointBorderColor: colors.pointBorder,
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointStyle: 'circle',
                hoverBackgroundColor: colors.primary,
                hoverBorderColor: colors.pointBorder,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: colors.border,
                titleColor: colors.text,
                bodyColor: colors.textSecondary,
                borderColor: colors.border,
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `${context.parsed.y} views`;
                    }
                }
            },
            datalabels: {
                display: function(context) {
                    return context.dataset.data[context.dataIndex] > 0;
                },
                color: colors.text,
                font: {
                    weight: 'bold',
                    size: 11
                },
                formatter: function(value) {
                    return value;
                },
                anchor: 'end',
                align: 'top',
                offset: 8
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false
                },
                border: {
                    display: true,
                    color: colors.border
                },
                ticks: {
                    color: colors.textMuted,
                    stepSize: 20,
                    callback: function(value) {
                        return value;
                    },
                    padding: 8
                }
            },
            x: {
                grid: {
                    display: false
                },
                border: {
                    display: true,
                    color: colors.border
                },
                ticks: {
                    color: colors.textMuted,
                    padding: 8
                }
            }
        },
        layout: {
            padding: {
                top: 30,
                bottom: 10,
                left: 10,
                right: 10
            }
        },
        elements: {
            line: {
                borderColor: colors.primary,
                backgroundColor: colors.primaryVeryLight
            },
            point: {
                backgroundColor: colors.primary,
                borderColor: colors.pointBorder,
                hoverBackgroundColor: colors.primary,
                hoverBorderColor: colors.pointBorder
            }
        }
    };

    const barOptions = {
        ...options,
        plugins: {
            ...options.plugins,
            datalabels: {
                ...options.plugins.datalabels,
                anchor: 'center',
                align: 'center',
                color: colors.labelColor,
                font: {
                    weight: 'bold',
                    size: 12
                }
            }
        },
        elements: {
            bar: {
                backgroundColor: colors.barColor,
                borderColor: colors.primary,
                borderWidth: 1,
                hoverBackgroundColor: colors.primary,
                hoverBorderColor: colors.primary
            }
        }
    };

    const handlePeriodChange = (newPeriod) => {
        if (onPeriodChange) {
            onPeriodChange(newPeriod);
        }
    };

    return (
        <div className="chart-container">
            <div className="chart-header">
                <div className="chart-period">
                    <button 
                        className={`period-btn ${period === 'day' ? 'active' : ''}`}
                        onClick={() => handlePeriodChange('day')}
                    >
                        {t.daily}
                    </button>
                    <button 
                        className={`period-btn ${period === 'week' ? 'active' : ''}`}
                        onClick={() => handlePeriodChange('week')}
                    >
                        {t.weekly}
                    </button>
                    <button 
                        className={`period-btn ${period === 'month' ? 'active' : ''}`}
                        onClick={() => handlePeriodChange('month')}
                    >
                        {t.monthly}
                    </button>
                </div>
                <div className="chart-type">
                    <button 
                        className={`type-btn ${chartType === 'line' ? 'active' : ''}`}
                        onClick={() => setChartType('line')}
                    >
                        {t.line}
                    </button>
                    <button 
                        className={`type-btn ${chartType === 'bar' ? 'active' : ''}`}
                        onClick={() => setChartType('bar')}
                    >
                        {t.bar}
                    </button>
                </div>
            </div>
            <div className="chart-wrapper" key={chartKey}>
                {chartType === 'line' ? (
                    <Line data={chartData} options={options} />
                ) : (
                    <Bar data={chartData} options={barOptions} />
                )}
            </div>
        </div>
    );
};

export default ViewsChart;