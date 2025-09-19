'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { fetchTopPredictions } from '@/utils/api';
import NavigationRow from '@/components/NavigationRow'; // Keep if needed
import { formatDate } from '@/utils/formatDate';
import LoadingAnimation from '@/components/LoadingAnimation';
import '../styles/custom.css'; // Adjust path if necessary
import { getPrediction, getHighestProbability, validatePrediction } from '@/utils/predictionUtils';
import { formatMatchTime } from '@/utils/dateUtils';

const TopFixturesList = ({
  initialFixtures,
  initialHasMore,
  initialError,
  initialDate, // Receive initial date object
  initialNextCursor // Receive initial next cursor
}) => {
  const [fixtures, setFixtures] = useState(initialFixtures || []);
  const [isLoading, setIsLoading] = useState(false); // For subsequent loads
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [error, setError] = useState(initialError);
  const [selectedDate, setSelectedDate] = useState(initialDate); // Use initial date object
  const [nextCursor, setNextCursor] = useState(initialNextCursor); // Store next cursor
  const [favoriteStates, setFavoriteStates] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const observer = useRef();

  // Convert Date object to YYYY-MM-DD string
  const formatToApiDate = (date) => {
    if (!date || !(date instanceof Date)) {
        console.warn("Invalid date passed to formatToApiDate, using today.");
        date = new Date();
    }
     // Use the imported utility for consistency if it does the same thing
     // Otherwise, keep this specific formatting logic
     return formatDate(date); // Assuming formatDate utility returns YYYY-MM-DD
    // Or: return date.toISOString().split('T')[0]; 
  };

  // Handle date selection change from NavigationRow
  const handleDateChange = async (e) => {
    const newDateStr = e.target.value; // YYYY-MM-DD string
    const newDateObj = new Date(newDateStr + 'T00:00:00'); // Convert to Date object
    setSelectedDate(newDateObj);
    setIsLoading(true);
    setError(null);
    setFixtures([]);
    setHasMore(true); // Reset hasMore optimistically
    setNextCursor('1'); // Reset cursor for new date

    try {
      const formattedDate = formatToApiDate(newDateObj);
      console.log('(Client) Fetching initial top fixtures for date:', formattedDate);
      // Fetch initial batch for the new date using pagination
      const data = await fetchTopPredictions(formattedDate, 20, '1');

      if (data.status === true && Array.isArray(data.data)) {
        setFixtures(data.data);
        setNextCursor(data.nextCursor); // Store the new cursor
        setHasMore(!!data.nextCursor); // Update hasMore based on nextCursor
      } else {
        console.error('(Client) API error on date change (top fixtures):', data.message);
        setError(data.message || 'Failed to load fixtures');
        setHasMore(false);
        setNextCursor(null);
      }
    } catch (err) {
      console.error('(Client) Fetch error on date change (top fixtures):', err);
      setError('Error loading fixtures');
      setHasMore(false);
      setNextCursor(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Load More Fixtures
  const loadMoreFixtures = async () => {
    if (isLoadingMore || !hasMore || !nextCursor) return;

    setIsLoadingMore(true);
    setError(null);

    try {
      const formattedDate = formatToApiDate(selectedDate);
      console.log(`(Client) Loading more top fixtures for date: ${formattedDate}, cursor: ${nextCursor}`);
      const data = await fetchTopPredictions(formattedDate, 20, nextCursor);

      if (data.status === true && Array.isArray(data.data)) {
        // Filter out duplicates before adding to fixtures
        const newFixtures = data.data.filter(newFixture => 
          !fixtures.some(existingFixture => existingFixture.fixture_id === newFixture.fixture_id)
        );
        setFixtures(prevFixtures => [...prevFixtures, ...newFixtures]);
        setNextCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
      } else {
        console.error('(Client) API error on load more (top fixtures):', data.message);
        setError(data.message || 'Failed to load more fixtures');
        setHasMore(false); // Stop trying if API returns an error
        setNextCursor(null);
      }
    } catch (err) {
      console.error('(Client) Fetch error on load more (top fixtures):', err);
      setError('Error loading more fixtures');
      setHasMore(false);
      setNextCursor(null);
    } finally {
      // Short delay to ensure loading state is visible
      setTimeout(() => setIsLoadingMore(false), 200); 
    }
  };

  // --- Effects ---

  // Initialize favorite states
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

  // Check mobile
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // --- Rendering Helpers ---

   const toggleFavorite = (e, fixtureId) => {
      e.preventDefault();
      e.stopPropagation();
      const newState = !favoriteStates[fixtureId];
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
      window.dispatchEvent(new Event('storage'));
    };

  const renderFixturesHeader = () => (
    <div className="responsive-row header-size" style={{fontWeight: 'bold', textAlign: 'left', cursor: 'auto'}}>
        <div className="responsive-cell"></div> {/* Time/League */} 
        <div className="responsive-cell"></div> {/* Fav icon */} 
        <div className="responsive-cell team-link-probability" style={{textAlign: 'left', fontWeight: 'bold'}}>
          <span>Home Team</span><br/>
          <span>Away Team</span><br/>
        </div>
        <div className="responsive-cell team-link-probability" style={{whiteSpace: 'pre-wrap'}}>
        <span>&nbsp;{isMobile ? 'Probs' : 'Probability %'} </span><br />
        <span>1&nbsp;&nbsp;X&nbsp;&nbsp;2</span>
        </div>
        <div className="responsive-cell">{isMobile ? 'Pred' : 'Prediction'}</div>
        <div className="responsive-cell hide-on-mobile">Avg<br/>goals</div>
        <div className="responsive-cell">Odds</div>
        <div className="responsive-cell" title="Scores" style={{ overflow: 'visible', minWidth: '110px' }}>
          Scores
        </div>
    </div>
  );

   const renderFixture = (fixture, index) => {
        // Use safe defaults and parsing
        let scores = { fulltime: { home: null, away: null }, halftime: { home: null, away: null } };
        try { if (fixture.scores) scores = JSON.parse(fixture.scores); } catch (e) { /* Ignore */ }
        
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
          (totalPlayed > 0 ? ((homeFor + homeAganist + awayFor + awayAganist) / totalPlayed).toFixed(2) : 'N/A');

        const homePred = fixture.percent_pred_home?.replace('%', '') || '0';
        const drawPred = fixture.percent_pred_draw?.replace('%', '') || '0';
        const awayPred = fixture.percent_pred_away?.replace('%', '') || '0';
        const prediction = getPrediction(homePred, drawPred, awayPred);
        const predictionStyle = validatePrediction(prediction, scores, fixture.status_long);
        const highestProb = getHighestProbability(homePred, drawPred, awayPred);
        const isFavorite = favoriteStates[fixture.fixture_id] || false;

        return (
            <div key={fixture.id || fixture.fixture_id || index} className="responsive-row" style={{ cursor: 'auto' }}>
                <div className="match-time-wrapper"><div className="match-time">{formatMatchTime(fixture.date)}</div></div>
                 <div className="league-info-wrapper">
                     <img src={fixture.country_flag || fixture.logo} className="img-fluid league-logo" alt={`${fixture.country_name}-football-predictions`} loading="lazy" />
                     <span className="league-name">{fixture.league_name}</span>
                 </div>
                <div className="responsive-cell favorite-cell">
                    <div className="favorite-icon" onClick={(e) => toggleFavorite(e, fixture.fixture_id)} style={{ cursor: 'pointer' }}>
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
                         </svg>                    </div>
                </div>
                <div className="responsive-cell team-link" title="Click to open match details">
                    <Link href={`/football-predictions/fixture/${fixture.home_team_name?.toLowerCase().replace(/\s+/g, '-')}-vs-${fixture.away_team_name?.toLowerCase().replace(/\s+/g, '-')}-${fixture.fixture_id}`}>
                        <div className="teamNameLink"><span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.home_team_name}</span><br /><span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.away_team_name}</span></div>
                    </Link>
                </div>
                <div className="responsive-cell team-link-probability" style={{ whiteSpace: 'nowrap' }}>
                    <span style={{ fontWeight: highestProb === 'home' ? 'bold' : 'normal' }}>{fixture.percent_pred_home || '0%'}</span>&nbsp;
                    <span style={{ fontWeight: highestProb === 'draw' ? 'bold' : 'normal' }}>{fixture.percent_pred_draw || '0%'}</span>&nbsp;
                    <span style={{ fontWeight: highestProb === 'away' ? 'bold' : 'normal' }}>{fixture.percent_pred_away || '0%'}</span>
                </div>
                <div className="responsive-cell" title="Prediction">
                    <span className="m-1"><span className={`number-circle rounded-square ${predictionStyle.backgroundColor === '#008000' ? 'prediction-correct' : predictionStyle.backgroundColor === '#FF0000' ? 'prediction-incorrect' : ''}`} style={predictionStyle}>{prediction}</span></span>
                </div>
                <div className="responsive-cell hide-on-mobile" title="Average Goals">{avgGoals}</div>
                <div className="responsive-cell" title="Odds">
                    <div className="odds-container">
                        <div style={{ fontWeight: prediction === '1' ? 'bold' : 'normal' }}>{fixture.bets_home || '-'}</div>
                        <div style={{ fontWeight: prediction === 'X' ? 'bold' : 'normal' }}>{fixture.bets_draw || '-'}</div>
                        <div style={{ fontWeight: prediction === '2' ? 'bold' : 'normal' }}>{fixture.bets_away || '-'}</div>
                    </div>
                </div>
                 <div className="responsive-cell" title="Scores" style={{ overflow: 'visible', minWidth: '110px' }}>
                    <div className="score-container">
                        <div className="match-status-wrapper">
                            {fixture.status_short === "FT" || fixture.status_short === "ABD" ? (
                                <span className="match-status">{fixture.status_short}</span>
                            ) : ["2H", "1H", "INT", "HT", "LIVE"].includes(fixture.status_short) ? (
                                <div className="match-status-live">
                                    {["1H", "2H"].includes(fixture.status_short) && fixture.status_elapased ? `${fixture.status_elapased}'` : fixture.status_short}
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
            </div>
        );
   };

  // --- Main Return ---

  return (
    <>
      {/* Include NavigationRow here if it handles date changes */}
       <NavigationRow selectedDate={selectedDate} onDateChange={handleDateChange} /> 

       <div className="fixtures-wrapper">
         {isLoading ? (
            <div className="flex justify-center items-center w-full h-32 my-4"><LoadingAnimation text="Loading matches..." /></div>
         ) : error ? (
            <div className="text-center p-4 text-red-500">Error: {error}</div>
         ) : fixtures.length === 0 ? (
            <div className="text-center p-4">No top predictions available for this date.</div>
         ) : (
           <>
             {renderFixturesHeader()}
             {fixtures.map(renderFixture)}
           </>
         )}

         {/* Load More Button/Indicator */}
         {isLoadingMore && (
            <div className="flex justify-center items-center w-full h-20 my-4"><LoadingAnimation size={100} text="Loading more..." /></div>
         )}
         {!isLoading && !isLoadingMore && hasMore && fixtures.length > 0 && (
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
          {!hasMore && fixtures.length > 0 && !isLoading && !isLoadingMore &&(
             <div className="text-center p-4 text-gray-500">No more top predictions for this date.</div>
           )}
       </div>
    </>
  );
};

export default TopFixturesList; 