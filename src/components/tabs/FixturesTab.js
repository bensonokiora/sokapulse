'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPrediction, getHighestProbability } from '../../utils/predictionUtils';
import '../../styles/custom.css';
import { formatMatchTime } from '@/utils/dateUtils';

export default function FixturesTab({ fixtures }) {
  // Group fixtures by round
  const groupedByRound = fixtures.reduce((acc, fixture) => {
    const round = fixture.round || 'Unknown Round';
    if (!acc[round]) acc[round] = [];
    acc[round].push(fixture);
    return acc;
  }, {});

    const [favoriteStates, setFavoriteStates] = useState({});
    const [isMobile, setIsMobile] = useState(false);

    // Add effect to initialize favorite states from localStorage
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

    useEffect(() => {
      // Check if the device is mobile based on screen width
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      
      // Initial check
      checkIfMobile();
      
      // Add event listener for window resize
      window.addEventListener('resize', checkIfMobile);
      
      // Cleanup
      return () => window.removeEventListener('resize', checkIfMobile);
    }, []);


  
  return (
    <div id="fixtures" className="tab-pane fade show active" role="tabpanel">
      {/* Header Row */}
      {fixtures && fixtures.length > 0 ? (
        <>
          <div className="responsive-row header-size" style={{fontWeight: 'bold', textAlign: 'left', cursor: 'auto'}}>
            <div className="responsive-cell"></div>
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
            <div className="responsive-cell">Scores</div>
          </div>

          {/* Fixtures grouped by round */}
          {Object.entries(groupedByRound).map(([round, roundFixtures]) => (
            <div key={round}>
              {/* Round Header */}
              <div className="table-row round-header">
                <div className="table-cell" style={{textAlign: 'center'}}>{round}</div>
              </div>

              {/* Round Fixtures */}
              {roundFixtures.map((fixture) => {
                const scores = JSON.parse(fixture.scores || '{}');
                
                // Safely calculate average goals using avg_performance first
                const homeFor = parseInt(fixture.teams_perfomance_home_for) || 0;
                const homeAganist = parseInt(fixture.teams_perfomance_home_aganist) || 0;
                const awayFor = parseInt(fixture.teams_perfomance_away_for) || 0;
                const awayAganist = parseInt(fixture.teams_perfomance_away_aganist) || 0;
                const homePlayed = parseInt(fixture.teams_games_played_home) || 0;
                const awayPlayed = parseInt(fixture.teams_games_played_away) || 0;
                const totalPlayed = homePlayed + awayPlayed;
                
                const avgGoals = fixture.avg_performance ?
                  parseFloat(fixture.avg_performance).toFixed(2) :
                  totalPlayed > 0 ? 
                    ((homeFor + homeAganist + awayFor + awayAganist) / totalPlayed).toFixed(2) : 
                    'N/A';

                const prediction = getPrediction(
                  fixture.percent_pred_home,
                  fixture.percent_pred_draw,
                  fixture.percent_pred_away
                );

                const highestProb = getHighestProbability(
                  fixture.percent_pred_home,
                  fixture.percent_pred_draw,
                  fixture.percent_pred_away
                );

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
                  
                  // Trigger storage event for NavigationRow to update
                  window.dispatchEvent(new Event('storage'));
                };
                
                return (
                  <div key={fixture.id} className="responsive-row" style={{ cursor: 'auto' }}>
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
                      <div className="favorite-desktop" onClick={toggleFavorite}>
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
                      <div className="favorite-mobile" onClick={toggleFavorite}>
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
                          <span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.home_team_name}</span><br />
                          <span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.away_team_name}</span>
                        </div>
                      </Link>
                    </div>
                    <div className="responsive-cell team-link-probability" style={{ whiteSpace: 'nowrap' }}>
                      <span style={{ fontWeight: highestProb === 'home' ? 'bold' : 'normal' }}>{fixture.percent_pred_home}</span>&nbsp;
                      <span style={{ fontWeight: highestProb === 'draw' ? 'bold' : 'normal' }}>{fixture.percent_pred_draw}</span>&nbsp;
                      <span style={{ fontWeight: highestProb === 'away' ? 'bold' : 'normal' }}>{fixture.percent_pred_away}</span>
                    </div>
                    <div className="responsive-cell" title="Prediction">
                      <span className="m-1">
                        <span className="number-circle rounded-square" style={{ backgroundColor: 'rgb(255, 180, 0)' }}>
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
                          <span className={`${scores.fulltime?.home !== null ? 'scores-card' : 'no-score'} ${["2H", "1H", "INT", "HT", "LIVE"].includes(fixture.status_short) ? 'live' : ''}`} id="fulltimeGoals">
                            {scores.fulltime?.home != null ? `${scores.fulltime.home} - ${scores.fulltime.away}` : '-'}
                          </span>
                          {scores.halftime?.home != null && (
                            <span className="halfTimeDataDisplay">
                              {`(${scores.halftime.home}-${scores.halftime.away})`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </>
      ) : (
        <div className="text-center p-8">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No matches at the moment
          </p>
        </div>
      )}
    </div>
  );
}
