import React from 'react';
import { useApp } from '../context/AppContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useApp();

    return (
        <div className="theme-selector">
            <button 
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => theme === 'dark' && toggleTheme()}
                aria-label="Light mode"
            >
                <i className="bi bi-sun-fill"></i>
            </button>
            <button 
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => theme === 'light' && toggleTheme()}
                aria-label="Dark mode"
            >
                <i className="bi bi-moon-fill"></i>
            </button>
        </div>
    );
};

export default ThemeToggle;