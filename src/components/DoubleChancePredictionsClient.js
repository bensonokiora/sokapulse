'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import NavigationRow from '@/components/NavigationRow';
import LoadingAnimation from '@/components/LoadingAnimation';
import {  fetchFixturesByDatePaginated } from '@/utils/api';
import { getDoubleChancePrediction, getDoubleChanceProb, validateDoubleChancePrediction } from '@/utils/doubleChancePredictionUtils';
import { formatMatchTime } from '@/utils/dateUtils';

// Helper function to group fixtures by country and then by league
const groupFixturesByCountry = (fixtures) => {
  const grouped = {};
  const countryOrder = []; // Track the order in which countries first appear
  
  fixtures.forEach(fixture => {
    const countryName = fixture.country_name || 'Other';
    const countryFlag = fixture.country_flag || '';
    const leagueName = fixture.league_name || 'Unknown League';
    const leagueLogo = fixture.logo || '';
    
    // Initialize country if it doesn't exist
    if (!grouped[countryName]) {
      grouped[countryName] = {
        countryName,
        countryFlag,
        leagues: {},
        leagueOrder: [] // Track league order within country
      };
      countryOrder.push(countryName);
    }
    
    // Initialize league within country if it doesn't exist
    if (!grouped[countryName].leagues[leagueName]) {
      grouped[countryName].leagues[leagueName] = {
        leagueName,
        leagueLogo,
        fixtures: []
      };
      grouped[countryName].leagueOrder.push(leagueName);
    }
    
    // Add fixture to the appropriate league
    grouped[countryName].leagues[leagueName].fixtures.push(fixture);
  });
  
  // Convert to final structure and preserve order
  const orderedCountries = countryOrder.map(countryName => {
    const country = grouped[countryName];
    return {
      countryName: country.countryName,
      countryFlag: country.countryFlag,
      leagues: country.leagueOrder.map(leagueName => country.leagues[leagueName])
    };
  });
  
  // Find "World" and move it to the front
  const worldIndex = orderedCountries.findIndex(country => country.countryName === 'World');
  if (worldIndex > 0) {
    const worldCountry = orderedCountries.splice(worldIndex, 1)[0];
    orderedCountries.unshift(worldCountry);
  }
  
  return orderedCountries;
};

// League Group Header Component
const LeagueGroupHeader = ({ leagueName, leagueLogo, fixtureCount }) => {
  return (
    <div className="league-group-header">
      <div className="league-group-content">
        <div className="league-logo-wrapper">
          {leagueLogo ? (
            <img 
              src={leagueLogo} 
              alt={`${leagueName} logo`}
              className="league-logo"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                // Show fallback letter when image fails to load
                const fallback = document.createElement('div');
                fallback.className = 'league-logo-fallback';
                fallback.textContent = leagueName.charAt(0).toUpperCase();
                e.target.parentNode.appendChild(fallback);
              }}
            />
          ) : (
            <div className="league-logo-fallback">
              {leagueName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="league-info">
          <h4 className="league-name">{leagueName}</h4>
          <span className="league-fixture-count">{fixtureCount} {fixtureCount === 1 ? 'match' : 'matches'}</span>
        </div>
      </div>
    </div>
  );
};

// Modern Country Group Header Component
const CountryGroupHeader = ({ countryName, countryFlag, totalFixtures }) => {
  const getFlagUrl = (flagUrl) => {
    // Handle specific flag URL replacements like in the existing code
    if (flagUrl === "https://seekflag.com/app/uploads/2022/01/England-01-1.svg") {
      return "https://pngimg.com/uploads/england/england_PNG7.png";
    } else if (flagUrl === "https://seekflag.com/app/uploads/2022/01/Scotland-01-1.svg") {
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Flag_of_Scotland.svg/1200px-Flag_of_Scotland.svg.png";
    } else if (flagUrl === "https://seekflag.com/app/uploads/2022/01/Wales-01-1.svg") {
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Flag_of_Wales.svg/1200px-Flag_of_Wales.svg.png";
    } else if (flagUrl === "https://seekflag.com/app/uploads/2021/11/Flag-of-Gabon-01-1.svg") {
      return "https://upload.wikimedia.org/wikipedia/commons/0/04/Flag_of_Gabon.svg";
    } else if (flagUrl === "https://seekflag.com/app/uploads/2022/01/Northern-Ireland-01-1.svg") {
      return "https://cdn.britannica.com/92/3092-050-3A68D1DE/Flag-of-Northern-Ireland.jpg";
    }
    return flagUrl;
  };

  return (
    <div className="country-group-header">
      <div className="country-group-content">
        <div className="country-flag-wrapper">
          {countryFlag ? (
            <img 
              src={getFlagUrl(countryFlag)} 
              alt={`${countryName} flag`}
              className="country-flag"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                // Show fallback letter when image fails to load
                const fallback = document.createElement('div');
                fallback.className = 'country-flag-fallback';
                fallback.textContent = countryName.charAt(0).toUpperCase();
                e.target.parentNode.appendChild(fallback);
              }}
            />
          ) : (
            <div className="country-flag-fallback">
              {countryName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="country-info">
          <h3 className="country-name">{countryName}</h3>
          <span className="fixture-count">{totalFixtures} {totalFixtures === 1 ? 'match' : 'matches'}</span>
        </div>
      </div>
    </div>
  );
};

export default function DoubleChancePredictionsClient({ 
  initialFixtures,
  initialError,
  initialNextCursor,
  perPage,
  initialDate
}) {
  const [isLoading, setIsLoading] = useState(!initialFixtures || initialFixtures.length === 0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [fixtures, setFixtures] = useState(initialFixtures || []);
  const [allFixtures, setAllFixtures] = useState(initialFixtures || []);
  const [error, setError] = useState(initialError || null);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(!!initialNextCursor);
  const [currentNextCursor, setCurrentNextCursor] = useState(initialNextCursor);
  const [loadMoreError, setLoadMoreError] = useState(null);

  const getInitialSelectedDateString = () => {
    if (initialDate && typeof initialDate === 'string' && initialDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return initialDate; // initialDate is already YYYY-MM-DD string
    }
    // Fallback to today's date string if initialDate is not a valid string
    return new Date().toISOString().split('T')[0];
  };
  const [selectedDate, setSelectedDate] = useState(getInitialSelectedDateString()); // Stores YYYY-MM-DD string

  const formatDateForApi = (dateInput) => {
    if (typeof dateInput === 'string' && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateInput;
    }
    if (dateInput instanceof Date) {
      return dateInput.toISOString().split('T')[0];
    }
    // Fallback for unexpected input, log warning
    console.warn('formatDateForApi received unexpected dateInput type:', dateInput);
    return new Date().toISOString().split('T')[0]; 
  };
  
  const fetchPaginatedFixtures = useCallback(async (dateString, pageCursor) => {
    const formattedDate = formatDateForApi(dateString); // dateString is YYYY-MM-DD
    try {
      const apiResponse = await fetchFixturesByDatePaginated(formattedDate, perPage, pageCursor);
      if (apiResponse.status === true && Array.isArray(apiResponse.fixtures)) {
        return {
          newFixtures: apiResponse.fixtures,
          nextPageCursor: apiResponse.nextCursor,
          apiError: null,
        };
      } else {
        return {
          newFixtures: [],
          nextPageCursor: null,
          apiError: apiResponse.message || 'Failed to fetch fixtures',
        };
      }
    } catch (err) {
      console.error('Error in fetchPaginatedFixtures:', err);
      return {
        newFixtures: [],
        nextPageCursor: null,
        apiError: 'Error fetching fixtures',
      };
    }
  }, [perPage]);

  const loadMoreFixtures = useCallback(async () => {
    if (isLoadingMore || !hasMore || !currentNextCursor) {
      return;
    }
    
    setIsLoadingMore(true);
    setLoadMoreError(null);
    
    const { newFixtures, nextPageCursor, apiError } = await fetchPaginatedFixtures(selectedDate, currentNextCursor);

    if (apiError) {
      setLoadMoreError(apiError);
      setHasMore(false);
    } else {
      setFixtures(prevFixtures => {
        const existingFixtureIds = new Set(prevFixtures.map(f => f.fixture_id));
        const uniqueNewFixtures = newFixtures.filter(f => !existingFixtureIds.has(f.fixture_id));
        return [...prevFixtures, ...uniqueNewFixtures];
      });
      setAllFixtures(prevAll => {
        const existingFixtureIds = new Set(prevAll.map(f => f.fixture_id));
        const uniqueNewFixtures = newFixtures.filter(f => !existingFixtureIds.has(f.fixture_id));
        return [...prevAll, ...uniqueNewFixtures];
      });
      setCurrentNextCursor(nextPageCursor);
      setHasMore(!!nextPageCursor);
    }
    setIsLoadingMore(false);
  }, [isLoadingMore, hasMore, currentNextCursor, selectedDate, fetchPaginatedFixtures]);

  const handleDateChange = useCallback(async (e) => {
    const newDateString = e.target.value; // Assuming this is YYYY-MM-DD from date input
    // Ensure newDateString is valid YYYY-MM-DD, otherwise, don't proceed or use a default
    if (!newDateString || !newDateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        console.error("Invalid date string from event target:", newDateString);
        // Optionally, reset to a default or show an error, for now, just return
        return; 
    }

    setSelectedDate(newDateString); // Directly set the YYYY-MM-DD string
    setIsLoading(true);
    setFixtures([]);
    setAllFixtures([]);
    setError(null);
    setLoadMoreError(null);
    
    const { newFixtures, nextPageCursor, apiError } = await fetchPaginatedFixtures(newDateString, '1');

    if (apiError) {
      setError(apiError);
      setHasMore(false);
      setCurrentNextCursor(null);
    } else {
      setFixtures(newFixtures);
      setAllFixtures(newFixtures);
      setCurrentNextCursor(nextPageCursor);
      setHasMore(!!nextPageCursor);
    }
    setIsLoading(false);
  }, [fetchPaginatedFixtures]);
  
  useEffect(() => {
    setFixtures(initialFixtures || []);
    setAllFixtures(initialFixtures || []);
    setError(initialError || null);
    setCurrentNextCursor(initialNextCursor);
    setHasMore(!!initialNextCursor);
    setSelectedDate(getInitialSelectedDateString()); // selectedDate is now a string
    if ((initialFixtures && initialFixtures.length > 0) || initialError) {
      setIsLoading(false);
    }
  }, [initialFixtures, initialError, initialNextCursor, initialDate]);

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
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const refreshMatchData = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    setError(null); 
    setLoadMoreError(null); 

    const { newFixtures, nextPageCursor, apiError } = await fetchPaginatedFixtures(selectedDate, '1');

    if (apiError) {
      setError(apiError); 
      setFixtures([]);
      setAllFixtures([]);
      setHasMore(false);
      setCurrentNextCursor(null);
    } else {
      setFixtures(newFixtures);
      setAllFixtures(newFixtures);
      setCurrentNextCursor(nextPageCursor);
      setHasMore(!!nextPageCursor);
      setLastRefreshTime(new Date());
    }
    setIsRefreshing(false);
  }, [selectedDate, fetchPaginatedFixtures, isRefreshing]);

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refreshMatchData();
    }, 60000);
    
    return () => clearInterval(refreshInterval);
  }, [refreshMatchData]);

  const renderPredictionNav = () => (
    <div className="match-details-navigation">
      <div className="match-details-nav-item">
        <Link href="/today-football-predictions" className="match-details-nav-link">
          <span>1x2</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/today-football-predictions/double-chance-predictions" className="match-details-nav-link active">
          <span>Double Chance</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/today-football-predictions/predictions-under-over-goals" className="match-details-nav-link">
          <span>Under/Over 2.5</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/today-football-predictions/predictions-both-team-to-score" className="match-details-nav-link">
          <span>BTTS</span>
        </Link>
      </div>
    </div>
  );

  const renderFixturesHeader = () => (
    <div className="responsive-row header-size" style={{ fontWeight: 'bold', textAlign: 'left', cursor: 'auto' }}>
      <div className="responsive-cell"></div> {/* Time */} 
      <div className="responsive-cell"></div> {/* League Info */} 
      <div className="responsive-cell"></div> {/* Favorite */} 
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

  const renderFixture = (fixture, index) => {
    if (!fixture || !fixture.scores) {
      return null;
    }
    
    let scores;
    try {
      scores = JSON.parse(fixture.scores);
    } catch (e) {
      console.error("Error parsing scores JSON for fixture:", fixture.fixture_id, e);
      scores = { fulltime: { home: null, away: null }, halftime: { home: null, away: null } };
    }

    const homeFor = parseInt(fixture.teams_perfomance_home_for) || 0;
    const homeAganist = parseInt(fixture.teams_perfomance_home_aganist) || 0;
    const awayFor = parseInt(fixture.teams_perfomance_away_for) || 0;
    const awayAganist = parseInt(fixture.teams_perfomance_away_aganist) || 0;
    const homePlayed = parseInt(fixture.teams_games_played_home) || 1;
    const awayPlayed = parseInt(fixture.teams_games_played_away) || 1;
    
    const avgGoals = fixture.avg_performance ? 
      parseFloat(fixture.avg_performance).toFixed(2) : 
      ((homeFor + homeAganist + awayFor + awayAganist) / (homePlayed + awayPlayed)).toFixed(2);

    const predictionResult = getDoubleChancePrediction(
      fixture.percent_pred_home?.replace('%', '') || '0',
      fixture.percent_pred_draw?.replace('%', '') || '0',
      fixture.percent_pred_away?.replace('%', '') || '0',
      fixture.double_chance_goals
    );
    
    const homeGoals = fixture.goals_home !== null && fixture.goals_home !== undefined ? parseInt(fixture.goals_home, 10) : null;
    const awayGoals = fixture.goals_away !== null && fixture.goals_away !== undefined ? parseInt(fixture.goals_away, 10) : null;
    
    const predictionStyle = validateDoubleChancePrediction(
      predictionResult.prediction,
      fixture.status_short,
      homeGoals,
      awayGoals
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
      let favoriteData = { dataArray: [] };

      try {
        const storedData = localStorage.getItem('mymatchesdata');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData && Array.isArray(parsedData.dataArray)) {
            favoriteData = parsedData;
          } else if (parsedData && !Array.isArray(parsedData.dataArray)) {
            console.warn("Favorites dataArray is not an array, resetting.");
          }
        }
      } catch (parseError) {
        console.error("Error parsing favorites from localStorage:", parseError);
      }
      
      setFavoriteStates(prev => ({
        ...prev,
        [fixture.fixture_id]: newState
      }));

      if (newState) {
        if (fixture.fixture_id && !favoriteData.dataArray.some(item => item && item.fixture_id === fixture.fixture_id)) {
          favoriteData.dataArray.push({ fixture_id: fixture.fixture_id });
        }
      } else {
        favoriteData.dataArray = favoriteData.dataArray.filter(
          item => item && item.fixture_id !== fixture.fixture_id
        );
      }
      
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      favoriteData.expiry = expiry.getTime();

      try {
        localStorage.setItem('mymatchesdata', JSON.stringify(favoriteData));
        window.dispatchEvent(new Event('storage'));
      } catch (storageError) {
        console.error("Error saving favorites to localStorage:", storageError);
        setFavoriteStates(prev => ({ ...prev, [fixture.fixture_id]: !newState }));
      }
    };

    return (
      <Link key={fixture.fixture_id || index} href={`/football-predictions/fixture/${fixture.home_team_name.toLowerCase().replace(/\s+/g, '-')}-vs-${fixture.away_team_name.toLowerCase().replace(/\s+/g, '-')}-${fixture.fixture_id}`} className="responsive-row team-link" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
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
          <div className="favorite-desktop" onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleFavorite(e); }}>
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
          <div className="favorite-mobile" onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleFavorite(e); }}>
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
            <div className="teamNameLink">
              <span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.home_team_name}</span><br />
              <span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.away_team_name}</span>
            </div>
        </div>
        <div className="responsive-cell team-link-probability" style={{ whiteSpace: 'nowrap' }}>
          <span>{doubleChanceProb.value}%</span>
        </div>
        <div className="responsive-cell" title="Prediction">
          <span className="m-1">
            <span className="number-circle rounded-square" style={predictionStyle}>
              {predictionResult.prediction}
            </span>
          </span>
        </div>
        <div className="responsive-cell hide-on-mobile" title="Average Goals">{avgGoals}</div>
        <div className="responsive-cell" title="Odds">
          <div className="odds-container">
            {(() => {
              let odds = [];
              try {
                odds = JSON.parse(fixture.double_chance_goals || '[]');
                if (!Array.isArray(odds)) {
                  odds = [];
                }
              } catch (err) {
                console.error('Error parsing double_chance_goals:', err);
                odds = [];
              }
              
              return odds.slice(0, 3).map((odd, oddIndex) => (
                <div key={oddIndex} style={{ fontWeight: predictionResult.prediction === ['1X', 'X2', '12'][oddIndex] ? 'bold' : 'normal' }}>
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
              <span className={`${homeGoals !== null && awayGoals !== null ? 'scores-card' : 'no-score'} ${["2H", "1H", "INT", "HT", "LIVE"].includes(fixture.status_short) ? 'live' : ''}`} id="fulltimeGoals">
                {homeGoals !== null && awayGoals !== null ? `${homeGoals} - ${awayGoals}` : '-'}
              </span>
              
              {fixture.status_short === "AET" && scores && scores.fulltime && scores.fulltime.home !== null && scores.fulltime.away !== null && (
                <span className="fullTimeDataDisplay" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                  (FT: {scores.fulltime.home}-{scores.fulltime.away})
                </span>
              )}
              
              {scores && scores.halftime && scores.halftime.home !== null && scores.halftime.away !== null && (
                <span className="halfTimeDataDisplay">
                  (HT: {scores.halftime.home}-{scores.halftime.away})
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <>
      {/* Pass Date object to NavigationRow */}
      <NavigationRow selectedDate={selectedDate} onDateChange={handleDateChange} />
      {renderPredictionNav()}
      {renderFixturesHeader()}
      <div>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center w-full h-32 my-4">
              <LoadingAnimation text="Loading matches..." />
            </div>
          ) : error ? (
            <div className="text-center p-4 text-red-500">{error}</div>
          ) : fixtures.length === 0 && !isLoadingMore && !loadMoreError ? (
            <div className="text-center p-4">No fixtures available for this date</div>
          ) : (
            // Render grouped fixtures by country and league
            groupFixturesByCountry(fixtures).map((countryGroup, groupIndex) => {
              const totalFixtures = countryGroup.leagues.reduce((total, league) => total + league.fixtures.length, 0);
              
              return (
                <div key={`${countryGroup.countryName}-${groupIndex}`} className="country-group">
                  <CountryGroupHeader 
                    countryName={countryGroup.countryName}
                    countryFlag={countryGroup.countryFlag}
                    totalFixtures={totalFixtures}
                  />
                  <div className="country-leagues">
                    {countryGroup.leagues.map((league, leagueIndex) => (
                      <div key={`${league.leagueName}-${leagueIndex}`} className="league-group">
                        <LeagueGroupHeader 
                          leagueName={league.leagueName}
                          leagueLogo={league.leagueLogo}
                          fixtureCount={league.fixtures.length}
                        />
                        <div className="league-fixtures">
                          {league.fixtures.map((fixture, index) => renderFixture(fixture, index))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}

          {/* Loading More Indicator */} 
          {isLoadingMore && (
            <div className="flex justify-center items-center w-full h-20 my-4">
              <LoadingAnimation size={100} text="Loading more matches..." />
            </div>
          )}

          {/* Load More Button */}
          {!isLoading && !isLoadingMore && hasMore && (
            <div className="load-more">
              <button
                className="btn btn-success btn-sm"
                onClick={loadMoreFixtures}
              >
                Load More
              </button>
            </div>
          )}

          {/* Load More Error Message */}
          {loadMoreError && !isLoadingMore && (
             <div className="text-center p-4 text-red-500">{loadMoreError}</div>
          )}

          {/* Show message if no more fixtures to load */} 
          {!isLoading && !isLoadingMore && !hasMore && fixtures.length > 0 && !error && !loadMoreError && (
             <div className="text-center p-4 text-gray-500">No more matches for this date.</div>
          )}
        </div>
      </div>
    </>
  );
} 