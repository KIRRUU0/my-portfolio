import React from 'react';
import { useApp } from '../../context/AppContext';
import './ContactSection.css';

const ContactSection = ({ contactRef, formData, formError, formSuccess, formLoading, handleFormChange, handleFormSubmit }) => {
  const { language } = useApp();
  
  const t = {
    en: {
      contactTitle: 'get in touch',
      nameLabel: 'your name',
      messageLabel: 'message',
      send: 'send message',
      sending: 'sending...',
      success: 'message sent!',
      error: 'something went wrong. please try again.'
    },
    id: {
      contactTitle: 'hubungi saya',
      nameLabel: 'nama anda',
      messageLabel: 'pesan',
      send: 'kirim pesan',
      sending: 'mengirim...',
      success: 'pesan terkirim!',
      error: 'terjadi kesalahan. silakan coba lagi.'
    }
  };

  const text = t[language] || t.en;

  return (
    <section id="contact" ref={contactRef} className="contact-section">
      <div className="section-header">
        <h2 className="section-title">{text.contactTitle}</h2>
      </div>
      <div className="contact-container" data-aos="fade-up" data-aos-duration="800">
        <form onSubmit={handleFormSubmit} className="contact-form">
          {formError && <div className="error-message">{formError}</div>}
          {formSuccess && <div className="success-message">{text.success}</div>}
          <div className="form-group">
            <input 
              type="text" 
              name="name" 
              placeholder={text.nameLabel} 
              value={formData.name} 
              onChange={handleFormChange} 
              required 
              disabled={formLoading} 
              className="form-input" 
            />
          </div>
          <div className="form-group">
            <textarea 
              name="message" 
              rows="4" 
              placeholder={text.messageLabel} 
              value={formData.message} 
              onChange={handleFormChange} 
              required 
              disabled={formLoading} 
              className="form-input" 
            />
          </div>
          <button type="submit" className="submit-btn" disabled={formLoading}>
            {formLoading ? text.sending : text.send}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;