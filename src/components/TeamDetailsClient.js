'use client';

import { useState, useEffect } from 'react';
import { formatMatchTime } from '@/utils/dateUtils';
import { getPrediction, getHighestProbability, validatePrediction } from '@/utils/predictionUtils';
import Link from 'next/link';

export default function TeamDetailsClient({ teamData }) {
  const [isMobile, setIsMobile] = useState(false);
  const [favoriteStates, setFavoriteStates] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 760);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const favoriteData = JSON.parse(localStorage.getItem('mymatchesdata'));
    if (favoriteData?.dataArray) {
      const states = {};
      favoriteData.dataArray.forEach(item => {
        states[item.fixture_id] = true;
      });
      setFavoriteStates(states);
    }
  }, []);

  const probabilities = {
    home: teamData?.matchDetails?.percent_pred_home?.replace('%', '') || '0',
    draw: teamData?.matchDetails?.percent_pred_draw?.replace('%', '') || '0',
    away: teamData?.matchDetails?.percent_pred_away?.replace('%', '') || '0'
  };

  const prediction = getPrediction(probabilities.home, probabilities.draw, probabilities.away);

  const scores = teamData?.matchDetails?.parsedScores || {};
  const predictionStyle = validatePrediction(
    prediction, 
    scores, 
    teamData?.matchDetails?.status_long || ''
  );

  const isFavorite = teamData?.matchDetails ? favoriteStates[teamData.matchDetails.fixture_id] || false : false;

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!teamData?.matchDetails) return;

    const newState = !isFavorite;
    const favoriteData = JSON.parse(localStorage.getItem('mymatchesdata')) || { dataArray: [] };

    setFavoriteStates(prev => ({
      ...prev,
      [teamData.matchDetails.fixture_id]: newState
    }));

    if (newState) {
      favoriteData.dataArray.push({ fixture_id: teamData.matchDetails.fixture_id });
    } else {
      favoriteData.dataArray = favoriteData.dataArray.filter(
        item => item.fixture_id !== teamData.matchDetails.fixture_id
      );
    }

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    favoriteData.expiry = expiry.getTime();

    localStorage.setItem('mymatchesdata', JSON.stringify(favoriteData));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="responsive-row" style={{ cursor: 'auto' }}>
      <div className="match-time-wrapper">
        <div className="match-time">
          {formatMatchTime(teamData?.matchDetails?.date)}
        </div>
      </div>
      <div className="league-info-wrapper">
        {teamData?.matchDetails?.country_flag ? (
          <img 
            src={teamData.matchDetails.country_flag} 
            className="img-fluid league-logo" 
            alt={`${teamData?.matchDetails?.country_name}-football-predictions`} 
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              // Show fallback letter when image fails to load
              const fallback = document.createElement('div');
              fallback.className = 'league-logo-fallback';
              fallback.style.cssText = 'width: 24px; height: 24px; border-radius: 4px; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: #333; border: 1px solid #ddd; margin-right: 8px;';
              fallback.textContent = teamData?.matchDetails?.country_name?.charAt(0).toUpperCase() || 'C';
              e.target.parentNode.insertBefore(fallback, e.target.nextSibling);
            }}
          />
        ) : (
          <div className="league-logo-fallback" style={{
            width: '24px',
            height: '24px', 
            borderRadius: '4px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#333',
            border: '1px solid #ddd',
            marginRight: '8px'
          }}>
            {teamData?.matchDetails?.country_name?.charAt(0).toUpperCase() || 'C'}
          </div>
        )}
        <span className="league-name">{teamData?.matchDetails?.league_name}</span>
      </div>
      <div className="responsive-cell favorite-cell">
        <div className="favorite-desktop" onClick={toggleFavorite}>
          <svg xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              fill={isFavorite ? "red" : "currentColor"} 
              className="bi bi-star-fill" 
              viewBox="0 0 16 16">
            <path d={isFavorite ? 
              "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" :
              "M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"} 
            />
          </svg>
        </div>
      </div>
      <div className="responsive-cell team-link" title="Click to open match details">
        <Link href={`/football-predictions/fixture/${teamData?.matchDetails?.home_team_name?.toLowerCase()?.replace(/\s+/g, '-') || ''}-vs-${teamData?.matchDetails?.away_team_name?.toLowerCase()?.replace(/\s+/g, '-') || ''}-${teamData?.matchDetails?.fixture_id || ''}`}>
          <div className="teamNameLink">
            <span className="team-name" style={{ fontWeight: 'bold' }}>{teamData?.matchDetails?.home_team_name || 'Home Team'}</span><br />
            <span className="team-name" style={{ fontWeight: 'bold' }}>{teamData?.matchDetails?.away_team_name || 'Away Team'}</span>
          </div>
        </Link>
      </div>
      <div className="responsive-cell team-link-probability" style={{ whiteSpace: 'nowrap' }}>
        <span style={{ fontWeight: getHighestProbability(probabilities.home, probabilities.draw, probabilities.away) === 'home' ? 'bold' : 'normal' }}>
          {probabilities.home}% &nbsp;
        </span>
        <span style={{ fontWeight: getHighestProbability(probabilities.home, probabilities.draw, probabilities.away) === 'draw' ? 'bold' : 'normal' }}>
          {probabilities.draw}% &nbsp;
        </span>
        <span style={{ fontWeight: getHighestProbability(probabilities.home, probabilities.draw, probabilities.away) === 'away' ? 'bold' : 'normal' }}>
          {probabilities.away}%
        </span>
      </div>
      <div className="responsive-cell" title="Prediction">
        <span className="m-1">
          {teamData?.matchDetails && (
            <span className="number-circle rounded-square" style={predictionStyle}>
              {prediction}
            </span>
          )}
        </span>
      </div>
      <div className="responsive-cell hide-on-mobile" title="Average Goals">
        {teamData?.matchDetails?.avg_performance || '-'}
      </div>
      <div className="responsive-cell" title="Odds">
        <div className="odds-container">
          <div>{teamData?.matchDetails?.bets_home || '-'}</div>
          <div>{teamData?.matchDetails?.bets_draw || '-'}</div>
          <div>{teamData?.matchDetails?.bets_away || '-'}</div>
        </div>
      </div>
      <div className="responsive-cell" title="Scores">
        <div className="score-container">
          <div className="match-status-wrapper">
            {teamData?.matchDetails?.status_short === "FT" || teamData?.matchDetails?.status_short === "ABD" ? (
              <span className="match-status">{teamData.matchDetails.status_short}</span>
            ) : ["2H", "1H", "INT", "HT", "LIVE"].includes(teamData?.matchDetails?.status_short) ? (
              <div className="match-status-live">
                {["1H", "2H"].includes(teamData.matchDetails.status_short) ? 
                  `${teamData.matchDetails.status_elapased}` :
                  teamData.matchDetails.status_short
                }
                {teamData.matchDetails.status_short !== "HT" && teamData.matchDetails.status_elapased && (
                  <span className="blink_text">&nbsp;'</span>
                )}
              </div>
            ) : null}
          </div>
          <div className="scores-display">
            <span className={`${teamData?.matchDetails?.parsedScores?.fulltime?.home !== null && teamData?.matchDetails?.parsedScores?.fulltime?.home !== undefined ? 'scores-card' : 'no-score'} ${["2H", "1H", "INT", "HT", "LIVE"].includes(teamData?.matchDetails?.status_short) ? 'live' : ''}`}>
              {teamData?.matchDetails?.parsedScores?.fulltime?.home !== null && teamData?.matchDetails?.parsedScores?.fulltime?.home !== undefined ? 
                `${teamData.matchDetails.parsedScores.fulltime.home} - ${teamData.matchDetails.parsedScores.fulltime.away}` : 
                '-'
              }
            </span>
            {teamData?.matchDetails?.parsedScores?.halftime?.home !== null && teamData?.matchDetails?.parsedScores?.halftime?.home !== undefined && (
              <span className="halfTimeDataDisplay">
                {`(${teamData.matchDetails.parsedScores.halftime.home}-${teamData.matchDetails.parsedScores.halftime.away})`}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 