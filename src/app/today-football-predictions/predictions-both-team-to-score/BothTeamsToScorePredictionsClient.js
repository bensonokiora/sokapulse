'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaInfoCircle, FaStar } from 'react-icons/fa';
import NavigationRow from '@/components/NavigationRow';
import LoadingAnimation from '@/components/LoadingAnimation';
import '../../../styles/custom.css';
import { getBothTeamToScorePrediction, calculateBttsProbabilities, calculateConfidenceLevel, validateBttsPrediction } from '@/utils/predictionUtils';
import { formatMatchTime } from '@/utils/dateUtils';
import { fetchFixturesByDatePaginated } from '@/utils/api';

// Helper function to group fixtures by country and then by league
const groupFixturesByCountry = (fixtures) => {
  const grouped = {};
  const countryOrder = []; // Track the order in which countries first appear
  
  fixtures.forEach(fixture => {
    const countryName = fixture.country_name || 'Other';
    const countryFlag = fixture.country_flag || '';
    const leagueName = fixture.league_name || 'Unknown League';
    const leagueLogo = fixture.logo || '';
    
    // Initialize country if it doesn't exist
    if (!grouped[countryName]) {
      grouped[countryName] = {
        countryName,
        countryFlag,
        leagues: {},
        leagueOrder: [] // Track league order within country
      };
      countryOrder.push(countryName);
    }
    
    // Initialize league within country if it doesn't exist
    if (!grouped[countryName].leagues[leagueName]) {
      grouped[countryName].leagues[leagueName] = {
        leagueName,
        leagueLogo,
        fixtures: []
      };
      grouped[countryName].leagueOrder.push(leagueName);
    }
    
    // Add fixture to the appropriate league
    grouped[countryName].leagues[leagueName].fixtures.push(fixture);
  });
  
  // Convert to final structure and preserve order
  const orderedCountries = countryOrder.map(countryName => {
    const country = grouped[countryName];
    return {
      countryName: country.countryName,
      countryFlag: country.countryFlag,
      leagues: country.leagueOrder.map(leagueName => country.leagues[leagueName])
    };
  });
  
  // Find "World" and move it to the front
  const worldIndex = orderedCountries.findIndex(country => country.countryName === 'World');
  if (worldIndex > 0) {
    const worldCountry = orderedCountries.splice(worldIndex, 1)[0];
    orderedCountries.unshift(worldCountry);
  }
  
  return orderedCountries;
};

// League Group Header Component
const LeagueGroupHeader = ({ leagueName, leagueLogo, fixtureCount }) => {
  return (
    <div className="league-group-header">
      <div className="league-group-content">
        <div className="league-logo-wrapper">
          {leagueLogo ? (
            <img 
              src={leagueLogo} 
              alt={`${leagueName} logo`}
              className="league-logo"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                // Show fallback letter when image fails to load
                const fallback = document.createElement('div');
                fallback.className = 'league-logo-fallback';
                fallback.textContent = leagueName.charAt(0).toUpperCase();
                e.target.parentNode.appendChild(fallback);
              }}
            />
          ) : (
            <div className="league-logo-fallback">
              {leagueName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="league-info">
          <h4 className="league-name">{leagueName}</h4>
          <span className="league-fixture-count">{fixtureCount} {fixtureCount === 1 ? 'match' : 'matches'}</span>
        </div>
      </div>
    </div>
  );
};

// Modern Country Group Header Component
const CountryGroupHeader = ({ countryName, countryFlag, totalFixtures }) => {
  const getFlagUrl = (flagUrl) => {
    // Handle specific flag URL replacements like in the existing code
    if (flagUrl === "https://seekflag.com/app/uploads/2022/01/England-01-1.svg") {
      return "https://pngimg.com/uploads/england/england_PNG7.png";
    } else if (flagUrl === "https://seekflag.com/app/uploads/2022/01/Scotland-01-1.svg") {
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Flag_of_Scotland.svg/1200px-Flag_of_Scotland.svg.png";
    } else if (flagUrl === "https://seekflag.com/app/uploads/2022/01/Wales-01-1.svg") {
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Flag_of_Wales.svg/1200px-Flag_of_Wales.svg.png";
    } else if (flagUrl === "https://seekflag.com/app/uploads/2021/11/Flag-of-Gabon-01-1.svg") {
      return "https://upload.wikimedia.org/wikipedia/commons/0/04/Flag_of_Gabon.svg";
    } else if (flagUrl === "https://seekflag.com/app/uploads/2022/01/Northern-Ireland-01-1.svg") {
      return "https://cdn.britannica.com/92/3092-050-3A68D1DE/Flag-of-Northern-Ireland.jpg";
    }
    return flagUrl;
  };

  return (
    <div className="country-group-header">
      <div className="country-group-content">
        <div className="country-flag-wrapper">
          {countryFlag ? (
            <img 
              src={getFlagUrl(countryFlag)} 
              alt={`${countryName} flag`}
              className="country-flag"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                // Show fallback letter when image fails to load
                const fallback = document.createElement('div');
                fallback.className = 'country-flag-fallback';
                fallback.textContent = countryName.charAt(0).toUpperCase();
                e.target.parentNode.appendChild(fallback);
              }}
            />
          ) : (
            <div className="country-flag-fallback">
              {countryName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="country-info">
          <h3 className="country-name">{countryName}</h3>
          <span className="fixture-count">{totalFixtures} {totalFixtures === 1 ? 'match' : 'matches'}</span>
        </div>
      </div>
    </div>
  );
};

export default function BothTeamsToScorePredictionsClient({ 
  initialFixtures = [], 
  initialError = null,
  initialNextCursor = null,
  perPage = 20,
  initialDate = new Date().toISOString().split('T')[0]
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [fixtures, setFixtures] = useState([]);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [error, setError] = useState(initialError);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [allFixtures, setAllFixtures] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(!!initialNextCursor);
  const [currentNextCursor, setCurrentNextCursor] = useState(initialNextCursor);
  const [loadMoreError, setLoadMoreError] = useState(null);

  const formatDateForApi = (dateInput) => {
    if (typeof dateInput === 'string' && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateInput;
    }
    if (dateInput instanceof Date) {
      return dateInput.toISOString().split('T')[0];
    }
    console.warn('formatDateForApi received unexpected dateInput type (BTTS):', dateInput);
    return new Date().toISOString().split('T')[0]; 
  };

  useEffect(() => {
    setFixtures(initialFixtures || []);
    setAllFixtures(initialFixtures || []);
    setError(initialError || null);
    setCurrentNextCursor(initialNextCursor);
    setHasMore(!!initialNextCursor);
    setSelectedDate(initialDate ? formatDateForApi(initialDate) : new Date().toISOString().split('T')[0]);
    setIsLoading(!(initialFixtures && initialFixtures.length > 0) && !initialError);
  }, [initialFixtures, initialError, initialNextCursor, initialDate]);

  const fetchPaginatedFixtures = useCallback(async (dateString, pageCursor) => {
    const formattedDate = formatDateForApi(dateString);
    try {
      const apiResponse = await fetchFixturesByDatePaginated(formattedDate, perPage, pageCursor);
      if (apiResponse.status === true && Array.isArray(apiResponse.fixtures)) {
        return {
          newFixtures: apiResponse.fixtures,
          nextPageCursor: apiResponse.nextCursor,
          apiError: null,
        };
      } else {
        return {
          newFixtures: [],
          nextPageCursor: null,
          apiError: apiResponse.message || 'Failed to fetch fixtures',
        };
      }
    } catch (err) {
      console.error('Error in fetchPaginatedFixtures (BTTS):', err);
      return {
        newFixtures: [],
        nextPageCursor: null,
        apiError: 'Error fetching fixtures',
      };
    }
  }, [perPage]);

  const loadMoreFixtures = useCallback(async () => {
    if (isLoadingMore || !hasMore || !currentNextCursor) return;
    
    setIsLoadingMore(true);
    setLoadMoreError(null);
    
    const { newFixtures, nextPageCursor, apiError } = await fetchPaginatedFixtures(selectedDate, currentNextCursor);

    if (apiError) {
      setLoadMoreError(apiError);
      setHasMore(false);
    } else {
      setFixtures(prevFixtures => {
        const existingFixtureIds = new Set(prevFixtures.map(f => f.fixture_id));
        const uniqueNewFixtures = newFixtures.filter(f => !existingFixtureIds.has(f.fixture_id));
        return [...prevFixtures, ...uniqueNewFixtures];
      });
      setAllFixtures(prevAll => {
        const existingFixtureIds = new Set(prevAll.map(f => f.fixture_id));
        const uniqueNewFixtures = newFixtures.filter(f => !existingFixtureIds.has(f.fixture_id));
        return [...prevAll, ...uniqueNewFixtures];
      });
      setCurrentNextCursor(nextPageCursor);
      setHasMore(!!nextPageCursor);
    }
    setIsLoadingMore(false);
  }, [isLoadingMore, hasMore, currentNextCursor, selectedDate, fetchPaginatedFixtures]);

  const handleDateChange = useCallback(async (e) => {
    const newDateString = e.target.value;
    if (!newDateString || !newDateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        console.error("Invalid date string from event target (BTTS):", newDateString);
        return; 
    }
    setSelectedDate(newDateString);
    setIsLoading(true);
    setFixtures([]);
    setAllFixtures([]);
    setError(null);
    setLoadMoreError(null);
    
    const { newFixtures, nextPageCursor, apiError } = await fetchPaginatedFixtures(newDateString, '1');

    if (apiError) {
      setError(apiError);
      setHasMore(false);
      setCurrentNextCursor(null);
    } else {
      setFixtures(newFixtures);
      setAllFixtures(newFixtures);
      setCurrentNextCursor(nextPageCursor);
      setHasMore(!!nextPageCursor);
    }
    setIsLoading(false);
  }, [fetchPaginatedFixtures]);

  const refreshMatchData = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setError(null); 
    setLoadMoreError(null); 

    const { newFixtures, nextPageCursor, apiError } = await fetchPaginatedFixtures(selectedDate, '1');

    if (apiError) {
      setError(apiError); 
      setFixtures([]);
      setAllFixtures([]);
      setHasMore(false);
      setCurrentNextCursor(null);
    } else {
      setFixtures(newFixtures);
      setAllFixtures(newFixtures);
      setCurrentNextCursor(nextPageCursor);
      setHasMore(!!nextPageCursor);
      setLastRefreshTime(new Date());
    }
    setIsRefreshing(false);
  }, [selectedDate, fetchPaginatedFixtures, isRefreshing]);

  useEffect(() => {
    const refreshInterval = setInterval(refreshMatchData, 60000);
    return () => clearInterval(refreshInterval);
  }, [refreshMatchData]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const renderPredictionNav = () => (
    <div className="match-details-navigation">
      <div className="match-details-nav-item">
        <Link href="/today-football-predictions" className="match-details-nav-link">
          <span>1x2</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/today-football-predictions/double-chance-predictions" className="match-details-nav-link">
          <span>Double Chance</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/today-football-predictions/predictions-under-over-goals" className="match-details-nav-link">
          <span>Under/Over 2.5</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/today-football-predictions/predictions-both-team-to-score" className="match-details-nav-link active">
          <span>BTTS</span>
        </Link>
      </div>
    </div>
  );

  const renderFixturesHeader = () => (
    <div className="responsive-row header-size" style={{ fontWeight: 'bold', textAlign: 'left', cursor: 'auto' }}>
      <div className="responsive-cell"></div> {/* Time */} 
      <div className="responsive-cell"></div> {/* League Info */} 
      <div className="responsive-cell"></div> {/* Favorite */} 
      <div className="responsive-cell team-link-probability" style={{ textAlign: 'left', fontWeight: 'bold' }}>
        <span>Teams</span><br />
      </div>
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
      const [noProb, yesProb] = calculateBttsProbabilities(fixture);
      const bttsData = getBothTeamToScorePrediction(fixture);
      const prediction = bttsData.prediction;
      const confidenceText = bttsData.confidenceText;
      const confidenceColor = bttsData.confidenceColor;
      const scores = JSON.parse(fixture.scores);
      const predictionStyle = validateBttsPrediction(prediction, scores, fixture.status_long);
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
        <Link href={`/football-predictions/fixture/${fixture.home_team_name.toLowerCase().replace(/\s+/g, '-')}-vs-${fixture.away_team_name.toLowerCase().replace(/\s+/g, '-')}-${fixture.fixture_id}`} className="responsive-row team-link" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
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
            <div className="favorite-desktop" onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleFavorite(e); }}>
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
            <div className="favorite-mobile" onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleFavorite(e); }}>
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
              <div className="teamNameLink">
                <span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.home_team_name}</span><br />
                <span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.away_team_name}</span>
              </div>
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
                minWidth: isMobile ? '50px' : '55px',
                display: 'inline-block',
                textAlign: 'center',
                padding: isMobile ? '2px 4px' : '3px 6px',
                whiteSpace: 'nowrap',
                fontSize: isMobile ? '9px' : '12px',
                fontWeight: 'bold',
                letterSpacing: isMobile ? '0.2px' : '0.5px'
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
        </Link>
      );
    } catch (error) {
      console.error("Error rendering fixture:", error, fixture);
      return null;
    }
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

  return (
    <>
      {/* Pass Date object to NavigationRow */}
      <NavigationRow selectedDate={selectedDate} onDateChange={handleDateChange} />
      {renderPredictionNav()}
      {renderFixturesHeader()}
      <div>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center w-full h-32 my-4">
              <LoadingAnimation text="Loading matches..." />
            </div>
          ) : error ? (
            <div className="text-center p-4 text-red-500">{error}</div>
          ) : fixtures.length === 0 && !isLoadingMore && !loadMoreError ? (
            <div className="text-center p-4">No fixtures available for this date</div>
          ) : (
            // Render grouped fixtures by country and league
            groupFixturesByCountry(fixtures).map((countryGroup, groupIndex) => {
              const totalFixtures = countryGroup.leagues.reduce((total, league) => total + league.fixtures.length, 0);
              
              return (
                <div key={`${countryGroup.countryName}-${groupIndex}`} className="country-group">
                  <CountryGroupHeader 
                    countryName={countryGroup.countryName}
                    countryFlag={countryGroup.countryFlag}
                    totalFixtures={totalFixtures}
                  />
                  <div className="country-leagues">
                    {countryGroup.leagues.map((league, leagueIndex) => (
                      <div key={`${league.leagueName}-${leagueIndex}`} className="league-group">
                        <LeagueGroupHeader 
                          leagueName={league.leagueName}
                          leagueLogo={league.leagueLogo}
                          fixtureCount={league.fixtures.length}
                        />
                        <div className="league-fixtures">
                          {league.fixtures.map((fixture, index) => renderFixture(fixture))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}

          {/* Loading More Indicator */} 
          {isLoadingMore && (
            <div className="flex justify-center items-center w-full h-20 my-4">
              <LoadingAnimation size={100} text="Loading more matches..." />
            </div>
          )}

          {/* Load More Button */}
          {!isLoading && !isLoadingMore && hasMore && (
            <div className="load-more">
              <button
                className="btn btn-success btn-sm"
                onClick={loadMoreFixtures}
              >
                Load More
              </button>
            </div>
          )}

          {/* Load More Error Message */}
          {loadMoreError && !isLoadingMore && (
             <div className="text-center p-4 text-red-500">{loadMoreError}</div>
          )}

          {/* Show message if no more fixtures to load */} 
          {!isLoading && !isLoadingMore && !hasMore && fixtures.length > 0 && !error && !loadMoreError && (
             <div className="text-center p-4 text-gray-500">No more matches for this date.</div>
          )}
        </div>
      </div>
    </>
  );
} 