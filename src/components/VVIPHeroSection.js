'use client';

import React from 'react';
import Link from 'next/link';

export default function VVIPHeroSection() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <span className="badge-icon">💎</span>
            <span className="badge-text">Elite VVIP Predictions - Maximum Returns</span>
          </div>

          {/* Main Heading */}
          <h1 className="hero-title">
            <span className="hero-title-free">VVIP</span>{' '}
            <span className="hero-title-main">Betting Tips</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Experience the ultimate in premium betting tips with 5.0+ odds multibets. Our VVIP package offers
            priority support, WhatsApp & SMS delivery, and exclusive VIP jackpot access with unmatched accuracy.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta-container">
            <Link href="/premium-tips" className="hero-cta-primary">
              Join VVIP Elite
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
