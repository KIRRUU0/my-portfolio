import React from 'react';
import StackIcon from 'tech-stack-icons';
import { useApp } from '../../context/AppContext';
import './TechStackSection.css';

const TechStackSection = ({ techRef }) => {
  const { language } = useApp();
  const t = {
    en: { techTitle: 'Tech Stack' },
    id: { techTitle: 'Teknologi' }
  };

  const text = t[language] || t.en;
  
  const techCategories = [
    {
      id: 'frontend',
      title: language === 'en' ? 'Frontend Development' : 'Pengembangan Frontend',
      icon: <i className="bi bi-window-stack"></i>,
      items: [
        { name: 'React', iconName: 'react' },
        { name: 'Tailwind CSS', iconName: 'tailwindcss' },
        { name: 'JavaScript', iconName: 'js' },
        { name: 'HTML5/CSS3', iconName: 'html5' },
        { name: 'Bootstrap', iconName: 'bootstrap5' }
      ]
    },
    {
      id: 'backend',
      title: language === 'en' ? 'Backend & Database' : 'Backend & Basis Data',
      icon: <i className="bi bi-hdd-stack-fill"></i>,
      items: [
        { name: 'Laravel', iconName: 'laravel' },
        { name: 'PHP', iconName: 'php' },
        { name: 'MySQL', iconName: 'mysql' },
        { name: 'REST API', iconName: 'openapi' },
        { name: 'Node.js', iconName: 'nodejs' }
      ]
    },
    {
      id: 'tools',
      title: language === 'en' ? 'Tools & Design' : 'Alat & Desain',
      icon: <i className="bi bi-gear-wide-connected"></i>,
      items: [
        { name: 'Figma', iconName: 'figma' },
        { name: 'Git & GitHub', iconName: 'git' },
        { name: 'Postman', iconName: 'postman' },
        { name: 'VS Code', iconName: 'vscode' },
        { name: 'UI/UX Design', iconName: 'sketch' }
      ]
    }
  ];

  return (
    <section id="tech" ref={techRef} className="tech-section">
      <div className="section-header">
        <h2 className="section-title">{text.techTitle}</h2>
      </div>
      
      <div className="tech-categories-grid">
        {techCategories.map((category) => (
          <div key={category.id} className="tech-category-card">
            <div className="category-header">
              <span className="category-icon">{category.icon}</span>
              <h3 className="category-title">{category.title}</h3>
            </div>
            
            <div className="tech-items-grid">
              {category.items.map((item, index) => (
                <div key={index} className="tech-item">
                  <span className="tech-icon">
                    <StackIcon name={item.iconName} />
                  </span>
                  <span className="tech-name">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechStackSection;