
'use client';

import { useState, useCallback, useEffect } from 'react';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const checkLoginStatus = useCallback(() => {
    const userToken = localStorage.getItem('userToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    if (userToken && tokenExpiry) {
      const expiryDate = new Date(tokenExpiry);
      const currentDate = new Date();
      
      if (currentDate > expiryDate) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('tokenExpiry');
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    checkLoginStatus();
    // Listen for storage changes to sync auth state across tabs
    window.addEventListener('storage', checkLoginStatus);
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, [checkLoginStatus]);

  const handleLoginSuccess = useCallback(() => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('tokenExpiry');
    setIsLoggedIn(false);
  }, []);

  const handleShowRegister = useCallback(() => {
    setShowLoginModal(false);
    setShowPaymentForm(true);
  }, []);

  const openLoginModal = useCallback(() => {
    setShowLoginModal(true);
  }, []);

  return {
    isLoggedIn,
    showLoginModal,
    setShowLoginModal,
    showPaymentForm,
    setShowPaymentForm,
    handleLoginSuccess,
    handleLogout,
    handleShowRegister,
    openLoginModal,
    checkLoginStatus,
  };
};
