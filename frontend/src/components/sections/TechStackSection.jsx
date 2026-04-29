import React from 'react';
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
        { 
          name: 'React', 
          icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 16.813c.425-.344.838-.719 1.212-1.125a.376.376 0 0 0 0-.5c-.375-.406-.788-.781-1.212-1.125-.138-.113-.288-.225-.438-.325l-.238-.15c-.2-.125-.4-.238-.613-.35-.3-.15-.625-.288-.938-.4a10.94 10.94 0 0 0-1.875-.487c-.638-.1-1.288-.138-1.925-.1-.325.025-.65.05-.975.088l-.963.15c-.638.138-1.263.325-1.875.563-1.15.438-2.188 1.05-3.075 1.8-.888-.75-1.925-1.363-3.075-1.8a12.63 12.63 0 0 0-1.875-.563l-.963-.15c-.325-.038-.65-.063-.975-.088-.638-.038-1.288 0-1.925.1a10.94 10.94 0 0 0-1.875.487c-.313.113-.638.25-.938.4-.213.113-.413.225-.613.35l-.238.15c-.15.1-.3.213-.438.325-.425.344-.838.719-1.212 1.125a.376.376 0 0 0 0 .5c.375.406.788.781 1.212 1.125.138.113.288.225.438.325l.238.15c.2.125.4.238.613.35.3.15.625.288.938.4.588.225 1.212.388 1.875.488.638.1 1.288.138 1.925.1.325-.025.65-.05.975-.088l.963-.15c.638-.138 1.263-.325 1.875-.563 1.15-.438 2.188-1.05 3.075-1.8.888.75 1.925 1.363 3.075 1.8a12.63 12.63 0 0 0 1.875.563l.963.15c.325.038.65.063.975.088.638.038 1.288 0 1.925-.1a10.94 10.94 0 0 0 1.875-.487c.313-.113.638-.25.938-.4.213-.113.413-.225.613-.35l.238-.15c.15-.1.3-.213.438-.325zM12 14.5c-1.375 0-2.5-1.125-2.5-2.5s1.125-2.5 2.5-2.5 2.5 1.125 2.5 2.5-1.125 2.5-2.5 2.5z"/></svg> 
        },
        { name: 'Tailwind CSS', icon: <i className="bi bi-lightning-charge-fill"></i> },
        { name: 'JavaScript', icon: <i className="bi bi-filetype-js"></i> },
        { name: 'HTML5/CSS3', icon: <i className="bi bi-code-slash"></i> },
        { name: 'Bootstrap', icon: <i className="bi bi-bootstrap-fill"></i> }
      ]
    },
    {
      id: 'backend',
      title: language === 'en' ? 'Backend & Database' : 'Backend & Basis Data',
      icon: <i className="bi bi-hdd-stack-fill"></i>,
      items: [
        { 
          name: 'Laravel', 
          icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22.95 2.7l-9.15 4.5V18.3l9.15-4.5V2.7zM1.05 2.7v11.1l9.15 4.5V7.2L1.05 2.7zm11.25 18.6v-4.5L3.15 12.3v4.5l9.15 4.5zm0-6.15v4.5l9.15-4.5V10.8l-9.15 4.5z"/></svg>
        },
        { name: 'PHP', icon: <i className="bi bi-filetype-php"></i> },
        { name: 'MySQL', icon: <i className="bi bi-database-fill"></i> },
        { name: 'REST API', icon: <i className="bi bi-cloud-arrow-down-fill"></i> },
        { 
          name: 'Node.js', 
          icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm7.5 14.2l-7.5 4.1-7.5-4.1V7.8l7.5-4.1 7.5 4.1v8.4zM9.5 9.5c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5v5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-5zm6.5 0c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5v5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-5z"/></svg>
        }
      ]
    },
    {
      id: 'tools',
      title: language === 'en' ? 'Tools & Design' : 'Alat & Desain',
      icon: <i className="bi bi-gear-wide-connected"></i>,
      items: [
        { 
          name: 'Figma', 
          icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4zM4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4zm0-8c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4zm8 0c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4h-4V4zm4 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4v4h4z"/></svg>
        },
        { name: 'Git & GitHub', icon: <i className="bi bi-git"></i> },
        { name: 'Postman', icon: <i className="bi bi-send-fill"></i> },
        { name: 'VS Code', icon: <i className="bi bi-terminal-fill"></i> },
        { name: 'UI/UX Design', icon: <i className="bi bi-bezier2"></i> }
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
                  <span className="tech-icon">{item.icon}</span>
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