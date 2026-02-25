import React from 'react';
import CertificateSlider from '../CertificateSlider';

const CertificatesSection = ({ certificatesRef, certificates }) => {
  if (!certificates || certificates.length === 0) return null;
  
  return (
    <section id="certificates" ref={certificatesRef} className="certificates-section">
      <CertificateSlider certificates={certificates} />
    </section>
  );
};

export default CertificatesSection;