'use client';

import React from 'react';

export default function Step1PlanSelection({ 
  selectedPlan, 
  setSelectedPlan, 
  pricingOptions,
  onNext 
}) {
  // Set option 1 as default if no option is selected
  React.useEffect(() => {
    if (!selectedPlan && pricingOptions.length > 0) {
      const defaultOption = pricingOptions.find(option => option.id === 1);
      if (defaultOption) {
        setSelectedPlan(defaultOption.id);
      }
    }
  }, [selectedPlan, setSelectedPlan, pricingOptions]);

  const handleContinue = () => {
    if (selectedPlan) {
      onNext();
    }
  };
  
  return (
    <div className="tw-mb-3">
      <h2 className="tw-text-lg md:tw-text-xl tw-font-semibold tw-mb-3 md:tw-mb-5 tw-text-gray-800">Select Subscription Plan</h2>
      
      <div className="tw-grid tw-grid-cols-2 tw-gap-2 md:tw-gap-4 tw-mb-4 md:tw-mb-6 tw-auto-rows-fr">
        {pricingOptions.map(option => (
          <div
            key={option.id}
            onClick={() => setSelectedPlan(option.id)}
            className={`
              tw-cursor-pointer tw-flex tw-flex-col tw-justify-between tw-rounded-lg md:tw-rounded-xl tw-border tw-transition-all tw-duration-300
              ${selectedPlan === option.id 
                ? 'tw-border-violet-400 tw-bg-violet-50 tw-shadow-md md:tw-shadow-lg tw-scale-[1.01] md:tw-scale-[1.02]' 
                : 'tw-border-gray-200 tw-bg-white hover:tw-border-violet-200 hover:tw-shadow-sm'}
            `}
          >
            <div className="tw-relative tw-p-2 md:tw-p-4 tw-w-full tw-flex tw-flex-col tw-items-center">
              {option.id === 1 && (
                <span className="tw-absolute tw-top-0 tw-right-0 tw-transform tw-translate-x-1 -tw-translate-y-1/2 tw-bg-gradient-to-r tw-from-violet-500 tw-to-indigo-600 tw-text-white tw-text-[10px] md:tw-text-xs tw-py-0.5 tw-px-1.5 md:tw-px-2.5 tw-rounded-full tw-font-medium tw-shadow-sm limited-offer-tag">Limited Offer</span>
              )}
              
              <h3 className="tw-font-semibold tw-text-xs md:tw-text-base tw-mb-1 md:tw-mb-2 tw-text-center tw-text-gray-800">{option.name}</h3>
              
              <div className="tw-flex tw-items-baseline tw-mb-1 md:tw-mb-2.5 tw-justify-center">
                <span className="tw-text-lg md:tw-text-2xl tw-font-bold tw-text-indigo-600 price-text">
                  KSH {option.price}
                </span>
              </div>
              
              <div className="tw-flex tw-flex-col tw-items-center">
                <p className="tw-text-xs md:tw-text-sm tw-text-gray-600 tw-mb-0.5 md:tw-mb-1 tw-font-medium">
                  {option.duration} days access
                </p>
                
                <p className="tw-text-[8px] md:tw-text-[10px] tw-text-gray-500 tw-text-center">
                  {option.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!selectedPlan && (
        <p className="tw-text-rose-600 tw-text-xs md:tw-text-sm tw-mb-3 md:tw-mb-4 tw-font-medium">
          Please select a subscription plan to continue
        </p>
      )}
      
      <div className="tw-flex tw-justify-end">
        <button 
          className={`tw-py-2 tw-px-4 md:tw-py-2.5 md:tw-px-5 tw-rounded-lg tw-font-medium tw-transition-all tw-duration-300 tw-shadow-md tw-text-xs md:tw-text-sm ${
            selectedPlan 
              ? 'tw-bg-gradient-to-r tw-from-violet-500 tw-to-indigo-600 hover:tw-from-violet-600 hover:tw-to-indigo-700 tw-text-white' 
              : 'tw-bg-gray-200 tw-cursor-not-allowed tw-text-gray-500'
          }`}
          onClick={handleContinue}
          disabled={!selectedPlan}
        >
          Next →
        </button>
      </div>
    </div>
  );
} 