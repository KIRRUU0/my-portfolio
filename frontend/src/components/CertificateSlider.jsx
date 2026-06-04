import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useApp } from '../context/AppContext';
import './CertificateSlider.css';

const CertificateSlider = ({ certificates }) => {
  const { language } = useApp();
  const [selectedCert, setSelectedCert] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);

  const t = {
    en: {
      issuedBy: 'Issued by',
      issuedDate: 'Issued',
      credentialId: 'Credential ID',
      viewCredential: 'View Credential',
      certificates: 'Certificates'
    },
    id: {
      issuedBy: 'Diterbitkan oleh',
      issuedDate: 'Diterbitkan',
      credentialId: 'ID Kredensial',
      viewCredential: 'Lihat Kredensial',
      certificates: 'Sertifikat'
    }
  };

  const text = t[language] || t.en;

  const sortedCertificates = [...certificates].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCert]);

  const openPopup = (cert) => {
    setSelectedCert(cert);
  };

  const closePopup = () => {
    setSelectedCert(null);
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (!certificates || certificates.length === 0) {
    return null;
  }

  return (
    <div className="certificate-grid-section">
      <div className="section-header">
        <h2 className="section-title">{text.certificates}</h2>
      </div>

      <div className="certificate-grid">
        {sortedCertificates.slice(0, visibleCount).map((cert) => (
          <div 
            key={cert.id} 
            className="certificate-grid-item"
            onClick={() => openPopup(cert)}
          >
            <div className="certificate-card">
              <div className="verified-badge">
                <i className="bi bi-patch-check-fill"></i> Verified
              </div>
              <div className="certificate-image">
                <img src={cert.image_url} alt={cert.name} />
              </div>
              <div className="certificate-overlay">
                <h3>{cert.name}</h3>
                <p>{cert.vendor}</p>
                <div className="view-detail">
                  {language === 'en' ? 'Click to view' : 'Klik untuk lihat'} <i className="bi bi-arrow-right"></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < sortedCertificates.length && (
        <div className="more-btn-container">
          <button className="btn-more-certificates" onClick={loadMore}>
            {language === 'en' ? 'Show More Certificates' : 'Tampilkan Lebih Banyak'} <i className="bi bi-arrow-down-short"></i>
          </button>
        </div>
      )}

      {selectedCert && ReactDOM.createPortal(
        <div className="cert-popup-overlay" onClick={closePopup}>
          <div className="certificate-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closePopup}>
              <i className="bi bi-x-lg"></i>
            </button>
            
            <div className="popup-image-section">
              <img src={selectedCert.image_url} alt={selectedCert.name} />
            </div>
            
            <div className="popup-info-section">
              <h2 className="popup-title">{selectedCert.name}</h2>
              <div className="popup-date-badge">
                <i className="bi bi-calendar3"></i> {formatDate(selectedCert.date)}
              </div>
              
              <div className="popup-details-container">
                <div className="popup-section">
                  <h3 className="section-subtitle"><i className="bi bi-building"></i> {text.issuedBy}</h3>
                  <p className="popup-description">{selectedCert.vendor}</p>
                </div>
                
                <div className="popup-section">
                  <h3 className="section-subtitle"><i className="bi bi-info-circle"></i> {language === 'en' ? 'Description' : 'Deskripsi'}</h3>
                  <p className="popup-description">
                    {selectedCert.description || (language === 'en' ? 'No description available.' : 'Tidak ada deskripsi tersedia.')}
                  </p>
                </div>

                {selectedCert.credential_id && (
                  <div className="popup-section">
                    <h3 className="section-subtitle"><i className="bi bi-card-checklist"></i> {text.credentialId}</h3>
                    <p className="popup-description">{selectedCert.credential_id}</p>
                  </div>
                )}

                {selectedCert.credential_url && (
                  <div className="popup-actions">
                    <a 
                      href={selectedCert.credential_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-popup-primary"
                    >
                      <i className="bi bi-award"></i> {text.viewCredential}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CertificateSlider;