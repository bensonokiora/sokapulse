'use client';

import { useState, useCallback } from 'react';

export function usePaystack({ setProcessing, setAlert, onSuccess }) {
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  const loadPaystack = useCallback(() => {
    // Check if Paystack is already loaded
    if (typeof window.PaystackPop !== 'undefined') {
      console.log('Paystack already loaded');
      setPaystackLoaded(true);
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v2/inline.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Paystack script loaded successfully');
        setPaystackLoaded(true);
        resolve();
      };
      
      script.onerror = () => {
        console.error('Failed to load Paystack script');
        reject(new Error('Failed to load Paystack script'));
      };
      
      document.head.appendChild(script);
    });
  }, []);

  const handlePaystackPayment = useCallback((selectedPlanId, phoneNumber, selectedOption) => {
    if (!selectedPlanId || !phoneNumber || !selectedOption) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'Please select a plan and enter a valid phone number'
      });
      return;
    }

    const amountInCents = selectedOption.price * 100;

    try {
      setProcessing(true);
      console.log('Initializing Paystack payment...');
      
      // Check for Paystack availability
      if (typeof window.PaystackPop === 'undefined') {
        console.error('PaystackPop is not available');
        setProcessing(false);
        setAlert({
          type: 'error',
          title: 'Error',
          message: 'Payment gateway is not available. Please try the M-Pesa option.'
        });
        return;
      }
      
      // Create a new PaystackPop instance
      const paystackPop = new window.PaystackPop();
      
      // Initialize transaction with proper config
      paystackPop.newTransaction({
        key: 'pk_live_cab92200b64c50b1eba965cd63d679488c7d520d',
        email: phoneNumber ? phoneNumber + '@example.com' : 'client@sportpesa-tips.com',
        amount: amountInCents,
        currency: 'KES',
        ref: '' + Math.floor((Math.random() * 1000000000) + 1),
        metadata: {
          phone_number: phoneNumber,
          plan_id: selectedPlanId,
          custom_fields: [
            {
              display_name: 'Phone Number',
              variable_name: 'phone_number',
              value: phoneNumber
            },
            {
              display_name: 'Plan ID',
              variable_name: 'plan_id',
              value: selectedPlanId
            }
          ]
        },
        onCancel: function() {
          console.log('Paystack payment window closed by user');
          setProcessing(false);
          setAlert({
            type: 'warning',
            title: 'Payment Cancelled',
            message: 'You have cancelled the payment. Please try again when ready.'
          });
        },
        onSuccess: function(response) {
          console.log('Paystack payment successful:', response);
          setProcessing(false);
          
          if (typeof onSuccess === 'function') {
            onSuccess(response);
          } else {
            setAlert({
              type: 'success',
              title: 'Success',
              message: 'Your payment was successful! Reference: ' + response.reference
            });
            
            // Store payment info in localStorage
            try {
              localStorage.setItem('userToken', 'paid_user');
              localStorage.setItem('userPhone', phoneNumber);
              localStorage.setItem('paymentRef', response.reference);
              localStorage.setItem('paymentPlan', selectedPlanId);
              localStorage.setItem('paymentDate', new Date().toISOString());
              
              // Redirect after short delay
              setTimeout(() => {
                window.location.href = '/';
              }, 3000);
            } catch (e) {
              console.error('Failed to store payment info:', e);
            }
          }
        }
      });
      
    } catch (error) {
      console.error('Paystack initialization error:', error);
      setProcessing(false);
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'There was an issue initializing the payment system. Please try the M-Pesa option instead.'
      });
    }
  }, [setProcessing, setAlert, onSuccess]);

  return {
    loadPaystack,
    paystackLoaded,
    handlePaystackPayment
  };
} 