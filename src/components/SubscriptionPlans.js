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

export default function SubscriptionPlans() {
  const [activeTab, setActiveTab] = useState('vip');

  const currentPlans = pricingPlans[activeTab];

  const getIconForPlan = (name) => {
    switch (name) {
      case 'BASIC':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11 1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h6zM5 0a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H5z"/>
          </svg>
        );
      case 'POPULAR':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
          </svg>
        );
      case 'STANDARD':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-.214c-2.162-1.241-4.49-1.843-6.912-2.083l.405 2.712A1 1 0 0 1 5.51 15.1h-.548a1 1 0 0 1-.916-.599l-1.85-3.49a68.14 68.14 0 0 0-.202-.003A2.014 2.014 0 0 1 0 9V7a2.02 2.02 0 0 1 1.992-2.013 74.663 74.663 0 0 0 2.483-.075c3.043-.154 6.148-.849 8.525-2.199V2.5z"/>
          </svg>
        );
      case 'PREMIUM':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
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
                      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-2zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
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
