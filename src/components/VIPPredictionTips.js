'use client';

import React from 'react';
import Link from 'next/link';
import './VIPPredictionTips.css';

export default function VIPPredictionTips({ type = 'vip' }) {
  const isVVIP = type === 'vvip';

  return (
    <div className="vip-prediction-tips">
      <div className="vip-tips-card">
        <h3 className="vip-tips-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
          </svg>
          {isVVIP ? 'VVIP' : 'VIP'} Prediction Tips
        </h3>
        <p className="vip-tips-description">
          {isVVIP
            ? 'Get exclusive access to premium predictions, expert analysis, and highest odds selections. Our VVIP service provides 5.0+ odds with unmatched accuracy and priority support via WhatsApp & SMS.'
            : 'Get exclusive access to premium predictions, expert analysis, and high-quality tips. Our VIP service offers daily multibets with 3.0+ odds, jackpot access, and SMS delivery.'
          }
        </p>
        <Link href="/premium-tips" className="vip-tips-cta">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
          </svg>
          GET {isVVIP ? 'VVIP' : 'VIP'} ACCESS
        </Link>
      </div>
    </div>
  );
}
