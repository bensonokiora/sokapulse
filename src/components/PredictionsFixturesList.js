'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import NavigationRow from '@/components/NavigationRow';
import LoadingAnimation from '@/components/LoadingAnimation';
import { getPrediction, getHighestProbability, validatePrediction } from '@/utils/predictionUtils';
import { formatMatchTime, formatDate } from '@/utils/dateUtils';
import { fetchFixturesByDatePaginated } from '@/utils/api';
import '../styles/custom.css'; // Adjust path if necessary

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

const PredictionsFixturesList = ({
  initialFixtures,
  initialNextCursor,
  perPage,
  initialDate,
  initialError,
}) => {
  const [fixtures, setFixtures] = useState(initialFixtures || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(!!initialNextCursor);
  const [currentNextCursor, setCurrentNextCursor] = useState(initialNextCursor);
  const [error, setError] = useState(initialError);
  const [loadMoreError, setLoadMoreError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const observer = useRef();

  // Last element ref callback for infinite scrolling (optional)
  const lastFixtureElementRef = useCallback(node => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && fixtures.length > fixtures.length) {
        // Trigger load more only if IntersectionObserver is preferred over button
        // loadMoreFixtures();
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoadingMore, hasMore, fixtures]);

  // Initialize loading state and props
  useEffect(() => {
    setIsLoading(!initialFixtures && !initialError); // Set loading true if no initial data and no error
    setFixtures(initialFixtures || []);
    setCurrentNextCursor(initialNextCursor);
    setHasMore(!!initialNextCursor);
    setSelectedDate(initialDate); // Ensure selectedDate is set from initialDate prop
    setError(initialError);
  }, [initialFixtures, initialNextCursor, initialDate, initialError]);

  // Function to fetch fixtures using fetchFixturesByDatePaginated
  const fetchPaginatedFixtures = useCallback(async (date, cursor, itemsPerPage) => {
    const formattedDate = formatDate(date);
    // console.log(`Fetching paginated fixtures: date=${formattedDate}, cursor=${cursor}, perPage=${itemsPerPage}`);

    try {
      const apiResponse = await fetchFixturesByDatePaginated(formattedDate, itemsPerPage, cursor);
      // console.log(`Paginated API response status: ${apiResponse?.status}`);

      if (apiResponse.status === true && Array.isArray(apiResponse.fixtures)) {
        return apiResponse; // Return the whole response object
      } else {
        throw new Error(apiResponse.message || 'Invalid data structure from paginated API');
      }
    } catch (err) {
      console.error('Error fetching paginated fixtures:', err);
      // Rethrow or handle as appropriate for the caller
      throw err;
    }
  }, []); // formatDate is stable, so no dependency needed if it's from import

  // Handle date selection change
  const handleDateChange = async (e) => {
    const newDateString = e.target.value;
    const newDateObject = new Date(newDateString + 'T00:00:00');
    
    setSelectedDate(newDateObject);
    setIsLoading(true);
    setError(null);
    setLoadMoreError(null);
    setFixtures([]);
    setHasMore(false);
    setCurrentNextCursor(null);

    try {
      const apiResponse = await fetchPaginatedFixtures(newDateObject, '1', perPage);
      setFixtures(apiResponse.fixtures);
      setCurrentNextCursor(apiResponse.nextCursor);
      setHasMore(!!apiResponse.nextCursor);
    } catch (err) {
      setError(`Failed to load fixtures: ${err.message}`);
      setFixtures([]);
      setHasMore(false);
      setCurrentNextCursor(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Load More Fixtures Logic
  const loadMoreFixtures = async () => {
    if (isLoadingMore || !hasMore || !currentNextCursor) {
      return;
    }

    setIsLoadingMore(true);
    setLoadMoreError(null);

    try {
      const formattedDate = formatDate(selectedDate);
      const apiResponse = await fetchPaginatedFixtures(formattedDate, currentNextCursor, perPage);
      const newFixturesFetched = apiResponse.fixtures;

      setFixtures(prevFixtures => {
        const existingFixtureIds = new Set(prevFixtures.map(f => f.fixture_id));
        const uniqueNewFixtures = newFixturesFetched.filter(f => !existingFixtureIds.has(f.fixture_id));
        return [...prevFixtures, ...uniqueNewFixtures];
      });
      
      setCurrentNextCursor(apiResponse.nextCursor);
      setHasMore(!!apiResponse.nextCursor);
    } catch (err) {
      console.error('Error loading more fixtures:', err);
      setLoadMoreError(`Failed to load more fixtures: ${err.message}`);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Refresh Match Data
  const refreshMatchData = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setError(null);
    setLoadMoreError(null);
    // console.log(`Refreshing paginated data for date ${formatDate(selectedDate)}`);

    try {
      const apiResponse = await fetchPaginatedFixtures(selectedDate, '1', perPage); // Fetch first page

      setFixtures(apiResponse.fixtures);
      setCurrentNextCursor(apiResponse.nextCursor);
      setHasMore(!!apiResponse.nextCursor);
      setLastRefreshTime(new Date());
    } catch (err) {
      setError(`Failed to refresh fixtures: ${err.message}`);
      setFixtures([]); // Clear fixtures if refresh fails
      setHasMore(false);
      setCurrentNextCursor(null);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedDate, perPage, isRefreshing, fetchPaginatedFixtures]); // Added fetchPaginatedFixtures dependency

  // --- Effects ---

  // Initialize favorite states from localStorage
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

  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Auto-refresh interval
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      console.log("Auto-refresh triggered");
      refreshMatchData();
    }, 60000); // Refresh every 60 seconds
    return () => clearInterval(refreshInterval);
  }, [refreshMatchData]);

  // --- Rendering Helpers ---

  const renderPredictionNav = () => (
    <div className="match-details-navigation">
      <div className="match-details-nav-item">
        <Link href="/today-football-predictions" className="match-details-nav-link active ">
          <span>1x2</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/today-football-predictions/double-chance-predictions" className="match-details-nav-link ">
          <span>Double Chance</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/today-football-predictions/predictions-under-over-goals" className="match-details-nav-link  ">
          <span>Under/Over 2.5</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/today-football-predictions/predictions-both-team-to-score" className="match-details-nav-link">
          <span>BTTS</span>
        </Link>
      </div>
    </div>
  );

  const renderFixturesHeader = () => (
    <div className="responsive-row header-size" style={{ fontWeight: 'bold', textAlign: 'left', cursor: 'auto' }}>
      <div className="responsive-cell"></div> {/* // League Logo cell? */} 
      <div className="responsive-cell team-link-probability" style={{ textAlign: 'left', fontWeight: 'bold' }}>
        <span>Teams</span><br />
      </div>
      <div className="responsive-cell team-link-probability" style={{ whiteSpace: 'pre-wrap', fontWeight: 'bold' }}>
         <span>&nbsp;{isMobile ? 'Probs' : 'Probability %'} </span><br />
        <span>1&nbsp;&nbsp;X&nbsp;&nbsp;2</span>
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

  const getFixtureDetails = (fixture) => {
     // Add null/undefined checks for safety
    const scores = fixture.scores ? JSON.parse(fixture.scores) : { fulltime: { home: null, away: null }, halftime: { home: null, away: null } };
    
    const homeFor = parseInt(fixture.teams_perfomance_home_for) || 0;
    const homeAganist = parseInt(fixture.teams_perfomance_home_aganist) || 0;
    const awayFor = parseInt(fixture.teams_perfomance_away_for) || 0;
    const awayAganist = parseInt(fixture.teams_perfomance_away_aganist) || 0;
    const homePlayed = parseInt(fixture.teams_games_played_home) || 0;
    const awayPlayed = parseInt(fixture.teams_games_played_away) || 0;
    const totalPlayed = homePlayed + awayPlayed;

    // Use avg_performance from API instead of calculating it manually
    const avgGoals = fixture.avg_performance ? 
      parseFloat(fixture.avg_performance).toFixed(2) : 
      (totalPlayed > 0 ? 
        ((homeFor + homeAganist + awayFor + awayAganist) / totalPlayed).toFixed(2) : 
        'N/A'); // Handle division by zero

    const homePred = fixture.percent_pred_home?.replace('%', '') || '0';
    const drawPred = fixture.percent_pred_draw?.replace('%', '') || '0';
    const awayPred = fixture.percent_pred_away?.replace('%', '') || '0';

    const prediction = getPrediction(homePred, drawPred, awayPred);
    const predictionStyle = validatePrediction(prediction, scores, fixture.status_long);
    const highestProb = getHighestProbability(homePred, drawPred, awayPred);

    const isFavorite = favoriteStates[fixture.fixture_id] || false;

    const toggleFavorite = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const fixtureId = fixture.fixture_id;
      const newState = !isFavorite;
      const favoriteData = JSON.parse(localStorage.getItem('mymatchesdata')) || { dataArray: [] };

      setFavoriteStates(prev => ({ ...prev, [fixtureId]: newState }));

      if (newState) {
        if (!favoriteData.dataArray.some(item => item.fixture_id === fixtureId)) {
             favoriteData.dataArray.push({ fixture_id: fixtureId });
        }
      } else {
        favoriteData.dataArray = favoriteData.dataArray.filter(item => item.fixture_id !== fixtureId);
      }

      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      favoriteData.expiry = expiry.getTime();

      localStorage.setItem('mymatchesdata', JSON.stringify(favoriteData));
      window.dispatchEvent(new Event('storage')); // Notify other tabs/windows
    };

    return { scores, isFavorite, prediction, predictionStyle, highestProb, avgGoals, toggleFavorite };
  };

  const renderFixture = (fixture, index, isLast) => {
    const { scores, isFavorite, prediction, predictionStyle, highestProb, avgGoals, toggleFavorite } = getFixtureDetails(fixture);
    const refProp = isLast ? { ref: lastFixtureElementRef } : {}; // Apply ref to last element for IntersectionObserver

    return (
      <Link key={fixture.id || fixture.fixture_id || index} href={`/football-predictions/fixture/${fixture.home_team_name?.toLowerCase().replace(/\s+/g, '-')}-vs-${fixture.away_team_name?.toLowerCase().replace(/\s+/g, '-')}-${fixture.fixture_id}`} className="responsive-row team-link" style={{ 
        cursor: 'pointer', 
        textDecoration: 'none', 
        color: 'inherit'
      }} {...refProp}>
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
           {/* Simplified SVG rendering logic */}
           <div className="favorite-icon" onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleFavorite(e); }} style={{ cursor: 'pointer' }}>
           <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            fill={isFavorite ? "red" : "white"} 
                            stroke={isFavorite ? "red" : "black"} 
                            strokeWidth={isFavorite ? "0" : "1"}
                            className="bi bi-star-fill"
                            viewBox="0 0 16 16"
                         >
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                         </svg>
           </div>
         </div>
        <div className="responsive-cell team-link" title="Click to open match details">
            <div className="teamNameLink">
              <span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.home_team_name}</span><br />
              <span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.away_team_name}</span>
            </div>
        </div>
        <div className="responsive-cell team-link-probability" style={{ width: '50px', minWidth: '50px', maxWidth: '50px' }}>
          <div className="probability-container" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: '1px',
            width: 'fit-content',
            margin: '0 auto'
          }}>
            <div className="probability-item" style={{ 
              fontWeight: highestProb === 'home' ? 'bold' : 'normal',
              border: '1px solid #dee2e6',
              borderRadius: '3px',
              padding: '2px 4px',
              backgroundColor: highestProb === 'home' ? '#e3f2fd' : 'transparent',
              textAlign: 'center',
              fontSize: '0.8rem',
              width: '38px'
            }}>{fixture.percent_pred_home || '0%'}</div>
            <div className="probability-item" style={{ 
              fontWeight: highestProb === 'draw' ? 'bold' : 'normal',
              border: '1px solid #dee2e6',
              borderRadius: '3px',
              padding: '2px 4px',
              backgroundColor: highestProb === 'draw' ? '#e3f2fd' : 'transparent',
              textAlign: 'center',
              fontSize: '0.8rem',
              width: '38px'
            }}>{fixture.percent_pred_draw || '0%'}</div>
            <div className="probability-item" style={{ 
              fontWeight: highestProb === 'away' ? 'bold' : 'normal',
              border: '1px solid #dee2e6',
              borderRadius: '3px',
              padding: '2px 4px',
              backgroundColor: highestProb === 'away' ? '#e3f2fd' : 'transparent',
              textAlign: 'center',
              fontSize: '0.8rem',
              width: '38px'
            }}>{fixture.percent_pred_away || '0%'}</div>
          </div>
        </div>
        <div className="responsive-cell" title="Prediction">
          <span className="m-1">
            <span className={`number-circle rounded-square ${predictionStyle.backgroundColor === '#008000' ? 'prediction-correct' : predictionStyle.backgroundColor === '#FF0000' ? 'prediction-incorrect' : ''}`} style={predictionStyle}>
              {prediction}
            </span>
          </span>
        </div>
        <div className="responsive-cell hide-on-mobile" title="Average Goals">{avgGoals}</div>
        <div className="responsive-cell" title="Odds">
          <div className="odds-container">
            <div style={{ fontWeight: prediction === '1' ? 'bold' : 'normal' }}>{fixture.bets_home || '-'}</div>
            <div style={{ fontWeight: prediction === 'X' ? 'bold' : 'normal' }}>{fixture.bets_draw || '-'}</div>
            <div style={{ fontWeight: prediction === '2' ? 'bold' : 'normal' }}>{fixture.bets_away || '-'}</div>
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
                     fixture.status_short}
                  {fixture.status_short !== "HT" && ["1H", "2H", "LIVE"].includes(fixture.status_short) && <span className="blink_text">&nbsp;&#x25CF;</span>}
                </div>
              ) : null}
            </div>
            <div className="scores-display">
               <span className={`${scores.fulltime.home !== null ? 'scores-card' : 'no-score'} ${["2H", "1H", "INT", "HT", "LIVE"].includes(fixture.status_short) ? 'live' : ''}`} id="fulltimeGoals">
                 {scores.fulltime.home !== null ? `${scores.fulltime.home} - ${scores.fulltime.away}` : '-'}
               </span>
               {scores.halftime.home !== null && fixture.status_short !== 'NS' && (
                 <span className="halfTimeDataDisplay">
                   {`(${scores.halftime.home}-${scores.halftime.away})`}
                 </span>
               )}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  // --- Main Return --- 

  return (
    <>
      <NavigationRow selectedDate={selectedDate} onDateChange={handleDateChange} />
       <div className="responsive-row" style={{ textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)', marginLeft: '1px', borderRadius: '5px', cursor: 'auto' }}>
          <div className="table-cell">
            {/* Use h2 or similar for semantics if h1 is already on the page */}
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Football Predictions & Tips</h2> 
          </div>
       </div>
      {renderPredictionNav()}
      {renderFixturesHeader()}
      <div>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center w-full h-32 my-4">
              <LoadingAnimation text="Loading matches..." />
            </div>
          ) : error ? (
             <div className="text-center p-4 text-red-500">Error: {error}</div>
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
                          {league.fixtures.map((fixture, index) => renderFixture(fixture, index, index === league.fixtures.length - 1))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
          {isLoadingMore && (
            <div className="flex justify-center items-center w-full h-20 my-4">
              <LoadingAnimation size={100} text="Loading more..." />
            </div>
          )}
          
          {/* Load More Button */}
          {!isLoading && !isLoadingMore && hasMore && (
            <div className="load-more" style={{ textAlign: 'center', padding: '20px' }}>
              <button 
                className="btn btn-success btn-sm"
                onClick={loadMoreFixtures}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? 'Loading...' : 'Load More Predictions'}
              </button>
            </div>
          )}
           {loadMoreError && !isLoadingMore && (
             <div className="text-center p-4 text-red-500">{loadMoreError}</div>
           )}
           {!isLoading && !isLoadingMore && !hasMore && fixtures.length > 0 && !error && !loadMoreError && (
             <div className="text-center p-4 text-gray-500">No more matches for this date.</div>
           )}
        </div>
      </div>
      {/* Optionally add a last refreshed time indicator */}
      <div className="text-center text-xs text-gray-500 p-2">Last updated: {lastRefreshTime.toLocaleTimeString()}</div>
    </>
  );
};

export default PredictionsFixturesList; 