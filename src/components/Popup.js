"use client";

import React, { useState, useEffect } from 'react';

const Popup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000); // 10 seconds delay

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs only once on mount

  if (!isOpen) {
    return null;
  }

  const backdropStyle = {
    position: 'fixed',
    inset: '0px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent black
    backdropFilter: 'blur(5px)',
    WebkitBackdropFilter: 'blur(5px)', // For Safari compatibility
    zIndex: 2147483646, // Just below the popup content
  };

  const popupContentStyle = {
    position: 'fixed',
    display: 'block',
    width: '300px',
    height: '250px',
    inset: '0px',
    margin: 'auto',
    backgroundColor: 'transparent',
    zIndex: 2147483647, // Above the backdrop
  };

  return (
    <>
      <div style={backdropStyle}></div>
      <div style={popupContentStyle}>
        <a
          href="https://refpa3267686.top/L?tag=d_4439441m_1599c_&site=4439441&ad=1599"
          target="_blank"
          rel="nofollow"
          title=""
          style={{
            position: 'absolute',
            display: 'block',
            width: '300px',
            height: '250px',
            top: '0px',
            left: '0px',
            margin: 'auto',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
        >
          <img
            src="https://f8.cdn.ftd.agency/uploads/media/9/2/149129/v1/300x250_EN_KE.gif"
            width="300px"
            height="250px"
            alt="Advertisement"
          />
        </a>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            position: 'absolute',
            display: 'block',
            width: '20px',
            height: '20px',
            top: '-10px',
            right: '-10px',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            border: 'none',
            padding: '0'
          }}
        >
          <svg style={{ position: 'relative', display: 'block', width: '100%', height: '100%' }}>
            <svg height="20" width="20">
              <circle cx="10" cy="10" r="9" stroke="#333" strokeWidth="2" fill="#FFF"></circle>
              <line x1="6" y1="6" x2="14" y2="14" style={{ stroke: '#333', strokeWidth: 2 }}></line>
              <line x1="6" y1="14" x2="14" y2="6" style={{ stroke: '#333', strokeWidth: 2 }}></line>
            </svg>
          </svg>
        </button>
      </div>
    </>
  );
};

export default Popup; 