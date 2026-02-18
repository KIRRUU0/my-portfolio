import React from 'react';
import './AnalyticsCard.css';

const AnalyticsCard = ({ title, value, change, period, color = '#333' }) => {
    const isPositive = change > 0;
    
    return (
        <div className="analytics-card">
            <h3 className="analytics-title">{title}</h3>
            <div className="analytics-value">{value.toLocaleString()}</div>
            <div className="analytics-footer">
                <span className={`analytics-change ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? '↑' : '↓'} {Math.abs(change)}%
                </span>
                <span className="analytics-period">{period}</span>
            </div>
        </div>
    );
};

export default AnalyticsCard;