'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaInfoCircle, FaStar } from 'react-icons/fa';
import NavigationRow from '@/components/NavigationRow';
import LoadingAnimation from '@/components/LoadingAnimation';
import '../../../styles/custom.css';
import { getUnderOverPrediction, calculateExpectedGoals, calculateProbabilities, calculateConfidenceLevel } from '@/utils/predictionUtils';
import { formatMatchTime } from '@/utils/dateUtils';
import { fetchFixturesByDatePaginated } from '@/utils/api';

export default function UnderOverPredictionsClient({ 
  initialFixtures = [], 
  initialError = null,
  initialNextCursor = null,
  perPage = 20
}) {
  const [isLoading, setIsLoading] = useState(!initialFixtures || initialFixtures.length === 0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [fixtures, setFixtures] = useState(initialFixtures || []);
  
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };
  
  const [selectedDate, setSelectedDate] = useState(getTomorrowDate());
  const [error, setError] = useState(initialError);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [allFixtures, setAllFixtures] = useState(initialFixtures || []);
  const [isMobile, setIsMobile] = useState(false);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);
  const [hasMore, setHasMore] = useState(!!initialNextCursor);
  const [currentNextCursor, setCurrentNextCursor] = useState(initialNextCursor);

  const formatDate = (date) => {
    if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date;
    }
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      const today = new Date();
      return today.toISOString().split('T')[0];
    }
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setFixtures(initialFixtures || []);
    setAllFixtures(initialFixtures || []);
    setError(initialError);
    setCurrentNextCursor(initialNextCursor);
    setHasMore(!!initialNextCursor);
    if (initialFixtures && initialFixtures.length > 0) {
        setIsLoading(false);
    } else if (initialError) {
        setIsLoading(false);
    }
  }, [initialFixtures, initialError, initialNextCursor]);

  const loadMoreFixtures = useCallback(async () => {
    if (isLoadingMore || !hasMore || !currentNextCursor) return;
    
    setIsLoadingMore(true);
    setError(null);
    
    try {
      const formattedDate = formatDate(selectedDate);
      const apiResponse = await fetchFixturesByDatePaginated(formattedDate, perPage, currentNextCursor);
      
      if (apiResponse.status === true && Array.isArray(apiResponse.fixtures)) {
        const newFixtures = apiResponse.fixtures;
        
        setAllFixtures(prevAll => {
          const existingFixtureIds = new Set(prevAll.map(f => f.fixture_id));
          const uniqueNewFixtures = newFixtures.filter(f => !existingFixtureIds.has(f.fixture_id));
          return [...prevAll, ...uniqueNewFixtures];
        });

        setFixtures(prevFixturesList => {
            const existingFixtureIds = new Set(prevFixturesList.map(f => f.fixture_id));
            const uniqueNewFixtures = newFixtures.filter(f => !existingFixtureIds.has(f.fixture_id));
            return [...prevFixturesList, ...uniqueNewFixtures];
        });

        setCurrentNextCursor(apiResponse.nextCursor);
        setHasMore(!!apiResponse.nextCursor);
      } else {
        setError(apiResponse.message || 'Failed to load more fixtures');
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching more fixtures:', err);
      setError('Error loading more fixtures');
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, currentNextCursor, selectedDate, perPage]);

  const handleDateChange = async (e) => {
    const newDateString = e.target.value;
    setSelectedDate(new Date(newDateString + 'T00:00:00'));
    setIsLoading(true);
    setFixtures([]);
    setAllFixtures([]);
    setError(null);
    
    try {
      const formattedDate = formatDate(newDateString);
      const apiResponse = await fetchFixturesByDatePaginated(formattedDate, perPage, '1');
      
      if (apiResponse.status === true && Array.isArray(apiResponse.fixtures)) {
        setAllFixtures(apiResponse.fixtures);
        setFixtures(apiResponse.fixtures);
        setCurrentNextCursor(apiResponse.nextCursor);
        setHasMore(!!apiResponse.nextCursor);
        setError(null);
      } else {
        setError(apiResponse.message || 'Failed to load fixtures');
        setFixtures([]);
        setAllFixtures([]);
        setHasMore(false);
        setCurrentNextCursor(null);
      }
    } catch (err) {
      console.error('Error fetching fixtures for new date:', err);
      setError('Error loading fixtures for the selected date');
      setFixtures([]);
      setAllFixtures([]);
      setHasMore(false);
      setCurrentNextCursor(null);
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const validatePrediction = (prediction, scores, status) => {
    if (status !== "Match Finished" && status !== "Match Finished After Extra Time") {
      return {
        backgroundColor: 'rgb(255, 180, 0)',
        color: 'white',
        border: 'none'
      };
    }

    try {
      const homeScore = parseInt(scores.fulltime.home) || 0;
      const awayScore = parseInt(scores.fulltime.away) || 0;
      const totalGoals = homeScore + awayScore;
      
      const homeHalfScore = parseInt(scores.halftime.home) || 0;
      const awayHalfScore = parseInt(scores.halftime.away) || 0;
      const halfTimeGoals = homeHalfScore + awayHalfScore;
      
      let predictionCorrect = false;
      
      if (prediction === "Over") {
        predictionCorrect = totalGoals > 2.5;
        
        if (predictionCorrect) {
          return {
            backgroundColor: '#00a651',
            color: 'white',
            border: 'none'
          };
        } else if (totalGoals === 2) {
          return {
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            opacity: '0.9'
          };
        } else {
          return {
            backgroundColor: '#cc0000',
            color: 'white',
            border: 'none'
          };
        }
      } else {
        predictionCorrect = totalGoals < 2.5;
        
        if (predictionCorrect) {
          return {
            backgroundColor: '#00a651',
            color: 'white',
            border: 'none'
          };
        } else if (totalGoals === 3) {
          return {
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            opacity: '0.9'
          };
        } else {
          return {
            backgroundColor: '#cc0000',
            color: 'white',
            border: 'none'
          };
        }
      }
    } catch (error) {
      console.error('Error validating prediction:', error);
      return {
        backgroundColor: 'white',
        color: 'black',
        border: '1px solid black'
      };
    }
  };

  const renderPredictionNav = () => (
    <div className="match-details-navigation">
      <div className="match-details-nav-item">
        <Link href="/tomorrow-football-predictions" className="match-details-nav-link">
          <span>1x2</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/tomorrow-football-predictions/double-chance-predictions" className="match-details-nav-link">
          <span>Double Chance</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/tomorrow-football-predictions/predictions-under-over-goals" className="match-details-nav-link active">
          <span>Under/Over 2.5</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/tomorrow-football-predictions/predictions-both-team-to-score" className="match-details-nav-link">
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
    const [prediction, odd, avgGoals] = getUnderOverPrediction(fixture);
    const [underProb, overProb] = calculateProbabilities(fixture);
    const scores = JSON.parse(fixture.scores);
    const predictionStyle = validatePrediction(prediction, scores, fixture.status_long);
    const isFavorite = favoriteStates[fixture.fixture_id] || false;

    const { confidenceText, confidenceColor } = calculateConfidenceLevel(underProb, overProb);

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
            <div>{avgGoals.toFixed(2)}</div>
            <div style={{ fontSize: '10px', color: '#666' }}>
              {
                avgGoals > 3.0 ? 'High-scoring' : 
                avgGoals > 2.5 ? 'Above avg' : 
                avgGoals > 2.0 ? 'Average' : 'Low-scoring'
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
  };

  const renderPredictionExplanation = () => (
    <div className="responsive-row" style={{ 
      padding: '10px', 
      marginTop: '10px',
      marginBottom: '10px', 
      backgroundColor: '#f8f9fa', 
      borderRadius: '5px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div className="col-12" style={{ fontSize: '14px' }}>
        <div 
          onClick={() => setIsExplanationVisible(!isExplanationVisible)}
          style={{ 
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <p style={{ 
            fontWeight: 'bold', 
            marginBottom: '5px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            Enhanced Prediction System 📊
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 16 16" 
              style={{ 
                transform: isExplanationVisible ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.3s ease'
              }}
            >
              <path 
                fill="currentColor" 
                d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
              />
            </svg>
          </p>
        </div>
        
        {isExplanationVisible && (
          <>
            <p style={{ marginBottom: '8px' }}>
              Our AI-powered algorithm analyzes team performance, head-to-head statistics, and betting market data 
              to deliver accurate Under/Over 2.5 goals predictions.
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '5px' }}>
              <div>
                <span style={{ fontWeight: 'bold', fontSize: '12px' }}>Confidence Levels:</span>
                <div style={{ display: 'flex', gap: '5px', marginTop: '3px' }}>
                  <span style={{ fontSize: '11px', padding: '2px 5px', backgroundColor: '#5cb85c', color: 'white', borderRadius: '3px' }}>High</span>
                  <span style={{ fontSize: '11px', padding: '2px 5px', backgroundColor: '#f0ad4e', color: 'white', borderRadius: '3px' }}>Medium</span>
                  <span style={{ fontSize: '11px', padding: '2px 5px', backgroundColor: '#d9534f', color: 'white', borderRadius: '3px' }}>Low</span>
                </div>
              </div>
              
              <div>
                <span style={{ fontWeight: 'bold', fontSize: '12px' }}>Prediction Status:</span>
                <div style={{ display: 'flex', gap: '5px', marginTop: '3px' }}>
                  <span style={{ fontSize: '11px', padding: '2px 5px', backgroundColor: '#00a651', color: 'white', borderRadius: '3px' }}>Correct</span>
                  <span style={{ fontSize: '11px', padding: '2px 5px', backgroundColor: '#ff4444', color: 'white', borderRadius: '3px' }}>Close</span>
                  <span style={{ fontSize: '11px', padding: '2px 5px', backgroundColor: '#cc0000', color: 'white', borderRadius: '3px' }}>Wrong</span>
                  <span style={{ fontSize: '11px', padding: '2px 5px', backgroundColor: 'rgb(255, 180, 0)', color: 'black', borderRadius: '3px' }}>Pending</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>
      <div className="col-lg-12" style={{ height: 'auto !important' }}>
        <NavigationRow selectedDate={selectedDate} onDateChange={handleDateChange} />
        <div className="responsive-row" style={{ textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)', marginLeft: '1px', borderRadius: '5px', cursor: 'auto' }}>
          <div className="table-cell">
            <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>Free Football Under/Over 2.5 Goals Predictions</h1>
          </div>
        </div>
        {renderPredictionNav()}
        {renderPredictionExplanation()}
        {renderFixturesHeader()}
        {isLoading ? (
          <div className="loading-container">
            <LoadingAnimation text="Loading matches..." />
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : fixtures.length === 0 ? (
          <div className="no-fixtures-message">No fixtures available for this date</div>
        ) : (
          <>
            {fixtures.map((fixture, index) => (
              <div key={fixture.fixture_id}>
                {renderFixture(fixture)}
              </div>
            ))}
            
            {hasMore && (
              <div className="load-more" style={{ textAlign: 'center', margin: '20px 0' }}>
                <button 
                  className="btn btn-success btn-sm"
                  onClick={loadMoreFixtures}
                  disabled={isLoadingMore}
                  style={{ padding: '8px 20px', fontSize: '14px' }}
                >
                  {isLoadingMore ? 'Loading...' : 'Load More Matches'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 