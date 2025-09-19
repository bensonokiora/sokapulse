'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import LoadingAnimation from '@/components/LoadingAnimation';
import '../styles/jackpot-match-details.css';
import {
    fetchJackpotMatches,
    fetchHeadToHeadData,
    fetchLastHomeTeamMatches,
    fetchLastAwayTeamMatches,
    fetchMatchOdds
} from '@/utils/api';

// Simple form indicator component (can stay here or move to own file)
const FormIndicator = ({ result }) => {
  const safeResult = result || 'd'; // Default to 'd' if result is null/undefined
  return (
    <div className={`jmd-form-indicator ${safeResult}`}>
      {safeResult.toUpperCase()}
    </div>
  );
};

export default function JackpotMatchDetailsDisplay() {
    // Get params from URL
    const params = useParams();
    const searchParams = useSearchParams();
    const matchId = params?.id;
    const homeTeamId = searchParams.get('homeTeamId');
    const awayTeamId = searchParams.get('awayTeamId');
    const matchDate = searchParams.get('date');
    const bookmakerId = searchParams.get('bookmakerId');
    const apiMatchId = searchParams.get('matchId'); // Specific ID for odds

    // State for data, loading, and error
    const [matchDetails, setMatchDetails] = useState(null);
    const [h2hData, setH2hData] = useState([]);
    const [homeTeamMatches, setHomeTeamMatches] = useState([]);
    const [awayTeamMatches, setAwayTeamMatches] = useState([]);
    const [odds, setOdds] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Start loading

    // State for countdown timer 
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const countdownInterval = useRef(null);

    // --- Fetch data on mount/param change ---
    useEffect(() => {
        const fetchData = async () => {
            if (!matchId || !homeTeamId || !awayTeamId || !matchDate || !bookmakerId || !apiMatchId) {
                console.error("[Client Component] Missing required parameters.");
                setError('Missing required match information to load details.');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            console.log(`[Client Component] Fetching data for matchId: ${matchId}, apiMatchId: ${apiMatchId}`);

            try {
                // Fetch all data in parallel
                const [matchesRes, h2hRes, homeRes, awayRes, oddsRes] = await Promise.all([
                    fetchJackpotMatches(matchDate, bookmakerId).catch(e => { console.error("Error fetching jackpot matches:", e); return null; }),
                    fetchHeadToHeadData(homeTeamId, awayTeamId, matchDate).catch(e => { console.error("Error fetching H2H data:", e); return null; }),
                    fetchLastHomeTeamMatches(homeTeamId, matchDate).catch(e => { console.error("Error fetching home team matches:", e); return null; }),
                    fetchLastAwayTeamMatches(awayTeamId, matchDate).catch(e => { console.error("Error fetching away team matches:", e); return null; }),
                    fetchMatchOdds(apiMatchId).catch(e => { console.error("Error fetching odds:", e); return null; })
                ]);

                // Process matches data first to find the specific match
                if (!matchesRes || !Array.isArray(matchesRes)) {
                    throw new Error('Could not load essential match data.');
                }
                // Use apiMatchId from query params to find the match based on the 'matchId' field in the response
                const foundMatch = matchesRes.find(m => m.matchId === apiMatchId);
                if (!foundMatch) {
                    // Add more context to the error message
                    console.error(`[Client Component] Match with apiMatchId ${apiMatchId} not found in response for date ${matchDate} and bookmaker ${bookmakerId}. Response:`, matchesRes);
                    throw new Error(`Match details not found for the provided ID (${apiMatchId}) in this jackpot list.`);
                }
                setMatchDetails(foundMatch);
                console.log("[Client Component] Found match detail.");

                // Process other data safely
                if (Array.isArray(h2hRes)) {
                    setH2hData(h2hRes.slice(0, 5)); // Take the first 5 matches
                } else {
                    setH2hData([]); // Default to empty array if not an array
                }

                if (homeRes && homeRes.status === true && Array.isArray(homeRes.data)) {
                    setHomeTeamMatches(homeRes.data.slice(0, 5));
                } else if (Array.isArray(homeRes)) {
                    setHomeTeamMatches(homeRes.slice(0, 5));
                }
                
                if (awayRes && awayRes.status === true && Array.isArray(awayRes.data)) {
                    setAwayTeamMatches(awayRes.data.slice(0, 5));
                } else if (Array.isArray(awayRes)) {
                    setAwayTeamMatches(awayRes.slice(0, 5));
                }

                if (oddsRes && Array.isArray(oddsRes) && oddsRes.length > 0) {
                   setOdds(oddsRes[0].bookmakerOdds || []);
                }

            } catch (err) {
                console.error('[Client Component] Error fetching match details data:', err);
                setError(err.message || 'Error loading match details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        // Cleanup function (optional, if needed for aborting fetches)
        return () => {
            // Optional: Abort ongoing fetches if component unmounts
        };

    }, [matchId, homeTeamId, awayTeamId, matchDate, bookmakerId, apiMatchId]); // Re-fetch if params change

    // --- Helper functions for calculations and formatting --- 
    // (These could also be moved to utils if used elsewhere)

    const calculateCountdown = (targetDate) => {
        if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        const now = new Date().getTime();
        const distance = new Date(targetDate).getTime() - now;
        if (distance < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        const days = Math.floor(distance / 86400000);
        const hours = Math.floor((distance % 86400000) / 3600000);
        const minutes = Math.floor((distance % 3600000) / 60000);
        const seconds = Math.floor((distance % 60000) / 1000);
        return { days, hours, minutes, seconds };
    };

    const startCountdown = useCallback((targetDate) => {
        if (countdownInterval.current) clearInterval(countdownInterval.current);
        if (!targetDate) return;
        
        const matchTime = new Date(targetDate);
        if (isNaN(matchTime.getTime())) {
            console.warn("Invalid date provided to startCountdown");
            return;
        }

        const initialCountdown = calculateCountdown(matchTime);
        setCountdown(initialCountdown); 

        if (initialCountdown.days > 0 || initialCountdown.hours > 0 || initialCountdown.minutes > 0 || initialCountdown.seconds > 0) {
            countdownInterval.current = setInterval(() => {
                const newCountdown = calculateCountdown(matchTime);
                setCountdown(newCountdown);
                if (newCountdown.days === 0 && newCountdown.hours === 0 && newCountdown.minutes === 0 && newCountdown.seconds === 0) {
                    clearInterval(countdownInterval.current);
                }
            }, 1000);
        }
    }, []);

    const formatMatchDate = (dateString) => {
        if (!dateString) return { display: 'N/A', aria: 'Date not available' };
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return { display: dateString, aria: dateString };
          const display = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
          return { display, aria: `Match scheduled for ${display}` };
        } catch (error) { return { display: dateString, aria: dateString }; }
    };

    const formatMatchTime = (timeString) => {
        if (!timeString) return { display: '--:--', aria: 'Time not available' };
        try {
            const [hours, minutes] = timeString.split(':');
            const date = new Date(); date.setUTCHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
            const display = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC', hour12: false });
            return { display, aria: `Kick-off time: ${display} UTC` };
        } catch (error) { return { display: timeString, aria: timeString }; }
    };

    const calculateH2HStats = useCallback(() => {
        if (!h2hData || h2hData.length === 0 || !homeTeamId || !awayTeamId) {
          return { homeWins: 0, draws: 0, awayWins: 0 };
        }
    
        let homeWins = 0;
        let draws = 0;
        let awayWins = 0;
    
        // Convert IDs from params to numbers for comparison if they are strings
        const homeIdNum = Number(homeTeamId);
        const awayIdNum = Number(awayTeamId);
    
        h2hData.forEach(match => {
          // Ensure scores are numbers
          const homeScore = parseInt(match.ft_goals_home, 10);
          const awayScore = parseInt(match.ft_goals_away, 10);
          const matchHomeId = parseInt(match.home_team_id, 10);
         // const matchAwayId = parseInt(match.away_team_id, 10); // Not needed for current logic but good practice
    
          if (!isNaN(homeScore) && !isNaN(awayScore)) {
            if (homeScore > awayScore) { // Home team in the match won
              if (matchHomeId === homeIdNum) {
                homeWins++;
              } else { // The current fixture's away team won
                awayWins++;
              }
            } else if (homeScore < awayScore) { // Away team in the match won
              if (matchHomeId === homeIdNum) { // The current fixture's home team lost
                awayWins++;
              } else { // The current fixture's away team won
                homeWins++;
              }
            } else {
              draws++; // Draw
            }
          }
        });
    
        return { homeWins, draws, awayWins };
      }, [h2hData, homeTeamId, awayTeamId]); // Recalculate when data or IDs change

    const getTeamForm = (matches, teamId) => {
        if (!matches || matches.length === 0) return [];
        return matches.slice(0, 5).map(match => {
          const matchHomeTeamId = match.homeTeamId; // Use direct field
          const isHome = matchHomeTeamId == teamId; // Use == for potential type difference
          const homeScore = parseInt(match.goalsHome ?? 0, 10); // Use goalsHome
          const awayScore = parseInt(match.goalsAway ?? 0, 10); // Use goalsAway
          const homeTeam = match.homeTeamName || 'Home Team'; // Use homeTeamName
          const awayTeam = match.awayTeamName || 'Away Team'; // Use awayTeamName
          let result = 'd';
          if (!isNaN(homeScore) && !isNaN(awayScore)) { // Ensure scores are valid numbers
              if (isHome) {
                if (homeScore > awayScore) result = 'w'; else if (homeScore < awayScore) result = 'l';
              } else {
                if (homeScore < awayScore) result = 'w'; else if (homeScore > awayScore) result = 'l';
              }
          }
          return {
            result,
            opponent: isHome ? awayTeam : homeTeam,
            score: !isNaN(homeScore) && !isNaN(awayScore) ? `${homeScore} - ${awayScore}` : '-',
            matchDate: match.date, // Use date
            matchLeague: match.leagueName, // Use leagueName
            matchLeagueLogo: match.downloadedCountryFlag // Use leagueLogo
          };
        });
    };

    // --- Countdown Effect ---
    useEffect(() => {
        if (!isLoading && matchDetails?.matchDateOriginal && matchDetails?.matchTime) {
            const targetDate = new Date(`${matchDetails.matchDateOriginal}T${matchDetails.matchTime}Z`);
            startCountdown(targetDate);
        }
        return () => {
            if (countdownInterval.current) clearInterval(countdownInterval.current);
        };
    }, [isLoading, matchDetails, startCountdown]); 

    // --- Calculations based on state --- (Run on every render)
    const h2hStats = calculateH2HStats();
    // Pass the IDs obtained from hooks
    const homeTeamForm = getTeamForm(homeTeamMatches, homeTeamId);
    const awayTeamForm = getTeamForm(awayTeamMatches, awayTeamId);
    const formatTimeUnit = (unit) => unit < 10 ? `0${unit}` : unit;

    // --- Render Logic --- 

    if (isLoading) {
        return (
            <div className="jmd-loading-container" role="status" aria-live="polite">
                <LoadingAnimation text="Loading Match Details..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="jmd-error-message" role="alert">
                <p>{error}</p>
                <Link href="/jackpot-predictions" className="jmd-back-button" style={{ marginTop: '16px' }}>
                    Return to Jackpot Predictions
                </Link>
            </div>
        );
    }

    if (!matchDetails) {
        // Should ideally be covered by error state, but as a fallback
        return (
            <div className="jmd-error-message" role="alert">
                <p>Match details could not be loaded.</p>
                <Link href="/jackpot-predictions" className="jmd-back-button" style={{ marginTop: '16px' }}>
                    Return to Jackpot Predictions
                </Link>
            </div>
        );
    }

    // Main content rendering using state variables (matchDetails, h2hStats, homeTeamForm, etc.)
    return (
        <div className="jmd-container"> 
            <div className="jmd-header">
                <Link href="/jackpot-predictions" className="jmd-back-button" aria-label="Return to jackpot predictions">
                    {/* Replace FaArrowLeft with actual SVG or character if needed */}
                    ← Back to Jackpot
                </Link>
            </div>
            <div className="jmd-content">
                <div className="jmd-overview-card">
                    {/* Date/Time Display */}
                    <div className="jmd-date-time-container">
                        <div className="jmd-date-display" aria-label={formatMatchDate(matchDetails.matchDateOriginal).aria}>
                            <FaCalendarAlt aria-hidden="true" style={{ marginRight: '6px' }} />
                            {formatMatchDate(matchDetails.matchDateOriginal).display}
                        </div>
                        <div className="jmd-time-display" aria-label={formatMatchTime(matchDetails.matchTime).aria}>
                            <FaClock aria-hidden="true" style={{ marginRight: '6px' }} />
                            {formatMatchTime(matchDetails.matchTime).display}
                        </div>
                    </div>
                    {/* Teams Grid */}
                    <div className="jmd-teams-grid">
                        {/* Home Team */}
                        <div className="jmd-team-container">
                            <div className="jmd-team-logo-container"><img src={matchDetails.homeTeamLogo || '/placeholder-team.png'} alt={matchDetails.homeTeam || 'Home Team'} className="jmd-team-logo-image"/></div>
                            <div className="jmd-team-name-display">{matchDetails.homeTeam || 'Home Team'}</div>
                            <div className="jmd-form-indicators-container">
                                {homeTeamForm.length > 0 ? homeTeamForm.map((match, index) => <FormIndicator key={index} result={match.result} />) : Array(5).fill(0).map((_, index) => <FormIndicator key={index} result="d" />)}
                            </div>
                        </div>
                        {/* Score/Prediction */}
                        <div className="jmd-score-container">
                            {matchDetails.scores ? (<div className="jmd-match-score-display">{matchDetails.scores}</div>) : (<div className="jmd-match-vs-display">VS</div>)}
                            <div className="jmd-prediction-container">
                                <div className="jmd-prediction-label">Prediction</div>
                                <div className="jmd-prediction-value">{matchDetails.tip || 'N/A'}</div>
                            </div>
                        </div>
                        {/* Away Team */}
                        <div className="jmd-team-container">
                            <div className="jmd-team-logo-container"><img src={matchDetails.awayTeamLogo || '/placeholder-team.png'} alt={matchDetails.awayTeam || 'Away Team'} className="jmd-team-logo-image"/></div>
                            <div className="jmd-team-name-display">{matchDetails.awayTeam || 'Away Team'}</div>
                            <div className="jmd-form-indicators-container">
                                {awayTeamForm.length > 0 ? awayTeamForm.map((match, index) => <FormIndicator key={index} result={match.result} />) : Array(5).fill(0).map((_, index) => <FormIndicator key={index} result="d" />)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* H2H Section */}
                <div className="jmd-details-section">
                    <h2 className="jmd-section-title">Head to Head</h2>
                    <div className="jmd-h2h-stats">
                        <div className="jmd-h2h-stat"><div className="jmd-stat-value">{h2hStats.homeWins}</div><div className="jmd-stat-label">{matchDetails.homeTeam || 'Home'} Wins</div></div>
                        <div className="jmd-h2h-stat"><div className="jmd-stat-value">{h2hStats.draws}</div><div className="jmd-stat-label">Draws</div></div>
                        <div className="jmd-h2h-stat"><div className="jmd-stat-value">{h2hStats.awayWins}</div><div className="jmd-stat-label">{matchDetails.awayTeam || 'Away'} Wins</div></div>
                    </div>
                    <div className="jmd-h2h-matches">
                        {h2hData.length > 0 ? (
                            h2hData.map((match, index) => (
                                <div key={index} className="jmd-h2h-match">
                                    <div className="jmd-h2h-match-league">
                                        {match.downloaded_league_logo && (<img src={match.downloaded_league_logo} alt={match.league_name || 'League'} className="jmd-league-logo" />)}
                                        {match.league_name || 'Unknown League'}
                                    </div>
                                    <div className="jmd-h2h-match-teams"><div className="jmd-h2h-team-name">{match.home_team_name}</div><div className="jmd-h2h-team-name">{match.away_team_name}</div></div>
                                    <div className="jmd-h2h-match-score">{match.ft_goals_home ?? '-'} - {match.ft_goals_away ?? '-'}</div>
                                    <div className="jmd-h2h-match-date">{formatMatchDate(match.date || '').display}</div>
                                </div>
                            ))
                        ) : (<div className="jmd-no-data">No head-to-head matches found</div>)}
                    </div>
                </div>

                {/* Team Form Section */}
                <div className="jmd-details-section">
                    <h2 className="jmd-section-title">Team Form</h2>
                    <div className="jmd-team-form-container">
                        <div className="jmd-team-form">
                            <div className="jmd-team-form-title">{matchDetails.homeTeam || 'Home Team'}</div>
                            <div className="jmd-form-matches">
                                {homeTeamForm.length > 0 ? (
                                    homeTeamForm.map((match, index) => (
                                        <div key={index} className="jmd-form-match">
                                            <div className="jmd-form-match-result"><FormIndicator result={match.result} /></div>
                                            <div className="jmd-form-match-details">
                                                <div className="jmd-form-match-opponent">vs {match.opponent || 'Unknown'}</div>
                                                <div className="jmd-form-match-score">{match.score}</div>
                                                <div className="jmd-form-match-info">
                                                    <div className="jmd-form-match-date"><FaCalendarAlt size={12} /> {formatMatchDate(match.matchDate).display}</div>
                                                    <div className="jmd-form-match-league">{match.matchLeagueLogo && <img src={match.matchLeagueLogo} alt={match.matchLeague} className="jmd-league-logo-small" />} {match.matchLeague || 'League'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (<div className="jmd-no-data">No recent matches found</div>)}
                            </div>
                        </div>
                        <div className="jmd-team-form">
                            <div className="jmd-team-form-title">{matchDetails.awayTeam || 'Away Team'}</div>
                            <div className="jmd-form-matches">
                                {awayTeamForm.length > 0 ? (
                                    awayTeamForm.map((match, index) => (
                                        <div key={index} className="jmd-form-match">
                                            <div className="jmd-form-match-result"><FormIndicator result={match.result} /></div>
                                            <div className="jmd-form-match-details">
                                                <div className="jmd-form-match-opponent">vs {match.opponent || 'Unknown'}</div>
                                                <div className="jmd-form-match-score">{match.score}</div>
                                                <div className="jmd-form-match-info">
                                                    <div className="jmd-form-match-date"><FaCalendarAlt size={12} /> {formatMatchDate(match.matchDate).display}</div>
                                                    <div className="jmd-form-match-league">{match.matchLeagueLogo && <img src={match.matchLeagueLogo} alt={match.matchLeague} className="jmd-league-logo-small" />} {match.matchLeague || 'League'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (<div className="jmd-no-data">No recent matches found</div>)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Match Odds Section */}
                <div className="jmd-details-section">
                    <h2 className="jmd-section-title">Match Odds</h2>
                    <div className="jmd-odds-container">
                        {odds.length > 0 ? (
                            <div className="jmd-odds-grid">
                                <div className="jmd-odds-header"><div className="jmd-odds-cell">Bookmaker</div><div className="jmd-odds-cell">1</div><div className="jmd-odds-cell">X</div><div className="jmd-odds-cell">2</div></div>
                                {odds.map((bookmaker) => (
                                    <div key={bookmaker.id} className="jmd-odds-row">
                                        <div className="jmd-odds-cell bookmaker-name">{bookmaker.bookmakerName}</div>
                                        <div className="jmd-odds-cell">{bookmaker.homeWin}</div>
                                        <div className="jmd-odds-cell">{bookmaker.draw}</div>
                                        <div className="jmd-odds-cell">{bookmaker.awayWin}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (<div className="jmd-no-data">No odds available for this match</div>)}
                    </div>
                </div>
            </div>
        </div>
    );
} 