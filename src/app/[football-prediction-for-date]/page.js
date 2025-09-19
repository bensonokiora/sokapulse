'use client';

import { Suspense, useState, useEffect, useRef, useCallback, use } from 'react';
import Link from 'next/link';
import { fetchFixturesByDatePaginated } from '@/utils/api';
import NavigationRow from '@/components/NavigationRow';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { formatToLocalDate, getTodayDate, getNavigationDate, formatDate, isValidDate } from '@/utils/dateUtils';
import { getPrediction, getHighestProbability, validatePrediction } from '@/utils/predictionUtils';

import '../../styles/custom.css';
import LoadingAnimation from '@/components/LoadingAnimation';
import { formatMatchTime } from '@/utils/dateUtils';

export default function Home({ params }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  
  
  // State variables
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [fixtures, setFixtures] = useState([]);
  const [error, setError] = useState(null);
  const [loadMoreError, setLoadMoreError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentNextCursor, setCurrentNextCursor] = useState(null);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [currentDate, setCurrentDate] = useState(getTodayDate());
  const perPage = 20;
  
  // Refs
  const isInitialRender = useRef(true);
  const ignoreURLChange = useRef(false);

  // On component mount, extract date from URL if present
  useEffect(() => {
    if (isInitialRender.current) {
      const defaultDate = getTodayDate();
      
      if (resolvedParams && resolvedParams['football-prediction-for-date']) {
        try {
          const extractedDate = resolvedParams['football-prediction-for-date'].replace('football-predictions-for-', '');
          if (isValidDate(extractedDate)) {
            setCurrentDate(extractedDate);
            fetchFixturesByDateSafe(extractedDate);
          } else {
            console.error("Invalid date in URL, using today:", defaultDate);
            setCurrentDate(defaultDate);
            fetchFixturesByDateSafe(defaultDate);
          }
        } catch (error) {
          console.error("Error extracting date from URL:", error);
          setCurrentDate(defaultDate);
          fetchFixturesByDateSafe(defaultDate);
        }
      } else {
        console.log("No date in URL, using today:", defaultDate);
        setCurrentDate(defaultDate);
        fetchFixturesByDateSafe(defaultDate);
      }
      
      isInitialRender.current = false;
    }
  }, [resolvedParams]);

  // Safe wrapper for fetchFixturesByDate that includes error handling
  const fetchFixturesByDateSafe = async (date) => {
    if (!date || !isValidDate(date)) {
      console.error("Invalid date provided to fetch:", date);
      return;
    }
    
    // Capture the date to ensure it doesn't change during the async operation
    const dateToFetch = date;
    console.log("Fetching fixtures for date:", dateToFetch);
    setIsLoading(true);
    setFixtures([]);
    setError(null);
    setLoadMoreError(null);
    setCurrentNextCursor(null);
    setHasMore(false);
    
    try {
      // Fetch initial page of fixtures
      console.log("API call for initial page using date:", dateToFetch);
      const apiResponse = await fetchFixturesByDatePaginated(dateToFetch, perPage, '1');
      console.log("API Response:", apiResponse); 
      
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
        console.error("API returned an error or empty data:", apiResponse);
        setError(apiResponse.message || 'Failed to load fixtures');
        setFixtures([]);
        setHasMore(false);
        setCurrentNextCursor(null);
      }
    } catch (err) {
      console.error("Error fetching fixtures:", err);
      setError('Error loading fixtures');
      setFixtures([]);
      setHasMore(false);
      setCurrentNextCursor(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreFixtures = useCallback(async () => {
    if (isLoadingMore || !hasMore || !currentNextCursor) return;
    
    setIsLoadingMore(true);
    setLoadMoreError(null);
    
    try {
      console.log(`Fetching next page with cursor: ${currentNextCursor} for date: ${currentDate}`);
      const apiResponse = await fetchFixturesByDatePaginated(currentDate, perPage, currentNextCursor);

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
        console.error('API error while loading more fixtures:', apiResponse.message);
        setLoadMoreError(apiResponse.message || 'Failed to load more fixtures');
        setHasMore(false); 
      }
    } catch (err) {
      console.error("Error in loadMoreFixtures:", err);
      setLoadMoreError('Error loading more fixtures');
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, currentNextCursor, currentDate, perPage]);

  // Handle date selection change from NavigationRow
  const handleDateChange = (e) => {
    if (!e?.target?.value) {
      console.error("No date value in handleDateChange");
      return;
    }
    
    try {
      const dateValue = e.target.value;
      console.log("handleDateChange received:", dateValue);
      
      let newDate;
      if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Already in YYYY-MM-DD format
        newDate = dateValue;
      } else {
        // Need to format it
        newDate = formatDate(new Date(dateValue));
      }
      
      if (!isValidDate(newDate)) {
        console.error("Invalid date after formatting:", newDate);
        return;
      }
      
      console.log("Setting new date:", newDate);
      
      // Update state first
      setCurrentDate(newDate);
      setFixtures([]);
      setIsLoading(true);
      
      // Set flag before navigation to ignore URL change effect
      ignoreURLChange.current = true;
      
      // Navigate to new URL
      const formattedUrl = `football-predictions-for-${newDate}`;
      router.push(`/${formattedUrl}?filter_date=${newDate}`);
      
      // Fetch fixtures
      fetchFixturesByDateSafe(newDate);
    } catch (error) {
      console.error("Error in handleDateChange:", error);
    }
  };

  // Mobile detection effect
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Initialize favorites from localStorage
  useEffect(() => {
    try {
      const favoriteData = JSON.parse(localStorage.getItem('mymatchesdata'));
      if (favoriteData?.dataArray) {
        const states = {};
        favoriteData.dataArray.forEach(item => {
          states[item.fixture_id] = true;
        });
        setFavoriteStates(states);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }, []);

  // Render navigation links
  const renderPredictionNav = () => {
    const baseUrl = `/football-predictions-for-${currentDate}`;
    
    return (
      <div className="match-details-navigation">
        <div className="match-details-nav-item">
          <Link href={baseUrl} className="match-details-nav-link active">
            <span>1x2</span>
          </Link>
        </div>
        <div className="match-details-nav-item">
          <Link href={`${baseUrl}/double-chance-predictions`} className="match-details-nav-link">
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
            <span>Both Team to Score</span>
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

  const renderFixture = (fixture) => {
    // Early return with empty div if fixture is invalid to prevent errors
    if (!fixture) {
      console.warn("Received invalid fixture:", fixture);
      return <div key={Math.random()}>Invalid fixture data</div>;
    }
    
    // Support both id and fixture_id fields
    const fixtureId = fixture.id || fixture.fixture_id;
    if (!fixtureId) {
      console.warn("Fixture missing ID:", fixture);
      return <div key={Math.random()}>Fixture missing ID</div>;
    }
    
    // Extra validation for critical fields
    if (!fixture.percent_pred_home && !fixture.percent_pred_draw && !fixture.percent_pred_away) {
      // Set default values if predictions are missing
      fixture.percent_pred_home = fixture.percent_pred_home || "33%";
      fixture.percent_pred_draw = fixture.percent_pred_draw || "33%";
      fixture.percent_pred_away = fixture.percent_pred_away || "34%";
    }
    
    try {
      // Parse scores safely
      let scores;
      try {
        scores = fixture.scores ? JSON.parse(fixture.scores) : { fulltime: { home: null, away: null }, halftime: { home: null, away: null }, extratime: { home: null, away: null } };
      } catch (e) {
        console.warn("Error parsing scores:", e);
        scores = { fulltime: { home: null, away: null }, halftime: { home: null, away: null }, extratime: { home: null, away: null } };
      }
      
      // Format scores with support for extra time
      const formattedScores = getFormattedScores(fixture, scores);
      
      // Safely calculate average goals with fallbacks for null values
      const homeFor = parseInt(fixture.teams_perfomance_home_for) || 0;
      const homeAgainst = parseInt(fixture.teams_perfomance_home_aganist) || 0;
      const awayFor = parseInt(fixture.teams_perfomance_away_for) || 0;
      const awayAgainst = parseInt(fixture.teams_perfomance_away_aganist) || 0;
      const homePlayed = parseInt(fixture.teams_games_played_home) || 1;  // Use 1 to avoid division by zero
      const awayPlayed = parseInt(fixture.teams_games_played_away) || 1;
      
      const avgGoals = ((homeFor + homeAgainst + awayFor + awayAgainst) / (homePlayed + awayPlayed)).toFixed(2);

      // ULTRA-safe prediction percentage processing with type checking
      const safeReplace = (value) => {
        if (typeof value === 'string') {
          return value.replace ? value.replace('%', '') : value;
        }
        return '0';
      };
      
      const homePercent = safeReplace(fixture.percent_pred_home);
      const drawPercent = safeReplace(fixture.percent_pred_draw);
      const awayPercent = safeReplace(fixture.percent_pred_away);

      const prediction = getPrediction(homePercent, drawPercent, awayPercent);
      
      const predictionStyle = validatePrediction(prediction, scores, fixture.status_long, fixture);
      
      const highestProb = getHighestProbability(homePercent, drawPercent, awayPercent);

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
        <div key={fixtureId} className="responsive-row" style={{ cursor: 'auto' }}>
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
              <span className="number-circle rounded-square" style={predictionStyle}>
                {prediction}
              </span>
            </span>
          </div>
          <div className="responsive-cell hide-on-mobile" title="Average Goals">{avgGoals}</div>
          <div className="responsive-cell" title="Odds">
            <div className="odds-container">
              <div style={{ fontWeight: prediction === '1' ? 'bold' : 'normal' }}>{fixture.bets_home}</div>
              <div style={{ fontWeight: prediction === 'X' ? 'bold' : 'normal' }}>{fixture.bets_draw}</div>
              <div style={{ fontWeight: prediction === '2' ? 'bold' : 'normal' }}>{fixture.bets_away}</div>
            </div>
          </div>
          <div className="responsive-cell" title="Scores">
            <div className="score-container">
              <div className="match-status-wrapper">
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
                ) : null}
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
    } catch (error) {
      console.error("Error rendering fixture:", error, fixture);
      return <div key={fixture.id || Math.random()}>Error rendering fixture</div>;
    }
  };

  // Add helper function for formatted scores with extra time support
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Suspense fallback={<div>Loading...</div>}>
      <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>

        <div className="col-lg-12" style={{ height: 'auto !important' }}>
          <NavigationRow selectedDate={currentDate} onDateChange={handleDateChange} />
          <div className="responsive-row" style={{ textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)', marginLeft: '1px', borderRadius: '5px', cursor: 'auto' }}>
            <div className="table-cell">
              <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>Free Football Predictions, Tips & Statistics</h1>
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
                  <div className="error-container" style={{
                    padding: '20px',
                    margin: '20px 0',
                    backgroundColor: '#ffebee',
                    borderRadius: '8px',
                    border: '1px solid #ef5350',
                    textAlign: 'center'
                  }}>
                    <div style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold', color: '#d32f2f' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" style={{ marginRight: '8px' }} viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                      </svg>
                      {error}
                    </div>
                    <p style={{ marginBottom: '15px', color: '#555' }}>
                      We couldn't load the fixtures for this date. Please try again.
                    </p>
                    <button
                      onClick={() => fetchFixturesByDateSafe(currentDate)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#2196f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                    >
                      Retry
                    </button>
                  </div>
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