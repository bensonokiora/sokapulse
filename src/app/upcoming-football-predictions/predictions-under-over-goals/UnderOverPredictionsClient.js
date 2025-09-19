'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { fetchUpcomingFixtures } from '@/utils/api';
import NavigationRow from '@/components/NavigationRow';
import { getUnderOverPrediction, calculateProbabilities, calculateConfidenceLevel, validatePrediction as validateUnderOver } from '@/utils/predictionUtils';
import { formatMatchTime } from '@/utils/dateUtils';
import LoadingAnimation from '@/components/LoadingAnimation';
import '@/styles/custom.css';

export default function UnderOverPredictionsClient({ 
  initialFixtures = [],
  initialSelectedDate,
  initialHasMore,
  initialNextCursor,
  initialError = null,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [fixtures, setFixtures] = useState(initialFixtures);
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [error, setError] = useState(initialError);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  const formatDateForApi = (date) => {
    if (!date) date = new Date();
    if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) return date;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dayString = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${dayString}`;
  };

  const fetchDataForDate = async (dateToFetch) => {
    setIsLoading(true);
    setError(null);
    setFixtures([]);
    setNextCursor('1');
    setHasMore(true);

    try {
      const formattedDate = formatDateForApi(dateToFetch);
      console.log('(Client-UO) Fetching initial fixtures for date:', formattedDate);
      const response = await fetchUpcomingFixtures(formattedDate, 20, '1');

      if (response.status === true && Array.isArray(response.data)) {
        setFixtures(response.data);
        setNextCursor(response.nextCursor);
        setHasMore(!!response.nextCursor);
      } else {
        console.error('(Client-UO) API error on date change:', response.message);
        setError(response.message || 'Failed to load fixtures');
        setFixtures([]);
        setHasMore(false);
        setNextCursor(null);
      }
    } catch (err) {
      console.error('(Client-UO) Fetch error on date change:', err);
      setError('Error loading fixtures');
      setFixtures([]);
      setHasMore(false);
      setNextCursor(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    window.history.pushState({}, '', `/upcoming-football-predictions/predictions-under-over-goals?date=${newDate}`);
    fetchDataForDate(newDate);
  };

  const loadMoreFixtures = async () => {
    if (isLoadingMore || !hasMore || !nextCursor) return;
    
    setIsLoadingMore(true);
    setError(null);
    
    try {
      const formattedDate = formatDateForApi(selectedDate);
      console.log(`(Client-UO) Loading more. Date: ${formattedDate}, Cursor: ${nextCursor}`);
      const response = await fetchUpcomingFixtures(formattedDate, 20, nextCursor);

      if (response.status === true && Array.isArray(response.data)) {
        const newFixtures = response.data.filter(
          (newFixture) => !fixtures.some((existing) => existing.fixture_id === newFixture.fixture_id)
        );
        setFixtures(prev => [...prev, ...newFixtures]);
        setNextCursor(response.nextCursor);
        setHasMore(!!response.nextCursor);
      } else {
        console.error('(Client-UO) API error on load more:', response.message);
        setError(response.message || 'Failed to load more fixtures');
        setHasMore(false);
        setNextCursor(null);
      }
    } catch (err) {
      console.error('(Client-UO) Error loading more fixtures:', err);
      setError('Error loading more fixtures');
      setHasMore(false);
      setNextCursor(null);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setFixtures(initialFixtures || []);
    setSelectedDate(initialSelectedDate || formatDateForApi(new Date()));
    setHasMore(initialHasMore || false);
    setNextCursor(initialNextCursor || null);
    setError(initialError || null);
    setIsLoading(false);
    setIsLoadingMore(false);
  }, [initialFixtures, initialSelectedDate, initialHasMore, initialNextCursor, initialError]);

  useEffect(() => {
    const favoriteData = JSON.parse(localStorage.getItem('mymatchesdata'));
    if (favoriteData?.dataArray) {
      const states = {};
      favoriteData.dataArray.forEach(item => {
        states[item.fixture_id] = true;
      });
      setFavoriteStates(states);
    }
    const handleStorageChange = () => {
        const updatedFavoriteData = JSON.parse(localStorage.getItem('mymatchesdata'));
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
        <Link href="/upcoming-football-predictions" className="match-details-nav-link">
          <span>1x2</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/upcoming-football-predictions/double-chance-predictions" className="match-details-nav-link">
          <span>Double Chance</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/upcoming-football-predictions/predictions-under-over-goals" className="match-details-nav-link active">
          <span>Under/Over 2.5</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/upcoming-football-predictions/predictions-both-team-to-score" className="match-details-nav-link">
          <span>BTTS</span>
        </Link>
      </div>
    </div>
  );

  const validateDisplayPrediction = (prediction, scores, status) => {
    if (status !== "Match Finished" && status !== "Match Finished After Extra Time" && status !== "FT" && status !== "AET" && status !== "PEN") {
      return {
        backgroundColor: 'rgb(255, 180, 0)',
        color: 'white',
        border: 'none'
      };
    }
    try {
      const homeScore = parseInt(scores?.fulltime?.home) || 0;
      const awayScore = parseInt(scores?.fulltime?.away) || 0;
      const totalGoals = homeScore + awayScore;
      let predictionCorrect = false;
      if (prediction.toUpperCase() === "OVER") {
        predictionCorrect = totalGoals > 2.5;
      } else {
        predictionCorrect = totalGoals < 2.5;
      }
      if (predictionCorrect) {
        return { backgroundColor: '#00a651', color: 'white', border: 'none' };
      } else {
        return { backgroundColor: '#cc0000', color: 'white', border: 'none' };
      }
    } catch (error) {
      console.error('Error validating display prediction:', error);
      return { backgroundColor: 'white', color: 'black', border: '1px solid black' };
    }
  };

  const renderFixturesHeader = () => (
    <div className="responsive-row header-size" style={{ fontWeight: 'bold', textAlign: 'left', cursor: 'auto' }}>
      <div className="responsive-cell"></div>
      
      <div className="responsive-cell team-link-probability" style={{ textAlign: 'left', fontWeight: 'bold' }}>
        <span>Teams</span><br />
      </div>
      <div className="responsive-cell team-link-probability" style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
        <span>&nbsp;{isMobile ? 'Probs' : 'Probability %'} </span><br />
        <span>Under/Over 2.5</span>
      </div>
      <div className="responsive-cell">{isMobile ? 'Pred' : 'Prediction'}</div>
      <div className="responsive-cell hide-on-mobile">
        <div>Avg goals</div>
        <div style={{ fontSize: '10px', fontWeight: 'normal' }}>Expected</div>
      </div>
      <div className="responsive-cell">
        <div>Odds</div>
      </div>
      <div className="responsive-cell">
        <div className="row">
          <div className="col-md-12 col-sm-12 col-xs-12">Scores</div>
        </div>
      </div>
    </div>
  );

  const renderFixture = (fixture) => {
    try {
      let prediction = 'Under';
      let odd = '0.00';
      let displayAvgGoals = 0;

      if (fixture.goals_over_under && typeof fixture.goals_over_under === 'string' && fixture.goals_over_under !== "null") {
        try {
          const predictionResult = getUnderOverPrediction(fixture);
          if (predictionResult) {
            prediction = predictionResult[0] || 'Under';
            odd = predictionResult[1] || '0.00';
            displayAvgGoals = predictionResult[2] || 0;
          }
        } catch (err) {
          console.error('Error getting under/over prediction for fixture:', fixture.fixture_id, err);
        }
      } else {
        console.warn('Invalid or missing goals_over_under for prediction on fixture:', fixture.fixture_id);
      }
      
      let underProb = 50;
      let overProb = 50;
       try {
        if (fixture.goals_over_under && typeof fixture.goals_over_under === 'string' && fixture.goals_over_under !== "null") {
          const probResult = calculateProbabilities(fixture);
          if (probResult) {
            underProb = probResult[0] || 50;
            overProb = probResult[1] || 50;
          }
        } else {
          console.warn('Invalid or missing goals_over_under for fixture:', fixture.fixture_id);
        }
      } catch (err) {
        console.error('Error calculating probabilities for fixture:', fixture.fixture_id, err);
      }

      const scoresString = fixture.scores || '{}';
      let scores = {};
      try {
          scores = JSON.parse(scoresString);
      } catch (e) {
          console.warn("Failed to parse scores for fixture_id:", fixture.fixture_id, scoresString);
          scores = { fulltime: { home: null, away: null }, halftime: { home: null, away: null } };
      } 

      const predictionStyle = validateDisplayPrediction(prediction, scores, fixture.status_long);
      const isFavorite = favoriteStates[fixture.fixture_id] || false;

      const { confidenceText, confidenceColor } = calculateConfidenceLevel(underProb, overProb) || {
        confidenceText: 'Low',
        confidenceColor: '#ff4444'
      };

      const toggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const newState = !isFavorite;
        const favoriteData = JSON.parse(localStorage.getItem('mymatchesdata')) || { dataArray: [] };

        setFavoriteStates(prev => ({
          ...prev,
          [fixture.fixture_id]: newState
        }));

        if (newState) {
          favoriteData.dataArray.push({ fixture_id: fixture.fixture_id });
        } else {
          favoriteData.dataArray = favoriteData.dataArray.filter(
            item => item.fixture_id !== fixture.fixture_id
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
                    : fixture.country_flag || fixture.logo} className="img-fluid league-logo" alt={`${fixture.country_name}-football-predictions`} loading="lazy" />
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
            <Link href={`/football-predictions/fixture/${fixture.home_team_name.toLowerCase().replace(/\s+/g, '-')}-vs-${fixture.away_team_name.toLowerCase().replace(/\s+/g, '-')}-${fixture.fixture_id}`}>
              <div className="teamNameLink">
                <span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.home_team_name}</span><br />
                <span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.away_team_name}</span>
              </div>
            </Link>
          </div>
          <div className="responsive-cell" style={{ minWidth: '70px', textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: prediction === 'Under' ? 'bold' : 'normal' }}>{underProb}%</span>&nbsp;
                <span style={{ fontWeight: prediction === 'Over' ? 'bold' : 'normal' }}>{overProb}%</span>
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
          <div className="responsive-cell" title="Prediction" style={{ minWidth: '65px', textAlign: 'center' }}>
            <span className="m-1">
              <span className="number-circle rounded-square" style={{
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
            </span>
          </div>
          <div className="responsive-cell hide-on-mobile" title="Average Goals">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div>{displayAvgGoals.toFixed(2)}</div>
              <div style={{ fontSize: '10px', color: '#666' }}>
                {
                  displayAvgGoals > 3.0 ? 'High-scoring' : 
                  displayAvgGoals > 2.5 ? 'Above avg' : 
                  displayAvgGoals > 2.0 ? 'Average' : 'Low-scoring'
                }
              </div>
            </div>
          </div>
          <div className="responsive-cell" title="Odds">
            <div className="odds-container">
              <div>{odd}</div>
            </div>
          </div>
          <div className="responsive-cell" title="Scores">
            <div className="score-container">
              <div className="match-status-wrapper">
                {fixture.status_short === "FT" || fixture.status_short === "ABD" ? (
                  <span className="match-status">{fixture.status_short}</span>
                ) : ["2H", "1H", "INT", "HT", "LIVE"].includes(fixture.status_short) ? (
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
                <span className={`${scores.fulltime.home !== null ? 'scores-card' : 'no-score'} ${["2H", "1H", "INT", "HT", "LIVE"].includes(fixture.status_short) ? 'live' : ''}`} id="fulltimeGoals">
                  {scores.fulltime.home !== null ? `${scores.fulltime.home} - ${scores.fulltime.away}` : '-'}
                </span>
                {scores.halftime.home !== null && (
                  <span className="halfTimeDataDisplay">
                    {`(${scores.halftime.home}-${scores.halftime.away})`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error rendering fixture:', error);
      return null;
    }
  };

  return (
    <>
      <NavigationRow selectedDate={selectedDate} onDateChange={handleDateChange} />
      {renderPredictionNav()}
      {renderFixturesHeader()}
      
      {isLoading ? (
        <div className="loading-container flex justify-center items-center w-full h-64">
          <LoadingAnimation text="Loading matches..." />
        </div>
      ) : error ? (
        <div className="error-message text-center p-4 text-red-500">{error}</div>
      ) : fixtures.length === 0 ? (
        <div className="no-fixtures-message text-center p-4 text-gray-500">No Under/Over 2.5 predictions available for {selectedDate}</div>
      ) : (
        <>
          {fixtures.map((fixture, index) => (
            <div key={fixture.fixture_id || fixture.id || index}>
              {renderFixture(fixture)}
            </div>
          ))}
        </>
      )}
      {hasMore && !isLoadingMore && !isLoading && (
        <div className="load-more text-center p-4">
          <button 
            className="btn btn-success btn-sm px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            onClick={loadMoreFixtures}
            disabled={isLoadingMore || isLoading} 
          >
            {'Load More Matches'}
          </button>
        </div>
      )}
      {isLoadingMore && (
        <div className="flex justify-center items-center w-full h-20 my-4"><LoadingAnimation size={100} text="Loading more..." /></div>
      )}
    </>
  );
} 