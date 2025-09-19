'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function Step5MpesaPayment({ 
  selectedPlan, 
  pricingOptions, 
  phoneNumber, 
  checkoutRequestID,
  setCheckoutRequestID,
  merchantRequestID,
  setMerchantRequestID,
  onBack,
  showAlert
}) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [statusMessage, setStatusMessage] = useState('Please check your phone and enter M-Pesa PIN to complete payment.');
  const [statusType, setStatusType] = useState('info'); // 'info', 'success', 'error', 'warning'
  const [showTimer, setShowTimer] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  
  const timerInterval = useRef(null);
  const paymentCheckInterval = useRef(null);
  
  const selectedOption = pricingOptions.find(p => p.id === selectedPlan);
  
  // Function to initiate M-Pesa payment
  const initiatePayment = async () => {
    // Clear out any previous state
    setPaymentFailed(false);
    setTimeLeft(60);
    setShowTimer(true);
    
    // Set initial status
    setStatusMessage('Initializing M-Pesa payment, please wait...');
    setStatusType('info');
    
    try {
      // Show loading message
      setStatusMessage('Sending payment request to your phone...');
      
      const response = await fetch(`https://api.sportpesa-tips.com/api/v1/stk-website?amount=${selectedOption.price}&phoneNumber=${phoneNumber}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Payment initiation response:', data);
      
      if (!data.error) {
        // Get the IDs from the response
        const newCheckoutRequestID = data.body.checkoutRequestID;
        const newMerchantRequestID = data.body.merchantRequestID;
        
        // Update state
        setCheckoutRequestID(newCheckoutRequestID);
        setMerchantRequestID(newMerchantRequestID);
        
        // Update status message
        setStatusMessage('Please enter your PIN on your phone to complete this payment...');
        
        // Pass the IDs directly to startPaymentChecking instead of relying on state
        startPaymentChecking(newCheckoutRequestID, newMerchantRequestID);
      } else {
        console.error('Error in payment initiation:', data);
        setStatusMessage(data.message || 'Failed to initiate payment. Please try again.');
        setStatusType('error');
        setShowTimer(false);
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      setStatusMessage('Failed to connect to payment service. Please try again.');
      setStatusType('error');
      setShowTimer(false);
    }
  };
  
  // Start timer and periodic payment status checking
  const startPaymentChecking = (checkoutID, merchantID) => {
    // Store the IDs to use in the interval function
    const paymentCheckoutID = checkoutID || checkoutRequestID;
    const paymentMerchantID = merchantID || merchantRequestID;
    
    // Validate we have the required IDs
    if (!paymentCheckoutID || !paymentMerchantID) {
      console.error('Cannot start payment checking: missing IDs', { 
        paymentCheckoutID, 
        paymentMerchantID 
      });
      return;
    }
    
    console.log('Payment checking starting with IDs:', { 
      checkoutID: paymentCheckoutID, 
      merchantID: paymentMerchantID 
    });
    
    // Clear any existing intervals
    if (timerInterval.current) clearInterval(timerInterval.current);
    if (paymentCheckInterval.current) clearInterval(paymentCheckInterval.current);
    
    // Reset timer and status
    setTimeLeft(60);
    setShowTimer(true);
    setStatusMessage('Please enter your PIN on your phone to complete this payment...');
    setStatusType('info');
    setPaymentFailed(false);
    
    // Set up countdown interval
    timerInterval.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval.current);
          if (paymentCheckInterval.current) {
            clearInterval(paymentCheckInterval.current);
            paymentCheckInterval.current = null;
          }
          setShowTimer(false);
          setStatusMessage('Payment request has expired. Please try again.');
          setStatusType('warning');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Set up status check interval (check every 5 seconds)
    paymentCheckInterval.current = setInterval(() => {
      console.log('Automatic payment check triggered with IDs:', { 
        checkoutID: paymentCheckoutID, 
        merchantID: paymentMerchantID 
      });
      checkPaymentStatus(false, paymentCheckoutID, paymentMerchantID);
    }, 5000);
  };
  
  // Check payment status with the server - exactly matching the jQuery implementation
  const checkPaymentStatus = async (isManualCheck = false, checkoutID, merchantID) => {
    // Use provided IDs or fall back to state
    const paymentCheckoutID = checkoutID || checkoutRequestID;
    const paymentMerchantID = merchantID || merchantRequestID;
    
    if (!paymentCheckoutID || !paymentMerchantID) {
      console.error('Missing required IDs for payment check:', { 
        checkoutID: paymentCheckoutID, 
        merchantID: paymentMerchantID 
      });
      return;
    }
    
    if (isManualCheck) {
      setIsChecking(true);
      setStatusMessage('Checking payment status...');
      setStatusType('info');
    } else {
      // For automatic checks, let's also update the status but with a more subtle message
      // that doesn't interrupt the user flow
      console.log('Running automatic payment check with IDs:', { 
        checkoutID: paymentCheckoutID, 
        merchantID: paymentMerchantID,
        timeLeft
      });
    }
    
    try {
      // Create query string for the API request
      const params = new URLSearchParams({
        checkoutRequestID: paymentCheckoutID,
        merchantRequestID: paymentMerchantID
      });
      
      const url = `https://api.sportpesa-tips.com/api/v1/mpesa-callback?${params.toString()}`;
      console.log('Checking payment status with URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Payment check response:', data);
      
      // Add more detailed logging to help with debugging
      console.log('Payment check response details:', {
        error: data.error,
        message: data.message,
        fullData: JSON.stringify(data)
      });
      
      if (data.error === false) {
        console.log('Payment check successful, handling response');
        // Clear interval before handling response to prevent race conditions
        if (paymentCheckInterval.current) {
          clearInterval(paymentCheckInterval.current);
          paymentCheckInterval.current = null;
        }
        handlePaymentResponse(data.message);
      } else if (data.error === true && data.message) {
        // Handle case where we got an error response with a message
        console.log('Payment check returned error:', data.message);
        
        // Only update UI for manual checks or significant error messages
        if (isManualCheck || data.message.toLowerCase().includes('failed') || data.message.toLowerCase().includes('error')) {
          setStatusMessage(data.message || 'Payment not completed. Please try again.');
          setStatusType('warning');
          
          // If the message indicates a payment failure, not just "waiting"
          if (data.message.toLowerCase().includes('failed') || data.message.toLowerCase().includes('error')) {
            setPaymentFailed(true);
            setStatusType('error');
          }
        }
      } else if (isManualCheck) {
        // If manual check and no success, update status
        setStatusMessage('Payment not completed yet. Please complete the payment on your phone.');
        setStatusType('warning');
      }
    } catch (error) {
      console.error('Payment Status Check Error:', error);
      if (isManualCheck) {
        setStatusMessage('Error checking payment status. Please try again.');
        setStatusType('error');
      }
    } finally {
      if (isManualCheck) {
        setIsChecking(false);
      }
    }
  };
  
  // Copy text to clipboard helper
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };
  
  // Handle payment response and update UI - matched with jQuery implementation
  const handlePaymentResponse = (message) => {
    // Clear intervals
    if (timerInterval.current) clearInterval(timerInterval.current);
    if (paymentCheckInterval.current) clearInterval(paymentCheckInterval.current);
    
    setShowTimer(false);
    
    if (message.toLowerCase().includes('successfully')) {
      setStatusMessage('Payment successful! You will be redirected shortly...');
      setStatusType('success');
      
      // Store payment info in localStorage
      try {
        localStorage.setItem('userToken', 'paid_user');
        localStorage.setItem('userPhone', phoneNumber);
        localStorage.setItem('paymentPlan', selectedPlan);
        localStorage.setItem('paymentDate', new Date().toISOString());
      } catch (e) {
        console.error('Failed to store payment info:', e);
      }
      
      // Redirect after short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else {
      // Payment failed - show manual payment instructions
      setPaymentFailed(true);
      setStatusType('error');
      // Add explicit status message update for failed payments
      setStatusMessage('Payment failed. Please pay manually using the details below.');
    }
  };
  
  // Handle manual check button click
  const handleManualCheck = () => {
    checkPaymentStatus(true);
  };
  
  // Clean up intervals on component unmount
  useEffect(() => {
    // Start payment on component mount
    initiatePayment();
    
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
      if (paymentCheckInterval.current) clearInterval(paymentCheckInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Create a copyable field component
  const CopyableField = ({ label, value }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
      copyToClipboard(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };
    
    return (
      <div className="tw-bg-gray-50 tw-rounded-md tw-p-2 tw-border tw-border-gray-200 tw-transition-all tw-duration-200 hover:tw-bg-gray-100">
        <div className="tw-flex tw-items-center tw-justify-between">
          <div className="tw-flex-1 tw-min-w-0">
            <p className="tw-text-xs tw-font-medium tw-text-gray-600">{label}</p>
            <p className="tw-text-sm tw-font-semibold tw-text-gray-900 tw-truncate">{value}</p>
          </div>
          <button 
            className={`tw-ml-2 tw-p-1.5 tw-rounded-md tw-transition-all tw-duration-200 tw-flex-shrink-0 ${
              copied 
                ? 'tw-bg-green-100 tw-text-green-600 tw-ring-1 tw-ring-green-200' 
                : 'tw-bg-white tw-text-gray-500 hover:tw-bg-violet-50 hover:tw-text-violet-600 tw-border tw-border-gray-200 hover:tw-border-violet-300'
            }`}
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy'}
          >
            {copied ? (
              <svg className="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="tw-w-3 tw-h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  };
  
  // Payment Detail Field component for the top section
  const PaymentDetailField = ({ label, value }) => {
    // Add price-text class if the value includes KES or KSH
    const valueClass = value.includes('KES') || value.includes('KSH') 
      ? 'tw-font-semibold tw-text-xs md:tw-text-sm tw-text-indigo-600 price-text'
      : 'tw-font-semibold tw-text-xs md:tw-text-sm tw-text-gray-900';
    
    return (
      <div className="tw-flex tw-justify-between tw-items-center tw-py-1.5 md:tw-py-2 tw-border-b tw-border-gray-100 last:tw-border-0">
        <span className="tw-text-xs md:tw-text-sm tw-text-gray-500">{label}</span>
        <span className={valueClass}>{value}</span>
      </div>
    );
  };
  
  return (
    <div>
      <h2 className="tw-text-base md:tw-text-lg tw-font-semibold tw-mb-2 md:tw-mb-3 tw-text-gray-800">Complete M-Pesa Payment</h2>
      
      {/* Payment details section - more compact layout */}
      <div className="tw-bg-white tw-rounded-lg md:tw-rounded-xl tw-p-3 md:tw-p-4 tw-mb-2 md:tw-mb-3 tw-border tw-border-slate-200 tw-shadow-sm">
        <PaymentDetailField label="Paybill Business Number" value="883927" />
        <PaymentDetailField label="Amount" value={`KES ${selectedOption?.price}`} />
      </div>
      
      {/* Payment status section - enhanced UI */}
      <div className={`tw-p-3 md:tw-p-4 tw-mb-3 md:tw-mb-4 tw-rounded-lg md:tw-rounded-xl tw-border tw-shadow-md ${
        statusType === 'info' ? 'tw-bg-blue-50 tw-border-blue-100' :
        statusType === 'success' ? 'tw-bg-green-50 tw-border-green-100' :
        statusType === 'error' ? 'tw-bg-rose-50 tw-border-rose-100' :
        'tw-bg-amber-50 tw-border-amber-100'
      }`}>
        <div className="tw-flex tw-items-start">
          <div className="tw-flex-shrink-0 tw-mt-0.5">
            {statusType === 'info' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="tw-h-5 tw-w-5 tw-text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {statusType === 'success' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="tw-h-5 tw-w-5 tw-text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {statusType === 'error' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="tw-h-5 tw-w-5 tw-text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {statusType === 'warning' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="tw-h-5 tw-w-5 tw-text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
          <div className="tw-ml-3 tw-flex-1">
            <h5 className={`tw-font-medium tw-text-sm md:tw-text-base ${
              statusType === 'info' ? 'tw-text-blue-700' :
              statusType === 'success' ? 'tw-text-green-700' :
              statusType === 'error' ? 'tw-text-rose-700' :
              'tw-text-amber-700'
            }`}>
              {statusType === 'warning' && !showTimer ? 'Payment Expired' : 'Payment Status'}
            </h5>
            <p className={`tw-text-xs md:tw-text-sm tw-mt-1 ${
              statusType === 'info' ? 'tw-text-blue-600' :
              statusType === 'success' ? 'tw-text-green-600' :
              statusType === 'error' ? 'tw-text-rose-600' :
              'tw-text-amber-600'
            }`}>
              {statusMessage}
            </p>
          </div>
        </div>
      </div>
      
      {/* Timer container with enhanced styling */}
      {showTimer && (
        <div className="tw-text-center tw-my-3 md:tw-my-4 tw-p-3 md:tw-p-4 tw-bg-violet-50 tw-rounded-lg md:tw-rounded-xl tw-border tw-border-violet-100 tw-shadow-sm">
          <div className="tw-flex tw-flex-col tw-items-center">
            <p className="tw-text-sm md:tw-text-base tw-text-violet-700 tw-mb-2">Enter M-Pesa PIN when prompted</p>
            <div className="tw-flex tw-items-center tw-justify-center">
              <span className="tw-text-xs md:tw-text-sm tw-text-violet-600 tw-mr-2 tw-font-medium">Request expires in:</span>
              <div className="tw-bg-white tw-rounded-md tw-px-2 tw-py-1 tw-border tw-border-violet-200">
                <span className="tw-text-lg md:tw-text-xl tw-font-bold tw-text-indigo-600 price-text">{timeLeft}s</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!showTimer && statusType === 'warning' && (
        <div className="tw-text-center tw-my-3 md:tw-my-4 tw-p-3 md:tw-p-4 tw-bg-amber-50 tw-rounded-lg md:tw-rounded-xl tw-border tw-border-amber-100 tw-shadow-sm">
          <div className="tw-flex tw-flex-col tw-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="tw-h-10 tw-w-10 tw-text-amber-500 tw-mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="tw-text-base md:tw-text-lg tw-font-semibold tw-text-amber-700 tw-mb-1">Payment Request Expired</p>
            <p className="tw-text-sm md:tw-text-base tw-text-amber-600">Please try again or select a different payment method</p>
          </div>
        </div>
      )}
      
      {/* Payment actions section */}
      <div className="tw-bg-white tw-rounded-lg md:tw-rounded-xl tw-p-3 md:tw-p-4 tw-mb-2 md:tw-mb-3 tw-border tw-border-slate-200 tw-shadow-sm">
        <div className="tw-flex tw-justify-between tw-items-center">
          <button 
            className="tw-py-1.5 md:tw-py-2 tw-px-3 md:tw-px-4 tw-bg-gray-100 tw-text-gray-700 tw-rounded-lg hover:tw-bg-gray-200 tw-transition-all tw-duration-300 tw-font-medium tw-shadow-sm tw-text-xs md:tw-text-sm"
            onClick={onBack}
            disabled={isChecking}
          >
            ← Different Payment
          </button>
          
          <button 
            className={`tw-py-1.5 md:tw-py-2 tw-px-3 md:tw-px-4 tw-rounded-lg tw-transition-all tw-duration-300 tw-font-medium tw-shadow-md tw-text-xs md:tw-text-sm ${
              isChecking 
                ? 'tw-bg-gray-400 tw-text-white tw-cursor-not-allowed' 
                : 'tw-bg-gradient-to-r tw-from-violet-500 tw-to-indigo-600 hover:tw-from-violet-600 hover:tw-to-indigo-700 tw-text-white'
            }`}
            onClick={handleManualCheck}
            disabled={isChecking}
          >
            {isChecking ? (
              <span className="tw-flex tw-items-center">
                <span className="tw-w-3 tw-h-3 md:tw-w-3.5 md:tw-h-3.5 tw-border-2 tw-border-white tw-border-t-transparent tw-rounded-full tw-animate-spin tw-mr-1.5"></span>
                Checking...
              </span>
            ) : 'Check Payment Status'}
          </button>
        </div>
      </div>
      
      {/* Display copy details if payment failed */}
      {paymentFailed && (
        <div className="tw-mt-4 tw-p-3 tw-bg-gradient-to-r tw-from-orange-50 tw-to-red-50 tw-border tw-border-orange-200 tw-rounded-lg">
          <div className="tw-flex tw-items-center tw-space-x-2 tw-mb-3">
            <div className="tw-w-6 tw-h-6 tw-bg-orange-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
              <svg className="tw-w-3 tw-h-3 tw-text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="tw-text-sm tw-font-semibold tw-text-gray-900">Payment Failed - Use Manual Payment</h3>
            </div>
          </div>
          
          <div className="tw-space-y-2">
            <CopyableField label="Paybill" value="883927" />
            <CopyableField label="Account" value={phoneNumber} />
            <CopyableField label="Amount" value={`KES ${selectedOption?.price}`} />
          </div>
        </div>
      )}
    </div>
  );
}