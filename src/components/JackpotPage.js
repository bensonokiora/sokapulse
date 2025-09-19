
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import LoadingAnimation from '@/components/LoadingAnimation';
import '@/styles/jackpot.css';
import '../styles/payment-form-utilities.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCalendarAlt, faClock, faInfoCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';
import LoginModal from './LoginModal';
import ManualPayment from './ManualPayment';
import { useAuth } from '../hooks/useAuth';
import JackpotMatches from './JackpotMatches';

const PaymentForm = dynamic(() => import('@/components/PaymentForm'), {
  ssr: false,
  loading: () => <div className="payment-form-loading-placeholder p-4 text-center">
    <div className="payment-form-spinner inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent"></div>
    <p className="payment-form-loading-text mt-2 text-black">Loading payment form...</p>
  </div>
});

export default function JackpotPage({ 
  initialPredictions, 
  firstMatchDateISO, 
  serverError, 
  seoContent,
  bookmakerId,
  pageTitle,
  pageDescription
}) {
  
  const [predictions, setPredictions] = useState(initialPredictions || []);
  const [firstMatchDate, setFirstMatchDate] = useState(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const countdownInterval = useRef(null);
  const [error, setError] = useState(serverError || null);
  
  const { 
    isLoggedIn, 
    showLoginModal, 
    setShowLoginModal, 
    showPaymentForm, 
    setShowPaymentForm, 
    handleLoginSuccess, 
    handleLogout, 
    handleShowRegister, 
    openLoginModal 
  } = useAuth();

  const formatTimeUnit = (unit) => {
    return unit.toString().padStart(2, '0');
  };

  useEffect(() => {
    if (firstMatchDateISO) {
      const date = new Date(firstMatchDateISO);
      if (!isNaN(date.getTime())) {
        setFirstMatchDate(date);
      }
    }
  }, [firstMatchDateISO]);

  useEffect(() => {
    if (firstMatchDate) {
      const updateCountdown = () => {
        const now = new Date();
        const timeDifference = firstMatchDate.getTime() - now.getTime();
        
        if (timeDifference <= 0) {
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          if (countdownInterval.current) {
            clearInterval(countdownInterval.current);
          }
          return;
        }
        
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        
        setCountdown({ days, hours, minutes, seconds });
      };
      
      updateCountdown();
      countdownInterval.current = setInterval(updateCountdown, 1000);
      
      return () => {
        if (countdownInterval.current) {
          clearInterval(countdownInterval.current);
        }
      };
    } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
  }, [firstMatchDate]);

  if (error && (!predictions || predictions.length === 0)) {
    return (
      <div className="jp-container p-4">
        <div className="jp-error-message text-red-500 text-center">Error: {error}</div>
      </div>
    );
  }

  if (!predictions || predictions.length === 0) {
    return (
        <div className="jp-container p-4">
            <div className="jp-error-message text-center">No jackpot predictions available at the moment. Please check back later.</div>
        </div>
    );
  }

  return (
    <div className="jp-content-wrapper">
      <div className="jp-page-header">
        <div className="jp-title-section">
          <h1 className="jp-title">{seoContent?.title || pageTitle}</h1>
          <p className="jp-subtitle">{seoContent?.description || pageDescription}</p>
        </div>
        
        {isLoggedIn && (
          <button 
            className="jp-logout-btn"
            onClick={handleLogout}
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
              position: 'absolute',
              top: '16px',
              right: '16px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.3)';
            }}
          >
            Logout
          </button>
        )}
        
        {firstMatchDate && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0 || countdown.seconds > 0) && (
          <div className="jp-timer-countdown-container">
            <div className="jp-timer-label-top">First Match Starts In:</div>
            <div className="jp-timer-countdown">
              <div className="jp-timer-time-segment">
                <div className="jp-timer-time">{formatTimeUnit(countdown.days)}</div>
                <div className="jp-timer-label">days</div>
              </div>
              <div className="jp-timer-time-segment">
                <div className="jp-timer-time">{formatTimeUnit(countdown.hours)}</div>
                <div className="jp-timer-label">hrs</div>
              </div>
              <div className="jp-timer-time-segment">
                <div className="jp-timer-time">{formatTimeUnit(countdown.minutes)}</div>
                <div className="jp-timer-label">min</div>
              </div>
              <div className="jp-timer-time-segment">
                <div className="jp-timer-time">{formatTimeUnit(countdown.seconds)}</div>
                <div className="jp-timer-label">sec</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="jp-page-content">
        <JackpotMatches 
          predictions={predictions} 
          isLoggedIn={isLoggedIn} 
          handleUnlockClick={openLoginModal} 
          bookmakerId={bookmakerId} 
        />

        {/* Manual Payment Section */}
        <ManualPayment
          paymentReason="premium jackpot predictions"
          onPayWithMpesaExpress={handleShowRegister}
        />

        {/* SEO Content Section */}
        <div className="jp-seo-content">
          <div className="jp-seo-main-section">
            {seoContent?.sections?.map((section) => (
              <div key={section.id} className="jp-seo-section">
                <h2 className="jp-seo-section-title">{section.title}</h2>
                <div className="jp-seo-section-content" dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
            ))}
          </div>

          {/* Features Section */}
          {seoContent?.features && seoContent.features.length > 0 && (
              <div className="jp-features-section">
                <h2 className="jp-features-title">Our Prediction Features</h2>
                <div className="jp-features-subtitle">What makes our predictions special</div>
                <div className="jp-features-list">
                  {seoContent.features.map((feature, index) => (
                    <div key={index} className="jp-feature-item">
                      <span className="jp-feature-check">✓</span>
                      <span className="jp-feature-text">{feature}</span>
                    </div>
                  ))}
                </div>
                {seoContent.accuracy && (
                  <div className="jp-accuracy-note">
                    <strong>Accuracy:</strong> {seoContent.accuracy}
                  </div>
                )}
                {seoContent.specialFeature && (
                  <div className="jp-special-feature">
                    <strong>Special Feature:</strong> {seoContent.specialFeature}
                  </div>
                )}
              </div>
          )}

          {/* FAQs Section */}
          {seoContent?.faqs && seoContent.faqs.length > 0 && (
              <div className="jp-faqs-section">
                <h2 className="jp-faqs-title">Frequently Asked Questions</h2>
                <div className="jp-faqs-subtitle">Everything you need to know</div>
                <div className="jp-faqs-list">
                  {seoContent.faqs.map((faq, index) => (
                    <div key={index} className="jp-faq-item">
                      <h3 className="jp-faq-question">{faq.question}</h3>
                      <p className="jp-faq-answer">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
          )}

          {/* Prediction Links Section */}
          {seoContent?.predictionLinks && seoContent.predictionLinks.length > 0 && (
              <div className="jp-prediction-links-section">
                <h2 className="jp-prediction-links-title">More Predictions</h2>
                <div className="jp-prediction-links-subtitle">Explore our other services</div>
                <div className="jp-prediction-links-list">
                  {seoContent.predictionLinks.map((link, index) => (
                    link.href.startsWith('/') ? (
                      <Link key={index} href={link.href} className="jp-prediction-link">{link.text}</Link>
                    ) : (
                      <a key={index} href={link.href} className="jp-prediction-link" target="_blank" rel="noopener noreferrer">{link.text}</a>
                    )
                  ))}
                </div>
              </div>
           )}
        </div>
      </div>

      <LoginModal 
        isLoginModalOpen={showLoginModal} 
        setIsLoginModalOpen={setShowLoginModal} 
        handleShowRegister={handleShowRegister}
        onLoginSuccess={handleLoginSuccess}
      />
      
      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div 
          className="payment-modal-backdrop fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPaymentForm(false);
            }
          }}
          style={{
            padding: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
              .payment-modal-container {
                animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              }
            `}
          </style>
          <div className="payment-modal-container relative bg-white rounded-lg w-full max-w-xl overflow-hidden flex flex-col" style={{
            margin: 20, 
            width: '100%', 
            maxWidth: '700px',
            borderRadius: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div className="payment-modal-header sticky top-0 z-10 bg-gradient-to-r from-violet-500 to-indigo-600 text-white p-4 flex justify-between items-center" style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              padding: '24px',
              borderRadius: '20px 20px 0 0'
            }}>
              <div>
                <h3 className="payment-modal-title text-lg font-semibold" style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  margin: 0,
                  letterSpacing: '-0.025em'
                }}>Premium Access</h3>
                <p style={{
                  fontSize: '14px',
                  margin: '4px 0 0 0',
                  opacity: 0.9
                }}>Choose your subscription plan</p>
              </div>
              <button 
                className="payment-modal-close-btn text-2xl text-white hover:text-violet-200 focus:outline-none"
                onClick={() => setShowPaymentForm(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                ×
              </button>
            </div>
            <div className="payment-modal-body flex-1 overflow-auto" style={{
              display: 'flex', 
              flexDirection: 'column', 
              flexGrow: 1, 
              height: 'calc(100% - 60px)', 
              padding: 0, 
              width: '100%',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
            }}>
              <PaymentForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
