import React, { useState } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Jika hanya 1 gambar, tampilkan sederhana
  if (!images || images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <div className="gallery-single">
        <img 
          src={images[0]} 
          alt={title} 
          className="gallery-single-image"
          onClick={() => setShowFullscreen(true)}
        />
        
        {/* Fullscreen Modal untuk 1 gambar */}
        {showFullscreen && (
          <div className="fullscreen-overlay" onClick={() => setShowFullscreen(false)}>
            <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
              <button className="fullscreen-close" onClick={() => setShowFullscreen(false)}>×</button>
              <img src={images[0]} alt={title} className="fullscreen-image" />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Untuk multiple images, tampilkan gallery dengan navigasi
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="gallery-multiple">
      <div className="gallery-main">
        <img 
          src={images[currentIndex]} 
          alt={`${title} - ${currentIndex + 1}`}
          className="gallery-main-image"
          onClick={() => setShowFullscreen(true)}
        />
        
        {images.length > 1 && (
          <>
            <button className="gallery-nav prev" onClick={handlePrev}>←</button>
            <button className="gallery-nav next" onClick={handleNext}>→</button>
          </>
        )}
        
        <div className="gallery-counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
      
      {/* Thumbnail preview */}
      {images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((img, idx) => (
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
        <div className="fullscreen-overlay" onClick={() => setShowFullscreen(false)}>
          <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <button className="fullscreen-close" onClick={() => setShowFullscreen(false)}>×</button>
            <img 
              src={images[currentIndex]} 
              alt={title} 
              className="fullscreen-image" 
            />
            {images.length > 1 && (
              <>
                <button className="fullscreen-nav prev" onClick={handlePrev}>←</button>
                <button className="fullscreen-nav next" onClick={handleNext}>→</button>
                <div className="fullscreen-counter">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;