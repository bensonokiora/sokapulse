'use client';

import { useEffect } from 'react';

const AdManager = () => {
  useEffect(() => {
    const setupEventListeners = () => {
      // Mobile Ad
      const mobileAdCloseBtn = document.getElementById('mobileAdCloseBtn');
      const mobileAd = document.querySelector('.mobile-bottom-ad');

      if (mobileAdCloseBtn && mobileAd) {
        const handleMobileAdClose = () => {
          mobileAd.style.display = 'none';
          document.body.classList.add('mobile-ad-closed');
        };
        // To prevent adding multiple listeners, we remove it first.
        mobileAdCloseBtn.removeEventListener('click', handleMobileAdClose);
        mobileAdCloseBtn.addEventListener('click', handleMobileAdClose);
      }

      // Desktop Ad
      const desktopAdCloseBtn = document.getElementById('desktopAdCloseBtn');
      const desktopAd = document.querySelector('.desktop-fixed-bottom-banner');

      if (desktopAdCloseBtn && desktopAd) {
        const handleDesktopAdClose = () => {
          desktopAd.style.display = 'none';
        };
        // To prevent adding multiple listeners, we remove it first.
        desktopAdCloseBtn.removeEventListener('click', handleDesktopAdClose);
        desktopAdCloseBtn.addEventListener('click', handleDesktopAdClose);
      }
    };

    // Use a small timeout to ensure the DOM is updated after navigation
    const timer = setTimeout(setupEventListeners, 100);

    return () => {
      clearTimeout(timer);
      // Optional: Cleanup listeners if the component were to unmount,
      // though it's unlikely in the root layout.
    };
  }, []); // Empty dependency array ensures this runs once per component mount.

  return null; // This component does not render anything
};

export default AdManager;