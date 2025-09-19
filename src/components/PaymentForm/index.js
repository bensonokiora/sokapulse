'use client';

import React, { useState, useEffect } from 'react';
// Consolidate CSS imports - keep only what's necessary
import '../../styles/tailwind-payment-form.css';
// Then component imports
import Step1PlanSelection from './Step1PlanSelection';
import Step2ContactInfo from './Step2ContactInfo';
import Step3Confirmation from './Step3Confirmation';
import Step4PaymentMethod from './Step4PaymentMethod';
import Step5MpesaPayment from './Step5MpesaPayment';
import { PaystackButton } from 'react-paystack';
import TailwindIsolator from '../TailwindIsolator';

// Define pricing options array for use throughout the form
export const pricingOptions = [
  { id: 1, name: 'Three Days Access', price: 150, duration: 3, description: 'Multibet slips + all Jackpots' },
  { id: 3, name: 'One Week Access', price: 300, duration: 7, description: 'Multibet slips + all Jackpots' },
  { id: 4, name: 'Two Weeks Access', price: 400, duration: 14, description: 'Multibet slips + all Jackpots' },
  { id: 5, name: 'Monthly', price: 700, duration: 30, description: 'Multibet slips + all Jackpots' },
];

// The actual PaymentForm component that uses Tailwind
function PaymentFormContent() {
  // Form state
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('info@sokapulse.com'); // Set default email since we're not collecting it
  const [isKenya, setIsKenya] = useState(true); // Default to true for Kenya
  const [processing, setProcessing] = useState(false);
  const [alert, setAlert] = useState(null);
  
  // Payment specific state
  const [checkoutRequestID, setCheckoutRequestID] = useState(null);
  const [merchantRequestID, setMerchantRequestID] = useState(null);
  
  // Load Paystack script
  useEffect(() => {
    // Always assume Kenya for simplicity
    setIsKenya(true);
  }, []);
  
  // Progress tracking functions
  const nextStep = () => setStep(current => Math.min(current + 1, 5));
  const prevStep = () => setStep(current => Math.max(current - 1, 1));
  const goToStep = (stepNumber) => setStep(stepNumber);
  
  // Alert handling
  const showAlert = (type, title, message) => {
    setAlert({ type, title, message });
  };
  
  const clearAlert = () => setAlert(null);
  
  // Handle Paystack payment success
  const handlePaystackSuccess = (response) => {
    // Store payment info in localStorage
    try {
      localStorage.setItem('userToken', 'paid_user');
      localStorage.setItem('userPhone', phoneNumber);
      localStorage.setItem('paymentPlan', selectedPlan);
      localStorage.setItem('paymentRef', response.reference);
      localStorage.setItem('paymentDate', new Date().toISOString());
      
      // Show success message and redirect after a short delay
      setAlert({
        type: 'success',
        title: 'Success',
        message: 'Your payment was successful! You will be redirected shortly.'
      });
      
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } catch (e) {
      console.error('Failed to store payment info:', e);
    }
  };
  
  // Handle Paystack popup close
  const handlePaystackClose = () => {
    setAlert({
      type: 'warning',
      title: 'Payment Cancelled',
      message: 'You have cancelled the payment. Please try again when ready.'
    });
  };
  
  // Get Paystack props
  const getPaystackProps = () => {
    if (!selectedPlan) return null;
    
    const selectedOption = pricingOptions.find(p => p.id === selectedPlan);
    if (!selectedOption) return null;
    
    // Convert to the smallest currency unit (cents/kobo)
    const amountInCents = selectedOption.price * 100;
    
    // Use the email from props or create a placeholder
    const userEmail = email || `${phoneNumber}@example.com`;
    
    return {
      email: userEmail,
      amount: amountInCents,
      phone: phoneNumber, // Add phone number directly to payment object
      metadata: {
        phone_number: phoneNumber,
        plan_id: selectedPlan,
        customer_phone: phoneNumber // Also include in metadata for redundancy
      },
      publicKey: 'pk_live_cab92200b64c50b1eba965cd63d679488c7d520d',
      text: 'Pay with Card/Mobile Money',
      onSuccess: handlePaystackSuccess,
      onClose: handlePaystackClose,
      currency: 'KES'
    };
  };
  
  // If there's an alert, show it instead of the form steps
  if (alert) {
    return (
      <div className="tw-p-5">
        <div className={`tw-p-5 tw-rounded-xl tw-shadow-md ${
          alert.type === 'success' ? 'tw-bg-green-50 tw-text-green-800' :
          alert.type === 'error' ? 'tw-bg-rose-50 tw-text-rose-800' :
          alert.type === 'warning' ? 'tw-bg-amber-50 tw-text-amber-800' :
          'tw-bg-blue-50 tw-text-blue-800'
        }`}>
          <div className="tw-flex tw-items-start">
            <div className="tw-flex-shrink-0">
              {alert.type === 'success' && (
                <svg className="tw-h-6 tw-w-6 tw-text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {alert.type === 'error' && (
                <svg className="tw-h-6 tw-w-6 tw-text-rose-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {alert.type === 'warning' && (
                <svg className="tw-h-6 tw-w-6 tw-text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              {alert.type === 'info' && (
                <svg className="tw-h-6 tw-w-6 tw-text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="tw-ml-3 tw-flex-1">
              <h4 className="tw-font-semibold tw-text-lg tw-mb-1.5">{alert.title}</h4>
              <p className="tw-text-sm">{alert.message}</p>
            </div>
          </div>
        </div>
        
        <button 
          className="tw-mt-6 tw-py-3 tw-px-6 tw-bg-gradient-to-r tw-from-violet-500 tw-to-indigo-600 hover:tw-from-violet-600 hover:tw-to-indigo-700 tw-text-white tw-rounded-xl tw-transition-all tw-duration-300 tw-font-semibold tw-shadow-lg hover:tw-shadow-xl hover:tw-scale-105"
          onClick={() => {
            clearAlert();
            goToStep(4); // Go back to payment options
          }}
        >
          ← Back to Payment Options
        </button>
      </div>
    );
  }
  
  // Render progress indicator
  const renderProgressBar = () => (
    <div className="tw-mb-8">
      <div className="tw-flex tw-justify-between tw-items-center">
        {[1, 2, 3, 4, 5].map(stepNumber => (
          <React.Fragment key={stepNumber}>
            <div className={`tw-rounded-full tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-text-sm tw-font-semibold tw-shadow-lg tw-transition-all tw-duration-500 tw-transform ${
              stepNumber <= step 
                ? 'tw-bg-gradient-to-r tw-from-violet-500 tw-to-indigo-600 tw-text-white tw-scale-110 tw-shadow-violet-400/50' 
                : 'tw-bg-white tw-text-gray-400 tw-border-2 tw-border-gray-200 hover:tw-border-violet-300'
            }`}>
              {stepNumber <= step ? (
                stepNumber === step ? stepNumber : (
                  <svg className="tw-w-5 tw-h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )
              ) : stepNumber}
            </div>
            
            {stepNumber < 5 && (
              <div className={`tw-grow tw-mx-3 tw-h-1.5 tw-rounded-full tw-transition-all tw-duration-500 ${
                stepNumber < step ? 'tw-bg-gradient-to-r tw-from-violet-500 tw-to-indigo-600' : 'tw-bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
  
  // Processing overlay
  const renderProcessingOverlay = () => (
    processing ? (
      <div className="tw-fixed tw-inset-0 tw-bg-gray-900/30 tw-backdrop-blur-sm tw-z-50 tw-flex tw-items-center tw-justify-center">
        <div className="tw-bg-white tw-shadow-2xl tw-rounded-2xl tw-p-8 tw-text-center tw-w-80">
          <div className="tw-w-16 tw-h-16 tw-border-4 tw-border-violet-600 tw-border-t-transparent tw-rounded-full tw-animate-spin tw-mx-auto"></div>
          <p className="tw-mt-6 tw-text-gray-800 tw-font-medium tw-text-lg">Processing payment...</p>
        </div>
      </div>
    ) : null
  );
  
  // Get the paystack props
  const paystackProps = getPaystackProps();
  
  return (
    <div id="payment-form" className="tw-relative tw-bg-gradient-to-br tw-from-violet-50 tw-via-indigo-50 tw-to-purple-50 tw-rounded-xl tw-overflow-hidden">
      {renderProcessingOverlay()}
      
      <div className="tw-p-4 md:tw-p-6">
        {renderProgressBar()}
      
        <div className="tw-bg-white/80 tw-backdrop-blur-sm tw-rounded-2xl tw-shadow-xl tw-border tw-border-white/20 tw-p-4 md:tw-p-8">
          {step === 1 && (
            <Step1PlanSelection 
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
              pricingOptions={pricingOptions}
              onNext={nextStep}
            />
          )}
          
          {step === 2 && (
            <Step2ContactInfo 
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              email={email}
              setEmail={setEmail}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          
          {step === 3 && (
            <Step3Confirmation
              selectedPlan={selectedPlan}
              pricingOptions={pricingOptions}
              phoneNumber={phoneNumber}
              email={email}
              isKenya={isKenya}
              onNextStep={nextStep}
              onBack={prevStep}
            />
          )}
          
          {step === 4 && (
            <Step4PaymentMethod
              isKenya={isKenya}
              onSelectMpesa={() => nextStep()}
              onSelectPaystack={() => {
                // Directly navigate to the success page to simulate completion
                // This is where you would open the Paystack modal
                // For now, we'll just move to the success step
                setAlert({
                  type: 'info',
                  title: 'Opening Payment Gateway',
                  message: 'The payment gateway is being initialized...'
                });
                
                // Simulate processing in production
                // This would be replaced by the actual Paystack integration
                setTimeout(() => {
                  clearAlert();
                }, 500);
              }}
              customPaystackButton={paystackProps && (
                <PaystackButton {...paystackProps} className="tw-py-3 tw-px-6 md:tw-py-3.5 md:tw-px-7 tw-bg-gradient-to-r tw-from-violet-500 tw-to-indigo-600 hover:tw-from-violet-600 hover:tw-to-indigo-700 tw-text-white tw-rounded-xl tw-transition-all tw-duration-300 tw-font-semibold tw-shadow-lg tw-text-sm md:tw-text-base hover:tw-shadow-xl hover:tw-scale-105" />
              )}
              paystackLoaded={!!paystackProps}
              onBack={prevStep}
            />
          )}
          
          {step === 5 && (
            <Step5MpesaPayment
              selectedPlan={selectedPlan}
              pricingOptions={pricingOptions}
              phoneNumber={phoneNumber}
              checkoutRequestID={checkoutRequestID}
              setCheckoutRequestID={setCheckoutRequestID}
              merchantRequestID={merchantRequestID}
              setMerchantRequestID={setMerchantRequestID}
              onBack={() => goToStep(4)}
              showAlert={showAlert}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// The exported component that uses the TailwindIsolator
export default function PaymentForm() {
  return (
    <TailwindIsolator>
      <PaymentFormContent />
    </TailwindIsolator>
  );
} 