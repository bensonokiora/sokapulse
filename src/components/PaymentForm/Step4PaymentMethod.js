'use client';

import React, { useState } from 'react';

export default function Step4PaymentMethod({ 
  isKenya, 
  onSelectMpesa, 
  onSelectPaystack, 
  paystackLoaded,
  onBack,
  customPaystackButton
}) {
  const [selectedMethod, setSelectedMethod] = useState(isKenya ? 'mpesa' : 'card');
  
  const handlePayment = () => {
    if (selectedMethod === 'mpesa') {
      onSelectMpesa();
    } else if (selectedMethod === 'card' && !customPaystackButton) {
      // Only use this if a custom button is not provided
      onSelectPaystack();
    }
  };
  
  return (
    <div className="tw-mb-3 payment-method-step">
      <h2 className="tw-text-lg md:tw-text-xl tw-font-semibold tw-mb-3 md:tw-mb-5 tw-text-gray-800">Choose Payment Method</h2>
      
      <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-3 sm:tw-gap-6 tw-mb-4 md:tw-mb-6">
        {/* M-Pesa option (show only for Kenyan users) */}
        {isKenya && (
          <div>
            <div 
              className={`tw-cursor-pointer tw-rounded-lg md:tw-rounded-xl tw-border tw-transition-all tw-duration-300 tw-overflow-hidden tw-h-full payment-method-card
                ${selectedMethod === 'mpesa' 
                  ? 'tw-border-violet-400 tw-bg-violet-50 tw-shadow-md tw-scale-[1.01] md:tw-scale-[1.02]' 
                  : 'tw-border-gray-200 tw-bg-white hover:tw-border-violet-200 hover:tw-shadow-sm'}`}
              onClick={() => setSelectedMethod('mpesa')}
            >
              <div className="tw-text-center tw-p-3 md:tw-p-5 tw-flex tw-flex-col sm:tw-flex-col tw-items-center tw-justify-center tw-h-full">
                <div className="tw-w-12 tw-h-12 md:tw-w-16 md:tw-h-16 tw-flex tw-items-center tw-justify-center tw-bg-white tw-rounded-full tw-shadow-md tw-mb-3 md:tw-mb-4 tw-border tw-border-gray-100 payment-method-icon-container">
                  <img 
                    src="https://jackpot-predictions.com/assets/images/icon/mpesa.png" 
                    alt="M-Pesa" 
                    className="tw-w-8 tw-h-8 md:tw-w-12 md:tw-h-12 tw-object-contain payment-method-icon"
                  />
                </div>
                <div>
                  <h5 className="tw-text-sm md:tw-text-base tw-font-semibold tw-mb-1 md:tw-mb-2 tw-text-gray-800">Pay with M-Pesa</h5>
                  <p className="tw-text-xs tw-text-gray-500">Fast and secure mobile payment</p>
                  
                  {selectedMethod === 'mpesa' && (
                    <div className="tw-mt-2 md:tw-mt-3 tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-violet-600 tw-font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" className="tw-h-3 tw-w-3 md:tw-h-4 md:tw-w-4 tw-mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Selected
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Card payment option */}
        <div>
          <div 
            className={`tw-cursor-pointer tw-rounded-lg md:tw-rounded-xl tw-border tw-transition-all tw-duration-300 tw-overflow-hidden tw-h-full payment-method-card
              ${selectedMethod === 'card' 
                ? 'tw-border-violet-400 tw-bg-violet-50 tw-shadow-md tw-scale-[1.01] md:tw-scale-[1.02]' 
                : 'tw-border-gray-200 tw-bg-white hover:tw-border-violet-200 hover:tw-shadow-sm'}`}
            onClick={() => setSelectedMethod('card')}
          >
            <div className="tw-text-center tw-p-3 md:tw-p-5 tw-flex tw-flex-col sm:tw-flex-col tw-items-center tw-justify-center tw-h-full">
              <div className="tw-w-12 tw-h-12 md:tw-w-16 md:tw-h-16 tw-flex tw-items-center tw-justify-center tw-bg-white tw-rounded-full tw-shadow-md tw-mb-3 md:tw-mb-4 tw-border tw-border-gray-100 payment-method-icon-container">
                <img 
                  src="https://jackpot-predictions.com/assets/images/icon/paystack.webp" 
                  alt="Paystack" 
                  className="tw-w-8 tw-h-8 md:tw-w-12 md:tw-h-12 tw-object-contain payment-method-icon"
                />
              </div>
              <div>
                <h5 className="tw-text-sm md:tw-text-base tw-font-semibold tw-mb-1 md:tw-mb-2 tw-text-gray-800">
                  {isKenya ? 'Pay with Card / Mobile Money' : 'Pay with Card/Mobile Money'}
                </h5>
                <p className="tw-text-xs tw-text-gray-500">
                  {isKenya ? 'Secure card payment via Paystack' : 'Secure payment via Paystack'}
                </p>
                {!paystackLoaded ? (
                  <p className="tw-text-xs tw-italic tw-text-gray-400 tw-mt-2 tw-flex tw-items-center tw-justify-center">
                    <span className="tw-w-2.5 tw-h-2.5 md:tw-w-3 md:tw-h-3 tw-border-2 tw-border-violet-400 tw-border-t-transparent tw-rounded-full tw-animate-spin tw-mr-1"></span>
                    Loading payment system...
                  </p>
                ) : selectedMethod === 'card' && (
                  <div className="tw-mt-2 md:tw-mt-3 tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-violet-600 tw-font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="tw-h-3 tw-w-3 md:tw-h-4 md:tw-w-4 tw-mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Selected
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="tw-flex tw-justify-between tw-mt-4 md:tw-mt-6">
        <button 
          className="tw-py-2 tw-px-4 md:tw-py-2.5 md:tw-px-5 tw-bg-gray-100 tw-text-gray-700 tw-rounded-lg hover:tw-bg-gray-200 tw-transition-all tw-duration-300 tw-font-medium tw-shadow-sm tw-text-xs md:tw-text-sm"
          onClick={onBack}
        >
          ← Back
        </button>
        
        {selectedMethod === 'card' && customPaystackButton ? (
          <div className="tw-flex-none">
            {customPaystackButton}
          </div>
        ) : (
          <button 
            className="tw-py-2 tw-px-4 md:tw-py-2.5 md:tw-px-5 tw-bg-gradient-to-r tw-from-violet-500 tw-to-indigo-600 hover:tw-from-violet-600 hover:tw-to-indigo-700 tw-text-white tw-rounded-lg tw-transition-all tw-duration-300 tw-font-medium tw-shadow-md tw-text-xs md:tw-text-sm"
            onClick={handlePayment}
            disabled={!selectedMethod}
          >
            Proceed with Payment →
          </button>
        )}
      </div>
    </div>
  );
} 