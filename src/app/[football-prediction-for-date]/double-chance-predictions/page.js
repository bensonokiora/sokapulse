'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { fetchFixturesByDatePaginated } from '@/utils/api';
import NavigationRow from '@/components/NavigationRow';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { formatDate, getTodayDate } from '@/utils/dateUtils';
import { getDoubleChancePrediction, getDoubleChanceProb, validateDoubleChancePrediction } from '@/utils/doubleChancePredictionUtils';

import '../../../styles/custom.css';
import LoadingAnimation from '@/components/LoadingAnimation';
import { formatMatchTime } from '@/utils/dateUtils';


export default function DoubleChancePredictions({ params }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const date = params['football-prediction-for-date']?.replace('football-predictions-for-', '');
  const [isMobile, setIsMobile] = useState(false);

  // Validate date format
  useEffect(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      router.push('/');
      return;
    }
  }, [date, router]);

  const getTomorrowDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [fixtures, setFixtures] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [currentNextCursor, setCurrentNextCursor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    return date || getTodayDate();
  });
  const [error, setError] = useState(null);
  const [loadMoreError, setLoadMoreError] = useState(null);
  const [favoriteStates, setFavoriteStates] = useState({});
  const perPage = 20;

  const fetchFixtures = useCallback(async (dateToFetch) => {
    setIsLoading(true);
    setFixtures([]);
    setError(null);
    setLoadMoreError(null);
    setCurrentNextCursor(null);
    setHasMore(false);

    try {
      console.log("API call for initial page (double chance) using date:", dateToFetch);
      const apiResponse = await fetchFixturesByDatePaginated(dateToFetch, perPage, '1'); 
      
      if (apiResponse.status === true && Array.isArray(apiResponse.fixtures)) {
        console.log(`Retrieved ${apiResponse.fixtures.length} fixtures for date ${dateToFetch}`);
        
        const validFixtures = apiResponse.fixtures.filter(fixture => {
          return fixture && 
                 (fixture.id || fixture.fixture_id) && 
                 fixture.home_team_name && 
                 fixture.away_team_name;
        });
        
        console.log(`After validation: ${validFixtures.length} valid fixtures`);
        setFixtures(validFixtures);
        setCurrentNextCursor(apiResponse.nextCursor);
        setHasMore(!!apiResponse.nextCursor);
        setError(null);
      } else {
        console.error("API returned an error or empty data (double chance):", apiResponse);
        setError(apiResponse.message || 'Failed to load fixtures');
        setFixtures([]);
        setHasMore(false);
        setCurrentNextCursor(null);
      }
    } catch (err) {
      console.error("Error fetching fixtures (double chance):", err);
      setError('Error loading fixtures');
      setFixtures([]);
      setHasMore(false);
      setCurrentNextCursor(null);
    } finally {
      setIsLoading(false);
    }
  }, [perPage]);
  
  const loadMoreFixtures = useCallback(async () => {
    if (isLoadingMore || !hasMore || !currentNextCursor) return;
    
    setIsLoadingMore(true);
    setLoadMoreError(null);
    
    try {
      console.log(`Fetching next page (double chance) with cursor: ${currentNextCursor} for date: ${selectedDate}`);
      const apiResponse = await fetchFixturesByDatePaginated(selectedDate, perPage, currentNextCursor);

      if (apiResponse.status === true && Array.isArray(apiResponse.fixtures)) {
        const newFixtures = apiResponse.fixtures.filter(fixture => {
          return fixture && 
                 (fixture.id || fixture.fixture_id) && 
                 fixture.home_team_name && 
                 fixture.away_team_name;
        });

        setFixtures(prevFixtures => {
          const existingFixtureIds = new Set(prevFixtures.map(f => f.fixture_id || f.id));
          const uniqueNewFixtures = newFixtures.filter(f => !existingFixtureIds.has(f.fixture_id || f.id));
          return [...prevFixtures, ...uniqueNewFixtures];
        });
        
        setCurrentNextCursor(apiResponse.nextCursor);
        setHasMore(!!apiResponse.nextCursor);
      } else {
        console.error('API error while loading more fixtures (double chance):' + (apiResponse.message || ''));
        setLoadMoreError(apiResponse.message || 'Failed to load more fixtures');
        setHasMore(false); 
      }
    } catch (err) {
      console.error("Error in loadMoreFixtures (double chance):", err);
      setLoadMoreError('Error loading more fixtures');
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, currentNextCursor, selectedDate, perPage]);

  // Handle date selection change
  const handleDateChange = (e) => {
    const newDate = formatDate(new Date(e.target.value));
    const formattedDate = `football-predictions-for-${newDate}`;
    router.push(`/${formattedDate}/double-chance-predictions?filter_date=${newDate}`);
    setSelectedDate(newDate);
    fetchFixtures(newDate);
  };

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

  useEffect(() => {
    if (date) {
      setSelectedDate(date);
      fetchFixtures(date);
    }
  }, [date, fetchFixtures]);

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


  const renderPredictionNav = () => {
    // Create URLs using the current date parameter
    const formattedDate = selectedDate;
    const baseUrl = `/football-predictions-for-${formattedDate}`;

    return (
      <div className="match-details-navigation">
      <div className="match-details-nav-item">
        <Link href={baseUrl} className="match-details-nav-link ">
          <span>1x2</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href={`${baseUrl}/double-chance-predictions`} className="match-details-nav-link active">
          <span>Double Chance</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href={`${baseUrl}/predictions-under-over-goals`} className="match-details-nav-link">
          <span>Under/Over 2.5</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href={`${baseUrl}/predictions-both-team-to-score`} className="match-details-nav-link">
          <span>BTTS</span>
        </Link>
      </div>
      </div>
    );
  };

  const renderFixturesHeader = () => (
    <div className="responsive-row header-size" style={{ fontWeight: 'bold', textAlign: 'left', cursor: 'auto' }}>
      <div className="responsive-cell"></div>
      <div className="responsive-cell team-link-probability" style={{ textAlign: 'left', fontWeight: 'bold' }}>
        <span>Teams</span><br />
      </div>
      <div className="responsive-cell team-link-probability" style={{ whiteSpace: 'pre-wrap', fontWeight: 'bold' }}>
      <span>&nbsp;{isMobile ? 'Probs' : 'Probability %'} </span><br />
      <span>1X / X2 / 12</span>
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

  const renderFixture = (fixture) => {
    const scores = JSON.parse(fixture.scores);
    const avgGoals = fixture.avg_performance ? parseFloat(fixture.avg_performance).toFixed(2) : 
      ((parseInt(fixture.teams_perfomance_home_for) + parseInt(fixture.teams_perfomance_home_aganist) + 
        parseInt(fixture.teams_perfomance_away_for) + parseInt(fixture.teams_perfomance_away_aganist)) / 
       (parseInt(fixture.teams_games_played_home) + parseInt(fixture.teams_games_played_away))).toFixed(2);

    const homeProb = parseInt(fixture.percent_pred_home.replace('%', ''));
    const drawProb = parseInt(fixture.percent_pred_draw.replace('%', ''));
    const awayProb = parseInt(fixture.percent_pred_away.replace('%', ''));

    const prediction = getDoubleChancePrediction(
      fixture.percent_pred_home?.replace('%', '') || '0',
      fixture.percent_pred_draw?.replace('%', '') || '0',
      fixture.percent_pred_away?.replace('%', '') || '0',
      fixture.double_chance_goals
    );
    
    // Get the home and away scores from the parsed scores object
    const homeGoals = scores?.fulltime?.home;
    const awayGoals = scores?.fulltime?.away;
    
    const predictionStyle = validateDoubleChancePrediction(
      prediction.prediction,
      fixture.status_short,
      homeGoals,
      awayGoals,
      fixture
    );
    const doubleChanceProb = getDoubleChanceProb(
      fixture.percent_pred_home?.replace('%', '') || '0',
      fixture.percent_pred_draw?.replace('%', '') || '0',
      fixture.percent_pred_away?.replace('%', '') || '0'
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
          <span>{doubleChanceProb.value}%</span>
        </div>
        <div className="responsive-cell" title="Prediction">
          <span className="m-1">
            <span className="number-circle rounded-square" style={predictionStyle}>
              {prediction.prediction}
            </span>
          </span>
        </div>
        <div className="responsive-cell hide-on-mobile" title="Average Goals">{avgGoals}</div>
        <div className="responsive-cell" title="Odds">
          <div className="odds-container">
            {(() => {
              // Safely parse the double_chance_goals or return an empty array
              let odds = [];
              try {
                odds = JSON.parse(fixture.double_chance_goals || '[]');
                // Ensure odds is an array
                if (!Array.isArray(odds)) {
                  odds = [];
                }
              } catch (err) {
                console.error('Error parsing double_chance_goals:', err);
                odds = [];
              }
              
              // Now safely map through the odds array
              return odds.slice(0, 3).map((odd, index) => (
                <div key={index} style={{ fontWeight: prediction.prediction === ['1X', 'X2', '12'][index] ? 'bold' : 'normal' }}>
                  {odd.odd || '-'}
                </div>
              ));
            })()}
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
    <div className="min-h-screen bg-gray-100">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>
          <div className="col-lg-12" style={{ height: 'auto !important' }}>
            <NavigationRow selectedDate={selectedDate} onDateChange={handleDateChange} />
            <div className="responsive-row" style={{ textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)', marginLeft: '1px', borderRadius: '5px', cursor: 'auto' }}>
              <div className="table-cell">
                <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>Free Football Double Chance Predictions</h1>
              </div>
            </div>
            {renderPredictionNav()}
            {renderFixturesHeader()}
            <div>
              <div>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="loading-container">
                      <LoadingAnimation text="Loading matches..." />
                    </div>
                  ) : error ? (
                    <div className="error-message">{error}</div>
                  ) : fixtures.length === 0 && !isLoadingMore && !loadMoreError ? (
                    <div className="text-center p-4">No fixtures available for this date</div>
                  ) : (
                    fixtures.map((fixture, index) => (
                      <div key={fixture.id || fixture.fixture_id}>
                        {renderFixture(fixture)}
                      </div>
                    ))
                  )}
                  
                  {isLoadingMore && (
                    <div className="loading-container">
                      <LoadingAnimation text="Loading more matches..." />
                    </div>
                  )}

                  {!isLoadingMore && hasMore && (
                    <div className="text-center my-4">
                      <button
                        onClick={loadMoreFixtures}
                        className="load-more-button"
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          opacity: isLoadingMore ? 0.7 : 1
                        }}
                      >
                        {isLoadingMore ? 'Loading...' : 'Load More Matches'}
                      </button>
                    </div>
                  )}

                  {loadMoreError && !isLoadingMore && (
                    <div className="text-center p-4 text-red-500">
                      {loadMoreError}
                    </div>
                  )}

                  {!hasMore && !isLoading && !isLoadingMore && !error && !loadMoreError && fixtures.length > 0 && (
                    <div className="text-center p-4 text-gray-500">
                      All matches for this date are loaded.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
