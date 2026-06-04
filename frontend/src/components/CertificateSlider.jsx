import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useApp } from '../context/AppContext';
import './CertificateSlider.css';

const CertificateSlider = ({ certificates }) => {
  const { language } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCert, setSelectedCert] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sortedCertificates = [...certificates].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  const itemsPerPage = 3;
  const totalSlides = sortedCertificates.length;
  const pageCount = Math.ceil(totalSlides / itemsPerPage);
  
  // Each slide is (100 / totalSlides)% of track width.
  // Each page = itemsPerPage slides = (itemsPerPage / totalSlides * 100)% of track.
  // Clamp last page so we don't overshoot into empty space.
  const getTranslateX = () => {
    const slideWidthPercent = 100 / totalSlides;
    const pageShift = currentIndex * itemsPerPage * slideWidthPercent;
    const maxShift = (totalSlides - itemsPerPage) * slideWidthPercent;
    return Math.min(pageShift, maxShift);
  };

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

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      handleNext();
    }
    if (touchStart - touchEnd < -50) {
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
        {!isMobile && (
          <button 
            className="slider-nav prev" 
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
        )}

        <div className="slider-view">
          <div 
            className="slider-track"
            style={{ 
              width: `${(sortedCertificates.length / itemsPerPage) * 100}%`,
              transform: `translateX(-${getTranslateX()}%)`,
            }}
          >
            {sortedCertificates.map((cert) => (
              <div 
                key={cert.id} 
                className="certificate-slide"
                style={{ width: `${100 / sortedCertificates.length}%` }}
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
        </div>

        {!isMobile && (
          <button 
            className="slider-nav next" 
            onClick={handleNext}
            disabled={currentIndex === pageCount - 1}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        )}
      </div>

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
            />
          ))}
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