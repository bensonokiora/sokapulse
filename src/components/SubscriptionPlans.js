'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const pricingPlans = {
  vip: [
    {
      id: 1,
      name: 'BASIC',
      price: 500,
      duration: 7,
      color: 'green',
      features: [
        'Daily Multi bets 3.0 + Odds',
        'All Jackpots Access',
        'Login Account',
        'Tips via SMS Daily',
        '7 days Access'
      ],
      paybill: '4019119',
      accountNumber: 'Your Phone Number',
      amount: 500
    },
    {
      id: 2,
      name: 'POPULAR',
      price: 850,
      duration: 14,
      color: 'yellow',
      popular: true,
      features: [
        'Daily Multi bets 3.0 + Odds',
        'All Jackpots Access',
        'Login Account',
        'Tips via SMS Daily',
        '14 days Access'
      ],
      paybill: '4019119',
      accountNumber: 'Your Phone Number',
      amount: 850
    },
    {
      id: 3,
      name: 'STANDARD',
      price: 1500,
      duration: 30,
      color: 'orange',
      features: [
        'Daily Multi bets 3.0 + Odds',
        'All Jackpots Access',
        'Login Account',
        'Tips via SMS Daily',
        '30 days Access'
      ],
      paybill: '4019119',
      accountNumber: 'Your Phone Number',
      amount: 1500
    },
    {
      id: 4,
      name: 'PREMIUM',
      price: 3000,
      duration: 90,
      color: 'purple',
      features: [
        'Daily Multi bets 3.0 + Odds',
        'All Jackpots Access',
        'Login Account',
        'Tips via SMS Daily',
        '90 days Access'
      ],
      paybill: '4019119',
      accountNumber: 'Your Phone Number',
      amount: 3000
    }
  ],
  vvip: [
    {
      id: 5,
      name: 'BASIC',
      price: 950,
      duration: 7,
      color: 'green',
      features: [
        'Premium Multi bets 5.0 + Odds',
        'All Jackpots VIP Access',
        'Priority Login Account',
        'Tips via SMS & WhatsApp',
        '7 days Premium Access'
      ],
      paybill: '4019119',
      accountNumber: 'Your Phone Number',
      amount: 950
    },
    {
      id: 6,
      name: 'POPULAR',
      price: 1600,
      duration: 14,
      color: 'yellow',
      popular: true,
      features: [
        'Premium Multi bets 5.0 + Odds',
        'All Jackpots VIP Access',
        'Priority Login Account',
        'Tips via SMS & WhatsApp',
        '14 days Premium Access'
      ],
      paybill: '4019119',
      accountNumber: 'Your Phone Number',
      amount: 1600
    },
    {
      id: 7,
      name: 'STANDARD',
      price: 2800,
      duration: 30,
      color: 'orange',
      features: [
        'Premium Multi bets 5.0 + Odds',
        'All Jackpots VIP Access',
        'Priority Login Account',
        'Tips via SMS & WhatsApp',
        '30 days Premium Access'
      ],
      paybill: '4019119',
      accountNumber: 'Your Phone Number',
      amount: 2800
    },
    {
      id: 8,
      name: 'PREMIUM',
      price: 5500,
      duration: 90,
      color: 'purple',
      features: [
        'Premium Multi bets 5.0 + Odds',
        'All Jackpots VIP Access',
        'Priority Login Account',
        'Tips via SMS & WhatsApp',
        '90 days Premium Access'
      ],
      paybill: '4019119',
      accountNumber: 'Your Phone Number',
      amount: 5500
    }
  ]
};

export default function SubscriptionPlans({ defaultTab = 'vip' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const currentPlans = pricingPlans[activeTab];

  const getIconForPlan = (name) => {
    switch (name) {
      case 'BASIC':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
          </svg>
        );
      case 'POPULAR':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
          </svg>
        );
      case 'STANDARD':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935zM3.504 1c.007.517.026 1.006.056 1.469.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7 10a.5.5 0 0 1 .5.5v2.61a1 1 0 0 1-.757.97l-1.426.356a.5.5 0 0 0-.179.085L4.5 15h7l-.638-.479a.501.501 0 0 0-.18-.085l-1.425-.356a1 1 0 0 1-.757-.97V10.5A.5.5 0 0 1 9 10c.516 0 1.706-.52 2.57-2.864.413-1.12.74-2.64.87-4.667.03-.463.049-.952.056-1.469H3.504z"/>
          </svg>
        );
      case 'PREMIUM':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
            <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702 1.509.229z"/>
            <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="subscription-plans">
      <div className="container">
        <div className="plans-header">
          <h2 className="plans-title">Flexible Pricing Plans</h2>
          <p className="plans-subtitle">We Have Pricing Plans To Suit Every Customer</p>
        </div>

        {/* Tab Toggle */}
        <div className="plans-tabs">
          <button
            className={`tab-button ${activeTab === 'vip' ? 'active' : ''}`}
            onClick={() => setActiveTab('vip')}
          >
            VIP TIPS
          </button>
          <button
            className={`tab-button ${activeTab === 'vvip' ? 'active' : ''}`}
            onClick={() => setActiveTab('vvip')}
          >
            VVIP TIPS
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-grid">
          {currentPlans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card ${plan.color} ${plan.popular ? 'popular' : ''}`}
            >
              {plan.popular && (
                <div className="popular-badge">
                  <span>MOST POPULAR</span>
                </div>
              )}

              <div className="card-icon" style={{ color: `var(--${plan.color}-color)` }}>
                {getIconForPlan(plan.name)}
              </div>

              <h3 className="card-name" style={{ color: `var(--${plan.color}-color)` }}>
                {plan.name}
              </h3>

              <div className="card-price">
                <span className="price-currency">Ksh.</span>
                <span className="price-amount">{plan.price}</span>
              </div>

              <p className="card-duration">{plan.duration} days</p>

              <ul className="card-features">
                {plan.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={`/premium-tips?plan=${plan.id}`}
                className={`card-cta ${plan.color}`}
              >
                JOIN NOW
              </Link>

              <div className="mpesa-details">
                <div className="mpesa-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11 5.5a.5.5 0 0 1 .5-.5h2.764l-.643-.643a.5.5 0 1 1 .707-.707l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 1 1-.708-.708L13.963 6.5H11.5a.5.5 0 0 1-.5-.5z"/>
                    <path d="M.5 11a.5.5 0 0 1 .5-.5h2.764l-.643-.643a.5.5 0 0 1 .707-.707l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708-.708L3.464 11.5H1a.5.5 0 0 1-.5-.5z"/>
                    <path d="M3 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H3zm10 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h10z"/>
                  </svg>
                  <span>MPESA Payment:</span>
                </div>
                <ul className="mpesa-info">
                  <li>• PayBill: <strong>{plan.paybill}</strong> (TECH VANNAH LIMITED)</li>
                  <li>• Account: <strong>{plan.accountNumber}</strong></li>
                  <li>• Amount: <strong>Ksh. {plan.amount}</strong></li>
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="plans-footer">
          <Link href="/premium-tips" className="view-all-link">
            Get Tips Now
          </Link>
        </div>
      </div>
    </section>
  );
}
