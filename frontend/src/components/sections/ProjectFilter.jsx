import React from 'react';
import { useApp } from '../../context/AppContext';
import './ProjectFilter.css';

const ProjectFilter = ({ currentFilter, onFilterChange }) => {
  const { language } = useApp();
  
  const t = {
    en: {
      newest: 'Newest First',
      oldest: 'Oldest First'
    },
    id: {
      newest: 'Terbaru',
      oldest: 'Terlama'
    }
  };

  const text = t[language] || t.en;

  return (
    <div className="project-filter">
      <button 
        className={`filter-btn ${currentFilter === 'newest' ? 'active' : ''}`}
        onClick={() => onFilterChange('newest')}
      >
        {text.newest}
      </button>
      <button 
        className={`filter-btn ${currentFilter === 'oldest' ? 'active' : ''}`}
        onClick={() => onFilterChange('oldest')}
      >
        {text.oldest}
      </button>
    </div>
  );
};

export default ProjectFilter;