import React from 'react';
import { useApp } from '../context/AppContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { theme, toggleTheme, language } = useApp();

    return (
        <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
            <span className="toggle-text">
                {theme === 'light' 
                    ? (language === 'en' ? 'Dark' : 'Gelap')
                    : (language === 'en' ? 'Light' : 'Terang')
                }
            </span>
        </button>
    );
};

export default ThemeToggle;