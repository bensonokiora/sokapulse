'use client';

import React, { useState } from 'react';

export default function Step2ContactInfo({ 
  phoneNumber, 
  setPhoneNumber,
  email,
  setEmail,
  onNext, 
  onBack 
}) {
  const [errors, setErrors] = useState({
    phone: ''
  });
  
  const validatePhone = (phone) => {
    // Basic validation for a Kenya phone number (0xxx format with 10 digits)
    if (!phone || phone.trim() === '') {
      return 'Phone number is required';
    }
    if (!/^0\d{9}$/.test(phone.replace(/[\s-]/g, ''))) {
      return 'Please enter a valid 10-digit phone number starting with 0';
    }
    return '';
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate phone number only
    const phoneError = validatePhone(phoneNumber);
    
    if (phoneError) {
      setErrors({
        phone: phoneError
      });
      return;
    }
    
    // Clear errors and proceed
    setErrors({ phone: '' });
    
    // Set a dummy email since the backend might still require it
    setEmail('info@sokapulse.com');
    
    onNext();
  };
  
  return (
    <div className="tw-space-y-6">
      <div className="tw-text-center">
        <h2 className="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-2">M-Pesa Information</h2>
        <p className="tw-text-sm tw-text-gray-600">Enter your M-Pesa phone number to continue</p>
      </div>
      
      <form onSubmit={handleSubmit} className="tw-space-y-6">
        <div className="tw-space-y-2">
          <label className="tw-block tw-text-sm tw-font-semibold tw-text-gray-700" htmlFor="phone">
            Phone Number
          </label>
          <div className="tw-relative">
            <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-4 tw-flex tw-items-center tw-pointer-events-none">
              <svg className="tw-h-5 tw-w-5 tw-text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <input
              id="phone"
              type="tel"
              className={`tw-w-full tw-pl-12 tw-pr-12 tw-py-4 tw-text-base tw-font-medium tw-border-2 tw-rounded-xl tw-transition-all tw-duration-300 tw-outline-none tw-shadow-sm ${
                errors.phone 
                  ? 'tw-border-rose-400 tw-bg-rose-50 tw-text-rose-800 focus:tw-border-rose-500 focus:tw-ring-4 focus:tw-ring-rose-100' 
                  : 'tw-border-gray-200 tw-bg-white tw-text-gray-900 focus:tw-border-violet-500 focus:tw-ring-4 focus:tw-ring-violet-100 hover:tw-border-gray-300'
              }`}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0712345678"
            />
            {errors.phone && (
              <div className="tw-absolute tw-inset-y-0 tw-right-0 tw-pr-4 tw-flex tw-items-center">
                <svg className="tw-h-5 tw-w-5 tw-text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          {errors.phone && (
            <div className="tw-flex tw-items-center tw-space-x-2 tw-text-rose-600">
              <svg className="tw-h-4 tw-w-4 tw-flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="tw-text-sm tw-font-medium">{errors.phone}</p>
            </div>
          )}
          
          {!errors.phone && (
            <div className="tw-flex tw-items-center tw-space-x-2 tw-text-gray-500">
              <svg className="tw-h-4 tw-w-4 tw-flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="tw-text-sm">We'll send payment request to this number</p>
            </div>
          )}
        </div>
        
        <div className="tw-flex tw-items-center tw-justify-between tw-pt-4">
          <button 
            type="button"
            className="tw-inline-flex tw-items-center tw-px-6 tw-py-3 tw-text-sm tw-font-semibold tw-text-gray-700 tw-bg-gray-100 tw-border tw-border-gray-200 tw-rounded-xl hover:tw-bg-gray-200 hover:tw-border-gray-300 tw-transition-all tw-duration-300 tw-shadow-sm hover:tw-shadow-md"
            onClick={onBack}
          >
            <svg className="tw-w-4 tw-h-4 tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <button 
            type="submit"
            className="tw-inline-flex tw-items-center tw-px-8 tw-py-3 tw-text-sm tw-font-semibold tw-text-white tw-bg-gradient-to-r tw-from-violet-500 tw-to-indigo-600 hover:tw-from-violet-600 hover:tw-to-indigo-700 tw-border tw-border-transparent tw-rounded-xl tw-transition-all tw-duration-300 tw-shadow-lg hover:tw-shadow-xl hover:tw-scale-105"
          >
            Continue
            <svg className="tw-w-4 tw-h-4 tw-ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
} 