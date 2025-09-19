'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import LoadingAnimation from '@/components/LoadingAnimation';
import { getPrediction, getHighestProbability, validatePrediction } from '@/utils/predictionUtils';
import { formatMatchTime } from '@/utils/dateUtils';
import { fetchFixturesByDatePaginated } from '@/utils/api';
import '../styles/custom.css'; // Adjust path if necessary

export default function YesterdayFixturesDisplay({ 
  initialFixtures, 
  initialDate, 
  initialNextCursor, 
  perPage 
}) {

  const [allFixtures, setAllFixtures] = useState(initialFixtures || []);
  const [fixtures, setFixtures] = useState(initialFixtures || []);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(!!initialNextCursor);
  const [currentNextCursor, setCurrentNextCursor] = useState(initialNextCursor);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(null);

  const loadMoreFixtures = useCallback(async () => {
    if (isLoadingMore || !hasMore || !currentNextCursor) return;
    
    setIsLoadingMore(true);
    setLoadMoreError(null);

    try {
      const apiResponse = await fetchFixturesByDatePaginated(initialDate, perPage, currentNextCursor);

      if (apiResponse.status === true && Array.isArray(apiResponse.fixtures)) {
        const newFixtures = apiResponse.fixtures;
        
        setAllFixtures(prevAll => {
          const existingFixtureIds = new Set(prevAll.map(f => f.fixture_id));
          const uniqueNewFixtures = newFixtures.filter(f => !existingFixtureIds.has(f.fixture_id));
          return [...prevAll, ...uniqueNewFixtures];
        });

        setFixtures(prevDisplayed => {
            const existingFixtureIds = new Set(prevDisplayed.map(f => f.fixture_id));
            const uniqueNewFixtures = newFixtures.filter(f => !existingFixtureIds.has(f.fixture_id));
            return [...prevDisplayed, ...uniqueNewFixtures];
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
  }, [isLoadingMore, hasMore, currentNextCursor, initialDate, perPage]);

  // Initialize favorite states from localStorage
  useEffect(() => {
    let storedData = null;
    try {
        storedData = localStorage.getItem('mymatchesdata');
        const favoriteData = JSON.parse(storedData || '{ "dataArray": [] }');
        if (favoriteData?.dataArray && Array.isArray(favoriteData.dataArray)) {
            const states = {};
            favoriteData.dataArray.forEach(item => {
                if (item && item.fixture_id) { // Check item validity
                 states[item.fixture_id] = true;
                }
            });
            setFavoriteStates(states);
        }
    } catch (e) {
        console.error("Error parsing favorites from localStorage:", e, "Data:", storedData);
        setFavoriteStates({}); // Reset to empty object on error
    }
}, []);

  // Set initial fixtures and pagination state from props
  useEffect(() => {
    setFixtures(initialFixtures || []);
    setAllFixtures(initialFixtures || []);
    setCurrentNextCursor(initialNextCursor);
    setHasMore(!!initialNextCursor);
  }, [initialFixtures, initialNextCursor]);

  // Check for mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile(); // Initial check
    window.addEventListener('resize', checkIfMobile);
    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Navigation links specific to Yesterday's predictions
  const renderPredictionNav = () => (
    <div className="match-details-navigation">
        <div className="match-details-nav-item">
          <Link href="/yesterday-football-predictions" className="match-details-nav-link active ">
            <span>1x2</span>
          </Link>
        </div>
        <div className="match-details-nav-item">
          <Link href="/yesterday-football-predictions/double-chance-predictions" className="match-details-nav-link ">
            <span>Double Chance</span>
          </Link>
        </div>
        <div className="match-details-nav-item">
          <Link href="/yesterday-football-predictions/predictions-under-over-goals" className="match-details-nav-link  ">
            <span>Under/Over 2.5</span>
          </Link>
        </div>
        <div className="match-details-nav-item">
          <Link href="/yesterday-football-predictions/predictions-both-team-to-score" className="match-details-nav-link">
            <span>BTTS</span>
          </Link>
        </div>
    </div>
  );

  // Header row for the fixtures table
  const renderFixturesHeader = () => (
    <div className="responsive-row header-size" style={{ fontWeight: 'bold', textAlign: 'left', cursor: 'auto' }}>
      {/* Column for Time/League logo */}
      <div className="responsive-cell"></div> 
      {/* Column for Teams */}
      <div className="responsive-cell team-link-probability" style={{ textAlign: 'left', fontWeight: 'bold' }}>
        <span>Teams</span><br />
      </div>
      {/* Column for Probabilities */}
      <div className="responsive-cell team-link-probability" style={{ whiteSpace: 'pre-wrap', fontWeight: 'bold' }}>
         <span>&nbsp;{isMobile ? 'Probs' : 'Probability %'} </span><br />
        <span>1&nbsp;&nbsp;X&nbsp;&nbsp;2</span>
      </div>
      {/* Column for Prediction */}
      <div className="responsive-cell">{isMobile ? 'Pred' : 'Prediction'}</div>
      {/* Column for Avg Goals */}
      <div className="responsive-cell hide-on-mobile">Avg<br/>goals</div>
      {/* Column for Odds */}
      <div className="responsive-cell">Odds</div>
      {/* Column for Scores */}
      <div className="responsive-cell">
        <div className="row">
          <div className="col-md-12 col-sm-12 col-xs-12">Scores</div>
        </div>
      </div>
    </div>
  );

  // Function to process and prepare details for a single fixture
  const getFixtureDetails = (fixture) => {
    // Safely parse scores, providing a default structure if parsing fails or data is missing
    let scores = { 
      halftime: { home: null, away: null }, 
      fulltime: { home: null, away: null },
      extratime: { home: null, away: null }
    };
    
    try {
      if (fixture.scores) {
        const parsedScores = JSON.parse(fixture.scores);
        // Basic validation of parsed structure
        if (parsedScores && typeof parsedScores === 'object') {
          scores = {
            halftime: parsedScores.halftime || { home: null, away: null },
            fulltime: parsedScores.fulltime || { home: null, away: null },
            extratime: parsedScores.extratime || { home: null, away: null }
          };
        }
      }
    } catch (e) {
      console.error("Error parsing scores JSON:", e, "Fixture ID:", fixture.fixture_id, "Scores:", fixture.scores);
    }
    
    // Calculate formatted scores with support for extra time
    const formattedScores = getFormattedScores(fixture, scores);

    // Calculate average goals safely
    const homeFor = parseInt(fixture.teams_perfomance_home_for || 0);
    const homeAganist = parseInt(fixture.teams_perfomance_home_aganist || 0);
    const awayFor = parseInt(fixture.teams_perfomance_away_for || 0);
    const awayAganist = parseInt(fixture.teams_perfomance_away_aganist || 0);
    const homePlayed = parseInt(fixture.teams_games_played_home || 0);
    const awayPlayed = parseInt(fixture.teams_games_played_away || 0);
    const totalGames = homePlayed + awayPlayed;
    
    // Use avg_performance from API instead of calculating it manually
    const avgGoals = fixture.avg_performance ? 
      parseFloat(fixture.avg_performance).toFixed(2) : 
      (totalGames > 0 ? ((homeFor + homeAganist + awayFor + awayAganist) / totalGames).toFixed(2) : '0.00');

    // Get prediction details safely
    const prediction = getPrediction(
      fixture.percent_pred_home?.replace('%', '') || '0',
      fixture.percent_pred_draw?.replace('%', '') || '0',
      fixture.percent_pred_away?.replace('%', '') || '0'
    );
    
    // Create a modified scores object for validation that uses goals_home and goals_away
    const scoresForValidation = { 
      ...scores,
      fulltime: { 
        home: parseInt(fixture.goals_home) || null, 
        away: parseInt(fixture.goals_away) || null 
      }
    };
    
    const predictionStyle = validatePrediction(prediction, scoresForValidation, fixture.status_long);
    const highestProb = getHighestProbability(
      fixture.percent_pred_home?.replace('%', '') || '0',
      fixture.percent_pred_draw?.replace('%', '') || '0',
      fixture.percent_pred_away?.replace('%', '') || '0'
    );

    // Check favorite status
    const isFavorite = favoriteStates[fixture.fixture_id] || false;

    // Function to toggle favorite status
    const toggleFavorite = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const fixtureId = fixture.fixture_id;
      if (!fixtureId) return; // Prevent action if fixture_id is missing
      
      const newState = !isFavorite;
      let favoriteData = { dataArray: [] };
      try {
          const storedData = localStorage.getItem('mymatchesdata');
          if (storedData) {
              const parsedData = JSON.parse(storedData);
              // Ensure dataArray exists and is an array
              if (parsedData && Array.isArray(parsedData.dataArray)) {
                 favoriteData = parsedData;
              } else if (parsedData && !Array.isArray(parsedData.dataArray)) {
                 // Handle cases where dataArray might not be an array (e.g., old format)
                 console.warn("Favorites dataArray is not an array, resetting.");
                 favoriteData = { dataArray: [] };
              }
          } 
      } catch (parseError) {
          console.error("Error parsing favorites from localStorage:", parseError);
          favoriteData = { dataArray: [] }; // Reset on error
      }

      // Update UI state immediately
      setFavoriteStates(prev => ({ ...prev, [fixtureId]: newState }));

      // Update the data array for localStorage
      if (newState) {
          // Add only if not already present
          if (!favoriteData.dataArray.some(item => item && item.fixture_id === fixtureId)) {
              favoriteData.dataArray.push({ fixture_id: fixtureId });
          }
      } else {
          favoriteData.dataArray = favoriteData.dataArray.filter(
              item => item && item.fixture_id !== fixtureId
          );
      }

      // Set expiry and save to localStorage
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7); // 7-day expiry
      favoriteData.expiry = expiry.getTime();

      try {
          localStorage.setItem('mymatchesdata', JSON.stringify(favoriteData));
          window.dispatchEvent(new Event('storage')); // Notify other parts of the app
      } catch (storageError) {
          console.error("Error saving favorites to localStorage:", storageError);
          // Optionally revert UI state or show error to user
          setFavoriteStates(prev => ({ ...prev, [fixtureId]: !newState }));
      }
    };

    return {
      scores,
      formattedScores,
      isFavorite,
      prediction,
      predictionStyle,
      highestProb,
      avgGoals,
      toggleFavorite
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

  // Function to render a single fixture row
  const renderFixture = (fixture, index) => {
      // Check if fixture object and essential data exist
      if (!fixture || !fixture.fixture_id) {
        console.warn('Skipping rendering of invalid fixture data:', fixture);
        return null; // Don't render if fixture data is incomplete
      }

      const { scores, formattedScores, isFavorite, prediction, predictionStyle, highestProb, avgGoals, toggleFavorite } = getFixtureDetails(fixture);

      // Construct team names safely
      const homeTeamName = fixture.home_team_name || 'Home Team';
      const awayTeamName = fixture.away_team_name || 'Away Team';

      // Construct fixture link safely
      const fixtureLink = `/football-predictions/fixture/${homeTeamName.toLowerCase().replace(/\s+/g, '-')}-vs-${awayTeamName.toLowerCase().replace(/\s+/g, '-')}-${fixture.fixture_id}`;

      return (
          <div key={`${fixture.fixture_id}-${index}`} className="responsive-row" style={{ cursor: 'auto' }}>
              {/* Match Time */}
              <div className="match-time-wrapper">
                <div className="match-time">
                  {fixture.date ? formatMatchTime(fixture.date) : '--:--'}
                </div>
              </div>
              {/* League Info */}
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
                      : fixture.country_flag || fixture.logo || ''} /* Add fallback for missing logo */
                      className="img-fluid league-logo" 
                      alt={`${fixture.country_name || 'Country'}-football-predictions`} 
                      loading="lazy" 
                      onError={(e) => { e.target.style.display='none'}} /* Hide if image fails */
                />
                <span className="league-name">{fixture.league_name || 'League'}</span>
              </div>
               {/* Favorite Toggle */}
               <div className="responsive-cell favorite-cell">
                    <div className="favorite-icon" onClick={toggleFavorite} title={isFavorite ? "Remove from favorites" : "Add to favorites"} style={{ cursor: 'pointer' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          fill={isFavorite ? "red" : "currentColor"} 
                          className={`bi bi-star-fill ${isFavorite ? 'favorite-active' : ''}`} 
                          viewBox="0 0 16 16">
                        {/* SVG Path remains the same */}
                        <path d={isFavorite ? 
                          "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" :
                          "M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"} 
                        />
                      </svg>
                    </div>
                </div>
              {/* Teams Link */}
              <div className="responsive-cell team-link" title="Click to open match details">
                <Link href={fixtureLink}>
                  <div className="teamNameLink">
                    <span className="team-name" style={{ fontWeight: 'bold' }}>{homeTeamName}</span><br />
                    <span className="team-name" style={{ fontWeight: 'bold' }}>{awayTeamName}</span>
                  </div>
                </Link>
              </div>
              {/* Probabilities */}
              <div className="responsive-cell team-link-probability" style={{ whiteSpace: 'nowrap' }}>
                <span style={{ fontWeight: highestProb === 'home' ? 'bold' : 'normal' }}>{fixture.percent_pred_home || '-'}</span>&nbsp;
                <span style={{ fontWeight: highestProb === 'draw' ? 'bold' : 'normal' }}>{fixture.percent_pred_draw || '-'}</span>&nbsp;
                <span style={{ fontWeight: highestProb === 'away' ? 'bold' : 'normal' }}>{fixture.percent_pred_away || '-'}</span>
              </div>
              {/* Prediction */}
              <div className="responsive-cell" title="Prediction">
                <span className="m-1">
                  <span className="number-circle rounded-square" style={predictionStyle}>
                    {prediction}
                  </span>
                </span>
              </div>
              {/* Avg Goals */}
              <div className="responsive-cell hide-on-mobile" title="Average Goals">{avgGoals}</div>
              {/* Odds */}
              <div className="responsive-cell" title="Odds">
                <div className="odds-container">
                  <div style={{ fontWeight: prediction === '1' ? 'bold' : 'normal' }}>{fixture.bets_home || '-'}</div>
                  <div style={{ fontWeight: prediction === 'X' ? 'bold' : 'normal' }}>{fixture.bets_draw || '-'}</div>
                  <div style={{ fontWeight: prediction === '2' ? 'bold' : 'normal' }}>{fixture.bets_away || '-'}</div>
                </div>
              </div>
              {/* Scores */}
              <div className="responsive-cell" title="Scores">
                <div className="score-container">
                  <div className="match-status-wrapper">
                    {/* Display status like FT, HT, LIVE etc. */}
                    {fixture.status_short === "FT" || fixture.status_short === "ABD" ? (
                      <span className="match-status">{fixture.status_short}</span>
                    ) : fixture.status_short === "AET" ? (
                      <span className="match-status">AET</span>
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
                    ) : (fixture.status_short || 'NS')} {/* Fallback for other statuses like NS (Not Started) */}
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
                    {/* Display halftime score if available */}
                    {scores.halftime.home !== null && (
                      <span className="halfTimeDataDisplay">
                        {`(HT: ${scores.halftime.home}-${scores.halftime.away})`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
          </div>
      );
  };

  // Main component render
  return (
    <div>
      {renderPredictionNav()}
      {renderFixturesHeader()}
      <div className="fixtures-container"> {/* Added a container div */}
        <div className="space-y-4"> {/* Tailwind class for spacing between fixture rows */}
          {/* Conditional rendering based on fixtures data */}
          {fixtures.length === 0 && !isLoadingMore && !loadMoreError ? (
            <div className="text-center p-4">No fixtures available for yesterday</div>
          ) : (
            fixtures.map((fixture, index) => renderFixture(fixture, index))
          )}
          
          {/* Loading indicator for loading more fixtures */}
          {isLoadingMore && (
            <div className="flex justify-center items-center w-full h-20 my-4">
              <LoadingAnimation size={100} text="Loading more matches..." />
            </div>
          )}
          
          {/* Load More button - shown only if there are more fixtures and not currently loading */}
          {!isLoadingMore && hasMore && (
            <div className="load-more" style={{ textAlign: 'center', padding: '20px' }}>
              <button 
                className="btn btn-success btn-sm"
                onClick={loadMoreFixtures}
                disabled={isLoadingMore}
              >
                Load More
              </button>
            </div>
          )}
          
          {/* Message when all fixtures for the day are loaded */}
          {!hasMore && allFixtures.length > 0 && !isLoadingMore && !loadMoreError && (
              <div className="text-center p-4 text-gray-500">All matches for yesterday loaded.</div>
          )}
          {/* Display error message if loading more fails */}
          {loadMoreError && (
              <div className="text-center p-4 text-red-500">{loadMoreError}</div>
          )}
        </div>
      </div>
    </div>
  );
} 