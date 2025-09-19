'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { fetchWeekendFixtures } from '@/utils/api';
import LoadingAnimation from '@/components/LoadingAnimation';
import { getUnderOverPrediction, calculateExpectedGoals, calculateProbabilities, calculateConfidenceLevel } from '@/utils/predictionUtils';
import { formatMatchTime } from '@/utils/dateUtils';

export default function UnderOverPredictionsClient({ 
  initialFixtures, 
  initialError,
  initialNextCursor = null,
  perPage = 20 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [fixtures, setFixtures] = useState(initialFixtures || []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(initialError || null);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [hasMore, setHasMore] = useState(!!initialNextCursor);
  const [currentNextCursor, setCurrentNextCursor] = useState(initialNextCursor);
  const [loadMoreError, setLoadMoreError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);

  const formatDate = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return '';
    }
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const loadMoreFixtures = useCallback(async () => {
    if (isLoadingMore || !hasMore || !currentNextCursor) return;
    
    setIsLoadingMore(true);
    setLoadMoreError(null);
    
    try {
      const formattedDate = formatDate(selectedDate);
      const apiResponse = await fetchWeekendFixtures(formattedDate, perPage, currentNextCursor);
      
      if (apiResponse.status === true && Array.isArray(apiResponse.data)) {
        const newFixtures = apiResponse.data;
        
        // Filter out duplicates when adding new fixtures
        setFixtures(prevFixtures => {
          const existingFixtureIds = new Set(prevFixtures.map(f => f.fixture_id));
          const uniqueNewFixtures = newFixtures.filter(f => !existingFixtureIds.has(f.fixture_id));
          return [...prevFixtures, ...uniqueNewFixtures];
        });

        setCurrentNextCursor(apiResponse.nextCursor);
        setHasMore(!!apiResponse.nextCursor);
      } else {
        console.error('API error while loading more fixtures:', apiResponse.message);
        setLoadMoreError(apiResponse.message || 'Failed to load more fixtures');
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching more fixtures:', err);
      setLoadMoreError('Error loading more fixtures');
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, currentNextCursor, selectedDate, perPage]);

  const fetchFixtures = async (date) => {
    setIsLoading(true);
    setError(null);
    setLoadMoreError(null);
    
    try {
      // Reset pagination data
      setCurrentNextCursor('1');
      setHasMore(true);
      
      // Fetch first page of fixtures
      const response = await fetchWeekendFixtures(date, perPage, '1');
      
      if (response.status === true && Array.isArray(response.data)) {
        setFixtures(response.data);
        setCurrentNextCursor(response.nextCursor);
        setHasMore(!!response.nextCursor);
      } else {
        setError(response.message || 'Failed to load fixtures');
        setFixtures([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching fixtures:', err);
      setError('Error loading fixtures');
      setFixtures([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle date selection change
  const handleDateChange = (e) => {
    const newDate = parseInt(e.target.value);
    setSelectedDate(newDate);
    
    // Format date for API
    const today = new Date();
    const selectedDate = new Date(today.getFullYear(), today.getMonth(), newDate);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    fetchFixtures(formattedDate);
  };

  // Initialize state from props
  useEffect(() => {
    setFixtures(initialFixtures || []);
    setError(initialError || null);
    setCurrentNextCursor(initialNextCursor);
    setHasMore(!!initialNextCursor);
  }, [initialFixtures, initialError, initialNextCursor]);

  // Add effect to initialize favorite states from localStorage
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
    // Check if the device is mobile based on screen width
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const validatePrediction = (prediction, scores, status) => {
    // For upcoming matches, show amber color
    if (status !== "Match Finished" && status !== "Match Finished After Extra Time") {
      return {
        backgroundColor: 'rgb(255, 180, 0)',
        color: 'white',
        border: 'none'
      };
    }

    try {
      // Validate if predictions were correct for finished matches
      const homeScore = parseInt(scores.fulltime.home) || 0;
      const awayScore = parseInt(scores.fulltime.away) || 0;
      const totalGoals = homeScore + awayScore;
      
      // Add halftime goals for more detailed analysis
      const homeHalfScore = parseInt(scores.halftime.home) || 0;
      const awayHalfScore = parseInt(scores.halftime.away) || 0;
      const halfTimeGoals = homeHalfScore + awayHalfScore;
      
      // Check if prediction was correct
      let predictionCorrect = false;
      
      if (prediction === "Over") {
        predictionCorrect = totalGoals > 2.5;
        
        // Determine style based on prediction accuracy
        if (predictionCorrect) {
          // Strong green for correct prediction
          return {
            backgroundColor: '#00a651',
            color: 'white',
            border: 'none'
          };
        } else if (totalGoals === 2) {
          // Close call (only needed one more goal)
          return {
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            opacity: '0.9'
          };
        } else {
          // Completely wrong prediction
          return {
            backgroundColor: '#cc0000',
            color: 'white',
            border: 'none'
          };
        }
      } else {
        // For Under predictions
        predictionCorrect = totalGoals < 2.5;
        
        if (predictionCorrect) {
          // Strong green for correct prediction
          return {
            backgroundColor: '#00a651',
            color: 'white',
            border: 'none'
          };
        } else if (totalGoals === 3) {
          // Close call (only one goal over)
          return {
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            opacity: '0.9'
          };
        } else {
          // Completely wrong prediction
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
        <Link href="/weekend-football-predictions" className="match-details-nav-link">
          <span>1x2</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/weekend-football-predictions/double-chance-predictions" className="match-details-nav-link">
          <span>Double Chance</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/weekend-football-predictions/predictions-under-over-goals" className="match-details-nav-link active">
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
      // Create a safe copy of the fixture with properly formatted goals_over_under
      const safeFixture = { ...fixture };
      
      // Ensure goals_over_under is properly formatted as a JSON string array
      if (!safeFixture.goals_over_under || safeFixture.goals_over_under === "null" || safeFixture.goals_over_under === null) {
        // Default empty array in JSON string format
        safeFixture.goals_over_under = '[]';
      } else if (typeof safeFixture.goals_over_under === 'string') {
        // Make sure it's valid JSON
        try {
          JSON.parse(safeFixture.goals_over_under);
        } catch (e) {
          console.warn('Invalid goals_over_under JSON:', safeFixture.goals_over_under);
          safeFixture.goals_over_under = '[]';
        }
      } else if (Array.isArray(safeFixture.goals_over_under)) {
        // If it's already an array, stringify it
        safeFixture.goals_over_under = JSON.stringify(safeFixture.goals_over_under);
      }
      
      // Set defaults for expected goals calculation if missing
      if (!safeFixture.teams_perfomance_home_for) safeFixture.teams_perfomance_home_for = '0';
      if (!safeFixture.teams_perfomance_away_for) safeFixture.teams_perfomance_away_for = '0';
      if (!safeFixture.teams_perfomance_home_aganist) safeFixture.teams_perfomance_home_aganist = '0';
      if (!safeFixture.teams_perfomance_away_aganist) safeFixture.teams_perfomance_away_aganist = '0';
      if (!safeFixture.teams_games_played_home) safeFixture.teams_games_played_home = '1';
      if (!safeFixture.teams_games_played_away) safeFixture.teams_games_played_away = '1';
      
      // Get prediction data with defensive error handling
      let prediction = 'Under';
      let odd = '2.00';
      let avgGoals = 2.5;
      let underProb = 50;
      let overProb = 50;
      
      try {
        // Get prediction
        const predictionResult = getUnderOverPrediction(safeFixture);
        if (Array.isArray(predictionResult) && predictionResult.length >= 3) {
          prediction = predictionResult[0] || 'Under';
          odd = predictionResult[1] || '2.00';
          avgGoals = typeof predictionResult[2] === 'number' ? predictionResult[2] : 2.5;
        }
        
        // Get probabilities
        const probabilitiesResult = calculateProbabilities(safeFixture);
        if (Array.isArray(probabilitiesResult) && probabilitiesResult.length >= 2) {
          underProb = probabilitiesResult[0] || 50;
          overProb = probabilitiesResult[1] || 50;
        }
      } catch (err) {
        console.error('Error getting prediction data:', err);
        // Use defaults already set above
      }

      // Safely parse scores
      let scores = { halftime: { home: null, away: null }, fulltime: { home: null, away: null } };
      try {
        scores = JSON.parse(fixture.scores);
      } catch (e) {
        console.warn('Error parsing scores:', e);
      }
      
      const predictionStyle = validatePrediction(prediction, scores, fixture.status_long);
      const isFavorite = favoriteStates[fixture.fixture_id] || false;

      // Calculate prediction confidence level using the universal function
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
                minWidth: '55px', // Ensure enough width for the text
                display: 'inline-block',
                textAlign: 'center',
                padding: '3px 6px', // Add horizontal padding
                whiteSpace: 'nowrap', // Prevent text wrapping
                fontSize: '12px', // Slightly smaller font on mobile if needed
                fontWeight: 'bold', // Make text bold for better visibility
                letterSpacing: '0.5px' // Add letter spacing for better readability
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
    } catch (error) {
      console.error('Error rendering fixture:', error, fixture);
      return null;
    }
  };

  // New component for explanation
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
    <main>
      <Suspense fallback={<div>Loading...</div>}>
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
              <div key={fixture.fixture_id || index}>
                {renderFixture(fixture)}
              </div>
            ))}
            
            {hasMore && !isLoadingMore && (
              <div className="load-more" style={{ textAlign: 'center', margin: '20px 0' }}>
                <button 
                  className="btn btn-success btn-sm"
                  onClick={loadMoreFixtures}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? 'Loading...' : 'Load More Matches'}
                </button>
              </div>
            )}
            {isLoadingMore && (
                 <div className="flex justify-center items-center w-full h-20 my-4">
                    <LoadingAnimation size={100} text="Loading more matches..." />
                </div>
            )}
            {loadMoreError && (
              <div className="text-center p-4 text-red-500">{loadMoreError}</div>
            )}
            {!hasMore && fixtures.length > 0 && !isLoadingMore && !loadMoreError && (
                 <div className="text-center p-4 text-gray-500">All matches loaded.</div>
            )}
          </>
        )}
      </Suspense>
    </main>
  );
} 