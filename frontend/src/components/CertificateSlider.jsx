import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './CertificateSlider.css';

const CertificateSlider = ({ certificates }) => {
  const { language } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCert, setSelectedCert] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

  // Deteksi resize untuk mobile/tablet
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Urutkan sertifikat berdasarkan tanggal (terbaru dulu)
  const sortedCertificates = [...certificates].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  // Hitung jumlah halaman (setiap halaman 3 sertifikat - UNTUK SEMUA DEVICE)
  const itemsPerPage = 3;
  const pageCount = Math.ceil(sortedCertificates.length / itemsPerPage);
  
  // Dapatkan sertifikat untuk halaman saat ini (3 item)
  const currentCertificates = sortedCertificates.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
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

  // Handle touch events untuk slide dengan jari
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      handleNext();
    }
    if (touchStart - touchEnd < -50) {
      // Swipe right
      handlePrev();
    }
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

  return (
    <div className="certificate-slider-section">
      <div className="slider-header">
        <h2 className="section-title">{text.certificates}</h2>
      </div>

      <div 
        className="slider-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Tombol navigasi hanya tampil di desktop (>768px) */}
        {!isMobile && (
          <button className="slider-nav prev" onClick={handlePrev}>←</button>
        )}

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

        {/* Tombol navigasi hanya tampil di desktop (>768px) */}
        {!isMobile && (
          <button className="slider-nav next" onClick={handleNext}>→</button>
        )}
      </div>

      {/* Indicator halaman - TAMPIL DI SEMUA DEVICE */}
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
                    <p className="popup-description">{selectedCert.description}</p>
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