'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaInfoCircle, FaStar } from 'react-icons/fa';
import { fetchFixturesByIds } from '@/utils/api';
import NavigationRow from '@/components/NavigationRow';
import LoadingAnimation from '@/components/LoadingAnimation';
import '../../../styles/custom.css';
import { getBothTeamToScorePrediction, calculateBttsProbabilities, calculateConfidenceLevel, validateBttsPrediction } from '@/utils/predictionUtils';
import { formatMatchTime } from '@/utils/dateUtils';
import SeoContent from '@/components/SeoContent';

export default function BothTeamToScorePredictions() {
  const [isLoading, setIsLoading] = useState(true);
  const [fixtures, setFixtures] = useState([]);
  const [error, setError] = useState(null);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchFavoriteFixtures = async () => {
      setIsLoading(true);
      try {
        const favoriteData = JSON.parse(localStorage.getItem('mymatchesdata'));
        if (favoriteData?.dataArray && favoriteData.dataArray.length > 0) {
          // Extract fixture IDs
          const fixtureIds = favoriteData.dataArray.map(item => item.fixture_id);
          
          // Create states for favorites
          const states = {};
          fixtureIds.forEach(id => {
            states[id] = true;
          });
          setFavoriteStates(states);
          
          // Fetch fixture details using the IDs
          const response = await fetchFixturesByIds(fixtureIds);
          
          if (response.status === true && Array.isArray(response.data)) {
            setFixtures(response.data);
            setLastRefreshTime(new Date());
          } else {
            setError(response.message || 'Failed to load favorites');
            setFixtures([]);
          }
        } else {
          // No favorites saved
          setFixtures([]);
        }
      } catch (err) {
        console.error('Error fetching favorite fixtures:', err);
        setError('Error loading favorites');
        setFixtures([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteFixtures();
    
    // Listen for storage events to refresh on changes
    const handleStorageChange = () => {
      fetchFavoriteFixtures();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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
        <Link href="/favourite-predictions" className="match-details-nav-link">
          <span>1x2</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/favourite-predictions/double-chance-predictions" className="match-details-nav-link">
          <span>Double Chance</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/favourite-predictions/predictions-under-over-goals" className="match-details-nav-link">
          <span>Under/Over 2.5</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/favourite-predictions/predictions-both-team-to-score" className="match-details-nav-link active">
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
      // Use the utility functions for BTTS predictions
      const [noProb, yesProb] = calculateBttsProbabilities(fixture);
      
      // Get BTTS prediction with all confidence data
      const bttsData = getBothTeamToScorePrediction(fixture);
      const prediction = bttsData.prediction;
      
      // Parse scores for validation
      const scores = JSON.parse(fixture.scores);
      
      // Get prediction style based on validation using the utility
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
  const refreshMatchData = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      const favoriteData = JSON.parse(localStorage.getItem('mymatchesdata'));
      if (favoriteData?.dataArray && favoriteData.dataArray.length > 0) {
        // Extract fixture IDs
        const fixtureIds = favoriteData.dataArray.map(item => item.fixture_id);
        
        // Fetch fixture details using the IDs
        const response = await fetchFixturesByIds(fixtureIds);
        
        if (response.status === true && Array.isArray(response.data)) {
          setFixtures(response.data);
          setLastRefreshTime(new Date());
        }
      }
    } catch (err) {
      console.error('Error refreshing match data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  // Set up auto-refresh interval
  useEffect(() => {
    // Refresh data every 60 seconds (1 minute)
    const refreshInterval = setInterval(() => {
      refreshMatchData();
    }, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [refreshMatchData]);

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
      <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>

        <div className="col-lg-12" style={{ height: 'auto !important' }}>
          <div className="responsive-row" style={{ textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)', marginLeft: '1px', borderRadius: '5px', cursor: 'auto' }}>
            <div className="table-cell">
              <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>Favorite Football Both Teams To Score (BTTS) Predictions</h1>
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
            <div className="no-fixtures-message">
              No favorite fixtures found. Add your favorite matches by clicking on the star ⭐ icon next to any match.
            </div>
          ) : (
            <>
              {fixtures.map((fixture, index) => (
                <div key={fixture.fixture_id}>
                  {renderFixture(fixture)}
                </div>
              ))}
            </>
          )}
           <SeoContent />
        </div>
       </div>
      </Suspense>
    </main>
  );
} 