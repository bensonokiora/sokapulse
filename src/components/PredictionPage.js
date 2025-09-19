'use client';

import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import NavigationRow from '@/components/NavigationRow';
import '../styles/custom.css';
import LoadingAnimation from '@/components/LoadingAnimation';
import { getPrediction, getHighestProbability, validatePrediction } from '@/utils/predictionUtils';
import { formatMatchTime } from '@/utils/dateUtils';
import SeoContent from '@/components/SeoContent';
import OptimizedTitle from '@/components/OptimizedTitle';
import { fetchFixturesByDatePaginated } from '@/utils/api';

// Helper function to parse scores safely (similar to FixturesList)
const safeParseScores = (scoresString) => {
  try {
    const scores = JSON.parse(scoresString);
    if (scores && typeof scores.fulltime === 'object' && typeof scores.halftime === 'object') {
      return scores;
    }
  } catch (e) {
    console.error("Error parsing scores JSON:", e);
  }
  return { fulltime: { home: null, away: null }, halftime: { home: null, away: null } };
};

// formatDate is now primarily used for display if needed, API expects YYYY-MM-DD string directly
const formatDateForDisplay = (dateInput) => {
  if (typeof dateInput === 'string' && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
    // If it's already a YYYY-MM-DD string, you might return it as is or format for display
    // For consistency, let's assume this function is for display and might reformat
    const [year, month, day] = dateInput.split('-');
    return `${day}/${month}/${year}`; // Example: DD/MM/YYYY for display
  }
  const dateObj = new Date(dateInput);
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date'; // Handle invalid date input for display
  }
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // Or return YYYY-MM-DD if that's the desired display
};

const FIXTURES_PER_PAGE = 20; // Define pagination size

// Re-add initial data props
export default function PredictionFixturesDisplay({
  initialFixtures,
  initialDate, // This will now be a 'YYYY-MM-DD' string
  initialError,
  initialNextCursor, // Added prop
  perPage, // Added prop
  pageTitle,
  metaDescription,
  pageType = 'default',
  siteName = 'SokaPulse'
}) {
  const [fixtures, setFixtures] = useState(initialFixtures || []);
  const [isLoading, setIsLoading] = useState(!(initialFixtures && initialFixtures.length > 0) && !initialError);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(!!initialNextCursor); // Initialize based on initialNextCursor
  const [currentNextCursor, setCurrentNextCursor] = useState(initialNextCursor); // Store the cursor
  const [error, setError] = useState(initialError);
  const [loadMoreError, setLoadMoreError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Effect to update state when initial props change
  useEffect(() => {
    setFixtures(initialFixtures || []);
    setError(initialError || null);
    setCurrentNextCursor(initialNextCursor);
    setHasMore(!!initialNextCursor);
    setSelectedDate(initialDate || new Date().toISOString().split('T')[0]);
    // Determine initial loading state
    setIsLoading(!(initialFixtures && initialFixtures.length > 0) && !initialError);
  }, [initialFixtures, initialError, initialNextCursor, initialDate]);

  const fetchPaginatedData = useCallback(async (dateString, cursor) => {
    try {
      const apiResponse = await fetchFixturesByDatePaginated(dateString, perPage, cursor);
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
      console.error('PredictionDisplay: Error fetching paginated data:', err);
      return {
        newFixtures: [],
        nextPageCursor: null,
        apiError: 'Error fetching fixtures',
      };
    }
  }, [perPage]); // perPage is a dependency

  const refreshMatchData = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setError(null);
    setLoadMoreError(null);
    console.log(`PredictionDisplay: Refreshing data for date ${selectedDate}`);

    const { newFixtures, nextPageCursor, apiError } = await fetchPaginatedData(selectedDate, '1');

    if (apiError) {
      setError(apiError);
      setFixtures([]);
      setHasMore(false);
      setCurrentNextCursor(null);
    } else {
      setFixtures(newFixtures);
      setCurrentNextCursor(nextPageCursor);
      setHasMore(!!nextPageCursor);
      setLastRefreshTime(new Date());
    }
    setIsRefreshing(false);
  }, [selectedDate, isRefreshing, fetchPaginatedData]);

  const loadMoreFixtures = useCallback(async () => {
    if (isLoadingMore || !hasMore || !currentNextCursor) return;

    setIsLoadingMore(true);
    setLoadMoreError(null);
    console.log(`PredictionDisplay: Loading more for date ${selectedDate} with cursor ${currentNextCursor}`);

    const { newFixtures, nextPageCursor, apiError } = await fetchPaginatedData(selectedDate, currentNextCursor);

    if (apiError) {
      setLoadMoreError(apiError);
      // Optionally setHasMore(false) or let the user try again
    } else {
      setFixtures(prevFixtures => {
        const existingFixtureIds = new Set(prevFixtures.map(f => f.fixture_id));
        const uniqueNewFixtures = newFixtures.filter(f => !existingFixtureIds.has(f.fixture_id));
        return [...prevFixtures, ...uniqueNewFixtures];
      });
      setCurrentNextCursor(nextPageCursor);
      setHasMore(!!nextPageCursor);
    }
    setIsLoadingMore(false);
  }, [isLoadingMore, hasMore, currentNextCursor, selectedDate, fetchPaginatedData]);

  const handleDateChange = useCallback(async (e) => {
    const newDateString = e.target.value; // Assuming date input gives YYYY-MM-DD
    if (!newDateString || !newDateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        console.error("Invalid date string from event target (PredictionDisplay):", newDateString);
        // Optionally set an error state to inform the user
        return; 
    }
    setSelectedDate(newDateString);
    setIsLoading(true);
    setError(null);
    setLoadMoreError(null);
    setFixtures([]); // Clear existing fixtures
    console.log(`PredictionDisplay: Date changed to ${newDateString}, fetching initial data.`);

    const { newFixtures, nextPageCursor, apiError } = await fetchPaginatedData(newDateString, '1');

    if (apiError) {
      setError(apiError);
      setHasMore(false);
      setCurrentNextCursor(null);
    } else {
      setFixtures(newFixtures);
      setCurrentNextCursor(nextPageCursor);
      setHasMore(!!nextPageCursor);
    }
    setIsLoading(false);
  }, [fetchPaginatedData]);

  // useEffect for localStorage (favorites) - Keep as is, but ensure safe parsing
  useEffect(() => {
    const favoriteData = JSON.parse(localStorage.getItem('mymatchesdata') || '{ "dataArray": [] }');
    if (favoriteData?.dataArray) {
      const states = {};
      favoriteData.dataArray.forEach(item => {
        if (item && item.fixture_id !== undefined) {
             states[item.fixture_id] = true;
        }
      });
      setFavoriteStates(states);
    }
  }, []);

  // useEffect for isMobile check - Keep as is
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Auto-refresh interval - Use refreshMatchData
  useEffect(() => {
    const interval = setInterval(() => {
        // Only refresh if there are fixtures and not already refreshing
        if (fixtures.length > 0 && !isRefreshing) {
             refreshMatchData();
        }
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [refreshMatchData, fixtures.length, isRefreshing]); // Add dependencies

  // renderPredictionNav - Keep as is
  const renderPredictionNav = () => (
    <div className="match-details-navigation">
      <div className="match-details-nav-item">
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
          <span>BTTS</span>
        </Link>
      </div>
    </div>
  );

  // renderFixturesHeader - Keep as is
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

  // Toggle Favorite Logic - Keep as is, ensure safe parsing
  const toggleFavorite = (e, fixtureId) => {
    e.preventDefault();
    e.stopPropagation();

    const newState = !favoriteStates[fixtureId];
    // Ensure localStorage parsing is safe
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
        item => item && item.fixture_id !== fixtureId // Add check for item validity
      );
    }

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    favoriteData.expiry = expiry.getTime();

    localStorage.setItem('mymatchesdata', JSON.stringify(favoriteData));
    window.dispatchEvent(new Event('storage'));
  };

  // getFixtureDetails - Adapt to use safeParseScores and handle potential nulls
  const getFixtureDetails = (fixture) => {
    const scores = safeParseScores(fixture.scores); // Use safe parsing

    const homeGames = parseInt(fixture.teams_games_played_home) || 0;
    const awayGames = parseInt(fixture.teams_games_played_away) || 0;
    const totalGames = homeGames + awayGames;
    let avgGoals = 'N/A';
    if (totalGames > 0) {
        const homeFor = parseInt(fixture.teams_perfomance_home_for) || 0;
        const homeAgainst = parseInt(fixture.teams_perfomance_home_aganist) || 0;
        const awayFor = parseInt(fixture.teams_perfomance_away_for) || 0;
        const awayAgainst = parseInt(fixture.teams_perfomance_away_aganist) || 0;
        avgGoals = ((homeFor + homeAgainst + awayFor + awayAgainst) / totalGames).toFixed(2);
    }

    const predictionPercentages = {
      home: fixture.percent_pred_home?.replace('%', '') || '0',
      draw: fixture.percent_pred_draw?.replace('%', '') || '0',
      away: fixture.percent_pred_away?.replace('%', '') || '0'
    };
    const prediction = getPrediction(predictionPercentages.home, predictionPercentages.draw, predictionPercentages.away);
    const predictionStyle = validatePrediction(prediction, scores, fixture.status_long, fixture);
    const highestProb = getHighestProbability(predictionPercentages.home, predictionPercentages.draw, predictionPercentages.away);
    const isFavorite = favoriteStates[fixture.fixture_id] || false;

    return {
      scores,
      isFavorite,
      prediction,
      predictionStyle,
      highestProb,
      avgGoals,
      toggleFavoriteHandler: (e) => toggleFavorite(e, fixture.fixture_id) // Pass handler
    };
  };

  // renderFixture - Adapt similarly to FixturesList for safety and consistency
  const renderFixture = (fixture, index) => {
     const { scores, isFavorite, prediction, predictionStyle, highestProb, avgGoals, toggleFavoriteHandler } = getFixtureDetails(fixture);

     const homeTeamName = fixture.home_team_name || 'Home Team';
     const awayTeamName = fixture.away_team_name || 'Away Team';
     const fixtureId = fixture.fixture_id ?? index; // Use fixture_id if available, else index

     // Generate slug safely
     const homeSlug = homeTeamName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
     const awaySlug = awayTeamName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
     const linkHref = fixture.fixture_id ? `/football-predictions/fixture/${homeSlug}-vs-${awaySlug}-${fixture.fixture_id}` : '#'; // Prevent link if no ID

     return (
       <div key={fixtureId} className="responsive-row" style={{ cursor: 'auto' }}>
         <div className="match-time-wrapper">
           <div className="match-time">
             {/* Use safe check for date */}
             {fixture.date ? formatMatchTime(fixture.date) : '--:--'}
           </div>
         </div>
         <div className="league-info-wrapper">
           <img
             src={fixture.country_flag === "https://seekflag.com/app/uploads/2022/01/England-01-1.svg"
                 ? "https://pngimg.com/uploads/england/england_PNG7.png"
                 // ... (keep other flag logic)
                 : fixture.country_flag === "https://seekflag.com/app/uploads/2022/01/Northern-Ireland-01-1.svg"
                     ? "https://cdn.britannica.com/92/3092-050-3A68D1DE/Flag-of-Northern-Ireland.jpg"
                     : fixture.country_flag || fixture.logo || '/img/default-flag.png'} // Add default fallback
             className="img-fluid league-logo"
             alt={`${fixture.country_name || 'country'}-football-predictions`}
             loading="lazy"
             onError={(e) => { e.target.onerror = null; e.target.src='/img/default-flag.png'; }} // Handle broken images
           />
           <span className="league-name">{fixture.league_name || 'League'}</span>
         </div>
         <div className="responsive-cell favorite-cell">
            {/* Use toggleFavoriteHandler */}
            <div className="favorite-desktop" onClick={toggleFavoriteHandler}>
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={isFavorite ? "red" : "currentColor"} className="bi bi-star-fill" viewBox="0 0 16 16">
               <path d={isFavorite ? "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" : "M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"} />
             </svg>
           </div>
           <div className="favorite-mobile" onClick={toggleFavoriteHandler}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={isFavorite ? "red" : "currentColor"} className="bi bi-star-fill" viewBox="0 0 16 16">
                  <path d={isFavorite ? "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" : "M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"} />
              </svg>
           </div>
         </div>
         <div className="responsive-cell team-link" title="Click to open match details">
           {/* Use safe linkHref */}
           <Link href={linkHref}>
             <div className="teamNameLink">
               <span className="team-name" style={{ fontWeight: 'bold' }}>{homeTeamName}</span><br />
               <span className="team-name" style={{ fontWeight: 'bold' }}>{awayTeamName}</span>
             </div>
           </Link>
         </div>
         <div className="responsive-cell team-link-probability" style={{ whiteSpace: 'nowrap' }}>
           <span style={{ fontWeight: highestProb === 'home' ? 'bold' : 'normal' }}>{fixture.percent_pred_home || '-'}</span>&nbsp;
           <span style={{ fontWeight: highestProb === 'draw' ? 'bold' : 'normal' }}>{fixture.percent_pred_draw || '-'}</span>&nbsp;
           <span style={{ fontWeight: highestProb === 'away' ? 'bold' : 'normal' }}>{fixture.percent_pred_away || '-'}</span>
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
               ) : ["2H", "1H", "INT", "HT", "LIVE"].includes(fixture.status_short) ? (
                 <div className="match-status-live">
                    {/* Use status_elapsed safely */}
                   {["1H", "2H"].includes(fixture.status_short) ?
                     `${fixture.status_elapsed ?? fixture.status_short}` :
                     fixture.status_short
                   }
                   {fixture.status_short !== "HT" && fixture.status_elapsed && (
                     <span className="blink_text">&nbsp;'</span>
                   )}
                 </div>
               ) : null}
             </div>
             <div className="scores-display">
               <span className={`${scores.fulltime.home !== null ? 'scores-card' : 'no-score'} ${["2H", "1H", "INT", "HT", "LIVE"].includes(fixture.status_short) ? 'live' : ''}`} id="fulltimeGoals">
                 {scores.fulltime.home !== null ? `${scores.fulltime.home} - ${scores.fulltime.away}` : '-'}
               </span>
               {/* Display halftime safely */}
               {scores.halftime.home !== null && scores.halftime.away !== null && (
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

  // --- Main Return ---
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>
        <div className="col-lg-12" style={{ height: 'auto !important' }}>
          {/* Header section using props */}
          <div className="responsive-row" style={{ textAlign: 'center', border: 'none', borderRadius: '5px', cursor: 'auto' }}>
            <div className="table-cell">
              <OptimizedTitle
                title={pageTitle || 'Free Football Predictions, Tips & Statistics'}
              />
              {metaDescription && <p style={{ fontSize: '14px', opacity: '0.85' }}>{metaDescription}</p>}
            </div>
          </div>

          {/* Navigation and Fixture display */}
          <NavigationRow selectedDate={selectedDate} onDateChange={handleDateChange} />
          {renderPredictionNav()}
          {renderFixturesHeader()}

          {/* Fixtures List Area - Now relies on internal isLoading */}
          <div>
            <div className="space-y-4">
              {error ? ( // Display initial error if passed as prop
                <div className="text-center p-4 text-red-500">{error}</div>
              ) : isLoading ? ( // Should only show loading on client-side actions
                <div className="flex justify-center items-center w-full h-32 my-4">
                  <LoadingAnimation text="Loading matches..." />
                </div>
              ) : fixtures.length === 0 ? ( // No fixtures message
                <div className="text-center p-4">No fixtures available for this date</div>
              ) : ( // Render fixtures
                fixtures.map((fixture, index) => renderFixture(fixture, index))
              )}

              {/* Loading More Indicator */}
              {isLoadingMore && (
                <div className="flex justify-center items-center w-full h-20 my-4">
                  <LoadingAnimation size={100} text="Loading more matches..." />
                </div>
              )}

              {/* Load More Button - Show only if not loading and has more */}
              {!isLoading && !isLoadingMore && hasMore && (
                <div className="load-more" style={{ textAlign: 'center', padding: '1.5rem' }}>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={loadMoreFixtures}
                    disabled={isLoadingMore} // Redundant check, but safe
                  >
                    Load More
                  </button>
                </div>
              )}

              {/* No more matches message */}
              {!isLoading && !isLoadingMore && !hasMore && fixtures.length > 0 && !error && (
                 <div className="text-center p-4 text-gray-500">No more matches for this date.</div>
              )}
            </div>
          </div>

          {/* SEO Content - Keep using props */}
          <div
            id="seo-content-priority-wrapper"
            style={{
              display: 'block',
              visibility: 'visible',
              contentVisibility: 'visible',
              contain: 'layout style',
              minHeight: '60px'
            }}
          >
            <SeoContent pageType={pageType} siteName={siteName} />
          </div>
        </div>
      </div>
    </div>
  );
} 