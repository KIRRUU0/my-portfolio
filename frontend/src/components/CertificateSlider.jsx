import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './CertificateSlider.css';

const CertificateSlider = ({ certificates }) => {
    const { language } = useApp();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedCert, setSelectedCert] = useState(null);

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

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? Math.max(0, certificates.length - 3) : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex + 3 >= certificates.length ? 0 : prevIndex + 1
        );
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

    const visibleCertificates = certificates.slice(currentIndex, currentIndex + 3);

    return (
        <div className="certificate-slider-section">
            <div className="slider-header">
                <h2 className="section-title">
                    {language === 'en' ? 'Certificates' : 'Sertifikat'}
                </h2>
            </div>

            <div className="slider-container">
                <button 
                    className="slider-nav prev" 
                    onClick={handlePrev}
                    aria-label="Previous"
                >
                    ←
                </button>

                <div className="slider-track">
                    {visibleCertificates.map((cert) => (
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

                <button 
                    className="slider-nav next" 
                    onClick={handleNext}
                    aria-label="Next"
                >
                    →
                </button>
            </div>

            {/* Popup Modal - Sama seperti sebelumnya */}
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