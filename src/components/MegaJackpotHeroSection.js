'use client';

import React from 'react';
import Link from 'next/link';

export default function MegaJackpotHeroSection() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <span className="badge-icon">🏆</span>
            <span className="badge-text">Free Sportpesa Mega Jackpot Predictions & Analysis</span>
          </div>

          {/* Main Heading */}
          <h1 className="hero-title">
            <span className="hero-title-free">Sportpesa Mega Jackpot</span>{' '}
            <span className="hero-title-main">Predictions</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Get free Sportpesa Mega Jackpot predictions with expert analysis.
            Access both free predictions and premium protected tips for all 17 matches.
            Join thousands of users winning big with our accurate jackpot predictions.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta-container">
            <Link href="#predictions" className="hero-cta-primary">
              View Predictions
            </Link>
            <Link href="#pricing" className="hero-cta-secondary">
              Get Premium Access
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
