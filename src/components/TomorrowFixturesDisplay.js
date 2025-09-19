'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import LoadingAnimation from '@/components/LoadingAnimation';
import { getPrediction, getHighestProbability, validatePrediction } from '@/utils/predictionUtils';
import { formatMatchTime } from '@/utils/dateUtils';
import { fetchFixturesByDatePaginated } from '@/utils/api'; // Import the updated API function
import '../styles/custom.css'; // Ensure correct path if styles are needed

export default function TomorrowFixturesDisplay({ initialFixtures, initialDate, initialNextCursor, perPage }) {

  const [allFixtures, setAllFixtures] = useState(initialFixtures || []);
  // Fixtures to display, initially the first page or accumulated fixtures
  const [fixtures, setFixtures] = useState(initialFixtures || []); 
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // hasMore is true if initialNextCursor is not null
  const [hasMore, setHasMore] = useState(!!initialNextCursor);
  const [currentNextCursor, setCurrentNextCursor] = useState(initialNextCursor);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  // const observer = useRef(); // No longer needed for manual load more
  // SelectedDate is passed as initialDate and used for fetching more
  // const [selectedDate, setSelectedDate] = useState(initialDate); 
  // error state for loading more, initial error is handled by parent
  const [loadMoreError, setLoadMoreError] = useState(null); 

  // Last element ref callback for infinite scrolling (if using intersection observer)
  // const lastFixtureElementRef = useCallback(node => { // Removed for manual button
  //   if (isLoadingMore) return;
  //   if (observer.current) observer.current.disconnect();
  //   
  //   observer.current = new IntersectionObserver(entries => {
  //     if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
  //       // Trigger load more on scroll
  //       loadMoreFixtures();
  //     }
  //   });
  //
  //   if (node) observer.current.observe(node);
  // }, [isLoadingMore, hasMore]);

  // Load more fixtures function
  const loadMoreFixtures = useCallback(async () => {
    if (isLoadingMore || !hasMore || !currentNextCursor) return;
    
    setIsLoadingMore(true);
    setLoadMoreError(null);
    
    try {
      // Use initialDate (which is tomorrowDate) for subsequent fetches
      const apiResponse = await fetchFixturesByDatePaginated(initialDate, perPage, currentNextCursor);

      if (apiResponse.status === true && Array.isArray(apiResponse.fixtures)) {
        const newFixtures = apiResponse.fixtures;
        
        // Filter out duplicates before adding to allFixtures
        setAllFixtures(prevAllFixtures => {
          const existingFixtureIds = new Set(prevAllFixtures.map(f => f.fixture_id));
          const uniqueNewFixtures = newFixtures.filter(f => !existingFixtureIds.has(f.fixture_id));
          return [...prevAllFixtures, ...uniqueNewFixtures];
        });

        // Update fixtures to display (which is effectively allFixtures now)
        setFixtures(prevFixtures => {
            const existingFixtureIds = new Set(prevFixtures.map(f => f.fixture_id));
            const uniqueNewFixtures = newFixtures.filter(f => !existingFixtureIds.has(f.fixture_id));
            return [...prevFixtures, ...uniqueNewFixtures];
        });

        setCurrentNextCursor(apiResponse.nextCursor);
        setHasMore(!!apiResponse.nextCursor); // Update hasMore based on the new cursor
      } else {
        console.error('API error while loading more fixtures:', apiResponse.message);
        setLoadMoreError(apiResponse.message || 'Failed to load more fixtures');
        setHasMore(false); // Stop trying if there's an error
      }
    } catch (err) {
      console.error('Error fetching more fixtures:', err);
      setLoadMoreError('Error loading more fixtures');
      setHasMore(false); // Stop trying if there's an error
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, currentNextCursor, initialDate, perPage]);

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
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Render the prediction type navigation
  const renderPredictionNav = () => (
    <div className="match-details-navigation">
      <div className="match-details-nav-item">
        <Link href="/tomorrow-football-predictions" className="match-details-nav-link active ">
          <span>1x2</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/tomorrow-football-predictions/double-chance-predictions" className="match-details-nav-link ">
          <span>Double Chance</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/tomorrow-football-predictions/predictions-under-over-goals" className="match-details-nav-link  ">
          <span>Under/Over 2.5</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/tomorrow-football-predictions/predictions-both-team-to-score" className="match-details-nav-link">
          <span>Both Team to Score</span>
        </Link>
      </div>
    </div>
  );

  // Render the table header for fixtures
  const renderFixturesHeader = () => (
    <div className="responsive-row header-size" style={{ fontWeight: 'bold', textAlign: 'left', cursor: 'auto' }}>
      <div className="responsive-cell"></div>
      <div className="responsive-cell hide-on-mobile" style={{ textAlign: 'center' }}> {/* Centered League Name & Flag */} 
        League
      </div>
      <div className="responsive-cell favorite-cell hide-on-mobile"></div> {/* Favorite Icon Column - No change needed here */}
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

  // Helper to get details for a single fixture
  const getFixtureDetails = (fixture) => {
    const scores = JSON.parse(fixture.scores || '{ "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null } }'); // Add default for safety
    
    // Use avg_performance from API instead of calculating it manually
    const avgGoals = fixture.avg_performance ? 
      parseFloat(fixture.avg_performance).toFixed(2) : 
      ((parseInt(fixture.teams_perfomance_home_for || 0) + parseInt(fixture.teams_perfomance_home_aganist || 0) +
       parseInt(fixture.teams_perfomance_away_for || 0) + parseInt(fixture.teams_perfomance_away_aganist || 0)) /
      (parseInt(fixture.teams_games_played_home || 1) + parseInt(fixture.teams_games_played_away || 1))).toFixed(2);

    const prediction = getPrediction(
      fixture.percent_pred_home?.replace('%', '') || '0',
      fixture.percent_pred_draw?.replace('%', '') || '0',
      fixture.percent_pred_away?.replace('%', '') || '0'
    );

    const predictionStyle = validatePrediction(prediction, scores, fixture.status_long);
    const highestProb = getHighestProbability(
      fixture.percent_pred_home?.replace('%', '') || '0',
      fixture.percent_pred_draw?.replace('%', '') || '0',
      fixture.percent_pred_away?.replace('%', '') || '0'
    );

    const isFavorite = favoriteStates[fixture.fixture_id] || false;

    const toggleFavorite = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const fixtureId = fixture.fixture_id;
      const newState = !isFavorite;
      let favoriteData = { dataArray: [] };
      try {
          const storedData = localStorage.getItem('mymatchesdata');
          if (storedData) {
              favoriteData = JSON.parse(storedData);
              // Ensure dataArray exists
              if (!Array.isArray(favoriteData.dataArray)) {
                  favoriteData.dataArray = [];
              }
          } 
      } catch (parseError) {
          console.error("Error parsing favorites from localStorage:", parseError);
          favoriteData = { dataArray: [] }; // Reset if parsing fails
      }

      setFavoriteStates(prev => ({ ...prev, [fixtureId]: newState }));

      if (newState) {
          // Add only if not already present
          if (!favoriteData.dataArray.some(item => item.fixture_id === fixtureId)) {
              favoriteData.dataArray.push({ fixture_id: fixtureId });
          }
      } else {
          favoriteData.dataArray = favoriteData.dataArray.filter(
              item => item.fixture_id !== fixtureId
          );
      }

      // Update expiry and save
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7); // Set expiry for 7 days
      favoriteData.expiry = expiry.getTime();

      try {
          localStorage.setItem('mymatchesdata', JSON.stringify(favoriteData));
          window.dispatchEvent(new Event('storage')); // Notify other components if needed
      } catch (storageError) {
          console.error("Error saving favorites to localStorage:", storageError);
      }
  };

    return {
      scores,
      isFavorite,
      prediction,
      predictionStyle,
      highestProb,
      avgGoals,
      toggleFavorite
    };
  };

  // Render a single fixture row
  const renderFixture = (fixture, index) => {
      const { scores, isFavorite, prediction, predictionStyle, highestProb, avgGoals, toggleFavorite } = getFixtureDetails(fixture);
      // const ref = index === fixtures.length - 1 ? lastFixtureElementRef : null; // Removed ref for manual button

      return (
          <div key={`${fixture.fixture_id}-${index}`} /* ref={ref} */ className="responsive-row" style={{ cursor: 'auto' }}>
              {/* Match Time */}
              <div className="match-time-wrapper">
                <div className="match-time">
                  {formatMatchTime(fixture.date)}
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
                      : fixture.country_flag || fixture.logo} className="img-fluid league-logo" alt={`${fixture.country_name}-football-predictions`} loading="lazy" />
                <span className="league-name">{fixture.league_name}</span>
              </div>
               {/* Favorite Toggle */}
               <div className="responsive-cell favorite-cell">
                    <div className="favorite-icon" onClick={toggleFavorite} title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                      <svg xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          fill={isFavorite ? "red" : "currentColor"} 
                          className={`bi bi-star-fill ${isFavorite ? 'favorite-active' : ''}`} 
                          viewBox="0 0 16 16">
                        <path d={isFavorite ? 
                          "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" :
                          "M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"} 
                        />
                      </svg>
                    </div>
                </div>
              {/* Teams */}
              <div className="responsive-cell team-link" title="Click to open match details">
                <Link href={`/football-predictions/fixture/${fixture.home_team_name.toLowerCase().replace(/\s+/g, '-')}-vs-${fixture.away_team_name.toLowerCase().replace(/\s+/g, '-')}-${fixture.fixture_id}`}>
                  <div className="teamNameLink">
                    <span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.home_team_name}</span><br />
                    <span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.away_team_name}</span>
                  </div>
                </Link>
              </div>
              {/* Probabilities */}
              <div className="responsive-cell team-link-probability" style={{ whiteSpace: 'nowrap' }}>
                <span style={{ fontWeight: highestProb === 'home' ? 'bold' : 'normal' }}>{fixture.percent_pred_home}</span>&nbsp;
                <span style={{ fontWeight: highestProb === 'draw' ? 'bold' : 'normal' }}>{fixture.percent_pred_draw}</span>&nbsp;
                <span style={{ fontWeight: highestProb === 'away' ? 'bold' : 'normal' }}>{fixture.percent_pred_away}</span>
              </div>
              {/* Prediction */}
              <div className="responsive-cell" title="Prediction">
                <span className="m-1">
                  <span className="number-circle rounded-square" style={predictionStyle}>
                    {prediction}
                  </span>
                </span>
                <span></span>
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

  return (
    <div>
      {renderPredictionNav()}
      {renderFixturesHeader()}
      <div>
        <div>
          <div className="space-y-4">
            {fixtures.length === 0 && !isLoadingMore ? (
              <div className="text-center p-4">No fixtures available for this date.</div>
            ) : (
              fixtures.map((fixture, index) => renderFixture(fixture, index))
            )}
            {isLoadingMore && (
              <div className="flex justify-center items-center w-full h-20 my-4">
                <LoadingAnimation size={100} text="Loading more matches..." />
              </div>
            )}
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
            {/* Message when all fixtures are loaded */} 
            {!hasMore && allFixtures.length > 0 && !isLoadingMore && (
                <div className="text-center p-4 text-gray-500">All matches for tomorrow loaded.</div>
            )}
            {/* Display error message if loading more fails */}
            {loadMoreError && (
              <div className="text-center p-4 text-red-500">{loadMoreError}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 