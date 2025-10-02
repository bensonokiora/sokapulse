'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchJackpots } from '@/utils/api';

export default function JackpotCarousel() {
  const [jackpots, setJackpots] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJackpots = async () => {
      try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];

        const response = await fetchJackpots(formattedDate);
        if (response.status && Array.isArray(response.jackpots)) {
          // Take first 3 jackpots
          setJackpots(response.jackpots.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching jackpots:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadJackpots();
  }, []);

  useEffect(() => {
    if (jackpots.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % jackpots.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [jackpots.length]);

  const currentJackpot = jackpots[currentIndex];

  if (isLoading) {
    return (
      <div className="jackpot-carousel loading">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!currentJackpot) {
    return (
      <div className="jackpot-carousel">
        <div className="jackpot-card">
          <div className="jackpot-header">
            <h3 className="jackpot-name">Sportpesa Mega Jackpot</h3>
            <span className="jackpot-badge">Jackpot</span>
          </div>

          <div className="jackpot-info">
            <div className="jackpot-stat">
              <span className="stat-label">Win Amount:</span>
              <span className="stat-value">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
                </svg>
                100 M
              </span>
            </div>
            <div className="jackpot-stat">
              <span className="stat-label">Stake Amount:</span>
              <span className="stat-value stake">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
                </svg>
                KES 99
              </span>
            </div>
            <div className="jackpot-stat">
              <span className="stat-label">No. of Games:</span>
              <span className="stat-value">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11 1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h6zM5 0a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H5z"/>
                  <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                </svg>
                17 Games
              </span>
            </div>
          </div>

          <div className="jackpot-pricing">
            <div className="pricing-option">
              <span className="pricing-label">VIP TIPS</span>
              <span className="pricing-value">KES 150</span>
            </div>
            <div className="pricing-option">
              <span className="pricing-label">VVIP TIPS</span>
              <span className="pricing-value">KES 299</span>
            </div>
          </div>

          <Link href="/jackpot-predictions" className="jackpot-cta">
            Get Tips Now
          </Link>

          <div className="carousel-indicators">
            <span className="indicator active"></span>
            <span className="indicator"></span>
            <span className="indicator"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="jackpot-carousel">
      <div className="jackpot-card">
        <div className="jackpot-header">
          <h3 className="jackpot-name">{currentJackpot.jackpot_name || 'Sportpesa Mega Jackpot'}</h3>
          <span className="jackpot-badge">Jackpot</span>
        </div>

        <div className="jackpot-info">
          <div className="jackpot-stat">
            <span className="stat-label">Win Amount:</span>
            <span className="stat-value">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
              </svg>
              {currentJackpot.jackpot_amount || '100 M'}
            </span>
          </div>
          <div className="jackpot-stat">
            <span className="stat-label">Stake Amount:</span>
            <span className="stat-value stake">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
              </svg>
              KES {currentJackpot.stake_amount || '99'}
            </span>
          </div>
          <div className="jackpot-stat">
            <span className="stat-label">No. of Games:</span>
            <span className="stat-value">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11 1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h6zM5 0a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H5z"/>
                <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
              </svg>
              {currentJackpot.total_games || '17'} Games
            </span>
          </div>
        </div>

        <div className="jackpot-pricing">
          <div className="pricing-option">
            <span className="pricing-label">VIP TIPS</span>
            <span className="pricing-value">KES 150</span>
          </div>
          <div className="pricing-option">
            <span className="pricing-label">VVIP TIPS</span>
            <span className="pricing-value">KES 299</span>
          </div>
        </div>

        <Link
          href={`/jackpot-predictions/${currentJackpot.jackpot_slug || 'sportpesa-mega-jackpot-predictions'}`}
          className="jackpot-cta"
        >
          Get Tips Now
        </Link>

        {jackpots.length > 1 && (
          <div className="carousel-indicators">
            {jackpots.map((_, index) => (
              <span
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
