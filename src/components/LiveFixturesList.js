'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { fetchLiveGames } from '@/utils/api'; // Import fetch function
import { formatDate } from '@/utils/formatDate'; // Date formatter
import LoadingAnimation from '@/components/LoadingAnimation';
import '../styles/custom.css'; // Adjust path if necessary
import { getPrediction, getHighestProbability, validatePrediction } from '@/utils/predictionUtils';
import { formatMatchTime } from '@/utils/dateUtils';

const LiveFixturesList = ({ initialFixtures, initialError }) => {
  const [isLoading, setIsLoading] = useState(false); // Initial load handled by server
  const [fixtures, setFixtures] = useState(initialFixtures || []);
  const [error, setError] = useState(initialError);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0); // For triggering refresh effect

  // Fetch live data (used for refresh)
  const fetchLiveData = useCallback(async () => {
    // Don't show main loading indicator on refresh, it's background
    // setIsLoading(true); 
    try {
      const today = formatDate(); // Get current date formatted
      console.log("(Client) Refreshing live fixtures...");
      const data = await fetchLiveGames(today);
      if (data.status === true && Array.isArray(data.data)) {
        setFixtures(data.data);
        setError(null); // Clear error on successful refresh
      } else {
        console.error('(Client) Refresh live fixtures API error:', data.message);
        // Optionally set a *non-blocking* error state here if needed
        // setError(data.message || 'Failed to refresh live fixtures'); 
      }
    } catch (err) {
      console.error('(Client) Refresh live fixtures fetch error:', err);
      // Optionally set a non-blocking error state
      // setError('Error refreshing live fixtures'); 
    } finally {
      // setIsLoading(false);
    }
  }, []); // No dependencies needed if it always fetches for 'today'

  // --- Effects ---

  // Auto-refresh interval
  useEffect(() => {
    const refreshInterval = setInterval(() => {
        console.log("Triggering live data refresh interval.");
        fetchLiveData(); 
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval); // Cleanup on unmount
  }, [fetchLiveData]); // Depend on the fetch function


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

  // --- Rendering Helpers ---

  const toggleFavorite = (e, fixtureId) => {
      e.preventDefault();
      e.stopPropagation();

      const newState = !favoriteStates[fixtureId];
      const favoriteData = JSON.parse(localStorage.getItem('mymatchesdata')) || { dataArray: [] };

      setFavoriteStates(prev => ({
        ...prev,
        [fixtureId]: newState
      }));

      if (newState) {
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
        // Safely parse scores or provide default structure
        let scores = { fulltime: { home: null, away: null }, halftime: { home: null, away: null } };
        try {
            if (fixture.scores) scores = JSON.parse(fixture.scores);
        } catch (e) {
            console.error("Failed to parse scores for fixture:", fixture.fixture_id, e);
        }

        // Safely calculate average goals
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
          totalPlayed > 0 ? 
            ((homeFor + homeAganist + awayFor + awayAganist) / totalPlayed).toFixed(2) : 
            'N/A';

        // Safely get prediction details
        const homePred = fixture.percent_pred_home?.replace('%', '') || '0';
        const drawPred = fixture.percent_pred_draw?.replace('%', '') || '0';
        const awayPred = fixture.percent_pred_away?.replace('%', '') || '0';
        const prediction = getPrediction(homePred, drawPred, awayPred);
        const predictionStyle = validatePrediction(prediction, scores, fixture.status_long);
        const highestProb = getHighestProbability(homePred, drawPred, awayPred);

        const isFavorite = favoriteStates[fixture.fixture_id] || false;

        return (
            <div key={fixture.id || fixture.fixture_id || index} className="responsive-row" style={{ cursor: 'auto' }}>
                <div className="match-time-wrapper">
                    <div className="match-time">
                        {formatMatchTime(fixture.date)}
                    </div>
                </div>
                <div className="league-info-wrapper">
                     <img 
                        src={fixture.country_flag || fixture.logo} // Add fallback logic if needed
                        className="img-fluid league-logo" 
                        alt={`${fixture.country_name}-football-predictions`} 
                        loading="lazy"
                     />
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
                         </svg>
                    </div>
                 </div>
                <div className="responsive-cell team-link" title="Click to open match details">
                    <Link href={`/football-predictions/fixture/${fixture.home_team_name?.toLowerCase().replace(/\s+/g, '-')}-vs-${fixture.away_team_name?.toLowerCase().replace(/\s+/g, '-')}-${fixture.fixture_id}`}>
                        <div className="teamNameLink">
                            <span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.home_team_name}</span><br />
                            <span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.away_team_name}</span>
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
                <div className="responsive-cell" title="Scores" style={{ overflow: 'visible', minWidth: '110px' }}>
                      {/* Live Score Display Logic */} 
                     <div className="score-container">
                         <div className="match-status-live">
                             {["1H", "2H"].includes(fixture.status_short) && fixture.status_elapased ? 
                                `${fixture.status_elapased}'` :
                                fixture.status_short}
                             {fixture.status_short !== "HT" && ["1H", "2H", "LIVE"].includes(fixture.status_short) && <span className="blink_text">&nbsp;&#x25CF;</span>}
                         </div>
                         <div className="scores-display">
                              <span className={`scores-card live`} id="fulltimeGoals">
                                  {/* Use goals_home/away for live scores if available, otherwise fallback */} 
                                 {`${fixture.goals_home ?? scores.fulltime.home ?? 0} - ${fixture.goals_away ?? scores.fulltime.away ?? 0}`}
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

  // --- Main Return --- 

  // Handle initial loading state or error passed from server
  if (initialError && !fixtures.length) {
      return (
          <div className="no-matches-container">
              <div className="no-matches-icon">
                 {/* Error Icon */} 
                 <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-exclamation-triangle-fill text-red-500" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                 </svg>
              </div>
              <div className="no-matches-text text-red-500">
                <h3>Error Loading Live Matches</h3>
                <p>{initialError}</p>
              </div>
          </div>
      );
  }

  if (!isLoading && fixtures.length === 0 && !initialError) {
      return (
          <div className="no-matches-container">
              <div className="no-matches-icon">
                 {/* No Matches Icon */}
                 <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-calendar-x" viewBox="0 0 16 16">
                    <path d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z"/>
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                 </svg>
              </div>
              <div className="no-matches-text">
                  <h3>No Live Matches</h3>
                  <p>There are currently no live football matches being played.</p>
              </div>
          </div>
      );
  }

  return (
    <div className="fixtures-wrapper">
      {/* Optional: Display non-blocking refresh error */} 
       {error && !isLoading && fixtures.length > 0 && (
           <div className="text-center p-2 text-orange-600">Warning: {error} (showing last known data)</div>
       )}
       {renderFixturesHeader()}
       {fixtures.map((fixture, index) => renderFixture(fixture, index))}
      {/* No Load More button needed for live games usually */} 
    </div>
  );
};

export default LiveFixturesList; 