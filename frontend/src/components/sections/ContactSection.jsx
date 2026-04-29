import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './ContactSection.css';

const ContactSection = ({ contactRef }) => {
  const { language } = useApp();
  const t = {
    en: {
      contactTitle: 'Contact',
      phone: 'Phone',
      email: 'Email',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      copy: 'Copy',
      copied: 'Copied!'
    },
    id: {
      contactTitle: 'Kontak',
      phone: 'Telepon',
      email: 'Email',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      copy: 'Salin',
      copied: 'Tersalin!'
    }
  };

  const text = t[language] || t.en;
  
  const contacts = [
    {
      id: 'phone',
      icon: <i className="bi bi-telephone"></i>,
      label: text.phone,
      value: '+62 851-5812-5501',
      link: 'tel:+6285158125501',
      copyable: true
    },
    {
      id: 'email',
      icon: <i className="bi bi-envelope-at"></i>,
      label: text.email,
      value: 'haekalarrafi@gmail.com',
      link: 'mailto:haekalarrafi@gmail.com',
      copyable: true
    },
    {
      id: 'linkedin',
      icon: <i className="bi bi-linkedin"></i>,
      label: text.linkedin,
      value: 'M Haekal Arrafi',
      link: 'https://www.linkedin.com/in/muhammad-haekal-arrafi-961991282',
      copyable: false
    },
    {
      id: 'github',
      icon: <i className="bi bi-github"></i>,
      label: text.github,
      value: 'github.com/KIRRUU0',
      link: 'https://github.com/KIRRUU0',
      copyable: false
    }
  ];

  const [copiedId, setCopiedId] = useState(null);
  
  const handleCopy = (val, id) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="contact" ref={contactRef} className="contact-section">
      <div className="section-header">
        <h2 className="section-title">{text.contactTitle}</h2>
      </div>
      
      <div className="contact-container">
        <div className="contact-grid">
          {contacts.map((contact) => (
            <div key={contact.id} className="contact-card">
              <div className="contact-icon">{contact.icon}</div>
              <div className="contact-info">
                <div className="contact-label">{contact.label}</div>
                <div className="contact-value">
                  <a href={contact.link} target="_blank" rel="noopener noreferrer">
                    {contact.value}
                  </a>
                </div>
              </div>
              {contact.copyable && (
                <button 
                  className="contact-copy" 
                  onClick={(e) => { e.preventDefault(); handleCopy(contact.value, contact.id); }}
                >
                  <i className={`bi ${copiedId === contact.id ? 'bi-check2 text-success' : 'bi-files'}`}></i>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;