'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaInfoCircle, FaStar } from 'react-icons/fa';
import { fetchUpcomingFixtures } from '@/utils/api'; // Ensure API function is imported
import NavigationRow from '@/components/NavigationRow'; // For date navigation
import LoadingAnimation from '@/components/LoadingAnimation';
import '../../../styles/custom.css';
import { getBothTeamToScorePrediction, calculateBttsProbabilities, calculateConfidenceLevel, validateBttsPrediction } from '@/utils/predictionUtils';
import { formatMatchTime } from '@/utils/dateUtils';
import SeoContent from '@/components/SeoContent';

// Accept props from server component
export default function UpcomingBttsClient({ 
  initialFixtures,
  initialSelectedDate, // Renamed from initialDate for clarity
  initialHasMore,
  initialNextCursor,
  initialError = null,
}) { 
  const [isLoading, setIsLoading] = useState(false); 
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [fixtures, setFixtures] = useState(initialFixtures || []);
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate); 
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [hasMore, setHasMore] = useState(initialHasMore || false);
  const [error, setError] = useState(initialError);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);

  const formatDateForApi = (date) => {
    if (!date) date = new Date();
    if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) return date;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dayString = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${dayString}`;
  };

  const fetchDataForDate = async (dateToFetch) => {
    setIsLoading(true);
    setError(null);
    setFixtures([]);
    setNextCursor('1');
    setHasMore(true); 

    try {
      const formattedDate = formatDateForApi(dateToFetch);
      console.log('(Client-BTTS) Fetching initial fixtures for date:', formattedDate);
      const response = await fetchUpcomingFixtures(formattedDate, 20, '1');

      if (response.status === true && Array.isArray(response.data)) {
        setFixtures(response.data);
        setNextCursor(response.nextCursor);
        setHasMore(!!response.nextCursor);
      } else {
        console.error('(Client-BTTS) API error on date change:', response.message);
        setError(response.message || 'Failed to load fixtures');
        setFixtures([]);
        setHasMore(false);
        setNextCursor(null);
      }
    } catch (err) {
      console.error('(Client-BTTS) Fetch error on date change:', err);
      setError('Error loading fixtures');
      setFixtures([]);
      setHasMore(false);
      setNextCursor(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value; // Assuming YYYY-MM-DD from NavigationRow
    setSelectedDate(newDate);
    // Update URL to reflect the new date for BTTS page
    window.history.pushState({}, '', `/upcoming-football-predictions/predictions-both-team-to-score?date=${newDate}`);
    fetchDataForDate(newDate);
  };

  const loadMoreFixtures = async () => { 
    if (isLoadingMore || !hasMore || !nextCursor) return;

    setIsLoadingMore(true);
    setError(null);

    try {
        const formattedDate = formatDateForApi(selectedDate);
        console.log(`(Client-BTTS) Loading more. Date: ${formattedDate}, Cursor: ${nextCursor}`);
        const response = await fetchUpcomingFixtures(formattedDate, 20, nextCursor);

        if (response.status === true && Array.isArray(response.data)) {
            const newFixtures = response.data.filter(
                (newFixture) => !fixtures.some((existing) => existing.fixture_id === newFixture.fixture_id)
            );
            setFixtures(prev => [...prev, ...newFixtures]);
            setNextCursor(response.nextCursor);
            setHasMore(!!response.nextCursor);
        } else {
            console.error('(Client-BTTS) API error on load more:', response.message);
            setError(response.message || 'Failed to load more fixtures');
            setHasMore(false);
            setNextCursor(null);
        }
    } catch (err) {
        console.error('(Client-BTTS) Error loading more fixtures:', err);
        setError('Error loading more fixtures.'); 
        setHasMore(false);
        setNextCursor(null);
    } finally {
        setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setFixtures(initialFixtures || []);
    setSelectedDate(initialSelectedDate || formatDateForApi(new Date()));
    setHasMore(initialHasMore || false);
    setNextCursor(initialNextCursor || null);
    setError(initialError || null);
    setIsLoading(false);
    setIsLoadingMore(false);
  }, [initialFixtures, initialSelectedDate, initialHasMore, initialNextCursor, initialError]);

  useEffect(() => {
    const favoriteData = JSON.parse(localStorage.getItem('mymatchesdata'));
    if (favoriteData?.dataArray) {
      const states = {};
      favoriteData.dataArray.forEach(item => {
        states[item.fixture_id] = true;
      });
      setFavoriteStates(states);
    }
    
    // Handle storage changes for favorites
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

    // Check if the device is mobile based on screen width
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
  }, []);

  const renderPredictionNav = () => (
    <div className="match-details-navigation">
      <div className="match-details-nav-item">
        <Link href="/upcoming-football-predictions" className="match-details-nav-link">
          <span>1x2</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/upcoming-football-predictions/double-chance-predictions" className="match-details-nav-link">
          <span>Double Chance</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/upcoming-football-predictions/predictions-under-over-goals" className="match-details-nav-link">
          <span>Under/Over 2.5</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/upcoming-football-predictions/predictions-both-team-to-score" className="match-details-nav-link active">
          <span>BTTS</span>
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
      <div className="responsive-cell"></div>
      <div className="responsive-cell"></div>
      <div className="responsive-cell team-link-probability" style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
         <span>&nbsp;{isMobile ? 'Probs' : 'Probability %'} </span><br />
        <span>No / Yes</span>
      </div>
      <div className="responsive-cell">{isMobile ? 'Pred' : 'Prediction'}</div>
      <div className="responsive-cell">
        <div className="row">
          <div className="col-md-12 col-sm-12 col-xs-12">Scores</div>
        </div>
      </div>
    </div>
  );

  const renderFixture = (fixture) => {
    try {
      // Use the utility functions for BTTS predictions
      const [noProb, yesProb] = calculateBttsProbabilities(fixture);
      
      // Get BTTS prediction with all confidence data
      const bttsData = getBothTeamToScorePrediction(fixture);
      const prediction = bttsData.prediction;
      const confidenceText = bttsData.confidenceText;
      const confidenceColor = bttsData.confidenceColor;
      const confidenceScore = bttsData.confidenceScore;
      const odds = bttsData.odds;
      
      // Parse scores for validation
      const scores = JSON.parse(fixture.scores || '{}'); // Safer parsing with default empty object string
      
      // Get prediction style based on validation using the utility function
      const predictionStyle = validateBttsPrediction(prediction, scores, fixture.status_long);
      
      // Check if this fixture is a favorite
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

        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
        favoriteData.expiry = expiry.getTime();

        localStorage.setItem('mymatchesdata', JSON.stringify(favoriteData));
        window.dispatchEvent(new Event('storage'));
      };

      return (
        <div className="responsive-row" style={{ cursor: 'auto' }}>
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
          <div className="responsive-cell">
            {/* Placeholder for potential odds/data */}
          </div>
          <div className="responsive-cell">
            {/* Placeholder for potential odds/data */}
          </div>
          <div className="responsive-cell" style={{ minWidth: '70px', textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: prediction === 'No' ? 'bold' : 'normal' }}>{noProb}%</span>&nbsp;
                <span style={{ fontWeight: prediction === 'Yes' ? 'bold' : 'normal' }}>{yesProb}%</span>
              </div>
              <div style={{ 
                fontSize: '8px', 
                marginTop: '2px', 
                padding: '1px 3px', 
                borderRadius: '3px', 
                backgroundColor: confidenceColor,
                color: '#fff' 
              }}>
                {confidenceText} confidence
              </div>
            </div>
          </div>
          <div className="responsive-cell" title={`Prediction: ${prediction === 'Yes' ? 'Both Teams to Score' : 'Both Teams NOT to Score'}`} style={{ minWidth: '65px', textAlign: 'center' }}>
            <span className="m-1">
              <span className="number-circle rounded-square" style={{
                ...predictionStyle,
                minWidth: '55px',
                display: 'inline-block',
                textAlign: 'center',
                padding: '3px 6px',
                whiteSpace: 'nowrap',
                fontSize: '12px',
                fontWeight: 'bold',
                letterSpacing: '0.5px'
              }}>
                {prediction === 'Yes' ? 'YES' : 'NO'}
              </span>
            </span>
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
                <span className={`${scores?.fulltime?.home !== null && scores?.fulltime?.away !== null ? 'scores-card' : 'no-score'} ${["2H", "1H", "INT", "HT", "LIVE"].includes(fixture.status_short) ? 'live' : ''}`} id="fulltimeGoals">
                  {scores?.fulltime?.home !== null && scores?.fulltime?.away !== null ? `${scores.fulltime.home} - ${scores.fulltime.away}` : '-'}
                </span>
                {scores?.halftime?.home !== null && scores?.halftime?.away !== null && (
                  <span className="halfTimeDataDisplay">
                    {`(${scores.halftime.home}-${scores.halftime.away})`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error rendering fixture:', error, fixture);
      return null;
    }
  };

   const renderPredictionExplanation = () => (
    <div className="explanation-popup">
      <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Both Teams to Score (BTTS) Prediction Explanation</h3>
      <p>This prediction indicates whether both teams are likely to score at least one goal during the match ('Yes') or if at least one team will fail to score ('No').</p>
      <p><strong>Factors considered:</strong></p>
      <ul>
        <li>Historical scoring and conceding rates for both teams (home/away).</li>
        <li>Recent form and offensive/defensive performance.</li>
        <li>Head-to-head match history.</li>
        <li>Statistical models analyzing goal probabilities.</li>
        <li>Market odds for the BTTS market (Yes/No).</li>
      </ul>
      <p><strong>Confidence Levels:</strong></p>
      <ul>
        <li><strong>Low:</strong> Small difference in probabilities, less certainty.</li>
        <li><strong>Medium:</strong> Moderate difference, reasonable confidence.</li>
        <li><strong>High:</strong> Significant difference, strong indication for the prediction.</li>
      </ul>
       <button onClick={() => setIsExplanationVisible(false)} style={{ marginTop: '10px', padding: '5px 10px', cursor: 'pointer' }}>Close</button>
    </div>
  );

  return (
    <div className="container container-mob">
      <NavigationRow selectedDate={selectedDate} onDateChange={handleDateChange} />
      {renderPredictionNav()}

      <div className="responsive-row header-info" style={{ textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)', marginLeft: '1px', borderRadius: '5px', cursor: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="table-cell flex-grow-1" style={{ padding: '5px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0' }}>Free Football Predictions Both Team To Score (BTTS)</h1>
        </div>
        <div style={{ paddingRight: '10px' }}>
          <FaInfoCircle 
            onClick={() => setIsExplanationVisible(!isExplanationVisible)} 
            style={{ cursor: 'pointer', fontSize: '20px', color: '#333' }} 
            title="Click for explanation" 
          />
        </div>
      </div>
      {isExplanationVisible && renderPredictionExplanation()}

      {renderFixturesHeader()}
      
      {isLoading ? (
        <div className="loading-container flex justify-center items-center w-full h-64">
          <LoadingAnimation text="Loading matches..." />
        </div>
      ) : error ? (
        <div className="error-message text-center p-4 text-red-500">{error}</div>
      ) : fixtures.length === 0 ? (
        <div className="no-fixtures-message text-center p-4 text-gray-500">No BTTS predictions available for {selectedDate}</div>
      ) : (
        <>
          {fixtures.map((fixture, index) => renderFixture(fixture))}
          
        </>
      )}
       {/* Load More Button and Indicator */}
       {hasMore && !isLoadingMore && !isLoading && (
        <div className="load-more text-center p-4">
          <button 
            className="btn btn-success btn-sm px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            onClick={loadMoreFixtures}
            disabled={isLoadingMore || isLoading} 
          >
            {'Load More Matches'}
          </button>
        </div>
      )}
      {isLoadingMore && (
        <div className="flex justify-center items-center w-full h-20 my-4"><LoadingAnimation size={100} text="Loading more..." /></div>
      )}
      
      {/* SEO Content */}
      <SeoContent pageType="upcoming" siteName="SokaPulse" />
    </div>
  );
} 