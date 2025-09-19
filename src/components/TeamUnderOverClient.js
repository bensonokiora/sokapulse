'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUnderOverPrediction, calculateProbabilities, calculateConfidenceLevel } from '@/utils/predictionUtils';
import { formatMatchTime } from '@/utils/dateUtils';

export default function TeamUnderOverClient({ teamData }) {
  const [isMobile, setIsMobile] = useState(false);
  const [favoriteStates, setFavoriteStates] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 760);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Initialize favorite states from localStorage
    const favoriteData = JSON.parse(localStorage.getItem('mymatchesdata'));
    if (favoriteData?.dataArray) {
      const states = {};
      favoriteData.dataArray.forEach(item => {
        states[item.fixture_id] = true;
      });
      setFavoriteStates(states);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Add a function to get under/over probabilities
  const getUnderOverProbabilities = () => {
    if (!teamData?.matchDetails) return [50, 50];
    return calculateProbabilities(teamData.matchDetails);
  };

  // Get the under/over probabilities
  const [underProb, overProb] = getUnderOverProbabilities();
  
  // Calculate confidence level
  const { confidenceText, confidenceColor } = calculateConfidenceLevel(underProb, overProb);

  // Add under/over validation function
  const validateUnderOverPrediction = (prediction, status, homeScore, awayScore) => {
    if (status !== "Match Finished" && status !== "Match Finished After Extra Time") {
      return {
        backgroundColor: 'rgb(255, 180, 0)',
        color: 'white',
        border: 'none'
      };
    }

    const totalGoals = homeScore + awayScore;
    const predictionCorrect = prediction === "Over" ? totalGoals > 2.5 : totalGoals < 2.5;

    if (predictionCorrect) {
      return {
        backgroundColor: 'green',
        color: 'white',
        border: 'none'
      };
    }

    return {
      backgroundColor: 'white',
      color: 'red',
      border: '2px solid red'
    };
  };

  const renderFixture = (fixture) => {
    if (!fixture) return null;

    const [prediction, odds] = getUnderOverPrediction(fixture);
    const predictionStyle = validateUnderOverPrediction(
      prediction,
      fixture.status_long || 'NS',
      fixture.parsedScores?.fulltime?.home ?? 0,
      fixture.parsedScores?.fulltime?.away ?? 0
    );

    return (
      <div className="responsive-row" style={{ cursor: 'auto' }}>
        <div className="match-time-wrapper">
          <div className="match-time">
            {formatMatchTime(fixture.date)}
          </div>
        </div>
        <div className="league-info-wrapper">
          {(fixture.country_flag || fixture.logo) ? (
            <img 
              src={fixture.country_flag === "https://seekflag.com/app/uploads/2022/01/England-01-1.svg" 
                  ? "https://pngimg.com/uploads/england/england_PNG7.png" 
                  : fixture.country_flag === "https://seekflag.com/app/uploads/2022/01/Scotland-01-1.svg"
                    ? "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Flag_of_Scotland.svg/1200px-Flag_of_Scotland.svg.png"
                    : fixture.country_flag === "https://seekflag.com/app/uploads/2022/01/Wales-01-1.svg"
                      ? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Flag_of_Wales.svg/1200px-Flag_of_Wales.svg.png"
                      : fixture.country_flag === "https://seekflag.com/app/uploads/2021/11/Flag-of-Gabon-01-1.svg"
                        ? "https://upload.wikimedia.org/wikipedia/commons/0/04/Flag_of_Gabon.svg"
                        : fixture.country_flag === "https://seekflag.com/app/uploads/2022/01/Northern-Ireland-01-1.svg"
                          ? "https://cdn.britannica.com/92/3092-050-3A68D1DE/Flag-of-Northern-Ireland.jpg"
                    : fixture.country_flag || fixture.logo} 
              className="img-fluid league-logo" 
              alt={`${fixture.country_name}-football-predictions`} 
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'league-logo-fallback';
                fallback.style.cssText = 'width: 24px; height: 24px; border-radius: 4px; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: #333; border: 1px solid #ddd; margin-right: 8px;';
                fallback.textContent = fixture?.country_name?.charAt(0).toUpperCase() || 'C';
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
              {fixture?.country_name?.charAt(0).toUpperCase() || 'C'}
            </div>
          )}
          <span className="league-name">{fixture.league_name}</span>
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
          <div className="favorite-mobile" onClick={toggleFavorite}>
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
        <div className="responsive-cell" style={{ minWidth: '70px', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: prediction === 'Under' ? 'bold' : 'normal' }}>
                {underProb}%&nbsp;
              </span>
              <span style={{ fontWeight: prediction === 'Over' ? 'bold' : 'normal' }}>
                {overProb}%
              </span>
            </div>
            <div style={{ 
              fontSize: '8px', 
              marginTop: '2px', 
              padding: '1px 3px', 
              borderRadius: '3px', 
              backgroundColor: confidenceColor, 
              color: '#fff' 
            }}>
              {confidenceText} confidence
            </div>
          </div>
        </div>
        <div className="responsive-cell" title="Prediction" style={{ minWidth: '60px', textAlign: 'center' }}>
          <span className="m-1">
            {fixture && (
              <span className="number-circle rounded-square" 
                    style={{
                      ...predictionStyle,
                      minWidth: '55px',
                      display: 'inline-block',
                      textAlign: 'center',
                      padding: '3px 6px',
                      whiteSpace: 'nowrap',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      letterSpacing: '0.5px'
                    }}>
                {prediction === 'Over' ? 'OVER' : 'UNDER'}
              </span>
            )}
          </span>
        </div>
        <div className="responsive-cell hide-on-mobile" title="Average Goals">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>{fixture?.avg_performance || '-'}</div>
            <div style={{ fontSize: '10px', color: '#666' }}>
              {
                parseFloat(fixture?.avg_performance || 0) > 3.0 ? 'High-scoring' : 
                parseFloat(fixture?.avg_performance || 0) > 2.5 ? 'Above avg' : 
                parseFloat(fixture?.avg_performance || 0) > 2.0 ? 'Average' : 'Low-scoring'
              }
            </div>
          </div>
        </div>
        <div className="responsive-cell" title="Odds">
          <div className="odds-container">
            <div>{odds}</div>
          </div>
        </div>
        <div className="responsive-cell" title="Scores">
          <div className="score-container">
            <div className="match-status-wrapper">
              {fixture?.status_short === "FT" || fixture?.status_short === "ABD" ? (
                <span className="match-status">{fixture.status_short}</span>
              ) : ["2H", "1H", "INT", "HT", "LIVE"].includes(fixture?.status_short) ? (
                <div className="match-status-live">
                  {["1H", "2H"].includes(fixture.status_short) ? 
                    `${fixture.status_elapased}` :
                    fixture.status_short
                  }
                  {fixture.status_short !== "HT" && fixture.status_elapased && (
                    <span className="blink_text">&nbsp;'</span>
                  )}
                </div>
              ) : null}
            </div>
            <div className="scores-display">
              <span className={`${fixture?.parsedScores?.fulltime?.home !== null && fixture?.parsedScores?.fulltime?.home !== undefined ? 'scores-card' : 'no-score'} ${["2H", "1H", "INT", "HT", "LIVE"].includes(fixture?.status_short) ? 'live' : ''}`}>
                {fixture?.parsedScores?.fulltime?.home !== null && fixture?.parsedScores?.fulltime?.home !== undefined ? 
                  `${fixture.parsedScores.fulltime.home} - ${fixture.parsedScores.fulltime.away}` : 
                  '-'
                }
              </span>
              {fixture?.parsedScores?.halftime?.home !== null && fixture?.parsedScores?.halftime?.home !== undefined && (
                <span className="halfTimeDataDisplay">
                  {`(${fixture.parsedScores.halftime.home}-${fixture.parsedScores.halftime.away})`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {teamData?.matchDetails ? renderFixture(teamData.matchDetails) : <div>No match details available</div>}
    </>
  );
} 