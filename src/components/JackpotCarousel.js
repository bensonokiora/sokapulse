'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function JackpotCarousel() {
  // Define all 8 jackpots with their static data
  const staticJackpots = [
    {
      id: 1,
      jackpot_name: 'Sportpesa Mega Jackpot',
      jackpot_amount: '100 M',
      stake_amount: '99',
      total_games: '17 Games',
      vip_price: '150',
      vvip_price: '299',
      jackpot_slug: 'sportpesa-mega-jackpot-predictions'
    },
    {
      id: 2,
      jackpot_name: 'Sportpesa Midweek Jackpot',
      jackpot_amount: '21M',
      stake_amount: '99',
      total_games: '13 Games',
      vip_price: '99',
      vvip_price: '199',
      jackpot_slug: 'sportpesa-midweek-jackpot-predictions'
    },
    {
      id: 3,
      jackpot_name: 'Betika Midweek Jackpot',
      jackpot_amount: '15M',
      stake_amount: '15',
      total_games: '15 Games',
      vip_price: '110',
      vvip_price: '220',
      jackpot_slug: 'betika-midweek-jackpot-predictions'
    },
    {
      id: 4,
      jackpot_name: 'Mozzart Super Daily Jackpot',
      jackpot_amount: '20M',
      stake_amount: '95',
      total_games: '16 Games',
      vip_price: '95',
      vvip_price: '189',
      jackpot_slug: 'mozzart-super-daily-jackpot-predictions'
    },
    {
      id: 5,
      jackpot_name: 'Mozzart Bet Grand Jackpot',
      jackpot_amount: '200M',
      stake_amount: '50',
      total_games: '20 Games',
      vip_price: '169',
      vvip_price: '290',
      jackpot_slug: 'mozzart-grand-jackpot-predictions'
    },
    {
      id: 6,
      jackpot_name: 'Odibet Laki Tatu Jackpot',
      jackpot_amount: '300,000',
      stake_amount: '15',
      total_games: '10 Games',
      vip_price: '75',
      vvip_price: '159',
      jackpot_slug: 'odibet-laki-tatu-jackpot-predictions'
    },
    {
      id: 7,
      jackpot_name: 'Betpawa Pick13 Jackpot',
      jackpot_amount: '1M',
      stake_amount: '5',
      total_games: '13 Games',
      vip_price: '105',
      vvip_price: '210',
      jackpot_slug: 'betpawa-pick13-jackpot-predictions'
    },
    {
      id: 8,
      jackpot_name: 'Betpawa Pick 17 Jackpot',
      jackpot_amount: '250M',
      stake_amount: '50',
      total_games: '17 Games',
      vip_price: '125',
      vvip_price: '249',
      jackpot_slug: 'betpawa-pick17-jackpot-predictions'
    }
  ];

  const [jackpots] = useState(staticJackpots);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Auto-slide carousel every 3 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % jackpots.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [jackpots.length]);

  const handleIndicatorClick = (index) => {
    setCurrentIndex(index);
  };

  const currentJackpot = jackpots[currentIndex];

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
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M6 9h4.5a.5.5 0 0 1 0 1H6a.5.5 0 0 1 0-1z"/>
                  <path d="M3.051 3.26a.5.5 0 0 1 .354-.613l1.932-.518a.5.5 0 0 1 .62.39c.655-.079 1.35-.117 2.043-.117.72 0 1.443.041 2.12.126a.5.5 0 0 1 .622-.399l1.932.518a.5.5 0 0 1 .306.729c.14.09.266.19.373.297.408.408.78 1.05 1.095 1.772.32.733.599 1.591.805 2.466.206.875.34 1.78.364 2.606.024.816-.059 1.602-.328 2.21a1.42 1.42 0 0 1-1.445.83c-.636-.067-1.115-.394-1.513-.773-.245-.232-.496-.526-.739-.808-.126-.148-.25-.292-.368-.423-.728-.804-1.597-1.527-3.224-1.527-1.627 0-2.496.723-3.224 1.527-.119.131-.242.275-.368.423-.243.282-.494.575-.739.808-.398.38-.877.706-1.513.773a1.42 1.42 0 0 1-1.445-.83c-.27-.608-.352-1.395-.329-2.21.024-.826.16-1.73.365-2.606.206-.875.486-1.733.805-2.466.315-.722.687-1.364 1.094-1.772a2.34 2.34 0 0 1 .433-.335.504.504 0 0 1-.028-.079zm2.036.412c-.877.185-1.469.443-1.733.708-.276.276-.587.783-.885 1.465a13.748 13.748 0 0 0-.748 2.295 12.351 12.351 0 0 0-.339 2.406c-.022.755.062 1.368.243 1.776a.42.42 0 0 0 .426.24c.327-.034.61-.199.929-.502.212-.202.4-.423.615-.674.133-.156.276-.323.44-.504C4.861 9.969 5.978 9.027 8 9.027s3.139.942 3.965 1.855c.164.181.307.348.44.504.214.251.403.472.615.674.318.303.601.468.929.503a.42.42 0 0 0 .426-.241c.18-.408.265-1.02.243-1.776a12.354 12.354 0 0 0-.339-2.406 13.753 13.753 0 0 0-.748-2.295c-.298-.682-.61-1.19-.885-1.465-.264-.265-.856-.523-1.733-.708-.85-.179-1.877-.27-2.913-.27-1.036 0-2.063.091-2.913.27z"/>
                </svg>
                100 M
              </span>
            </div>
            <div className="jackpot-stat">
              <span className="stat-label">Stake Amount:</span>
              <span className="stat-value stake">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
                </svg>
                KES 99
              </span>
            </div>
            <div className="jackpot-stat">
              <span className="stat-label">No. of Games:</span>
              <span className="stat-value">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 2A1.5 1.5 0 0 1 7 .5h2A1.5 1.5 0 0 1 10.5 2v2A1.5 1.5 0 0 1 9 5.5H7A1.5 1.5 0 0 1 5.5 4V2zm5 0v2a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5zm-5 8A1.5 1.5 0 0 1 7 8.5h2a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 12v-2zm5 0v2a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5zM1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2zm4 0v2H2V2h3zM1 10a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2zm4 0v2H2v-2h3zm6-8a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2zm4 0v2h-3V2h3zm-4 8a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2zm4 0v2h-3v-2h3z"/>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6 9h4.5a.5.5 0 0 1 0 1H6a.5.5 0 0 1 0-1z"/>
                <path d="M3.051 3.26a.5.5 0 0 1 .354-.613l1.932-.518a.5.5 0 0 1 .62.39c.655-.079 1.35-.117 2.043-.117.72 0 1.443.041 2.12.126a.5.5 0 0 1 .622-.399l1.932.518a.5.5 0 0 1 .306.729c.14.09.266.19.373.297.408.408.78 1.05 1.095 1.772.32.733.599 1.591.805 2.466.206.875.34 1.78.364 2.606.024.816-.059 1.602-.328 2.21a1.42 1.42 0 0 1-1.445.83c-.636-.067-1.115-.394-1.513-.773-.245-.232-.496-.526-.739-.808-.126-.148-.25-.292-.368-.423-.728-.804-1.597-1.527-3.224-1.527-1.627 0-2.496.723-3.224 1.527-.119.131-.242.275-.368.423-.243.282-.494.575-.739.808-.398.38-.877.706-1.513.773a1.42 1.42 0 0 1-1.445-.83c-.27-.608-.352-1.395-.329-2.21.024-.826.16-1.73.365-2.606.206-.875.486-1.733.805-2.466.315-.722.687-1.364 1.094-1.772a2.34 2.34 0 0 1 .433-.335.504.504 0 0 1-.028-.079zm2.036.412c-.877.185-1.469.443-1.733.708-.276.276-.587.783-.885 1.465a13.748 13.748 0 0 0-.748 2.295 12.351 12.351 0 0 0-.339 2.406c-.022.755.062 1.368.243 1.776a.42.42 0 0 0 .426.24c.327-.034.61-.199.929-.502.212-.202.4-.423.615-.674.133-.156.276-.323.44-.504C4.861 9.969 5.978 9.027 8 9.027s3.139.942 3.965 1.855c.164.181.307.348.44.504.214.251.403.472.615.674.318.303.601.468.929.503a.42.42 0 0 0 .426-.241c.18-.408.265-1.02.243-1.776a12.354 12.354 0 0 0-.339-2.406 13.753 13.753 0 0 0-.748-2.295c-.298-.682-.61-1.19-.885-1.465-.264-.265-.856-.523-1.733-.708-.85-.179-1.877-.27-2.913-.27-1.036 0-2.063.091-2.913.27z"/>
              </svg>
              {currentJackpot.jackpot_amount || '100 M'}
            </span>
          </div>
          <div className="jackpot-stat">
            <span className="stat-label">Stake Amount:</span>
            <span className="stat-value stake">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
              </svg>
              KES {currentJackpot.stake_amount || '99'}
            </span>
          </div>
          <div className="jackpot-stat">
            <span className="stat-label">No. of Games:</span>
            <span className="stat-value">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 2A1.5 1.5 0 0 1 7 .5h2A1.5 1.5 0 0 1 10.5 2v2A1.5 1.5 0 0 1 9 5.5H7A1.5 1.5 0 0 1 5.5 4V2zm5 0v2a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5zm-5 8A1.5 1.5 0 0 1 7 8.5h2a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 12v-2zm5 0v2a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5zM1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2zm4 0v2H2V2h3zM1 10a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2zm4 0v2H2v-2h3zm6-8a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2zm4 0v2h-3V2h3zm-4 8a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2zm4 0v2h-3v-2h3z"/>
              </svg>
              {currentJackpot.total_games || '17'} Games
            </span>
          </div>
        </div>

        <div className="jackpot-pricing">
          <div className="pricing-option">
            <span className="pricing-label">VIP TIPS</span>
            <span className="pricing-value">KES {currentJackpot.vip_price}</span>
          </div>
          <div className="pricing-option">
            <span className="pricing-label">VVIP TIPS</span>
            <span className="pricing-value">KES {currentJackpot.vvip_price}</span>
          </div>
        </div>

        <Link
          href={`/jackpot-predictions/${currentJackpot.jackpot_slug}`}
          className="jackpot-cta"
        >
          Get Tips Now
        </Link>

        <div className="carousel-indicators">
          {jackpots.map((_, index) => (
            <span
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleIndicatorClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
