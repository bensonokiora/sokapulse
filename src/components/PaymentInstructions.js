'use client';

import React from 'react';
import './PaymentInstructions.css';

export default function PaymentInstructions() {
  return (
    <div className="payment-instructions">
      <div className="payment-card">
        <h3 className="payment-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11 5.5a.5.5 0 0 1 .5-.5h2.764l-.643-.643a.5.5 0 1 1 .707-.707l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 1 1-.708-.708L13.963 6.5H11.5a.5.5 0 0 1-.5-.5z"/>
            <path d="M.5 11a.5.5 0 0 1 .5-.5h2.764l-.643-.643a.5.5 0 0 1 .707-.707l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708-.708L3.464 11.5H1a.5.5 0 0 1-.5-.5z"/>
            <path d="M3 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H3zm10 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h10z"/>
          </svg>
          Payment Instructions
        </h3>

        <div className="payment-steps">
          <div className="payment-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4 className="step-title">Go to M-PESA Menu</h4>
              <p className="step-description">On your phone, dial *334# or open M-PESA app</p>
            </div>
          </div>

          <div className="payment-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4 className="step-title">Select Lipa na M-PESA</h4>
              <p className="step-description">Choose "Lipa na M-PESA" then "Pay Bill"</p>
            </div>
          </div>

          <div className="payment-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4 className="step-title">Enter PayBill Details</h4>
              <p className="step-description">
                <strong>Business No:</strong> 4019119<br />
                <strong>Account:</strong> Your Phone Number<br />
                <strong>Amount:</strong> Select package amount
              </p>
            </div>
          </div>

          <div className="payment-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4 className="step-title">Complete & Get Access</h4>
              <p className="step-description">Enter your M-PESA PIN and you'll receive instant access via SMS</p>
            </div>
          </div>
        </div>

        <div className="payment-help">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
          </svg>
          <p>Need help? Contact us on WhatsApp: <strong>+254 712 345 678</strong></p>
        </div>
      </div>
    </div>
  );
}
