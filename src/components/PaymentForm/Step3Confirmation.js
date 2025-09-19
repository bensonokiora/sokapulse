'use client';

import React from 'react';

export default function Step3Confirmation({ 
  selectedPlan, 
  pricingOptions, 
  phoneNumber, 
  email, 
  isKenya, 
  onNextStep, 
  onBack 
}) {
  const selectedOption = pricingOptions.find(p => p.id === selectedPlan);
  
  return (
    <div className="tw-mb-3">
      <h2 className="tw-text-xl md:tw-text-xl tw-font-semibold tw-mb-3 tw-text-gray-800">Confirm Your Order</h2>
      
      <div className="tw-bg-white tw-rounded-lg md:tw-rounded-xl tw-p-3 md:tw-p-5 tw-mb-4 tw-border tw-border-gray-200 tw-shadow-sm">
        <div className="tw-mb-3 md:tw-mb-4 tw-border-b tw-pb-2 tw-border-gray-100">
          <h3 className="tw-font-semibold tw-text-violet-700 tw-mb-0.5 tw-text-sm md:tw-text-base">Order Summary</h3>
          <p className="tw-text-xs tw-text-gray-500">Please review your subscription details.</p>
        </div>
        
        <div className="tw-space-y-2 md:tw-space-y-3">
          <div className="tw-flex tw-justify-between tw-items-center tw-py-1.5 md:tw-py-2 tw-border-b tw-border-gray-100">
            <p className="tw-text-xs md:tw-text-sm tw-text-gray-500">Selected Plan</p>
            <p className="tw-font-semibold tw-text-xs md:tw-text-sm tw-text-gray-900">{selectedOption?.name}</p>
          </div>
          
          <div className="tw-flex tw-justify-between tw-items-center tw-py-1.5 md:tw-py-2 tw-border-b tw-border-gray-100">
            <p className="tw-text-xs md:tw-text-sm tw-text-gray-500">Price</p>
            <p className="tw-font-bold tw-text-sm md:tw-text-base tw-text-indigo-600 price-text">KSH {selectedOption?.price}</p>
          </div>
          
          <div className="tw-flex tw-justify-between tw-items-center tw-py-1.5 md:tw-py-2 tw-border-b tw-border-gray-100">
            <p className="tw-text-xs md:tw-text-sm tw-text-gray-500">Duration</p>
            <p className="tw-font-semibold tw-text-xs md:tw-text-sm tw-text-gray-900">{selectedOption?.duration} days</p>
          </div>
          
          <div className="tw-bg-violet-50 tw-rounded-md md:tw-rounded-lg tw-p-2.5 md:tw-p-3.5 tw-border tw-border-violet-100 tw-mt-2 md:tw-mt-3">
            <div className="tw-flex tw-justify-between tw-items-center">
              <div className="tw-flex tw-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="tw-h-3.5 tw-w-3.5 md:tw-h-4 md:tw-w-4 tw-mr-1.5 tw-text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p className="tw-text-xs md:tw-text-sm tw-text-gray-600">Phone Number</p>
              </div>
              <p className="tw-font-semibold tw-text-xs md:tw-text-sm tw-text-gray-900">{phoneNumber}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="tw-flex tw-justify-between tw-mt-4">
        <button 
          className="tw-py-2 tw-px-4 md:tw-py-2.5 md:tw-px-5 tw-bg-gray-100 tw-text-gray-700 tw-rounded-lg hover:tw-bg-gray-200 tw-transition-all tw-duration-300 tw-font-medium tw-shadow-sm tw-text-xs md:tw-text-sm"
          onClick={onBack}
        >
          ← Back
        </button>
        
        <button 
          className="tw-py-2 tw-px-4 md:tw-py-2.5 md:tw-px-5 tw-bg-gradient-to-r tw-from-violet-500 tw-to-indigo-600 hover:tw-from-violet-600 hover:tw-to-indigo-700 tw-text-white tw-rounded-lg tw-transition-all tw-duration-300 tw-font-medium tw-shadow-md tw-text-xs md:tw-text-sm"
          onClick={onNextStep}
        >
          Continue to Payment →
        </button>
      </div>
    </div>
  );
} 