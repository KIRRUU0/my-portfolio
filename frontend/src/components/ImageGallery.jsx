import React, { useState, useEffect } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ images, title, hideNavButtons = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Listen for swipe events from parent
  useEffect(() => {
    const handleSwipe = (e) => {
      if (e.detail.direction === 'left') {
        handleNext();
      } else if (e.detail.direction === 'right') {
        handlePrev();
      }
    };

    window.addEventListener('swipe', handleSwipe);
    return () => window.removeEventListener('swipe', handleSwipe);
  }, [currentIndex, images.length]);

  // Validasi images
  if (!images || images.length === 0) {
    return null;
  }

  // Pastikan images adalah array
  const imageArray = Array.isArray(images) ? images : [images];

  // Handle touch events untuk swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (imageArray.length <= 1) return;
    
    if (touchStart - touchEnd > 50) {
      // Swipe left
      handleNext();
    }
    if (touchStart - touchEnd < -50) {
      // Swipe right
      handlePrev();
    }
  };

  // Handle prev/next
  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? imageArray.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === imageArray.length - 1 ? 0 : prev + 1));
  };

  // Buka fullscreen
  const openFullscreen = () => {
    setShowFullscreen(true);
  };

  // Tutup fullscreen
  const closeFullscreen = () => {
    setShowFullscreen(false);
  };

  // Single image view
  if (imageArray.length === 1) {
    return (
      <div className="gallery-single">
        <img 
          src={imageArray[0]} 
          alt={title} 
          className="gallery-single-image"
          onClick={openFullscreen}
        />
        
        {/* Fullscreen Modal untuk 1 gambar */}
        {showFullscreen && (
          <div className="fullscreen-overlay" onClick={closeFullscreen}>
            <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
              <button className="fullscreen-close" onClick={closeFullscreen}>×</button>
              <img src={imageArray[0]} alt={title} className="fullscreen-image" />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Multiple images view
  return (
    <div className="gallery-multiple">
      {/* Main Image - dengan touch events */}
      <div 
        className="gallery-main"
        onClick={openFullscreen}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img 
          src={imageArray[currentIndex]} 
          alt={`${title} - ${currentIndex + 1}`}
          className="gallery-main-image"
        />
        
        {/* Navigation Buttons - HANYA TAMPIL JIKA hideNavButtons = false */}
        {!hideNavButtons && (
          <>
            <button className="gallery-nav prev" onClick={handlePrev}>←</button>
            <button className="gallery-nav next" onClick={handleNext}>→</button>
          </>
        )}
        
        {/* Counter */}
        <div className="gallery-counter">
          {currentIndex + 1} / {imageArray.length}
        </div>
      </div>
      
      {/* Thumbnails - HANYA TAMPIL JIKA ADA BANYAK GAMBAR */}
      {imageArray.length > 1 && (
        <div className="gallery-thumbnails">
          {imageArray.map((img, idx) => (
            <div 
              key={idx}
              className={`thumbnail ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} />
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className="fullscreen-overlay" onClick={closeFullscreen}>
          <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <button className="fullscreen-close" onClick={closeFullscreen}>×</button>
            <img 
              src={imageArray[currentIndex]} 
              alt={title} 
              className="fullscreen-image" 
            />
            <button className="fullscreen-nav prev" onClick={handlePrev}>←</button>
            <button className="fullscreen-nav next" onClick={handleNext}>→</button>
            <div className="fullscreen-counter">
              {currentIndex + 1} / {imageArray.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;