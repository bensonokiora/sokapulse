'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { fetchWeekendFixtures } from '@/utils/api';
import LoadingAnimation from '@/components/LoadingAnimation';
import { getBothTeamToScorePrediction, calculateBttsProbabilities, calculateConfidenceLevel, validateBttsPrediction } from '@/utils/predictionUtils';
import { formatMatchTime } from '@/utils/dateUtils';

export default function BothTeamsToScorePredictionsClient({ 
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
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

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
        
        // Update last refresh time
        setLastRefreshTime(new Date());
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
      const formattedDate = formatDate(date);
      const response = await fetchWeekendFixtures(formattedDate, perPage, '1');
      
      if (response.status === true && Array.isArray(response.data)) {
        setFixtures(response.data);
        setCurrentNextCursor(response.nextCursor);
        setHasMore(!!response.nextCursor);
        
        // Update last refresh time
        setLastRefreshTime(new Date());
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

  // Initialize state from props
  useEffect(() => {
    setFixtures(initialFixtures || []);
    setError(initialError || null);
    setCurrentNextCursor(initialNextCursor);
    setHasMore(!!initialNextCursor);
  }, [initialFixtures, initialError, initialNextCursor]);

  // Handle date selection change
  const handleDateChange = (e) => {
    const newDate = parseInt(e.target.value);
    setSelectedDate(new Date(e.target.value));
    
    // Format date for API
    const today = new Date();
    const selectedDate = new Date(today.getFullYear(), today.getMonth(), newDate);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    fetchFixtures(formattedDate);
  };

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
        <Link href="/weekend-football-predictions/predictions-under-over-goals" className="match-details-nav-link">
          <span>Under/Over 2.5</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/weekend-football-predictions/predictions-both-team-to-score" className="match-details-nav-link active">
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
      <div className="responsive-cell"></div>
      <div className="responsive-cell"></div>
      <div className="responsive-cell team-link-probability" style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
        <span>&nbsp;{isMobile ? 'Probs' : 'Probability %'} </span><br />
        <span>No / Yes</span>
      </div>
      <div className="responsive-cell">{isMobile ? 'Pred' : 'Prediction'}</div>
      <div className="responsive-cell">
        <div className="row">
          <div className="col-md-12 col-sm-12 col-xs-12">Scores</div>
        </div>
      </div>
    </div>
  );

  const renderFixture = (fixture) => {
    try {
      // Create a safe copy of the fixture and ensure required fields exist
      const safeFixture = { ...fixture };
      
      // Ensure required fields for BTTS prediction
      if (!safeFixture.goals_over_under || safeFixture.goals_over_under === "null" || safeFixture.goals_over_under === null) {
        safeFixture.goals_over_under = '[]';
      }
      
      if (!safeFixture.double_chance_goals || safeFixture.double_chance_goals === "null" || safeFixture.double_chance_goals === null) {
        safeFixture.double_chance_goals = '[]';
      }
      
      // Use the utility functions for BTTS predictions
      const [noProb, yesProb] = calculateBttsProbabilities(safeFixture);
      
      // Get BTTS prediction with all confidence data
      let bttsData = {
        prediction: 'No',
        confidenceText: 'Medium',
        confidenceColor: '#f0ad4e',
        confidenceScore: 0,
        odds: '2.00'
      };
      
      try {
        bttsData = getBothTeamToScorePrediction(safeFixture);
      } catch (err) {
        console.error('Error getting BTTS prediction:', err);
      }
      
      const prediction = bttsData.prediction;
      const confidenceText = bttsData.confidenceText;
      const confidenceColor = bttsData.confidenceColor;
      const confidenceScore = bttsData.confidenceScore;
      const odds = bttsData.odds;
      
      // Parse scores for validation with error handling
      let scores = { halftime: { home: null, away: null }, fulltime: { home: null, away: null } };
      try {
        scores = JSON.parse(fixture.scores);
      } catch (e) {
        console.warn('Error parsing scores:', e);
      }
      
      // Get prediction style based on validation using the utility function
      const predictionStyle = validateBttsPrediction(prediction, scores, fixture.status_long);
      
      // Check if this fixture is a favorite
      const isFavorite = favoriteStates[fixture.fixture_id] || false;

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
                <span style={{ fontWeight: prediction === 'No' ? 'bold' : 'normal' }}>{noProb}%</span>&nbsp;
                <span style={{ fontWeight: prediction === 'Yes' ? 'bold' : 'normal' }}>{yesProb}%</span>
              </div>
            </div>
          </div>
          <div className="responsive-cell" title="Prediction" style={{ minWidth: '60px', textAlign: 'center' }}>
            <span className="m-1">
              <span className="number-circle rounded-square" style={{
                ...predictionStyle,
                minWidth: isMobile ? '50px' : '55px', // Slightly smaller width on mobile
                display: 'inline-block',
                textAlign: 'center',
                padding: isMobile ? '2px 4px' : '3px 6px', // Smaller padding on mobile
                whiteSpace: 'nowrap', // Prevent text wrapping
                fontSize: isMobile ? '9px' : '12px', // Smaller font on mobile
                fontWeight: 'bold', // Make text bold for better visibility
                letterSpacing: isMobile ? '0.2px' : '0.5px' // Less letter spacing on mobile
              }}>
                {prediction === 'Yes' ? 'BTTS: YES' : 'BTTS: NO'}
              </span>
            </span>
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
      console.error("Error rendering fixture:", error, fixture);
      return null; // Return null for broken fixtures
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
            Both Teams To Score (BTTS) Predictions ⚽⚽
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
              Our algorithm analyzes team scoring patterns, defensive records, and betting odds
              to predict whether both teams will score in a match.
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

  // Add a new function to refresh match data without changing the page
  const refreshMatchData = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      const formattedDate = formatDate(selectedDate);
      const response = await fetchWeekendFixtures(formattedDate, perPage, '1');
      
      if (response.status === true && Array.isArray(response.data)) {
        // Update the visible fixtures
        setFixtures(response.data);
        setCurrentNextCursor(response.nextCursor);
        setHasMore(!!response.nextCursor);
        
        // Update last refresh time
        setLastRefreshTime(new Date());
      }
    } catch (err) {
      console.error('Error refreshing match data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Set up auto-refresh interval
  useEffect(() => {
    // Refresh data every 60 seconds (1 minute)
    const refreshInterval = setInterval(() => {
      refreshMatchData();
    }, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [selectedDate]);

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="responsive-row" style={{ textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)', marginLeft: '1px', borderRadius: '5px', cursor: 'auto' }}>
          <div className="table-cell">
            <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>Free Football Both Teams To Score (BTTS) Predictions - Weekend Matches</h1>
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
          <div className="no-fixtures-message">No fixtures available for weekend matches</div>
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
                  style={{ 
                    padding: '8px 20px',
                    fontSize: '14px',
                    borderRadius: '4px',
                    cursor: isLoadingMore ? 'not-allowed' : 'pointer',
                    opacity: isLoadingMore ? 0.7 : 1
                  }}
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