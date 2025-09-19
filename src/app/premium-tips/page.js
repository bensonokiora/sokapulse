'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { 
  fetchSportsAnalysisMultibetOne, 
  fetchSportsAnalysisMultibetTwo,
} from '@/utils/api';
import NavigationRow from '@/components/NavigationRow';
import LoadingAnimation from '@/components/LoadingAnimation';
import '../../styles/custom.css';
import '../../styles/payment-form-utilities.css';
import SeoContent from '@/components/SeoContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import LoginModal from '@/components/LoginModal';
import ManualPayment from '@/components/ManualPayment';
import { useAuth } from '@/hooks/useAuth';
import PremiumContent from '@/components/PremiumContent';

// Dynamically import Navbar without SSR
const Navbar = dynamic(
  () => import('@/components/Navbar'),
  { 
    ssr: false,
    loading: () => <div className="navbar-placeholder" />
  }
);

// Add the import for our PaymentForm with isolated Tailwind
const PaymentForm = dynamic(() => import('@/components/PaymentForm'), {
  ssr: false,
  loading: () => <div className="payment-form-loading-placeholder p-4 text-center">
    <div className="payment-form-spinner inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent"></div>
    <p className="payment-form-loading-text mt-2 text-black">Loading payment form...</p>
  </div>
});

export default function PremiumPredictions() {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [multibetOne, setMultibetOne] = useState([]);
  const [multibetTwo, setMultibetTwo] = useState([]);
  const [isLoadingMultibets, setIsLoadingMultibets] = useState(true);
  const [multibetError, setMultibetError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

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

  // Fetch multibets data
  const fetchMultibets = async () => {
    setIsLoadingMultibets(true);
    try {
      const [multibetOneResponse, multibetTwoResponse] = await Promise.all([
        fetchSportsAnalysisMultibetOne(),
        fetchSportsAnalysisMultibetTwo()
      ]);

      if (multibetOneResponse && !multibetOneResponse.error) {
        setMultibetOne(multibetOneResponse.body || []);
      } else {
        console.warn('Issue with multibet one response:', multibetOneResponse);
      }
      
      if (multibetTwoResponse && !multibetTwoResponse.error) {
        setMultibetTwo(multibetTwoResponse.body || []);
      } else {
        console.warn('Issue with multibet two response:', multibetTwoResponse);
      }
      
      setMultibetError(null);
    } catch (err) {
      console.error('Error loading multibets:', err);
      setMultibetError('Unable to load multibet tips. Please try again later.');
    } finally {
      setIsLoadingMultibets(false);
    }
  };

  const handleDateChange = (e) => {
    const newDate = parseInt(e.target.value);
    setSelectedDate(newDate);
  };

  useEffect(() => {
    // Fetch multibet data when component mounts
    fetchMultibets();
  }, []);

  useEffect(() => {
    // Check if the device is mobile based on screen width
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Render multibet slip component
  const renderMultibetSlip = (slipName, matches, slipNumber) => {
    if (!matches || matches.length === 0) return null;

    return (
      <div className="mb-multibet-slip-container">
        <div className="mb-slip-header">
          <h3 className="mb-slip-title">
            <span className="mb-slip-name">{slipName}</span>
            <span className="mb-slip-number">Slip {slipNumber}</span>
          </h3>
        </div>
        <div className="mb-slip-matches">
          {matches.map((match, index) => (
            <div key={match.id} className="mb-match-row">
              <div className="mb-match-content">
                <div className="mb-match-teams">
                  <span className="mb-match-date">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mb-calendar-icon" />
                    {new Date(`${match.date}T${match.time}`).toLocaleDateString('en-US', {
                      weekday: 'short',
                      day: '2-digit',
                      month: 'short'
                    })}
                    <span className="mb-time">
                      <FontAwesomeIcon icon={faClock} className="mb-clock-icon" />
                      {match.time}
                    </span>
                  </span>
                  <div className="mb-teams">
                    <span className="mb-team mb-home-team">{match.teamA}</span>
                    <span className="mb-vs">vs</span>
                    <span className="mb-team mb-away-team">{match.teamB}</span>
                  </div>
                </div>
                <div className="mb-match-info">
                  <PremiumContent isLoggedIn={isLoggedIn} openLoginModal={openLoginModal}>
                    <>
                      <div className="mb-match-tip">
                        {match.tip}
                      </div>
                      <div className="mb-match-status">
                        <span className={`mb-status-indicator ${match.isPlayed ? 'completed' : 'pending'}`}>
                          {match.fnResults || 'Pending'}
                        </span>
                      </div>
                    </>
                  </PremiumContent>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-slip-footer">
          <div className="mb-slip-stats">
            <div className="mb-slip-stat">
              <span className="mb-stat-label">Matches:</span>
              <span className="mb-stat-value">{matches.length}</span>
            </div>
            <div className="mb-slip-stat">
              <span className="mb-stat-label">Status:</span>
              <span className="mb-stat-value">Active</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>
        <div className="col-lg-12" style={{ height: 'auto !important' }}>
          
          <NavigationRow 
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
          
          {/* Title Header */}
          <div className="responsive-row mb-header-container">
            <div className="table-cell">
              <h1 className="mb-page-title">
                Premium Multibet Tips
                <span className="mb-page-date">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </h1>
              {isLoggedIn && (
                <button 
                  className="mb-logout-btn"
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
                    right: '16px',
                    zIndex: 10
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
            </div>
          </div>

          {/* Multibet Section */}
          <div className="mb-section">
            <div className="mb-section-header">
              <h2 className="mb-section-title">Multibet Tips of the Day</h2>
            </div>
            
            {isLoadingMultibets ? (
              <div className="mb-loading-container">
                <LoadingAnimation text="Loading multibet tips..." />
              </div>
            ) : multibetError ? (
              <div className="mb-error-container">
                <div className="mb-error-message">
                  <FontAwesomeIcon icon={faExclamationCircle} className="mb-error-icon" />
                  <p>{multibetError}</p>
                  <button onClick={fetchMultibets} className="mb-retry-button">
                    Try Again
                  </button>
                </div>
              </div>
            ) : (multibetOne.length === 0 && multibetTwo.length === 0) ? (
              <div className="mb-no-data-container">
                <div className="mb-no-data-message">
                  <FontAwesomeIcon icon={faInfoCircle} className="mb-info-icon" />
                  <p>No multibet tips are available at the moment.</p>
                </div>
              </div>
            ) : (
              <div className="mb-multibet-slips relative">
                {renderMultibetSlip("MultiBet Slip 1", multibetOne, 1)}
                {renderMultibetSlip("MultiBet Slip 2", multibetTwo, 2)}
              </div>
            )}
          </div>

          {/* Manual Payment Section */}
          <ManualPayment
            paymentReason="premium content"
            onPayWithMpesaExpress={handleShowRegister}
          />
        </div>
        <SeoContent pageType="premium" siteName="SokaPulse" />
      </div>
      
      <LoginModal 
        isLoginModalOpen={showLoginModal} 
        setIsLoginModalOpen={setShowLoginModal} 
        handleShowRegister={handleShowRegister}
        onLoginSuccess={handleLoginSuccess}
      />
      
      {/* New payment form modal with backdrop blur and increased width */}
      {showPaymentForm && (
        <div 
          className="payment-modal-backdrop fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 overflow-y-auto"
          onClick={(e) => {
            // Close when clicking outside
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