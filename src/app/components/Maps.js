'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const GoogleMapOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMap = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const MapOverlay = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="relative w-11/12 h-5/6 max-w-4xl bg-white rounded-lg shadow-lg transition-all duration-300 transform scale-100 opacity-100 overflow-hidden">
        <button
          onClick={toggleMap}
          className="absolute top-2 right-2 z-10 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2879.917395868646!2d-79.43733332381574!3d43.79532707109564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b2cfe9bcc414f%3A0xa14180194f4e6266!2sThe%20Indian%20Cuisine!5e0!3m2!1sen!2sca!4v1724307445637!5m2!1sen!2sca"
          className="absolute inset-0 w-full h-full"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={toggleMap}
        className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Location
      </button>

      {isOpen && createPortal(<MapOverlay />, document.body)}
    </>
  );
};

export default GoogleMapOverlay;