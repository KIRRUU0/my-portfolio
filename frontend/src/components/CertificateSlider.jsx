import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './CertificateSlider.css';

const CertificateSlider = ({ certificates }) => {
  const { language } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCert, setSelectedCert] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const t = {
    en: {
      issuedBy: 'Issued by',
      issuedDate: 'Issued',
      credentialId: 'Credential ID',
      viewCredential: 'View Credential'
    },
    id: {
      issuedBy: 'Diterbitkan oleh',
      issuedDate: 'Diterbitkan',
      credentialId: 'ID Kredensial',
      viewCredential: 'Lihat Kredensial'
    }
  };

  const text = t[language] || t.en;

  // Urutkan sertifikat berdasarkan tanggal (terbaru dulu)
  const sortedCertificates = [...certificates].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  // Hitung jumlah halaman (setiap halaman 3 sertifikat)
  const pageCount = Math.ceil(sortedCertificates.length / 3);
  
  // Dapatkan sertifikat untuk halaman saat ini
  const currentCertificates = sortedCertificates.slice(
    currentIndex * 3,
    currentIndex * 3 + 3
  );

  const handlePrev = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? pageCount - 1 : prevIndex - 1
    );
    
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === pageCount - 1 ? 0 : prevIndex + 1
    );
    
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const openPopup = (cert) => {
    setSelectedCert(cert);
  };

  const closePopup = () => {
    setSelectedCert(null);
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

  // Tambahkan fungsi ini di dalam komponen CertificateSlider
    const formatDescription = (text) => {
  if (!text) return null;
  
  // Split berdasarkan newline
  const lines = text.split('\n');
  
  return lines.map((line, index) => {
    const trimmedLine = line.trim();
    
    // Jika line kosong, skip
    if (!trimmedLine) return null;
    
    // Cek apakah line memiliki bullet point (•, -, *)
    if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
      return (
        <div key={index} className="popup-description-bullet">
          <span className="bullet-point">•</span>
          <span className="bullet-text">{trimmedLine.substring(1).trim()}</span>
        </div>
      );
    } else {
      // Teks biasa (tanpa bullet)
      return <p key={index} className="popup-description-text">{trimmedLine}</p>;
    }
  });
};

  return (
    <div className="certificate-slider-section">
      <div className="slider-header">
        <h2 className="section-title">
          {language === 'en' ? 'Certificates' : 'Sertifikat'}
        </h2>
      </div>

      <div className="slider-container">
        {/* HAPUS TOMBOL NAVIGASI KIRI */}
        {/* <button className="slider-nav prev" onClick={handlePrev}>←</button> */}

        <div className={`slider-track ${isTransitioning ? 'transitioning' : ''}`}>
          {currentCertificates.map((cert) => (
            <div 
              key={cert.id} 
              className="certificate-slide"
              onClick={() => openPopup(cert)}
            >
              <div className="certificate-card">
                <div className="certificate-image">
                  <img src={cert.image_url} alt={cert.name} />
                </div>
                <div className="certificate-overlay">
                  <h3>{cert.name}</h3>
                  <p>{cert.vendor}</p>
                  <span className="view-detail">
                    {language === 'en' ? 'Click to view' : 'Klik untuk lihat'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* HAPUS TOMBOL NAVIGASI KANAN */}
        {/* <button className="slider-nav next" onClick={handleNext}>→</button> */}
      </div>

      {/* Indicator halaman */}
      {pageCount > 1 && (
        <div className="slider-indicators">
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 400);
                }
              }}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Popup Modal */}
      {selectedCert && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closePopup}>×</button>
            
            <div className="popup-body">
              <div className="popup-image">
                <img src={selectedCert.image_url} alt={selectedCert.name} />
              </div>
              
              <div className="popup-details">
                <h2>{selectedCert.name}</h2>
                
                <div className="popup-info">
                  <p className="popup-vendor">
                    <strong>{text.issuedBy}:</strong> {selectedCert.vendor}
                  </p>
                  <p className="popup-date">
                    <strong>{text.issuedDate}:</strong> {formatDate(selectedCert.date)}
                  </p>
                  
                  {selectedCert.description && (
                    <div className="popup-description-container">
                        {formatDescription(selectedCert.description)}
                    </div>
                    )}
                  
                  {selectedCert.credential_id && (
                    <p className="popup-credential">
                      <strong>{text.credentialId}:</strong> {selectedCert.credential_id}
                    </p>
                  )}
                  
                  {selectedCert.credential_url && (
                    <a 
                      href={selectedCert.credential_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="popup-link"
                    >
                      {text.viewCredential} →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateSlider;