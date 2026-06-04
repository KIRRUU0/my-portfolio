import React from 'react';
import { useApp } from '../context/AppContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useApp();

    return (
        <input
            type="checkbox"
            className="theme-checkbox"
            checked={theme === 'dark'}
            onChange={toggleTheme}
            aria-label="Toggle dark mode"
        />
    );
};

export default ThemeToggle;