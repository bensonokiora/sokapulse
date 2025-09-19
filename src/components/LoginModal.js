'use client';

import { useRef, useState, useCallback, useEffect, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { loginUser } from '@/utils/api';

const LoginModal = memo(function LoginModal({ 
  isLoginModalOpen, 
  setIsLoginModalOpen, 
  handleShowRegister,
  onLoginSuccess
}) {
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const phoneInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Debug effect to monitor login modal state changes
  useEffect(() => {
    console.log('LoginModal (component) rendering, isLoginModalOpen:', isLoginModalOpen);
  }, [isLoginModalOpen]);

  const handleModalBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      console.log('LoginModal: Closing modal via backdrop click');
      setIsLoginModalOpen(false);
    }
  }, [setIsLoginModalOpen]);

  const handleCloseModal = useCallback(() => {
    console.log('LoginModal: Closing modal via close button');
    setIsLoginModalOpen(false);
  }, [setIsLoginModalOpen]);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    const phone = phoneInputRef.current?.value;
    const password = passwordInputRef.current?.value;

    if (!phone || !password) {
      setLoginError('Please enter both phone number and password.');
      setIsLoggingIn(false);
      return;
    }

    try {
      const data = await loginUser(phone, password);

      if (!data.error && data.message === "active") {
        const expirationTime = new Date();
        expirationTime.setDate(expirationTime.getDate() + 3);
        
        localStorage.setItem('userToken', 'logged_in');
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('tokenExpiry', expirationTime.toISOString());
        
        // Notify parent component of successful login
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        
        // Use timeout to avoid state conflicts
        setTimeout(() => {
          setIsLoginModalOpen(false);
        }, 100);
      } 
      else if (!data.error && data.message === "inactive") {
        setLoginError(
          <div>
            <p>Your subscription has expired. Please renew to access premium content.</p>
            <button 
              onClick={handleShowRegister}
              style={{ 
                marginTop: '12px',
                padding: '8px 12px', 
                backgroundColor: '#dc2626',
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Register Now
            </button>
          </div>
        );
      } 
      else if (data.error) {
        setLoginError(
          <div>
            <p>{data.message || "Invalid credentials. Please try again."}</p>
            <button 
              onClick={handleShowRegister}
              style={{ 
                marginTop: '12px',
                padding: '8px 12px', 
                backgroundColor: '#dc2626',
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Register Now
            </button>
          </div>
        );
      } 
      else {
        setLoginError("Login failed. Please try again later.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Connection error. Please try again later.');
    } finally {
      setIsLoggingIn(false);
    }
  }, [setIsLoginModalOpen, handleShowRegister, onLoginSuccess]);

  if (!isLoginModalOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        overflow: 'auto',
        padding: '20px',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={handleModalBackdropClick}
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
          .modern-input {
            transition: all 0.3s ease;
            background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
            border: 2px solid #4b5563;
            color: #ffffff;
          }
          .modern-input:focus {
            border-color: #8b5cf6;
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
            background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
            transform: translateY(-1px);
          }
          .modern-input::placeholder {
            color: #9ca3af;
          }
          .modern-button {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateY(0);
          }
          .modern-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          }
          .modern-button:active {
            transform: translateY(0);
          }
        `}
      </style>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '440px',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto',
        animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              margin: 0,
              letterSpacing: '-0.025em'
            }}>Welcome Back</h3>
            <p style={{
              fontSize: '14px',
              margin: '4px 0 0 0',
              opacity: 0.9
            }}>Sign in to access premium mega jackpot predictions</p>
          </div>
          <button 
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
            onClick={handleCloseModal}
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
        
        <div style={{
          padding: '32px'
        }}>
          {loginError && (
            <div style={{
              marginBottom: '24px',
              padding: '16px',
              backgroundColor: '#fef2f2',
              borderLeft: '4px solid #ef4444',
              borderRadius: '12px',
              color: '#b91c1c',
              fontSize: '14px',
              animation: 'slideUp 0.3s ease-out'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start'
              }}>
                <FontAwesomeIcon icon={faExclamationCircle} style={{ 
                  marginRight: '12px', 
                  marginTop: '2px',
                  color: '#ef4444'
                }} />
                <div>
                  {typeof loginError === 'string' ? loginError : ''}
                  {typeof loginError !== 'string' && loginError}
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleLogin} style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="phone" 
                style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                placeholder="0712345678"
                autoComplete="tel"
                className="modern-input"
                style={{ 
                  width: '100%', 
                  padding: '16px 20px', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontWeight: '500'
                }}
                ref={phoneInputRef}
                defaultValue=""
                required
              />
            </div>
            
            <div style={{ marginBottom: '28px' }}>
              <label 
                htmlFor="password" 
                style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="current-password"
                className="modern-input"
                style={{ 
                  width: '100%', 
                  padding: '16px 20px', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontWeight: '500'
                }}
                ref={passwordInputRef}
                defaultValue=""
                required
              />
            </div>
            
            <button
              type="submit"
              className="modern-button"
              style={{ 
                width: '100%', 
                padding: '16px 24px', 
                background: isLoggingIn 
                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                fontWeight: '600',
                fontSize: '16px',
                cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
              disabled={isLoggingIn}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>
                {isLoggingIn ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Signing you in...
                  </div>
                ) : 'Sign In'}
              </span>
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
            </button>
          </form>
          
          <div style={{ 
            position: 'relative',
            marginTop: '32px',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)'
            }}></div>
            <span style={{
              position: 'relative',
              display: 'inline-block',
              padding: '0 20px',
              backgroundColor: 'white',
              color: '#64748b',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              New to SokaPulse?
            </span>
          </div>
          
          <button
            onClick={handleShowRegister}
            className="modern-button"
            style={{ 
              width: '100%', 
              padding: '18px 24px', 
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '12px', 
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>
              🚀 Get Premium Access Now
            </span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default LoginModal; 