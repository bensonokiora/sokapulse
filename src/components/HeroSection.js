'use client';

import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <span className="badge-icon">🏆</span>
            <span className="badge-text">Kenya's #1 Football Betting Tips Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="hero-title">
            <span className="hero-title-free">Free</span>{' '}
            <span className="hero-title-main">Football Betting Tips</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Join 10,000+ successful bettors who trust our daily predictions. Get free predictions and complete jackpot access.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta-container">
            <Link href="/premium-tips" className="hero-cta-primary">
              Start Winning Today
            </Link>
            <Link href="/today-football-predictions" className="hero-cta-secondary">
              View Free Tips
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
