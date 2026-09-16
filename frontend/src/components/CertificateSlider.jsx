import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useApp } from '../context/AppContext';
import './CertificateSlider.css';

const CertificateSlider = ({ certificates }) => {
  const { language } = useApp();
  const [selectedCert, setSelectedCert] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [activeCategory, setActiveCategory] = useState('all');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copiedId, setCopiedId] = useState(false);

  const t = {
    en: {
      certificates: 'Certificates & Credentials',
      issuedBy: 'Issued by',
      issuedDate: 'Issued Date',
      credentialId: 'Credential ID',
      viewCredential: 'Verify Credential',
      openFullImage: 'Open Full Image',
      copied: 'Copied!',
      copyId: 'Copy ID',
      all: 'All',
      national: 'National (BNSP)',
      languageCat: 'Language (TOEFL)',
      course: 'Bootcamp & Courses',
      clickToView: 'View Certificate',
      showMore: 'Show More',
      showing: 'Showing',
      dragToPan: 'Drag image to pan',
      resetPan: 'Reset View'
    },
    id: {
      certificates: 'Sertifikasi & Kredensial',
      issuedBy: 'Diterbitkan oleh',
      issuedDate: 'Tanggal Terbit',
      credentialId: 'ID Kredensial',
      viewCredential: 'Verifikasi Kredensial',
      openFullImage: 'Buka Gambar Asli',
      copied: 'Tersalin!',
      copyId: 'Salin ID',
      all: 'Semua',
      national: 'Standar Nasional (BNSP)',
      languageCat: 'Kemahiran Bahasa (TOEFL)',
      course: 'Bootcamp & Kursus',
      clickToView: 'Lihat Sertifikat',
      showMore: 'Tampilkan Lebih Banyak',
      showing: 'Menampilkan',
      dragToPan: 'Tarik / geser gambar untuk menjelajah',
      resetPan: 'Reset Tampilan'
    }
  };

  const text = t[language] || t.en;

  const categories = [
    { key: 'all', label: text.all },
    { key: 'national', label: text.national },
    { key: 'language', label: text.languageCat },
    { key: 'course', label: text.course }
  ];

  const sortedCertificates = [...certificates].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  const filteredCertificates = sortedCertificates.filter(cert => {
    if (activeCategory === 'all') return true;
    return cert.category === activeCategory;
  });

  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = 'hidden';
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
      setCopiedId(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCert]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedCert) {
        setSelectedCert(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCert]);

  const openPopup = (cert) => {
    setSelectedCert(cert);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const closePopup = () => {
    setSelectedCert(null);
  };

  const handleCategoryChange = (key) => {
    setActiveCategory(key);
    setVisibleCount(6);
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.3, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const next = Math.max(prev - 0.3, 0.7);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleCopyId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getCategoryBadgeLabel = (category) => {
    switch (category) {
      case 'national': return 'BNSP';
      case 'language': return 'TOEFL';
      case 'course': return 'Course / Bootcamp';
      default: return 'Certified';
    }
  };

  if (!certificates || certificates.length === 0) {
    return null;
  }

  return (
    <div className="certificate-grid-section">
      <div className="section-header cert-section-header">
        <h2 className="section-title">{text.certificates}</h2>
        
        {/* Category Filter Tabs */}
        <div className="cert-category-filter">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`cert-filter-btn ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="certificate-grid">
        {filteredCertificates.slice(0, visibleCount).map((cert) => (
          <div 
            key={cert.id} 
            className="certificate-grid-item"
            onClick={() => openPopup(cert)}
          >
            <div className="certificate-card">
              <div className="cert-card-top">
                <span className="cert-category-tag">
                  {getCategoryBadgeLabel(cert.category)}
                </span>
                <div className="verified-badge">
                  <i className="bi bi-patch-check-fill"></i> Verified
                </div>
              </div>

              <div className="certificate-image">
                <img src={cert.image_url} alt={cert.name} loading="lazy" />
              </div>

              <div className="certificate-overlay">
                <span className="cert-overlay-date">{formatDate(cert.date)}</span>
                <h3>{cert.name}</h3>
                <p>{cert.vendor}</p>
                <div className="view-detail">
                  {text.clickToView} <i className="bi bi-arrow-up-right"></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < filteredCertificates.length && (
        <div className="more-btn-container">
          <button className="btn-more-certificates" onClick={loadMore}>
            {text.showMore} <i className="bi bi-arrow-down-short"></i>
          </button>
        </div>
      )}

      {/* Lightbox Document Viewer Modal */}
      {selectedCert && ReactDOM.createPortal(
        <div className="cert-popup-overlay" onClick={closePopup}>
          <div className="certificate-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closePopup} aria-label="Close">
              <i className="bi bi-x-lg"></i>
            </button>
            
            <div className="popup-image-section">
              {/* Zoom & Action Controls Bar */}
              <div className="lightbox-controls-bar">
                <div className="zoom-controls">
                  <button type="button" onClick={handleZoomOut} title="Zoom Out" aria-label="Zoom Out">
                    <i className="bi bi-dash"></i>
                  </button>
                  <button type="button" onClick={handleZoomReset} title="Reset Zoom">
                    {Math.round(zoomLevel * 100)}%
                  </button>
                  <button type="button" onClick={handleZoomIn} title="Zoom In" aria-label="Zoom In">
                    <i className="bi bi-plus"></i>
                  </button>
                </div>

                <a 
                  href={selectedCert.image_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-open-original"
                  title={text.openFullImage}
                >
                  <i className="bi bi-box-arrow-up-right"></i>
                  <span>{text.openFullImage}</span>
                </a>
              </div>

              {/* Pannable image viewport */}
              <div 
                className={`lightbox-image-viewport ${isDragging ? 'is-dragging' : ''} ${zoomLevel > 1 ? 'is-zoomable' : ''}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {zoomLevel > 1 && (
                  <div className="pan-hint-badge">
                    <i className="bi bi-arrows-move"></i> {text.dragToPan}
                  </div>
                )}
                <img 
                  src={selectedCert.image_url} 
                  alt={selectedCert.name} 
                  style={{ 
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
                    transition: isDragging ? 'none' : 'transform 0.2s ease'
                  }}
                  className="lightbox-zoom-img"
                  draggable={false}
                />
              </div>
            </div>
            
            <div className="popup-info-section">
              <div className="popup-header-tags">
                <span className="cert-category-tag">
                  {getCategoryBadgeLabel(selectedCert.category)}
                </span>
                <div className="popup-date-badge">
                  <i className="bi bi-calendar3"></i> {formatDate(selectedCert.date)}
                </div>
              </div>

              <h2 className="popup-title">{selectedCert.name}</h2>
              
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
                    <div className="credential-id-box">
                      <code>{selectedCert.credential_id}</code>
                      <button 
                        type="button" 
                        className="btn-copy-id" 
                        onClick={() => handleCopyId(selectedCert.credential_id)}
                      >
                        <i className={copiedId ? "bi bi-check-lg" : "bi bi-clipboard"}></i>
                        <span>{copiedId ? text.copied : text.copyId}</span>
                      </button>
                    </div>
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
                      <i className="bi bi-patch-check"></i> {text.viewCredential}
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