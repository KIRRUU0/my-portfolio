import React from 'react';
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
  
  // Data kontak dengan Bootstrap Icons
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
      icon: <i className="bi bi-envelope-at"></i>, // Icon email sesuai permintaan
      label: text.email,
      value: 'haekalarrafi@gmail.com',
      link: 'mailto:haekalarrafi@gmail.com',
      copyable: true
    },
    {
      id: 'linkedin',
      icon: <i className="bi bi-linkedin"></i>,
      label: text.linkedin,
      value: 'linkedin.com/in/muhammad-haekal-arrafi',
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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert(text.copied || 'Copied!');
  };

  return (
    <section id="contact" ref={contactRef} className="contact-section">
      <div className="section-header">
        <h2 className="section-title">{text.contactTitle}</h2>
      </div>
      
      <div className="contact-container" data-aos="fade-up" data-aos-duration="800">
        <div className="contact-grid">
          {contacts.map((contact) => (
            <div key={contact.id} className="contact-card">
              <div className="contact-icon">
                {contact.icon}
              </div>
              <div className="contact-info">
                <div className="contact-label">{contact.label}</div>
                <div className="contact-value">
                  {contact.link ? (
                    <a href={contact.link} target="_blank" rel="noopener noreferrer">
                      {contact.value}
                    </a>
                  ) : (
                    <span>{contact.value}</span>
                  )}
                </div>
              </div>
              {contact.copyable && (
                <button 
                  className="contact-copy" 
                  onClick={() => handleCopy(contact.value)}
                  title={text.copy}
                >
                  <i className="bi bi-files"></i>
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