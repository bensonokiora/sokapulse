'use client';

import React from 'react';
import Link from 'next/link';
import './MegaJackpotMatches.css';

export default function MegaJackpotMatches({ predictions = [] }) {
  // First 5 are free, rest are locked
  const freeCount = 5;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return timeString.slice(0, 5); // Get HH:MM
  };

  const parseTeamsFromMatches = (matchesString) => {
    if (!matchesString) return { homeTeam: 'TBD', awayTeam: 'TBD' };
    // Split by common separators: " - ", " vs ", " v "
    const separators = [' - ', ' vs ', ' v '];
    for (const separator of separators) {
      if (matchesString.includes(separator)) {
        const [home, away] = matchesString.split(separator).map(team => team.trim());
        return { homeTeam: home || 'TBD', awayTeam: away || 'TBD' };
      }
    }
    return { homeTeam: matchesString, awayTeam: 'TBD' };
  };

  const renderMatchCard = (prediction, index) => {
    const isFree = index < freeCount;

    // Parse team names from the matches field
    const { homeTeam, awayTeam } = parseTeamsFromMatches(prediction.matches);

    const tip = prediction.tip || prediction.prediction || prediction.oddDescription || '-';
    const date = formatDate(prediction.date);
    const time = formatTime(prediction.time);

    // Get team badges
    const homeBadge = prediction.teamHomeBadge;
    const awayBadge = prediction.teamAwayBadge;

    return (
      <div
        key={prediction.id || index}
        className={`mega-jackpot-match-card ${!isFree ? 'locked' : ''}`}
      >
        {/* Match Index */}
        <div className={`match-index ${isFree ? 'free' : ''}`}>
          {index + 1}
        </div>

        {/* Teams Info */}
        <div className="match-teams-info">
          <div className="match-team-row">
            <div className="team-logo-placeholder">
              {homeBadge ? (
                <img src={homeBadge} alt={homeTeam} loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
              )}
            </div>
            <span className="team-name">{homeTeam}</span>
          </div>
          <div className="match-team-row">
            <div className="team-logo-placeholder">
              {awayBadge ? (
                <img src={awayBadge} alt={awayTeam} loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
              )}
            </div>
            <span className="team-name">{awayTeam}</span>
          </div>
        </div>

        {/* Date & Time */}
        <div className="match-datetime-info">
          <span className="match-datetime-combined">
            <span className="match-date-text">{date}</span>
            <span className="match-time-text">{time}</span>
          </span>
        </div>

        {/* Prediction/Tip */}
        <div className="match-prediction">
          {isFree ? (
            <div className="prediction-badge">{tip}</div>
          ) : (
            <div className="prediction-locked">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
              </svg>
              <span>Locked</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!predictions || predictions.length === 0) {
    return (
      <section className="mega-jackpot-section" id="predictions">
        <div className="mega-jackpot-header">
          <div className="mega-jackpot-header-left">
            <h2>Mega Jackpot Predictions</h2>
          </div>
        </div>
        <div className="no-predictions">
          <svg className="no-predictions-icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
          <p>No predictions available at the moment.</p>
        </div>
      </section>
    );
  }

  const totalMatches = predictions.length;
  const lockedCount = Math.max(0, totalMatches - freeCount);

  return (
    <section className="mega-jackpot-section" id="predictions">
      {/* Header */}
      <div className="mega-jackpot-header">
        <div className="mega-jackpot-header-left">
          <h2>Mega Jackpot Predictions</h2>
          <span className="mega-jackpot-badge">{totalMatches} Matches</span>
        </div>
      </div>

      {/* Table Header */}
      <div className="mega-jackpot-table-header">
        <div className="header-index">#</div>
        <div className="header-teams">Teams</div>
        <div className="header-datetime">Date/Time</div>
        <div className="header-tip">Tip</div>
      </div>

      {/* Matches Container */}
      <div className="mega-jackpot-matches-container">
        {predictions.map((prediction, index) => renderMatchCard(prediction, index))}
      </div>

      {/* Footer - Unlock Premium */}
      {lockedCount > 0 && (
        <div className="mega-jackpot-footer">
          <Link href="#pricing" className="unlock-premium-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
            </svg>
            Unlock {lockedCount} Premium Predictions
          </Link>
        </div>
      )}
    </section>
  );
}
