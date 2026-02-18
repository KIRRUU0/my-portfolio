import React from 'react';
import { useApp } from '../context/AppContext';
import './LanguageSelector.css';

const LanguageSelector = () => {
    const { language, changeLanguage } = useApp();

    return (
        <div className="language-selector">
            <button 
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => changeLanguage('en')}
            >
                EN
            </button>
            <button 
                className={`lang-btn ${language === 'id' ? 'active' : ''}`}
                onClick={() => changeLanguage('id')}
            >
                ID
            </button>
        </div>
    );
};

export default LanguageSelector;