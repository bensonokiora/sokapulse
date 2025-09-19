'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { fetchUpcomingFixtures } from '@/utils/api';
import NavigationRow from '@/components/NavigationRow';
import LoadingAnimation from '@/components/LoadingAnimation';
import '@/styles/custom.css'; // Use correct path
import { getPrediction, getHighestProbability, validatePrediction } from '@/utils/predictionUtils';
import { formatMatchTime } from '@/utils/dateUtils';
import SeoContent from '@/components/SeoContent'; // Keep if needed on client


export default function UpcomingFixturesClient({ initialFixtures, initialDate, initialHasMore, initialNextCursor }) {
  console.log("--- UpcomingFixturesClient Initial Props ---");
  console.log("initialFixtures length:", initialFixtures?.length);
  console.log("initialHasMore:", initialHasMore);
  console.log("initialNextCursor:", initialNextCursor);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [fixtures, setFixtures] = useState(initialFixtures || []);
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(initialHasMore || false);
  const [nextCursor, setNextCursor] = useState(initialNextCursor || null);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [isClientLoading, setIsClientLoading] = useState(false); // Loading state for date changes


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

  // Fetch fixtures when date changes on the client
  const fetchFixturesForDate = async (date) => {
    setIsClientLoading(true); // Use client loading state
    setError(null);
    setFixtures([]); // Clear existing fixtures for new date
    setHasMore(true); // Optimistically set to true
    setNextCursor('1'); // Reset cursor for new date

    try {
      const formattedDate = formatDate(date);
      console.log('Client fetching initial upcoming fixtures for date:', formattedDate);

      // Fetch initial batch for the new date using pagination
      const response = await fetchUpcomingFixtures(formattedDate, 20, '1');
      console.log('Client API response for new date:', response);

      if (response.status === true && Array.isArray(response.data)) {
        setFixtures(response.data);
        setNextCursor(response.nextCursor);
        setHasMore(!!response.nextCursor);
      } else {
        console.error('Client API error on date change:', response.message);
        setError(response.message || 'Failed to load fixtures');
        setFixtures([]);
        setHasMore(false);
        setNextCursor(null);
      }
    } catch (err) {
      console.error('Client fetch error on date change:', err);
      setError('Error loading fixtures');
      setFixtures([]);
      setHasMore(false);
      setNextCursor(null);
    } finally {
      setIsClientLoading(false);
    }
  };

  // Load More Fixtures
  const loadMoreFixtures = async () => { 
    if (isLoadingMore || !hasMore || !nextCursor) return;

    setIsLoadingMore(true);
    setError(null);

    try {
        const formattedDate = formatDate(selectedDate);
        console.log(`Client: Loading more upcoming fixtures for ${formattedDate}, cursor: ${nextCursor}`);
        const response = await fetchUpcomingFixtures(formattedDate, 20, nextCursor);

        if (response.status === true && Array.isArray(response.data)) {
            const newFixtures = response.data.filter(
                (newFixture) => !fixtures.some((existing) => existing.fixture_id === newFixture.fixture_id)
            );
            setFixtures(prev => [...prev, ...newFixtures]);
            setNextCursor(response.nextCursor);
            setHasMore(!!response.nextCursor);
            console.log(`Loaded more. Total now: ${fixtures.length + newFixtures.length}, Next Cursor: ${response.nextCursor}, HasMore: ${!!response.nextCursor}`);
        } else {
            console.error('Client API error on load more:', response.message);
            setError(response.message || 'Failed to load more fixtures');
            setHasMore(false); // Stop if API error
            setNextCursor(null);
        }
    } catch (err) {
        console.error('Client error loading more fixtures:', err);
        setError('Error loading more fixtures.'); 
        setHasMore(false);
        setNextCursor(null);
    } finally {
        setIsLoadingMore(false);
    }
  };

   // Effect to set initial state from props, including nextCursor
    useEffect(() => {
        console.log("--- UpcomingFixturesClient useEffect --- Props Update ---");
        console.log({ initialFixturesLen: initialFixtures?.length, initialDate, initialHasMore, initialNextCursor });
        setFixtures(initialFixtures || []);
        setSelectedDate(initialDate || new Date().toISOString().split('T')[0]);
        setHasMore(initialHasMore || false);
        setNextCursor(initialNextCursor || null);
        // Reset loading states
        setIsClientLoading(false);
        setIsLoadingMore(false);
        setError(null);
    }, [initialFixtures, initialDate, initialHasMore, initialNextCursor]);


  // Handle date selection change
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    // Update URL without full page reload
    window.history.pushState({}, '', `/upcoming-football-predictions?date=${newDate}`);
    // Fetch data for the new date
    fetchFixturesForDate(newDate);
  };


  // Initialize favorite states from localStorage on client mount
  useEffect(() => {
    const favoriteData = JSON.parse(localStorage.getItem('mymatchesdata'));
    if (favoriteData?.dataArray) {
      const states = {};
      favoriteData.dataArray.forEach(item => {
        states[item.fixture_id] = true;
      });
      setFavoriteStates(states);
    }

    // Listen for storage changes to update favorites across tabs/components
     const handleStorageChange = () => {
        const updatedFavoriteData = JSON.parse(localStorage.getItem('mymatchesdata'));
         if (updatedFavoriteData?.dataArray) {
             const updatedStates = {};
             updatedFavoriteData.dataArray.forEach(item => {
                 updatedStates[item.fixture_id] = true;
             });
             setFavoriteStates(updatedStates);
         } else {
             setFavoriteStates({}); // Clear if data removed
         }
     };

     window.addEventListener('storage', handleStorageChange);


      // Check if mobile on mount and resize
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      checkIfMobile();
      window.addEventListener('resize', checkIfMobile);

      // Cleanup
      return () => {
          window.removeEventListener('resize', checkIfMobile);
          window.removeEventListener('storage', handleStorageChange);
      };
  }, []); // Run only on mount


  const getFixtureDetails = (fixture) => {
    // Safely access nested properties, provide defaults
    const scores = JSON.parse(fixture.scores || '{}'); // Default to empty object if null/undefined
    const fulltimeScores = scores.fulltime || { home: null, away: null };
    const halftimeScores = scores.halftime || { home: null, away: null };

    const homeFor = parseInt(fixture.teams_perfomance_home_for || 0);
    const homeAgainst = parseInt(fixture.teams_perfomance_home_aganist || 0);
    const awayFor = parseInt(fixture.teams_perfomance_away_for || 0);
    const awayAgainst = parseInt(fixture.teams_perfomance_away_aganist || 0);
    const homePlayed = parseInt(fixture.teams_games_played_home || 0);
    const awayPlayed = parseInt(fixture.teams_games_played_away || 0);
    const totalPlayed = homePlayed + awayPlayed;

    // Use avg_performance from API instead of calculating it manually
    const avgGoals = fixture.avg_performance ? 
      parseFloat(fixture.avg_performance).toFixed(2) : 
      (totalPlayed > 0 ? ((homeFor + homeAgainst + awayFor + awayAgainst) / totalPlayed).toFixed(2) : '0.00');

    const predHome = fixture.percent_pred_home?.replace('%', '') || '0';
    const predDraw = fixture.percent_pred_draw?.replace('%', '') || '0';
    const predAway = fixture.percent_pred_away?.replace('%', '') || '0';

    const prediction = getPrediction(predHome, predDraw, predAway);
    const predictionStyle = validatePrediction(prediction, { fulltime: fulltimeScores, halftime: halftimeScores }, fixture.status_long);
    const highestProb = getHighestProbability(predHome, predDraw, predAway);

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
         if (!favoriteData.dataArray.some(item => item.fixture_id === fixture.fixture_id)) {
             favoriteData.dataArray.push({ fixture_id: fixture.fixture_id });
         }
      } else {
        favoriteData.dataArray = favoriteData.dataArray.filter(
          item => item.fixture_id !== fixture.fixture_id
        );
      }

      // Set expiry for local storage data (optional but good practice)
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7); // Example: 7-day expiry
      favoriteData.expiry = expiry.getTime();

      localStorage.setItem('mymatchesdata', JSON.stringify(favoriteData));

      // Dispatch storage event to notify other components/tabs
      window.dispatchEvent(new Event('storage'));
    };

    return {
      scores: { fulltime: fulltimeScores, halftime: halftimeScores }, // Return structured scores
      isFavorite,
      prediction,
      predictionStyle,
      highestProb,
      avgGoals,
      toggleFavorite
    };
  };


   const renderPredictionNav = () => (
    <div className="match-details-navigation">
    <div className="match-details-nav-item">
      <Link href="/upcoming-football-predictions" className="match-details-nav-link active ">
        <span>1x2</span>
      </Link>
    </div>
    <div className="match-details-nav-item">
      <Link href="/upcoming-football-predictions/double-chance-predictions" className="match-details-nav-link ">
        <span>Double Chance</span>
      </Link>
    </div>
    <div className="match-details-nav-item">
      <Link href="/upcoming-football-predictions/predictions-under-over-goals" className="match-details-nav-link  ">
        <span>Under/Over 2.5</span>
      </Link>
    </div>
    <div className="match-details-nav-item">
      <Link href="/upcoming-football-predictions/predictions-both-team-to-score" className="match-details-nav-link">
        <span>Both Team to Score</span>
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

  // Update the renderFixture function to match homepage exactly
  const renderFixture = (fixture, index) => {
    const { scores, isFavorite, prediction, predictionStyle, highestProb, avgGoals, toggleFavorite } = getFixtureDetails(fixture);

    return (
      <div
        key={fixture.fixture_id || fixture.id || index} // Use a reliable key
        className="responsive-row"
        style={{ cursor: 'auto' }}
      >
        <div className="match-time-wrapper">
          <div className="match-time">
            {formatMatchTime(fixture.date)}
          </div>
        </div>
        <div className="league-info-wrapper">
          {/* Simplified flag logic for robustness */}
          <img src={fixture.country_flag || fixture.logo} className="img-fluid league-logo" alt={`${fixture.country_name || 'League'}-football-predictions`} loading="lazy" onError={(e) => e.target.style.display='none'} /> {/* Handle image errors */}
          <span className="league-name">{fixture.league_name || 'Unknown League'}</span>
        </div>
        <div className="responsive-cell favorite-cell">
          <div className="favorite-desktop" onClick={toggleFavorite} title={isFavorite ? "Remove from My Matches" : "Add to My Matches"}>
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
           <div className="favorite-mobile" onClick={toggleFavorite} title={isFavorite ? "Remove from My Matches" : "Add to My Matches"}>
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
              <span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.home_team_name || 'Home Team'}</span><br />
              <span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.away_team_name || 'Away Team'}</span>
            </div>
          </Link>
        </div>
        <div className="responsive-cell team-link-probability" style={{ whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: highestProb === 'home' ? 'bold' : 'normal' }}>{fixture.percent_pred_home || '0%'}</span>&nbsp;
          <span style={{ fontWeight: highestProb === 'draw' ? 'bold' : 'normal' }}>{fixture.percent_pred_draw || '0%'}</span>&nbsp;
          <span style={{ fontWeight: highestProb === 'away' ? 'bold' : 'normal' }}>{fixture.percent_pred_away || '0%'}</span>
        </div>
        <div className="responsive-cell" title="Prediction">
          <span className="m-1">
            <span className={`number-circle rounded-square ${predictionStyle.backgroundColor ? '' : 'default-prediction-style'}`} style={predictionStyle}> {/* Added default style class */}
              {prediction || '?'} {/* Handle cases where prediction might be null */}
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
                  {["1H", "2H"].includes(fixture.status_short) ?
                    `${fixture.status_elapased}'` : // Added apostrophe
                    fixture.status_short
                  }
                  {fixture.status_short !== "HT" && fixture.status_elapased && (
                    <span className="blink_text">&nbsp;</span> // Simplified blinking
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

  return (
    <div className="container container-mob mx-auto px-0 sm:px-4">
      <NavigationRow selectedDate={selectedDate} onDateChange={handleDateChange} />

      {renderPredictionNav()} {/* Render the prediction type navigation */}
      {renderFixturesHeader()}

      {isClientLoading ? (
        <div className="loading-container">
          <LoadingAnimation text="Loading matches..." />
        </div>
      ) : error ? (
        <div className="error-message text-center p-4 text-red-500">{error}</div>
      ) : fixtures.length === 0 ? (
        <div className="no-fixtures-message text-center p-4 text-gray-500">No fixtures available for {selectedDate}</div>
      ) : (
        <>
          {fixtures.map((fixture, index) => (
            // Remove ref from div
            <div key={fixture.fixture_id || index} /* ref={index === fixtures.length - 1 ? lastFixtureElementRef : null} */>
              {renderFixture(fixture, index)}
            </div>
          ))}

          {/* Conditionally render the Load More button */} 
          {hasMore && (
            <div className="load-more text-center p-4">
              <button 
                className="btn btn-success btn-sm px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                onClick={loadMoreFixtures}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? 'Loading...' : 'Load More Matches'}
              </button>
            </div>
          )}
        </>
      )}
       {/* SEO Content might be better placed in the server component if static */}
      {/* <SeoContent pageType="upcoming" siteName="SokaPulse" /> */}
    </div>
  );
} 