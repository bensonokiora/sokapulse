'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { fetchWeekendFixtures } from '@/utils/api';
import LoadingAnimation from '@/components/LoadingAnimation';
import { getDoubleChancePrediction, getDoubleChanceProb, validateDoubleChancePrediction } from '@/utils/doubleChancePredictionUtils';
import { formatMatchTime } from '@/utils/dateUtils';
import '../../../styles/custom.css'; // Adjusted path assuming it's in an `app` subfolder

export default function DoubleChancePredictionsClient({ 
  initialFixtures,
  initialDate, // This is the reference date for the weekend API call
  initialHasMore,
  initialNextCursor,
  initialError,
}) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [fixtures, setFixtures] = useState(initialFixtures || []);
  // The date for weekend fixtures is fixed based on what the server determined.
  const [date, setDate] = useState(initialDate);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [hasMore, setHasMore] = useState(initialHasMore || false);
  const [error, setError] = useState(initialError || null);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Effect to initialize state from props
  useEffect(() => {
    setFixtures(initialFixtures || []);
    setDate(initialDate); // Set the fixed date for the weekend
    setHasMore(initialHasMore || false);
    setNextCursor(initialNextCursor || null);
    setError(initialError || null);
    setIsLoadingMore(false); // Ensure loading more is reset
  }, [initialFixtures, initialDate, initialHasMore, initialNextCursor, initialError]);

  const loadMoreFixtures = async () => {
    if (isLoadingMore || !hasMore || !nextCursor) return;
    
    setIsLoadingMore(true);
    setError(null);
    
    try {
      // Use the 'date' state which holds the reference date for the weekend API call
      console.log(`(Client-DC Weekend) Loading more. Date: ${date}, Cursor: ${nextCursor}`);
      const response = await fetchWeekendFixtures(date, 20, nextCursor); // Fetch 20 items per page

      if (response.status === true && Array.isArray(response.data)) {
        const newFixtures = response.data.filter(
          (newFixture) => !fixtures.some((existing) => existing.fixture_id === newFixture.fixture_id)
        );
        setFixtures(prev => [...prev, ...newFixtures]);
        setNextCursor(response.nextCursor);
        setHasMore(!!response.nextCursor);
      } else {
        console.error('(Client-DC Weekend) API error on load more:', response.message);
        setError(response.message || 'Failed to load more fixtures');
        setHasMore(false);
        setNextCursor(null);
      }
    } catch (err) {
      console.error('(Client-DC Weekend) Error loading more fixtures:', err);
      setError('Error loading more fixtures');
      setHasMore(false);
      setNextCursor(null);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const favoriteData = JSON.parse(localStorage.getItem('mymatchesdata') || '{ "dataArray": [] }');
    if (favoriteData?.dataArray) {
      const states = {};
      favoriteData.dataArray.forEach(item => {
        states[item.fixture_id] = true;
      });
      setFavoriteStates(states);
    }

    const handleStorageChange = () => {
        const updatedFavoriteData = JSON.parse(localStorage.getItem('mymatchesdata') || '{ "dataArray": [] }');
        const newStates = {};
        if (updatedFavoriteData?.dataArray) {
            updatedFavoriteData.dataArray.forEach(item => {newStates[item.fixture_id] = true;});
        }
        setFavoriteStates(newStates);
    };
    window.addEventListener('storage', handleStorageChange);

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
        window.removeEventListener('resize', checkIfMobile);
        window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  const renderPredictionNav = () => (
    <div className="match-details-navigation">
      <div className="match-details-nav-item">
        <Link href="/weekend-football-predictions" className="match-details-nav-link">
          <span>1x2</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/weekend-football-predictions/double-chance-predictions" className="match-details-nav-link active">
          <span>Double Chance</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/weekend-football-predictions/predictions-under-over-goals" className="match-details-nav-link">
          <span>Under/Over 2.5</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/weekend-football-predictions/predictions-both-team-to-score" className="match-details-nav-link">
          <span>BTTS</span>
        </Link>
      </div>
    </div>
  );

  const renderFixturesHeader = () => (
    <div className="responsive-row header-size" style={{ fontWeight: 'bold', textAlign: 'left', cursor: 'auto' }}>
      <div className="responsive-cell"></div>
      <div className="responsive-cell team-link-probability" style={{ textAlign: 'left', fontWeight: 'bold' }}>
        <span>Teams</span><br />
      </div>
      <div className="responsive-cell team-link-probability" style={{ whiteSpace: 'pre-wrap', fontWeight: 'bold' }}>
      <span>&nbsp;{isMobile ? 'Probs' : 'Probability %'} </span><br />
      <span>1X / X2 / 12</span>
      </div>
      <div className="responsive-cell">{isMobile ? 'Pred' : 'Prediction'}</div>
      <div className="responsive-cell hide-on-mobile">Avg<br/>goals</div>
      <div className="responsive-cell">Odds</div>
      <div className="responsive-cell">
        <div className="row">
          <div className="col-md-12 col-sm-12 col-xs-12">Scores</div>
        </div>
      </div>
    </div>
  );

  const renderFixture = (fixture, index) => {
    const scoresString = fixture.scores || '{}';
    let scores = {};
    try {
        scores = JSON.parse(scoresString);
    } catch (e) {
        console.warn("Failed to parse scores for fixture_id:", fixture.fixture_id, scoresString);
        scores = { fulltime: { home: null, away: null }, halftime: { home: null, away: null } };
    }

    const homePlayed = parseInt(fixture.teams_games_played_home || 0);
    const awayPlayed = parseInt(fixture.teams_games_played_away || 0);
    const totalPlayed = homePlayed + awayPlayed;

    const avgGoals = fixture.avg_performance ? parseFloat(fixture.avg_performance).toFixed(2) : 
      (totalPlayed > 0 ? ((parseInt(fixture.teams_perfomance_home_for || 0) + parseInt(fixture.teams_perfomance_home_aganist || 0) + 
        parseInt(fixture.teams_perfomance_away_for || 0) + parseInt(fixture.teams_perfomance_away_aganist || 0)) / 
       totalPlayed).toFixed(2) : '0.00');

    const predictionResult = getDoubleChancePrediction(
      fixture.percent_pred_home?.replace('%', '') || '0',
      fixture.percent_pred_draw?.replace('%', '') || '0',
      fixture.percent_pred_away?.replace('%', '') || '0',
      fixture.double_chance_goals
    );
    
    const homeGoals = scores?.fulltime?.home;
    const awayGoals = scores?.fulltime?.away;
    
    const predictionStyle = validateDoubleChancePrediction(
      predictionResult.prediction,
      fixture.status_short,
      homeGoals,
      awayGoals
    );
    
    const doubleChanceProb = getDoubleChanceProb(
      fixture.percent_pred_home?.replace('%', '') || '0',
      fixture.percent_pred_draw?.replace('%', '') || '0',
      fixture.percent_pred_away?.replace('%', '') || '0'
    );

    const isFavorite = favoriteStates[fixture.fixture_id] || false;

    const toggleFavorite = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const fixtureId = fixture.fixture_id;
      const newState = !isFavorite;
      let favoriteData = { dataArray: [] };
      try {
          const storedData = localStorage.getItem('mymatchesdata');
          if (storedData) {
              favoriteData = JSON.parse(storedData);
              if (!Array.isArray(favoriteData.dataArray)) {
                  favoriteData.dataArray = [];
              }
          } 
      } catch (parseError) {
          console.error("Error parsing favorites from localStorage:", parseError);
          favoriteData = { dataArray: [] }; // Reset
      }

      setFavoriteStates(prev => ({ ...prev, [fixtureId]: newState }));

      if (newState) {
          if (!favoriteData.dataArray.some(item => item.fixture_id === fixtureId)) {
              favoriteData.dataArray.push({ fixture_id: fixtureId });
          }
      } else {
          favoriteData.dataArray = favoriteData.dataArray.filter(
              item => item.fixture_id !== fixtureId
          );
      }

      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      favoriteData.expiry = expiry.getTime();

      try {
          localStorage.setItem('mymatchesdata', JSON.stringify(favoriteData));
          window.dispatchEvent(new Event('storage'));
      } catch (storageError) {
          console.error("Error saving favorites to localStorage:", storageError);
      }
  };

    return (
      <div key={fixture.fixture_id || index} className="responsive-row" style={{ cursor: 'auto' }}>
        <div className="match-time-wrapper">
          <div className="match-time">
            {formatMatchTime(fixture.date)}
          </div>
        </div>
        <div className="league-info-wrapper">
          <img src={fixture.country_flag === "https://seekflag.com/app/uploads/2022/01/England-01-1.svg" 
              ? "https://pngimg.com/uploads/england/england_PNG7.png" 
              : fixture.country_flag === "https://seekflag.com/app/uploads/2022/01/Scotland-01-1.svg"
                ? "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Flag_of_Scotland.svg/1200px-Flag_of_Scotland.svg.png"
                : fixture.country_flag === "https://seekflag.com/app/uploads/2022/01/Wales-01-1.svg"
                  ? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Flag_of_Wales.svg/1200px-Flag_of_Wales.svg.png"
                  : fixture.country_flag === "https://seekflag.com/app/uploads/2021/11/Flag-of-Gabon-01-1.svg"
                    ? "https://upload.wikimedia.org/wikipedia/commons/0/04/Flag_of_Gabon.svg"
                    : fixture.country_flag === "https://seekflag.com/app/uploads/2022/01/Northern-Ireland-01-1.svg"
                      ? "https://cdn.britannica.com/92/3092-050-3A68D1DE/Flag-of-Northern-Ireland.jpg"
                : fixture.country_flag || fixture.logo} className="img-fluid league-logo" alt={`${fixture.country_name || 'League'}-football-predictions`} loading="lazy" onError={(e) => e.target.style.display='none'} />
          <span className="league-name">{fixture.league_name || 'Unknown League'}</span>
        </div>
        <div className="responsive-cell favorite-cell">
          <div className="favorite-icon" onClick={toggleFavorite} title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
            <svg xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                fill={isFavorite ? "red" : "currentColor"} 
                className={`bi bi-star-fill ${isFavorite ? 'favorite-active' : ''}`} 
                viewBox="0 0 16 16">
              <path d={isFavorite ? 
                "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" :
                "M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"} 
              />
            </svg>
          </div>
        </div>
        <div className="responsive-cell team-link" title="Click to open match details">
          <Link href={`/football-predictions/fixture/${fixture.home_team_name?.toLowerCase().replace(/\s+/g, '-')}-vs-${fixture.away_team_name?.toLowerCase().replace(/\s+/g, '-')}-${fixture.fixture_id}`}>
            <div className="teamNameLink">
              <span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.home_team_name || 'Home'}</span><br />
              <span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.away_team_name || 'Away'}</span>
            </div>
          </Link>
        </div>
        <div className="responsive-cell team-link-probability" style={{ whiteSpace: 'nowrap' }}>
          <span>{doubleChanceProb.value}%</span>
        </div>
        <div className="responsive-cell" title="Prediction">
          <span className="m-1">
            <span className="number-circle rounded-square" style={predictionStyle}>
              {predictionResult.prediction}
            </span>
          </span>
        </div>
        <div className="responsive-cell hide-on-mobile" title="Average Goals">{avgGoals}</div>
        <div className="responsive-cell" title="Odds">
          <div className="odds-container">
            {(() => {
              let odds = [];
              try {
                odds = JSON.parse(fixture.double_chance_goals || '[]');
                if (!Array.isArray(odds)) {
                  odds = [];
                }
              } catch (err) {
                console.error('Error parsing double_chance_goals:', err);
                odds = [];
              }
              
              return odds.slice(0, 3).map((odd, i) => (
                <div key={i} style={{ fontWeight: predictionResult.prediction === ['1X', 'X2', '12'][i] ? 'bold' : 'normal' }}>
                  {odd.odd || '-'}
                </div>
              ));
            })()}
          </div>
        </div>
        <div className="responsive-cell" title="Scores">
          <div className="score-container">
            <div className="match-status-wrapper">
              {fixture.status_short === "FT" || fixture.status_short === "ABD" ? (
                <span className="match-status">{fixture.status_short}</span>
              ) : ["2H", "1H", "INT", "HT", "LIVE"].includes(fixture.status_short) ? (
                <div className="match-status-live">
                  {["1H", "2H"].includes(fixture.status_short) && fixture.status_elapased ? 
                    `${fixture.status_elapased}'` :
                    fixture.status_short
                  }
                  {fixture.status_short !== "HT" && ["1H", "2H", "LIVE"].includes(fixture.status_short) && <span className="blink_text">&nbsp;&#x25CF;</span>}
                </div>
              ) : null}
            </div>
            <div className="scores-display">
              <span className={`${scores?.fulltime?.home !== null ? 'scores-card' : 'no-score'} ${["2H", "1H", "INT", "HT", "LIVE"].includes(fixture.status_short) ? 'live' : ''}`}>
                {scores?.fulltime?.home !== null ? `${scores.fulltime.home} - ${scores.fulltime.away}` : '-'}
              </span>
              {scores?.halftime?.home !== null && fixture.status_short !== 'NS' && (
                <span className="halfTimeDataDisplay">
                {`(${scores.halftime.home}-${scores.halftime.away})`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderPredictionNav()} {/* Render the prediction type navigation */}
      {/* Title was moved to page.js */}
      {renderFixturesHeader()}
      
      {error && <div className="error-message text-center p-4 text-red-500">{error}</div>}
      {!error && fixtures.length === 0 && !isLoadingMore && (
        <div className="no-fixtures-message text-center p-4 text-gray-500">No weekend double chance predictions available.</div>
      )}
      
      {fixtures.map((fixture, index) => renderFixture(fixture, index))}
      
      {isLoadingMore && (
        <div className="loading-container flex justify-center items-center w-full h-20 my-4">
          <LoadingAnimation text="Loading more matches..." />
        </div>
      )}
      {hasMore && !isLoadingMore && (
        <div className="load-more text-center p-4">
          <button 
            className="btn btn-success btn-sm px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            onClick={loadMoreFixtures}
            disabled={isLoadingMore} 
          >
            Load More Weekend Double Chance Matches
          </button>
        </div>
      )}
       {!hasMore && fixtures.length > 0 && !isLoadingMore && !error && (
        <div className="text-center p-4 text-gray-500">All weekend double chance matches for this period are loaded.</div>
      )}
    </div>
  );
} 