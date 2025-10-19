'use client';

import React from 'react';
import Link from 'next/link';

export default function VIPHeroSection() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <span className="badge-icon">⭐</span>
            <span className="badge-text">Premium VIP Predictions with Proven Results</span>
          </div>

          {/* Main Heading */}
          <h1 className="hero-title">
            <span className="hero-title-free">VIP</span>{' '}
            <span className="hero-title-main">Betting Tips</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Get exclusive VIP betting tips with 3.0+ odds. Join our elite community of successful bettors
            with proven 87% win rate. Daily predictions, jackpot access, and expert analysis delivered via SMS.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta-container">
            <Link href="/premium-tips" className="hero-cta-primary">
              Subscribe Now
            </Link>
            <Link href="#pricing" className="hero-cta-secondary">
              View Packages
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
