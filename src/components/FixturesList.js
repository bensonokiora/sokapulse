'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import NavigationRow from '@/components/NavigationRow';
import LoadingAnimation from '@/components/LoadingAnimation';
import { getPrediction, getHighestProbability, validatePrediction } from '@/utils/predictionUtils';
import { formatMatchTime } from '@/utils/dateUtils';
import { fetchFixturesByDatePaginated } from '@/utils/api';

// Helper function to parse scores safely
const safeParseScores = (scoresString) => {
  try {
    const scores = JSON.parse(scoresString);
    // Ensure the structure is as expected
    if (scores && typeof scores.fulltime === 'object' && typeof scores.halftime === 'object') {
      return scores;
    }
  } catch (e) {
    console.error("Error parsing scores JSON:", e);
  }
  // Return default structure if parsing fails or structure is wrong
  return { 
    fulltime: { home: null, away: null }, 
    halftime: { home: null, away: null },
    extratime: { home: null, away: null }
  };
};

// Define formatDate directly within the client component
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

const FixturesList = ({
  initialFixtures,
  initialNextCursor,
  perPage,
  initialDate,
  initialError,
}) => {
  const [fixtures, setFixtures] = useState(initialFixtures || []);
  const [currentNextCursor, setCurrentNextCursor] = useState(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(!!initialNextCursor);
  const [error, setError] = useState(initialError);
  const [loadMoreError, setLoadMoreError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);
  const [lastActiveTime, setLastActiveTime] = useState(new Date().getTime());
  const [isTabActive, setIsTabActive] = useState(true);

  // Initialize loading state based on initial data
  useEffect(() => {
    if (!initialFixtures || initialFixtures.length === 0) {
      if (!initialError) {
        // setIsLoading(true); // This might cause a flicker if data arrives quickly.
        // Let's rely on the parent to pass loading state or handle it if initial fetch is slow.
        // For now, if initialFixtures is empty, and no error, we might show "no fixtures" or loading.
      } else {
        setIsLoading(false); // Error occurred, not loading.
      }
    } else {
      setIsLoading(false); // Has initial fixtures, not loading.
    }
    // Update state from props if they change (e.g. parent re-fetches for a new date via server)
    setFixtures(initialFixtures || []);
    setCurrentNextCursor(initialNextCursor);
    setHasMore(!!initialNextCursor);
    setSelectedDate(initialDate);
    setError(initialError);

  }, [initialFixtures, initialNextCursor, initialDate, initialError]);

  // Handle date selection change - Fetch page 0 using fetchFixturesByDatePaginated
  const handleDateChange = async (e) => {
    const newDateString = e.target.value;
    const newDateObject = new Date(newDateString + 'T00:00:00'); // Ensure time is set to start of day
    
    setSelectedDate(newDateObject); // Update selectedDate state
    setIsLoading(true);
    setError(null);
    setLoadMoreError(null);
    setFixtures([]);
    setHasMore(false);
    setCurrentNextCursor(null);

    const formattedNewDate = formatDate(newDateObject); // Format for API call

    try {
      const apiResponse = await fetchFixturesByDatePaginated(formattedNewDate, perPage, '1');

      if (apiResponse.status === true && Array.isArray(apiResponse.fixtures)) {
        setFixtures(apiResponse.fixtures);
        setCurrentNextCursor(apiResponse.nextCursor);
        setHasMore(!!apiResponse.nextCursor);
      } else {
        setError(apiResponse.message || 'Failed to load fixtures for the new date');
        setFixtures([]); // Clear fixtures on error
        setHasMore(false);
        setCurrentNextCursor(null);
      }
    } catch (err) {
      console.error('Error fetching fixtures for new date:', err);
      setError(`Error loading fixtures: ${err.message}`);
      setFixtures([]);
      setHasMore(false);
      setCurrentNextCursor(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // If we were previously offline, mark for refresh on reconnection
      if (!isOnline) {
        setWasOffline(true);
        console.log("Network reconnected. Will refresh data.");
        // Immediately try to refresh data on reconnection
        refreshMatchData();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log("Network disconnected. Will refresh on reconnection.");
    };

    // Monitor tab visibility
    const handleVisibilityChange = () => {
      const isNowVisible = document.visibilityState === 'visible';
      setIsTabActive(isNowVisible);
      
      if (isNowVisible) {
        const currentTime = new Date().getTime();
        // If tab was hidden for more than 5 minutes, refresh data
        const timeDiffInMinutes = (currentTime - lastActiveTime) / (1000 * 60);
        
        if (timeDiffInMinutes > 5) {
          console.log(`Tab was inactive for ${timeDiffInMinutes.toFixed(2)} minutes. Refreshing data.`);
          refreshMatchData();
        }
      } else {
        // Store the time when tab became hidden
        setLastActiveTime(new Date().getTime());
      }
    };

    // Set up event listeners for network status
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial check 
    setIsOnline(navigator.onLine);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOnline, lastActiveTime]);

  // Load More Fixtures Logic - Fetch next page using fetchFixturesByDatePaginated
  const loadMoreFixtures = async () => {
    if (isLoadingMore || !hasMore || !currentNextCursor) return;

    setIsLoadingMore(true);
    setLoadMoreError(null);

    const formattedCurrentDate = formatDate(selectedDate);

    try {
      const apiResponse = await fetchFixturesByDatePaginated(formattedCurrentDate, perPage, currentNextCursor);

      if (apiResponse.status === true && Array.isArray(apiResponse.fixtures)) {
        const fetchedNewFixtures = apiResponse.fixtures;
        
        setFixtures(prevFixtures => {
          const existingFixtureIds = new Set(prevFixtures.map(f => f.fixture_id));
          const uniqueNewFixtures = fetchedNewFixtures.filter(f => !existingFixtureIds.has(f.fixture_id));
          return [...prevFixtures, ...uniqueNewFixtures];
        });
        
        setCurrentNextCursor(apiResponse.nextCursor);
        setHasMore(!!apiResponse.nextCursor);
      } else {
        setLoadMoreError(apiResponse.message || 'Failed to load more fixtures');
        setHasMore(false); // Stop trying if API indicates no more or error
      }
    } catch (err) {
      console.error('Error in loadMoreFixtures:', err);
      setLoadMoreError(`Error loading more fixtures: ${err.message}`);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Effect to initialize favorite states from localStorage
  useEffect(() => {
    const favoriteData = JSON.parse(localStorage.getItem('mymatchesdata') || '{ "dataArray": [] }');
    if (favoriteData?.dataArray) {
      const states = {};
      favoriteData.dataArray.forEach(item => {
        // Ensure item has fixture_id before setting state
        if (item && item.fixture_id !== undefined) {
             states[item.fixture_id] = true;
        }
      });
      setFavoriteStates(states);
    }
  }, []);

  // Effect to check if mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Toggle Favorite Logic
  const toggleFavorite = (e, fixtureId) => {
    e.preventDefault();
    e.stopPropagation();

    const newState = !favoriteStates[fixtureId];
    const favoriteData = JSON.parse(localStorage.getItem('mymatchesdata') || '{ "dataArray": [] }');

    setFavoriteStates(prev => ({
      ...prev,
      [fixtureId]: newState
    }));

    if (newState) {
       // Check if already exists before pushing
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

    localStorage.setItem('mymatchesdata', JSON.stringify(favoriteData));
    window.dispatchEvent(new Event('storage')); // Notify other components like NavigationRow
  };

  // Get fixture details (moved inside component, uses local state)
  const getFixtureDetails = (fixture) => {
    const scores = safeParseScores(fixture.scores);
    
    // Calculate formatted scores with support for extra time
    const formattedScores = getFormattedScores(fixture, scores);

    // Calculate avgGoals safely, checking for division by zero
    const homeGames = parseInt(fixture.teams_games_played_home) || 0;
    const awayGames = parseInt(fixture.teams_games_played_away) || 0;
    const totalGames = homeGames + awayGames;
    let avgGoals = 'N/A';
    if (fixture.avg_performance) {
        avgGoals = fixture.avg_performance;
    } else if (totalGames > 0) {
        const homeFor = parseInt(fixture.teams_perfomance_home_for) || 0;
        const homeAgainst = parseInt(fixture.teams_perfomance_home_aganist) || 0;
        const awayFor = parseInt(fixture.teams_perfomance_away_for) || 0;
        const awayAgainst = parseInt(fixture.teams_perfomance_away_aganist) || 0;
        avgGoals = ((homeFor + homeAgainst + awayFor + awayAgainst) / totalGames).toFixed(2);
    }

    const predHome = fixture.percent_pred_home?.replace('%', '') || '0';
    const predDraw = fixture.percent_pred_draw?.replace('%', '') || '0';
    const predAway = fixture.percent_pred_away?.replace('%', '') || '0';

    const prediction = getPrediction(predHome, predDraw, predAway);
    
    // Create a modified scores object that uses goals_home and goals_away for validation
    const scoresForValidation = { 
      ...scores,
      fulltime: { 
        home: parseInt(fixture.goals_home) || null, 
        away: parseInt(fixture.goals_away) || null 
      }
    };
    
    const predictionStyle = validatePrediction(prediction, scoresForValidation, fixture.status_long);
    const highestProb = getHighestProbability(predHome, predDraw, predAway);
    const isFavorite = favoriteStates[fixture.fixture_id] || false;

    return {
      scores,
      formattedScores,
      isFavorite,
      prediction,
      predictionStyle,
      highestProb,
      avgGoals,
      // Pass fixture_id to toggleFavorite
      toggleFavoriteHandler: (e) => toggleFavorite(e, fixture.fixture_id)
    };
  };

  // Format scores with support for extra time
  const getFormattedScores = (fixture, scores) => {
    if (!fixture || !scores) {
      return { 
        display: '-', 
        hasExtraTime: false,
        fullTimeDisplay: null
      };
    }
    
    try {
      const hasExtraTime = scores.extratime && 
                           scores.extratime.home !== null && 
                           scores.extratime.away !== null;
      
      // If match has extra time (AET)
      if (hasExtraTime && fixture.status_short === "AET") {
        // Final score should be from goals_home and goals_away which include extra time
        const finalHomeGoals = fixture.goals_home;
        const finalAwayGoals = fixture.goals_away;
        const fullTimeHomeGoals = scores.fulltime.home;
        const fullTimeAwayGoals = scores.fulltime.away;
        
        return {
          display: `${finalHomeGoals} - ${finalAwayGoals}`,
          fullTimeDisplay: `${fullTimeHomeGoals} - ${fullTimeAwayGoals}`,
          hasExtraTime: true
        };
      }
      
      // Regular time match
      if (scores.fulltime && scores.fulltime.home !== null) {
        return {
          display: `${scores.fulltime.home} - ${scores.fulltime.away}`,
          hasExtraTime: false,
          fullTimeDisplay: null
        };
      }
      
      return { 
        display: '-', 
        hasExtraTime: false,
        fullTimeDisplay: null
      };
    } catch (err) {
      console.error('Error formatting scores:', err);
      return { 
        display: '-', 
        hasExtraTime: false,
        fullTimeDisplay: null
      };
    }
  };

  // Refresh Match Data Logic - Refetch first page for the selectedDate
  const refreshMatchData = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setError(null); // Clear previous main errors
    setLoadMoreError(null); // Clear previous load more errors
    
    // Reset wasOffline flag since we're handling the reconnection now
    if (wasOffline) setWasOffline(false);

    const formattedCurrentDate = formatDate(selectedDate);

    try {
      const apiResponse = await fetchFixturesByDatePaginated(formattedCurrentDate, perPage, '1'); // Fetch first page

      if (apiResponse.status === true && Array.isArray(apiResponse.fixtures)) {
        setFixtures(apiResponse.fixtures);
        setCurrentNextCursor(apiResponse.nextCursor);
        setHasMore(!!apiResponse.nextCursor);
        setLastRefreshTime(new Date());
        console.log("Data refreshed successfully at", new Date().toLocaleTimeString());
      } else {
        setError(apiResponse.message || 'Failed to refresh fixtures'); // Set main error on refresh failure
        // Don't clear fixtures on refresh failure - keep showing existing data
        console.error("Refresh failed with status:", apiResponse?.status, "Message:", apiResponse?.message);
      }
    } catch (err) {
      console.error('Error refreshing match data:', err);
      setError(`Error refreshing fixtures: ${err.message}`);
      // Don't clear fixtures on refresh error - keep showing existing data
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedDate, perPage, isRefreshing, wasOffline]);

  // Set up auto-refresh interval
  useEffect(() => {
    // Skip refresh if offline or tab not active
    if (!isOnline || !isTabActive) return;
    
    const refreshInterval = setInterval(() => {
      // Only refresh if there are fixtures currently displayed and we're online
      if (fixtures.length > 0 && isOnline) {
        refreshMatchData();
      }
    }, 60000); // Refresh every 60 seconds
    return () => clearInterval(refreshInterval); // Cleanup
  }, [refreshMatchData, fixtures.length, isOnline, isTabActive]); 

  // Handle reconnection and tab reactivation
  useEffect(() => {
    // If we were offline and now we're back online, or tab becomes active
    if ((wasOffline && isOnline) || (isTabActive && fixtures.length > 0)) {
      const timeSinceLastRefresh = (new Date().getTime() - lastRefreshTime.getTime()) / 1000;
      // Only refresh if it's been more than 30 seconds since last refresh
      if (timeSinceLastRefresh > 30) {
        refreshMatchData();
      }
    }
  }, [wasOffline, isOnline, isTabActive, fixtures.length, lastRefreshTime, refreshMatchData]);

  // Refresh on component mount or if network status changes
  useEffect(() => {
    // Check if the data is stale (e.g., browser was closed and reopened)
    const lastSessionTime = localStorage.getItem('lastSessionTime');
    const currentTime = new Date().getTime();
    const sessionTimeDiff = lastSessionTime ? (currentTime - parseInt(lastSessionTime)) / (1000 * 60) : null;
    
    // If no fixtures loaded yet or session is more than 5 minutes old, refresh data
    if ((fixtures.length === 0 && !isLoading && !error) || (sessionTimeDiff && sessionTimeDiff > 5)) {
      refreshMatchData();
    }
    
    // Update session time
    localStorage.setItem('lastSessionTime', currentTime.toString());
    
    // Add cleanup function
    return () => {
      // Update session time when component unmounts
      localStorage.setItem('lastSessionTime', new Date().getTime().toString());
    };
  }, []);

  // --- Rendering Functions ---

  const renderPredictionNav = () => (
     <div className="match-details-navigation">
       <div className="match-details-nav-item">
         {/* Use Link for internal navigation */}
         <Link href="/" className="match-details-nav-link active">
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
         <Link href="/today-football-predictions/predictions-both-team-to-score" className="match-details-nav-link">
           <span>Both Team to Score</span>
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
      <div className="responsive-cell team-link-probability" style={{ whiteSpace: 'pre-wrap', fontWeight: 'bold' }}>
        <span>&nbsp;{isMobile ? 'Probs' : 'Probability %'} </span><br />
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
    // Use the getFixtureDetails method which now uses component state
    const { scores, formattedScores, isFavorite, prediction, predictionStyle, highestProb, avgGoals, toggleFavoriteHandler } = getFixtureDetails(fixture);

    // Fallback for missing team names
    const homeTeamName = fixture.home_team_name || 'Home Team';
    const awayTeamName = fixture.away_team_name || 'Away Team';
    const fixtureId = fixture.fixture_id || index; // Use index as fallback key

    // Generate slug safely
    const homeSlug = homeTeamName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const awaySlug = awayTeamName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const linkHref = `/football-predictions/fixture/${homeSlug}-vs-${awaySlug}-${fixtureId}`;

    return (
      // Use fixtureId for the key for better reconciliation
      <Link key={fixtureId} href={linkHref} className="responsive-row team-link" style={{ 
        cursor: 'pointer', 
        textDecoration: 'none', 
        color: 'inherit'
      }}>
        <div className="match-time-wrapper">
          <div className="match-time">
            {fixture.date ? formatMatchTime(fixture.date) : '--:--'}
          </div>
        </div>
        <div className="league-info-wrapper">
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
                                  : fixture.country_flag || fixture.logo || '/path/to/default/flag.png'} // Add a default fallback image path
              className="img-fluid league-logo"
              alt={`${fixture.country_name || 'country'}-football-predictions`}
              loading="lazy"
              onError={(e) => { e.target.onerror = null; e.target.src='/path/to/default/flag.png'; }} // Handle broken image links
            />
          <span className="league-name">{fixture.league_name || 'League'}</span>
        </div>
        <div className="responsive-cell favorite-cell">
           {/* Pass event and fixtureId to handler */}
           <div className="favorite-desktop" onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleFavoriteHandler(e); }}>
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
           <div className="favorite-mobile" onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleFavoriteHandler(e); }}>
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
               <span className="team-name" style={{ fontWeight: 'bold' }}>{homeTeamName}</span><br />
               <span className="team-name" style={{ fontWeight: 'bold' }}>{awayTeamName}</span>
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
            <div className={`probability-item ${highestProb === 'home' ? 'highest-prob' : ''}`} style={{ 
              fontWeight: highestProb === 'home' ? 'bold' : 'normal',
              border: '1px solid #dee2e6',
              borderRadius: '3px',
              padding: '2px 4px',
              backgroundColor: highestProb === 'home' ? '#e3f2fd' : 'transparent',
              textAlign: 'center',
              fontSize: '0.8rem',
              width: '38px'
            }}>{fixture.percent_pred_home || '-'}</div>
            <div className={`probability-item ${highestProb === 'draw' ? 'highest-prob' : ''}`} style={{ 
              fontWeight: highestProb === 'draw' ? 'bold' : 'normal',
              border: '1px solid #dee2e6',
              borderRadius: '3px',
              padding: '2px 4px',
              backgroundColor: highestProb === 'draw' ? '#e3f2fd' : 'transparent',
              textAlign: 'center',
              fontSize: '0.8rem',
              width: '38px'
            }}>{fixture.percent_pred_draw || '-'}</div>
            <div className={`probability-item ${highestProb === 'away' ? 'highest-prob' : ''}`} style={{ 
              fontWeight: highestProb === 'away' ? 'bold' : 'normal',
              border: '1px solid #dee2e6',
              borderRadius: '3px',
              padding: '2px 4px',
              backgroundColor: highestProb === 'away' ? '#e3f2fd' : 'transparent',
              textAlign: 'center',
              fontSize: '0.8rem',
              width: '38px'
            }}>{fixture.percent_pred_away || '-'}</div>
          </div>
        </div>
        <div className="responsive-cell" title="Prediction">
          <span className="m-1">
            <span className="number-circle rounded-square" style={predictionStyle}>
              {prediction}
            </span>
          </span>
          <span></span>
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
              ) : fixture.status_short === "AET" ? (
                <span className="match-status">AET</span>
              ) : ["2H", "1H", "INT", "HT", "LIVE"].includes(fixture.status_short) ? (
                <div className="match-status-live">
                  {["1H", "2H"].includes(fixture.status_short) ?
                    `${fixture.status_elapsed || fixture.status_short}` : // Use elapsed time if available
                    fixture.status_short
                  }
                  {/* Blinking only if elapsed time exists */}
                  {fixture.status_short !== "HT" && fixture.status_elapsed && (
                    <span className="blink_text">&nbsp;'</span>
                  )}
                </div>
              ) : null}
            </div>
            <div className="scores-display">
              <span className={`${formattedScores.display !== '-' ? 'scores-card' : 'no-score'} ${["2H", "1H", "INT", "HT", "LIVE"].includes(fixture.status_short) ? 'live' : ''}`} id="fulltimeGoals">
                {formattedScores.display}
              </span>
              {formattedScores.hasExtraTime && (
                <span className="fullTimeDataDisplay" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                  (FT: {formattedScores.fullTimeDisplay})
                </span>
              )}
              {/* Display halftime only if available */}
              {scores.halftime.home !== null && scores.halftime.away !== null && (
                <span className="halfTimeDataDisplay">
                  {`(HT: ${scores.halftime.home}-${scores.halftime.away})`}
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
                          {league.fixtures.map((fixture, index) => renderFixture(fixture, index))}
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
};

export default FixturesList; 