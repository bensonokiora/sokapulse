'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchMatchDetailsData } from '@/utils/api';
import LastSixMatches from '@/components/LastSixMatches';
import LeagueStandings from '@/components/LeagueStandings';
import HeadToHead from '@/components/HeadToHead';
import MatchTrends from '@/components/MatchTrends';
import UpcomingMatches from '@/components/UpcomingMatches';
import NavigationRow from '@/components/NavigationRow';
import '../../../../../styles/custom.css';
import LoadingAnimation from '@/components/LoadingAnimation';
import Link from 'next/link';
import '../../../../../styles/match-details.css';
import { getUnderOverPrediction, calculateProbabilities, calculateConfidenceLevel } from '@/utils/predictionUtils';

export default function MatchDetails() {
  const router = useRouter();
  const params = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [topData, setTopData] = useState([]);
  const [h2hData, setH2hData] = useState([]);
  const [homeTeamData, setHomeTeamData] = useState([]);
  const [awayTeamData, setAwayTeamData] = useState([]);
  const [standingsData, setStandingsData] = useState([]);
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [favoriteStates, setFavoriteStates] = useState({});
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const refreshMatchData = useCallback(async () => {
    if (isRefreshing || !params?.['match-details']) return;
    
    setIsRefreshing(true);
    try {
      const matchDetailsParam = params['match-details'];
      const parts = matchDetailsParam.split('-');
      const fixtureId = parts[parts.length - 1];

      const response = await fetchMatchDetailsData(fixtureId);
      
      if (response?.status && response?.data?.length > 0) {
        const matchDetails = response.data[0];

        if (matchDetails.scores) {
          try {
            const scoresObj = JSON.parse(matchDetails.scores);
            matchDetails.parsedScores = scoresObj;
          } catch (e) {
            console.error('Error parsing scores:', e);
            matchDetails.parsedScores = {};
          }
        }

        setMatchData(matchDetails);
        setTopData(response.data);
        setError(null);
      } else {
        console.error('No data in response:', response);
        setError('No match data available');
      }
      
      setLastRefreshTime(new Date());
    } catch (err) {
      console.error('Error refreshing match data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [params, isRefreshing]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 760);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const fetchData = async () => {
      try {
        if (!params?.['match-details']) {
          setError('Invalid match details');
          return;
        }

        // Extract fixture ID from URL
        const matchDetailsParam = params['match-details'];
        console.log('Match Details Param:', matchDetailsParam); // Debug log

        // Get the last part after the last hyphen
        const parts = matchDetailsParam.split('-');
        const fixtureId = parts[parts.length - 1];
        console.log('Fixture ID:', fixtureId); // Debug log

        const response = await fetchMatchDetailsData(fixtureId);
        console.log('API Response:', response); // Debug log

        if (response?.status && response?.data?.length > 0) {
          const matchDetails = response.data[0];
          console.log('Match Details:', matchDetails); // Debug log

          // Parse scores if they exist
          if (matchDetails.scores) {
            try {
              const scoresObj = JSON.parse(matchDetails.scores);
              matchDetails.parsedScores = scoresObj;
            } catch (e) {
              console.error('Error parsing scores:', e);
              matchDetails.parsedScores = {};
            }
          }

          setMatchData(matchDetails);
          setTopData(response.data);
          setError(null);
        } else {
          console.error('No data in response:', response); // Debug log
          setError('No match data available');
        }
      } catch (err) {
        console.error('Error fetching match details:', err);
        setError('Error loading match details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => window.removeEventListener('resize', handleResize);
  }, [params]);

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

  // Set up auto-refresh interval
  useEffect(() => {
    // Refresh data every 60 seconds (1 minute)
    const refreshInterval = setInterval(() => {
      refreshMatchData();
    }, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [refreshMatchData]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <LoadingAnimation text="Loading matches..." />
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const baseUrl = matchData ? encodeURIComponent(
    `${matchData.home_team_name.replace(/\s+/g, '-').toLowerCase()}-vs-${matchData.away_team_name.replace(/\s+/g, '-').toLowerCase()}-${matchData.fixture_id}`
  ) : '';

  // Add a helper function to get formatted scores
  const getFormattedScores = () => {
    if (!matchData) return { display: '-', hasExtraTime: false };
    
    try {
      // Check if we have scores available
      if (!matchData.parsedScores) return { display: '-', hasExtraTime: false };
      
      const scores = matchData.parsedScores;
      const hasExtraTime = scores.extratime && scores.extratime.home !== null && scores.extratime.away !== null;
      
      // If match has extra time (AET)
      if (hasExtraTime && matchData.status_short === "AET") {
        // Final score should be from goals_home and goals_away which include extra time
        const finalHomeGoals = matchData.goals_home;
        const finalAwayGoals = matchData.goals_away;
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
          hasExtraTime: false
        };
      }
      
      return { display: '-', hasExtraTime: false };
    } catch (err) {
      console.error('Error formatting scores:', err);
      return { display: '-', hasExtraTime: false };
    }
  };

  // Format score display
  const getScoreDisplay = () => {
    if (!matchData?.parsedScores) return '-';
    const { fulltime } = matchData.parsedScores;
    if (fulltime?.home !== null && fulltime?.away !== null) {
      return `${fulltime.home} - ${fulltime.away}`;
    }
    return '-';
  };

  // Format halftime score display
  const getHalftimeDisplay = () => {
    if (!matchData?.parsedScores) return '';
    const { halftime } = matchData.parsedScores;
    if (halftime?.home !== null && halftime?.away !== null) {
      return `HT ${halftime.home}-${halftime.away}`;
    }
    return '';
  };

  // Remove percentage signs and convert to numbers
  const getFormattedProbabilities = () => {
    const home = matchData?.percent_pred_home?.replace('%', '') || '0';
    const draw = matchData?.percent_pred_draw?.replace('%', '') || '0';
    const away = matchData?.percent_pred_away?.replace('%', '') || '0';
    return { home, draw, away };
  };

  const probabilities = getFormattedProbabilities();

  // Add prediction calculation function
  const getPrediction = (home, draw, away) => {
    const homeProb = parseInt(home);
    const drawProb = parseInt(draw);
    const awayProb = parseInt(away);

    // If home has highest probability
    if (homeProb > drawProb && homeProb > awayProb) {
      return "1";
    }
    // If away has highest probability
    else if (awayProb > homeProb && awayProb > drawProb) {
      return "2";
    }
    // If draw has highest probability
    else if (drawProb > homeProb && drawProb > awayProb) {
      return "X";
    }
    // If there's a tie between probabilities, prioritize based on odds
    else {
      if (homeProb === awayProb && homeProb > drawProb) {
        return "1"; // Default to home when equal
      } else if (homeProb === drawProb && homeProb > awayProb) {
        return "1"; // Default to home when equal
      } else if (drawProb === awayProb && drawProb > homeProb) {
        return "X"; // Default to draw in this case
      }
      return "X"; // Default case
    }
  };

  // Update prediction validation function to match homepage
  const validatePrediction = (prediction, scores, status) => {
    if (status !== "Match Finished" && status !== "Match Finished After Extra Time") {
      return {
        backgroundColor: 'rgb(255, 180, 0)',
        color: 'white',
        border: 'none'
      };
    }

    // Use goals_home and goals_away from matchData if available
    const homeScore = matchData && matchData.goals_home !== undefined ? 
      parseInt(matchData.goals_home) || 0 : 
      parseInt(scores.fulltime.home) || 0;
      
    const awayScore = matchData && matchData.goals_away !== undefined ? 
      parseInt(matchData.goals_away) || 0 : 
      parseInt(scores.fulltime.away) || 0;

    // For under/over predictions, we need to check total goals
    const totalGoals = homeScore + awayScore;
    
    let predictionCorrect = false;
    
    if (prediction === "Over") {
      predictionCorrect = totalGoals > 2.5;
    } else if (prediction === "Under") {
      predictionCorrect = totalGoals < 2.5;
    }

    if (predictionCorrect) {
      return {
        backgroundColor: 'green',
        color: 'white',
        border: 'none'
      };
    }

    return {
      backgroundColor: 'white',
      color: 'red',
      border: '1px solid red'
    };
  };

  // Add helper function for last 5 matches display
  const getLastFiveMatches = (matches, teamId) => {
    if (!matches || matches.length === 0) return [];
    return matches.slice(0, 5).map((match, index) => {
      const result = match.home_team_id === teamId
        ? match.ft_goals_home > match.ft_goals_away ? 'W' 
          : match.ft_goals_home < match.ft_goals_away ? 'L' : 'D'
        : match.ft_goals_away > match.ft_goals_home ? 'W'
          : match.ft_goals_away < match.ft_goals_home ? 'L' : 'D';
      
      const color = result === 'W' ? 'green' 
                    : result === 'L' ? 'red' 
                    : '#ffb400';

      const tooltipTitle = `***Click to Open Fixture***\n${match.home_team_name}  (${match.ft_goals_home}-${match.ft_goals_away})  ${match.away_team_name}\n${match.date}`;

      const matchUrl = `/football-predictions/fixture/${match.home_team_name.toLowerCase().replace(/\s+/g, '-')}-vs-${match.away_team_name.toLowerCase().replace(/\s+/g, '-')}-${match.fixture_id}`;

      return {
        result,
        color,
        tooltipTitle,
        matchUrl
      };
    });
  };

  // Add getHighestProbability function
  const getHighestProbability = (home, draw, away) => {
    const max = Math.max(home, draw, away);
    return max === home ? 'Home' : max === draw ? 'Draw' : 'Away';
  };

  // Add under/over validation function
  const validateUnderOverPrediction = (prediction, scores, status) => {
    if (status !== "Match Finished" && status !== "Match Finished After Extra Time") {
      return {
        backgroundColor: 'rgb(255, 180, 0)',
        color: 'white',
        border: 'none'
      };
    }

    const homeScore = parseInt(scores.fulltime.home);
    const awayScore = parseInt(scores.fulltime.away);
    const totalGoals = homeScore + awayScore;
    const predictionCorrect = prediction === "Over" ? totalGoals > 2.5 : totalGoals < 2.5;

    if (predictionCorrect) {
      return {
        backgroundColor: 'green',
        color: 'white',
        border: 'none'
      };
    }

    return {
      backgroundColor: 'white',
      color: 'red',
      border: '2px solid red'
    };
  };

  const isFavorite = matchData ? favoriteStates[matchData.fixture_id] || false : false;

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!matchData) return; // Add safety check

    const newState = !isFavorite;
    const favoriteData = JSON.parse(localStorage.getItem('mymatchesdata')) || { dataArray: [] };

    setFavoriteStates(prev => ({
      ...prev,
      [matchData.fixture_id]: newState
    }));

    if (newState) {
      favoriteData.dataArray.push({ fixture_id: matchData.fixture_id });
    } else {
      favoriteData.dataArray = favoriteData.dataArray.filter(
        item => item.fixture_id !== matchData.fixture_id
      );
    }

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    favoriteData.expiry = expiry.getTime();

    localStorage.setItem('mymatchesdata', JSON.stringify(favoriteData));
    
    // Trigger storage event for NavigationRow to update
    window.dispatchEvent(new Event('storage'));
  };

  const formatMatchTime = (dateString) => {
    if (!dateString) return '--:--'; // Keep the updated fallback

    // Ensure the date string is treated as UTC by appending 'Z'
    const matchDate = new Date(dateString + 'Z');
    const now = new Date();
    
    // Format time using user's locale and timezone
    const timeString = matchDate.toLocaleTimeString(undefined, { // Use undefined for default locale
      hour: 'numeric',
      minute: '2-digit',
      hour12: true // Adjust if 24-hour format is preferred
    });
    
    // Check if the match is today or tomorrow in the user's local timezone
    const isToday = matchDate.toLocaleDateString() === now.toLocaleDateString();
    
    // Create a date object for tomorrow in the user's local timezone
    const tomorrowDateObj = new Date(now);
    tomorrowDateObj.setDate(now.getDate() + 1);
    const isTomorrow = matchDate.toLocaleDateString() === tomorrowDateObj.toLocaleDateString();
    
    // --- Restored Original Status Logic --- 
    if (isToday) {
      // Check if the match time has already passed (compare UTC time with current time)
      if (matchDate < now) {
        return `Played today at ${timeString}`;
      } else {
        return `Starts today at ${timeString}`;
      }
    } else if (isTomorrow) {
      return `Starts tomorrow at ${timeString}`;
    } else {
      // For other dates, format the date part using user's locale
      const datePart = matchDate.toLocaleDateString(undefined, { 
        month: 'short',
        day: 'numeric'
      });
      // Check if the match date is in the past (compare UTC time with current time)
      if (matchDate < now) {
        return `Played on ${datePart} at ${timeString}`;
      } else {
        return `Starts on ${datePart} at ${timeString}`;
      }
    }
  };

  // Add function to handle team click and store data in localStorage
  const handleTeamClick = (e, isHomeTeam) => {
    if (!matchData) return;
    
    // Prevent default link behavior
    e.preventDefault();
    
    // Determine team data based on whether it's home or away team
    const teamId = isHomeTeam ? matchData.home_team_id : matchData.away_team_id;
    const teamName = isHomeTeam ? matchData.home_team_name : matchData.away_team_name;
    const teamLogo = isHomeTeam ? matchData.home_team_logo : matchData.away_team_logo;
    
    // Create team data object
    const teamData = {
      team_id: teamId,
      team_name: teamName,
      team_logo: teamLogo,
      venue_name: matchData.venue_name,
      country_name: matchData.country_name,
      league_name: matchData.league_name,
      league_id: matchData.league_id,
      matchDetails: matchData // Include full match details
    };
    
    // Store in localStorage with key specific to team ID
    localStorage.setItem(`teamData-${teamId}`, JSON.stringify(teamData));
    
    // Navigate to team page
    router.push(`/football-predictions/team/${teamName.toLowerCase().replace(/\s+/g, '-')}-${teamId}`);
  };

  // Add a function to get under/over probabilities
  const getUnderOverProbabilities = () => {
    if (!matchData) return [50, 50];
    return calculateProbabilities(matchData);
  };

  // Get the under/over probabilities
  const [underProb, overProb] = getUnderOverProbabilities();
  
  // Calculate confidence level
  const { confidenceText, confidenceColor } = calculateConfidenceLevel(underProb, overProb);

  return (
    <div className="min-h-screen bg-gray-100">
    
          
            <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>
            <div className="col-lg-12">
            <NavigationRow 
                      selectedDate={selectedDate}
                      onDateChange={handleDateChange}
                    />
          {/* Match Header */}
          <div className={`responsive-row match-details-header-row ${isMobile ? 'match-details-header-row-mobile' : ''}`}>
            <div className="table-cell match-details-header-cell">
              <h1 className={`match-details-header-title ${isMobile ? 'match-details-header-title-mobile' : ''}`}>
                {matchData?.home_team_name} vs {matchData?.away_team_name} Predictions, Results, H2H and Tips
              </h1>
            </div>
          </div>

          {/* Match Details Card */}
          <div className={`match-details-card ${isMobile ? 'match-details-card-mobile' : ''}`}>
            {/* Teams Container */}
            <div className={`teams-container ${isMobile ? 'match-details-teams-container-mobile' : ''}`}>
              {/* Home Team Column - Desktop */}
              {!isMobile && (
                <div className="team-column">
                  <div className="team-logo-container">
                    <a href="#" onClick={(e) => handleTeamClick(e, true)}>
                      {matchData?.home_team_logo ? (
                        <img 
                          src={matchData.home_team_logo} 
                          alt={`${matchData?.home_team_name}-predictions-and-fixtures`}
                          className="team-logo"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.className = 'team-logo-fallback';
                            fallback.style.cssText = 'width: 60px; height: 60px; border-radius: 50%; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #333; border: 2px solid #ddd;';
                            fallback.textContent = matchData?.home_team_name?.charAt(0).toUpperCase() || 'H';
                            e.target.parentNode.appendChild(fallback);
                          }}
                        />
                      ) : (
                        <div className="team-logo-fallback" style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          backgroundColor: '#f0f0f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#333',
                          border: '2px solid #ddd'
                        }}>
                          {matchData?.home_team_name?.charAt(0).toUpperCase() || 'H'}
                        </div>
                      )}
                    </a>
                  </div>
                  <h3 className="team-name-header">
                    <a href="#" onClick={(e) => handleTeamClick(e, true)}>
                      {matchData?.home_team_name}
                    </a>
                  </h3>
                  <div className="form-indicators">
                    {getLastFiveMatches(homeTeamData, matchData?.home_team_id).map((match, idx) => (
                      <span key={idx}
                            className="number-circle rounded-square"
                            data-toggle="tooltip"
                            title={match.tooltipTitle}
                            style={{ backgroundColor: match.color, marginLeft: '2px', cursor: 'pointer' }}>
                        <a href={match.matchUrl}>{match.result}</a>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Match Info Column - Desktop */}
              {!isMobile && (
                <div className="match-info-column">
                  <div className="match-datetime">
                    <span className="match-date">{formatMatchTime(matchData?.date)}</span>
                  </div>
                  <div className="match-venue">{matchData?.venue}</div>
                  <div className="prediction-badge">
                    <span className="prediction-label">Prediction</span>
                    <span className="number-circle rounded-square" 
                          style={validateUnderOverPrediction(
                            getUnderOverPrediction(matchData)[0],
                            matchData?.parsedScores,
                            matchData?.status_long
                          )}>
                      {getUnderOverPrediction(matchData)[0]}
                    </span>
                  </div>
                </div>
              )}

              {/* Away Team Column - Desktop */}
              {!isMobile && (
                <div className="team-column">
                  <div className="team-logo-container">
                    <a href="#" onClick={(e) => handleTeamClick(e, false)}>
                      {matchData?.away_team_logo ? (
                        <img 
                          src={matchData.away_team_logo} 
                          alt={`${matchData?.away_team_name}-predictions-and-fixtures`}
                          className="team-logo"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.className = 'team-logo-fallback';
                            fallback.style.cssText = 'width: 60px; height: 60px; border-radius: 50%; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #333; border: 2px solid #ddd;';
                            fallback.textContent = matchData?.away_team_name?.charAt(0).toUpperCase() || 'A';
                            e.target.parentNode.appendChild(fallback);
                          }}
                        />
                      ) : (
                        <div className="team-logo-fallback" style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          backgroundColor: '#f0f0f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#333',
                          border: '2px solid #ddd'
                        }}>
                          {matchData?.away_team_name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                      )}
                    </a>
                  </div>
                  <h3 className="team-name-header">
                    <a href="#" onClick={(e) => handleTeamClick(e, false)}>
                      {matchData?.away_team_name}
                    </a>
                  </h3>
                  <div className="form-indicators">
                    {getLastFiveMatches(awayTeamData, matchData?.away_team_id).map((match, idx) => (
                      <span key={idx}
                            className="number-circle rounded-square"
                            data-toggle="tooltip"
                            title={match.tooltipTitle}
                            style={{ backgroundColor: match.color, marginLeft: '2px', cursor: 'pointer' }}>
                        <a href={match.matchUrl}>{match.result}</a>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Layout */}
              {isMobile && (
                <>
                  {/* Match Info Column - Mobile */}
                  <div className={`match-info-column match-details-info-column-mobile`}>
                    <div className={`match-datetime match-details-datetime-mobile`}>
                      <span className={`match-date match-details-date-mobile`}>{formatMatchTime(matchData?.date)}</span>
                    </div>
                    <div className={`match-venue match-details-venue-mobile`}>{matchData?.venue}</div>
                  </div>

                  {/* Teams Row - Mobile */}
                  <div className={`teams-row match-details-teams-row-mobile`}>
                    {/* Home Team Column */}
                    <div className={`team-column match-details-team-column-mobile`}>
                      <div className={`team-logo-container match-details-team-logo-mobile`}>
                        <a href="#" onClick={(e) => handleTeamClick(e, true)}>
                          {matchData?.home_team_logo ? (
                            <img 
                              src={matchData.home_team_logo} 
                              alt={`${matchData?.home_team_name}-predictions-and-fixtures`}
                              className="team-logo"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                const fallback = document.createElement('div');
                                fallback.className = 'team-logo-fallback';
                                fallback.style.cssText = 'width: 50px; height: 50px; border-radius: 50%; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; color: #333; border: 2px solid #ddd;';
                                fallback.textContent = matchData?.home_team_name?.charAt(0).toUpperCase() || 'H';
                                e.target.parentNode.appendChild(fallback);
                              }}
                            />
                          ) : (
                            <div className="team-logo-fallback" style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '50%',
                              backgroundColor: '#f0f0f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '20px',
                              fontWeight: 'bold',
                              color: '#333',
                              border: '2px solid #ddd'
                            }}>
                              {matchData?.home_team_name?.charAt(0).toUpperCase() || 'H'}
                            </div>
                          )}
                        </a>
                      </div>
                      <h3 className={`team-name-header match-details-team-name-mobile`}>
                        <a href="#" onClick={(e) => handleTeamClick(e, true)}>
                          {matchData?.home_team_name}
                        </a>
                      </h3>
                      <div className={`form-indicators match-details-form-indicators-mobile`}>
                        {getLastFiveMatches(homeTeamData, matchData?.home_team_id).map((match, idx) => (
                          <span key={idx}
                                className={`number-circle rounded-square match-details-form-indicator-mobile`}
                                data-toggle="tooltip"
                                title={match.tooltipTitle}
                                style={{ backgroundColor: match.color, marginLeft: '2px', cursor: 'pointer' }}>
                            <a href={match.matchUrl}>{match.result}</a>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* VS Badge for Mobile */}
                    <div className={`vs-badge-mobile match-details-vs-badge-mobile`}>VS</div>

                    {/* Away Team Column */}
                    <div className={`team-column match-details-team-column-mobile`}>
                      <div className={`team-logo-container match-details-team-logo-mobile`}>
                        <a href="#" onClick={(e) => handleTeamClick(e, false)}>
                          {matchData?.away_team_logo ? (
                            <img 
                              src={matchData.away_team_logo} 
                              alt={`${matchData?.away_team_name}-predictions-and-fixtures`}
                              className="team-logo"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                const fallback = document.createElement('div');
                                fallback.className = 'team-logo-fallback';
                                fallback.style.cssText = 'width: 50px; height: 50px; border-radius: 50%; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; color: #333; border: 2px solid #ddd;';
                                fallback.textContent = matchData?.away_team_name?.charAt(0).toUpperCase() || 'A';
                                e.target.parentNode.appendChild(fallback);
                              }}
                            />
                          ) : (
                            <div className="team-logo-fallback" style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '50%',
                              backgroundColor: '#f0f0f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '20px',
                              fontWeight: 'bold',
                              color: '#333',
                              border: '2px solid #ddd'
                            }}>
                              {matchData?.away_team_name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                          )}
                        </a>
                      </div>
                      <h3 className={`team-name-header match-details-team-name-mobile`}>
                        <a href="#" onClick={(e) => handleTeamClick(e, false)}>
                          {matchData?.away_team_name}
                        </a>
                      </h3>
                      <div className={`form-indicators match-details-form-indicators-mobile`}>
                        {getLastFiveMatches(awayTeamData, matchData?.away_team_id).map((match, idx) => (
                          <span key={idx}
                                className={`number-circle rounded-square match-details-form-indicator-mobile`}
                                data-toggle="tooltip"
                                title={match.tooltipTitle}
                                style={{ backgroundColor: match.color, marginLeft: '2px', cursor: 'pointer' }}>
                            <a href={match.matchUrl}>{match.result}</a>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Prediction Badge - Mobile */}
                  <div className={`prediction-badge match-details-prediction-mobile`}>
                    <span className={`prediction-label match-details-prediction-label-mobile`}>Prediction</span>
                    <span className={`number-circle rounded-square match-details-form-indicator-mobile`} 
                          style={validateUnderOverPrediction(
                            getUnderOverPrediction(matchData)[0],
                            matchData?.parsedScores,
                            matchData?.status_long
                          )}>
                      {getUnderOverPrediction(matchData)[0]}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* League/Country Info */}
            <div className={`league-info-bar ${isMobile ? 'match-details-league-bar-mobile' : ''}`}>
              <div className={`league-info-content ${isMobile ? 'match-details-league-content-mobile' : ''}`}>
                <a href={`/football-predictions/country/${matchData.country_name.toLowerCase()}`}>
                  {matchData.country_name}
                </a>
                <span className="league-separator">•</span>
                <a href={`/football-predictions/league/${matchData.country_name.toLowerCase()}/${matchData.league_name.replace(/\s+/g, '-').toLowerCase()}-${matchData.league_id}`}>
                  {matchData.league_name}
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="match-details-navigation">
            <div className="match-details-nav-item">
              <a href={`/football-predictions/fixture/${baseUrl}`}
                 className="match-details-nav-link">
                <span>1x2</span>
              </a>
            </div>
            <div className="match-details-nav-item">
              <a href={`/football-predictions/fixture/double-chance-prediction/${baseUrl}`}
                 className="match-details-nav-link">
                <span>Double Chance</span>
              </a>
            </div>
            <div className="match-details-nav-item">
              <a href={`/football-predictions/fixture/predictions-under-over-goals/${baseUrl}`}
                 className="match-details-nav-link active">
                <span>Over/Under 2.5</span>
              </a>
            </div>
            <div className="match-details-nav-item">
              <a href={`/football-predictions/fixture/predictions-both-team-to-score/${baseUrl}`}
                 className="match-details-nav-link">
                <span>BTTS</span>
              </a>
            </div>
           
          </div>

          {/* Match Details Header */}
          <div className="responsive-row header-size" 
               style={{ fontWeight: 'bold', textAlign: 'left', cursor: 'auto' }}>
            <div className="responsive-cell"></div>
            <div className="responsive-cell team-link-probability" 
                 style={{ textAlign: 'left', fontWeight: 'bold' }}>
              <span>Home Team</span><br />
              <span>Away Team</span><br />
            </div>
            <div className="responsive-cell team-link-probability" 
                 style={{ whiteSpace: 'pre-wrap' }}>
         <span>&nbsp;{isMobile ? 'Probs' : 'Probability %'} </span><br />
         <span>Under/Over 2.5</span>
            </div>
            <div className="responsive-cell">{isMobile ? 'Pred' : 'Prediction'}</div>
            <div className="responsive-cell hide-on-mobile">Avg<br />goals</div>
            <div className="responsive-cell">Odds</div>
            <div className="responsive-cell">
              <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">Scores</div>
              </div>
            </div>
          </div>

          {/* Match Details Content */}
          <div className="responsive-row" style={{ cursor: 'auto' }}>
            <div className="match-time-wrapper">
              <div className="match-time">
                {formatMatchTime(matchData?.date)}
              </div>
            </div>
            <div className="league-info-wrapper">
              {(() => {
                const flagSrc = matchData.country_flag === "https://seekflag.com/app/uploads/2022/01/England-01-1.svg" 
                  ? "https://pngimg.com/uploads/england/england_PNG7.png" 
                  : matchData.country_flag === "https://seekflag.com/app/uploads/2022/01/Scotland-01-1.svg"
                  ? "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Flag_of_Scotland.svg/1200px-Flag_of_Scotland.svg.png" 
                  : matchData.country_flag === "https://seekflag.com/app/uploads/2022/01/Wales-01-1.svg"
                    ? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Flag_of_Wales.svg/1200px-Flag_of_Wales.svg.png"
                    : matchData.country_flag === "https://seekflag.com/app/uploads/2021/11/Flag-of-Gabon-01-1.svg"
                      ? "https://upload.wikimedia.org/wikipedia/commons/0/04/Flag_of_Gabon.svg"
                      : matchData.country_flag === "https://seekflag.com/app/uploads/2022/01/Northern-Ireland-01-1.svg"
                        ? "https://cdn.britannica.com/92/3092-050-3A68D1DE/Flag-of-Northern-Ireland.jpg"
                        : matchData.country_flag && matchData.country_flag.startsWith("countries/")
                          ? `https://media.sokapedia.com/sokapedia/${matchData.country_flag}`
                          : matchData.logo && matchData.logo.startsWith("countries/")
                            ? `https://media.sokapedia.com/sokapedia/${matchData.logo}`
                        : matchData.country_flag || matchData.logo;
                
                return flagSrc ? (
                  <img 
                    src={flagSrc}
                    className="img-fluid league-logo" 
                    alt={`${matchData?.country_name}-football-predictions`} 
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'league-logo-fallback';
                      fallback.style.cssText = 'width: 24px; height: 24px; border-radius: 4px; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: #333; border: 1px solid #ddd; margin-right: 8px;';
                      fallback.textContent = matchData?.country_name?.charAt(0).toUpperCase() || 'C';
                      e.target.parentNode.insertBefore(fallback, e.target.nextSibling);
                    }}
                  />
                ) : (
                  <div className="league-logo-fallback" style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#333',
                    border: '1px solid #ddd',
                    marginRight: '8px'
                  }}>
                    {matchData?.country_name?.charAt(0).toUpperCase() || 'C'}
                  </div>
                );
              })()}
              <span className="league-name">{matchData?.league_name}</span>
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
              <Link href={`/football-predictions/fixture/${matchData?.home_team_name.toLowerCase().replace(/\s+/g, '-')}-vs-${matchData?.away_team_name.toLowerCase().replace(/\s+/g, '-')}-${matchData?.fixture_id}`}>
                <div className="teamNameLink">
                  <span className="team-name" style={{ fontWeight: 'bold' }}>{matchData?.home_team_name}</span><br />
                  <span className="team-name" style={{ fontWeight: 'bold' }}>{matchData?.away_team_name}</span>
                </div>
              </Link>
            </div>
            <div className="responsive-cell" style={{ minWidth: '70px', textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: getUnderOverPrediction(matchData)[0] === 'Under' ? 'bold' : 'normal' }}>{underProb}%</span>&nbsp;
                  <span style={{ fontWeight: getUnderOverPrediction(matchData)[0] === 'Over' ? 'bold' : 'normal' }}>{overProb}%</span>
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
            <div className="responsive-cell" title="Prediction" style={{ minWidth: '60px', textAlign: 'center' }}>
              <span className="m-1">
                <span className="number-circle rounded-square" style={{
                  ...validateUnderOverPrediction(
                    getUnderOverPrediction(matchData)[0],
                    matchData?.parsedScores,
                    matchData?.status_long
                  ),
                  minWidth: '55px',
                  display: 'inline-block',
                  textAlign: 'center',
                  padding: '3px 6px',
                  whiteSpace: 'nowrap',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px'
                }}>
                  {getUnderOverPrediction(matchData)[0]}
                </span>
              </span>
            </div>
            <div className="responsive-cell hide-on-mobile" title="Average Goals">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div>{getUnderOverPrediction(matchData)[2].toFixed(2)}</div>
                <div style={{ fontSize: '10px', color: '#666' }}>
                  {
                    getUnderOverPrediction(matchData)[2] > 3.0 ? 'High-scoring' : 
                    getUnderOverPrediction(matchData)[2] > 2.5 ? 'Above avg' : 
                    getUnderOverPrediction(matchData)[2] > 2.0 ? 'Average' : 'Low-scoring'
                  }
                </div>
              </div>
            </div>
            <div className="responsive-cell" title="Odds">
              <div className="odds-container">
                <div>{getUnderOverPrediction(matchData)[1]}</div>
              </div>
            </div>
            <div className="responsive-cell" title="Scores">
              <div className="score-container">
                <div className="match-status-wrapper">
                  {matchData?.status_short === "FT" || matchData?.status_short === "ABD" ? (
                    <span className="match-status">{matchData.status_short}</span>
                  ) : matchData?.status_short === "AET" ? (
                    <span className="match-status">AET</span>
                  ) : ["2H", "1H", "INT", "HT", "LIVE"].includes(matchData?.status_short) ? (
                    <div className="match-status-live">
                      {["1H", "2H"].includes(matchData.status_short) ? 
                        `${matchData.status_elapased}` :
                        matchData.status_short
                      }
                      {matchData.status_short !== "HT" && matchData.status_elapased && (
                        <span className="blink_text">&nbsp;'</span>
                      )}
                    </div>
                  ) : null}
                </div>
                <div className="scores-display">
                  {(() => {
                    const scoreInfo = getFormattedScores();
                    return (
                      <>
                        <span className={`${scoreInfo.display !== '-' ? 'scores-card' : 'no-score'} ${["2H", "1H", "INT", "HT", "LIVE"].includes(matchData?.status_short) ? 'live' : ''}`}>
                          {scoreInfo.display}
                        </span>
                        {scoreInfo.hasExtraTime && (
                          <span className="fullTimeDataDisplay" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                            (FT: {scoreInfo.fullTimeDisplay})
                          </span>
                        )}
                        {matchData?.parsedScores?.halftime?.home !== null && (
                          <span className="halfTimeDataDisplay">
                            {`(HT: ${matchData.parsedScores.halftime.home}-${matchData.parsedScores.halftime.away})`}
                          </span>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Add HeadToHead component */}
          {matchData && <HeadToHead matchData={matchData} />}
          
         
          {/* Add LastSixMatches component */}
          {matchData && <LastSixMatches matchData={matchData} />}
          
          
          {/* Add LeagueStandings component */}
          {matchData && <LeagueStandings matchData={matchData} />}

           {/* Add MatchTrends component */}
           {matchData && <MatchTrends matchData={matchData} />}
          
          {/* Add UpcomingMatches component */}
          {matchData && <UpcomingMatches matchData={matchData} />}
          
        </div>
      </div>
    </div>
  );
}
