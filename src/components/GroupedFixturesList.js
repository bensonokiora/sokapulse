'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { fetchGroupedFixtures } from '@/utils/api';
import NavigationRow from '@/components/NavigationRow';
import { formatDate } from '@/utils/formatDate';
import '../styles/custom.css';
import LoadingAnimation from '@/components/LoadingAnimation';
import { getPrediction, getHighestProbability, validatePrediction } from '@/utils/predictionUtils';
import { formatMatchTime } from '@/utils/dateUtils';

// Helper function for grouping
const groupFixturesByLeague = (fixtures) => {
  if (!Array.isArray(fixtures)) return {};
  return fixtures.reduce((acc, fixture) => {
    const key = `${fixture.country_name}:${fixture.league_name}:${fixture.league_id}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(fixture);
    return acc;
  }, {});
};

const GroupedFixturesList = ({
  initialGroupedFixtures,
  initialFixturesRaw, // Accept raw initial fixtures
  initialError,
  initialDate,
  initialHasMore
}) => {
  const [groupedFixtures, setGroupedFixtures] = useState(initialGroupedFixtures || {});
  const [rawFixtures, setRawFixtures] = useState(initialFixturesRaw || []); // State for all loaded raw fixtures
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(initialError);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const batchSize = 20; // Define batch size
  const [currentOffset, setCurrentOffset] = useState(rawFixtures.length); // Track offset for fetching next batch

  // Format date utility
  const formatToApiDate = (date) => {
    if (!date || !(date instanceof Date)) {
        date = new Date();
    }
    return formatDate(date);
  };

  // Handle date selection change - fetch initial batch
  const handleDateChange = async (e) => {
    const newDateStr = e.target.value;
    const newDateObj = new Date(newDateStr + 'T00:00:00');
    setSelectedDate(newDateObj);
    setIsLoading(true);
    setError(null);
    setGroupedFixtures({});
    setRawFixtures([]); // Reset raw fixtures
    setCurrentOffset(0); // Reset offset
    setHasMore(true);
    setIsLoadingMore(false);

    try {
      const formattedDate = formatToApiDate(newDateObj);
      console.log(`(Client) Fetching initial ${batchSize} grouped fixtures for date: ${formattedDate}`);
      // Use proper endIndex calculation: 0 + batchSize
      const data = await fetchGroupedFixtures(formattedDate, 0, batchSize);

      if (data.status === true && Array.isArray(data.data)) {
        setRawFixtures(data.data); // Set initial raw fixtures
        const newGroupedData = groupFixturesByLeague(data.data);
        setGroupedFixtures(newGroupedData);
        setCurrentOffset(data.data.length); // Set initial offset
        // Always show hasMore if we got a full batch
        setHasMore(data.data.length >= batchSize);
        console.log(`(Client) Initial fixtures loaded: ${data.data.length}, hasMore: ${data.data.length >= batchSize}`);
      } else {
        console.error('(Client) API error on date change (grouped):', data.message);
        setError(data.message || 'Failed to load fixtures');
        setHasMore(false);
      }
    } catch (err) {
      console.error('(Client) Fetch error on date change (grouped):', err);
      setError('Error loading fixtures');
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Load More Fixtures - fetch NEXT BATCH
  const loadMoreFixtures = async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    setError(null);

    try {
      const formattedDate = formatToApiDate(selectedDate);
      
      // For the API call, endIndex parameter should be interpreted as batchSize
      // So we're actually asking for fixtures from currentOffset to currentOffset + batchSize
      console.log(`(Client) LOAD MORE: Requesting fixtures with date=${formattedDate}, offset=${currentOffset}, batchSize=${batchSize}`);
      
      // Fetch only the next batch of fixtures
      const data = await fetchGroupedFixtures(formattedDate, currentOffset, currentOffset + batchSize);

      console.log(`(Client) LOAD MORE: Received ${data?.data?.length || 0} fixtures from API`);
      
      if (data.status === true && Array.isArray(data.data)) {
        if (data.data.length > 0) {
            // Append new fixtures to existing ones
            const updatedRawFixtures = [...rawFixtures, ...data.data];
            console.log(`(Client) LOAD MORE: Updated raw fixtures count: ${updatedRawFixtures.length} (previous: ${rawFixtures.length}, new: ${data.data.length})`);
            
            setRawFixtures(updatedRawFixtures);
            // Re-group the entire updated list
            const updatedGroupedFixtures = groupFixturesByLeague(updatedRawFixtures);
            setGroupedFixtures(updatedGroupedFixtures);
            // Update offset
            const newOffset = currentOffset + data.data.length;
            console.log(`(Client) LOAD MORE: Setting new offset to ${newOffset}`);
            setCurrentOffset(newOffset);
        }
        // Update hasMore based on whether we received a full batch
        const newHasMore = data.data.length >= batchSize;
        console.log(`(Client) LOAD MORE: Setting hasMore to ${newHasMore} (received ${data.data.length} vs batchSize ${batchSize})`);
        setHasMore(newHasMore);
      } else {
        console.error('(Client) API error on load more (grouped):', data.message);
        setError(data.message || 'Failed to load more fixtures');
        setHasMore(false); // Stop trying if API fails
      }
    } catch (err) {
      console.error('(Client) Fetch error on load more (grouped):', err);
      setError('Error loading more fixtures');
      setHasMore(false); // Stop trying if fetch fails
    } finally {
      setIsLoadingMore(false);
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
    <div className="responsive-row header-size fixture-row" style={{fontWeight: 'bold', textAlign: 'left', cursor: 'auto'}}>
         <div className="match-time-wrapper"></div> 
         <div className="responsive-cell favorite-cell"></div> 
         <div className="responsive-cell team-link" style={{textAlign: 'left', fontWeight: 'bold'}}>
             <span>Home Team</span><br/>
             <span>Away Team</span><br/>
         </div>
         <div className="responsive-cell team-link-probability" style={{whiteSpace: 'pre-wrap'}}>
             <span>&nbsp;{isMobile ? 'Probs' : 'Probability %'} </span><br />
             <span>1&nbsp;&nbsp;X&nbsp;&nbsp;2</span>
         </div>
         <div className="responsive-cell" title="Prediction">{isMobile ? 'Pred' : 'Prediction'}</div>
         <div className="responsive-cell hide-on-mobile" title="Average Goals">Avg<br/>goals</div>
         <div className="responsive-cell" title="Odds">Odds</div>
         <div className="responsive-cell" title="Scores" style={{ overflow: 'visible', minWidth: '110px' }}>Scores</div>
     </div>
   );

   const renderFixture = (fixture, index) => {
        let scores = { fulltime: { home: null, away: null }, halftime: { home: null, away: null } };
        try { if (fixture.scores) scores = JSON.parse(fixture.scores); } catch (e) { console.error("Score parse error:", e); }
        
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
            <div key={fixture.id || fixture.fixture_id || index} className="responsive-row fixture-row" style={{ cursor: 'auto' }}>
                 <div className="match-time-wrapper"><div className="match-time">{formatMatchTime(fixture.date)}</div></div>
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
      <NavigationRow selectedDate={selectedDate} onDateChange={handleDateChange} />

      <div className="fixtures-wrapper">
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-32 my-4">
            <LoadingAnimation text="Loading matches..." />
          </div>
        ) : error ? (
          <div className="text-center p-4 text-red-500">Error: {error}</div>
        ) : Object.entries(groupedFixtures).length === 0 ? (
          <div className="text-center p-4">No matches found for selected date.</div>
        ) : (
          <>
            {renderFixturesHeader()} 
            {Object.entries(groupedFixtures).map(([key, leagueFixtures]) => {
              const [country, league, leagueId] = key.split(':');
              const countryFlag = leagueFixtures[0]?.country_flag || leagueFixtures[0]?.logo || ''; 

              return (
                <div key={key} className="league-group">
                  {/* League Header - Attempting original structure + alignment */}
                  <div className="responsive-row league-header" style={{
                      backgroundColor: 'var(--card-color)',
                      borderLeft: '4px solid #0d6efd',
                      marginBottom: '8px',
                      marginTop: '8px',
                      alignItems: 'center' // Keep vertical alignment
                  }}>
                      {/* Cell 1: League Info (Visible) */}
                      <div className="responsive-cell team-link-x" style={{textAlign: 'left', padding: '8px 0'}}>
                          <img 
                              src={countryFlag} 
                              className="img-fluid league-logo" 
                              alt={`${country}-football-predictions`} 
                              loading="lazy"
                              style={{ width: '20px', height: 'auto', marginRight: '8px', verticalAlign: 'middle'}}
                          />
                          <span style={{fontSize: '15px', fontWeight: 'bold', color: 'var(--text-color)', verticalAlign: 'middle'}}>
                              {country.toUpperCase()} :&nbsp;
                              <Link 
                                  href={`/football-predictions/league/${country.toLowerCase()}/${league.toLowerCase().replace(/ /g, '-')}-${leagueId}`} 
                                  className="league-name-link"
                              >
                                  {league}
                              </Link>
                          </span>
                      </div>
                      {/* Placeholder Cell 2 (Hide on Mobile) */}
                       <div className="responsive-cell favorite-cell hide-on-mobile"></div> 
                      {/* Placeholder Cell 3 (Hide on Mobile) */}
                       <div className="responsive-cell team-link hide-on-mobile"></div>
                       {/* Placeholder Cell 4 (Hide on Mobile) */}
                      <div className="responsive-cell team-link-probability hide-on-mobile"></div>
                      {/* Placeholder Cell 5 (Hide on Mobile) */}
                      <div className="responsive-cell hide-on-mobile" title="Prediction"></div>
                      {/* Placeholder Cell 6 (Already Hidden on Mobile) */}
                      <div className="responsive-cell hide-on-mobile" title="Average Goals"></div>
                      {/* Placeholder Cell 7 (Hide on Mobile) */}
                      <div className="responsive-cell hide-on-mobile" title="Odds"></div>
                      {/* Cell 8: Table Link (Visible) */}
                      <div className="responsive-cell team-link" style={{paddingRight: '12px', textAlign: 'right', minWidth: '110px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <Link 
                              href={`/football-predictions/league/${country.toLowerCase()}/${league.toLowerCase().replace(/ /g, '-')}-${leagueId}#standings`} 
                              className="table-link"
                          >
                              <span>Table</span>
                          </Link>
                      </div>
                  </div>

                  {/* Fixtures for this league */}
                  {leagueFixtures.map((fixture, index) => renderFixture(fixture, index))}
                </div>
              );
            })}
          </>
        )}

        {/* Load More Button */}
         {isLoadingMore && (
             <div className="flex justify-center items-center w-full h-20 my-4"><LoadingAnimation size={100} text="Loading more matches..." /></div>
         )}
         {!isLoading && !isLoadingMore && hasMore && Object.entries(groupedFixtures).length > 0 && (
             <div className="load-more" style={{ textAlign: 'center', padding: '20px' }}>
               <button 
                 className="btn btn-success btn-sm"
                 onClick={loadMoreFixtures}
                 disabled={isLoadingMore}
               >
                 {isLoadingMore ? 'Loading...' : 'Load More Matches'}
               </button>
             </div>
         )}
          {/* Message shown when all data is loaded (hasMore is false) */}
          {!hasMore && !isLoading && !error && Object.entries(groupedFixtures).length > 0 && (
              <div className="text-center p-4 text-gray-500">All matches for today are loaded.</div>
          )}
      </div>
    </>
  );
};

export default GroupedFixturesList; 