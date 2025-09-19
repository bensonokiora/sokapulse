
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function JackpotMatches({ predictions, isLoggedIn, handleUnlockClick, bookmakerId }) {
  // Helper function to get day of week from date
  const getMatchDay = (prediction) => {
    // Try to get date from various possible fields
    const dateStr = prediction.matchDateOriginal || prediction.date || prediction.matchDate;
    if (!dateStr) return 'TBD';
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'TBD';
      
      // Return short day name (Mon, Tue, Wed, etc.)
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } catch (error) {
      return 'TBD';
    }
  };

  // Helper function to format match result with win/loss indicator
  const formatMatchResult = (prediction) => {
    // For pending matches (clock.webp) with no scores, return dash
    if (prediction.isPlayed && prediction.isPlayed.includes('clock.webp') && (!prediction.scores || prediction.scores === null)) {
      return '-';
    }
    
    // If we have scores, show them even if match isn't marked as complete
    if (prediction.scores && prediction.scores !== null) {
      // For matches marked as complete (correct.webp or remove.webp), add win/loss indicator
      if (prediction.isPlayed && (prediction.isPlayed.includes('correct.webp') || prediction.isPlayed.includes('remove.webp'))) {
        // Parse the scores (e.g., "0 - 3")
        const scoreParts = prediction.scores.split(' - ');
        if (scoreParts.length !== 2) return prediction.scores;

        const homeScore = parseInt(scoreParts[0]);
        const awayScore = parseInt(scoreParts[1]);
        
        if (isNaN(homeScore) || isNaN(awayScore)) return prediction.scores;

        // Determine actual result
        let actualResult;
        if (homeScore > awayScore) {
          actualResult = '1'; // Home win
        } else if (awayScore > homeScore) {
          actualResult = '2'; // Away win
        } else {
          actualResult = 'X'; // Draw
        }

        // Compare with prediction tip
        const predictionTip = prediction.tip;
        let isCorrect = false;

        if (predictionTip === actualResult) {
          isCorrect = true;
        } else if (predictionTip === '1X' && (actualResult === '1' || actualResult === 'X')) {
          isCorrect = true;
        } else if (predictionTip === '2X' && (actualResult === '2' || actualResult === 'X')) {
          isCorrect = true;
        } else if (predictionTip === '12' && (actualResult === '1' || actualResult === '2')) {
          isCorrect = true;
        } else if (predictionTip === '1 OR X' && (actualResult === '1' || actualResult === 'X')) {
          isCorrect = true;
        } else if (predictionTip === 'X OR 2' && (actualResult === 'X' || actualResult === '2')) {
          isCorrect = true;
        } else if (predictionTip === '1 OR 2' && (actualResult === '1' || actualResult === '2')) {
          isCorrect = true;
        }

        // Return formatted result with win/loss indicator
        return `${prediction.scores} (${isCorrect ? 'W' : 'L'})`;
      }
      
      // Just return scores if available but not marked as complete
      return prediction.scores;
    }

    // Default case - no scores available
    return '-';
  };

  // Transform predictions to ensure they have the expected structure
  const transformedPredictions = predictions.map(prediction => {
    // If prediction already has the expected format (from specific jackpot components)
    if (prediction.matches && prediction.teamHomeBadge) {
      return prediction;
    }
    
    // Transform from jackpot-predictions API format to expected format
    return {
      ...prediction,
      matches: `${prediction.homeTeam || 'Home Team'} - ${prediction.awayTeam || 'Away Team'}`,
      teamHomeBadge: prediction.homeTeamLogo || '/images/teams/default-team.svg',
      teamAwayBadge: prediction.awayTeamLogo || '/images/teams/default-team.svg',
      no: prediction.id || '?',
      time: prediction.matchTime?.substring(0, 5) || '--:--',
      results: formatMatchResult(prediction),
      date: prediction.matchDateOriginal || prediction.date
    };
  });

  // Helper function to determine match status from results like "2-1 (L)" or "0-2 (W)"
  const getMatchStatusClass = (results, index) => {
    if (!results || results === '-') {
      return ''; // No styling for pending matches
    }
    
    // For non-logged-in users, only show colors for first 7 matches
    if (!isLoggedIn && index >= 7) {
      return '';
    }
    
    // Check for (W) indicating won match
    if (results.includes('(W)')) {
      return 'jp-match-won';
    }
    
    // Check for (L) indicating lost match  
    if (results.includes('(L)')) {
      return 'jp-match-lost';
    }
    
    return ''; // Default case for matches without (W) or (L)
  };

  return (
    <div className="jp-matches-content">
      <div className="jp-matches-header">
        <h2 className="jp-matches-title">
          This Week's Jackpot Predictions
          <span className="jp-matches-count">{transformedPredictions.length} Matches</span>
        </h2>
      </div>

      <div className="jp-matches-list">
        {/* Free matches (first 7) */}
        {transformedPredictions.slice(0, 7).map((prediction, index) => {
            const matchNameSlug = prediction.matches 
                ? prediction.matches.replace(' - ', '-vs-').replace(/\s+/g, '-').toLowerCase() 
                : 'unknown-match';
            
            const linkId = prediction.matchId || prediction.id || index; 
            const pathname = `/jackpot-match-details/${linkId}/${matchNameSlug}`;

            return (
                <Link 
                    key={prediction.no || linkId}
                    href={{
                        pathname: pathname,
                        query: {
                            homeTeamId: prediction.matchHomeTeamId,
                            awayTeamId: prediction.matchAwayTeamId,
                            date: prediction.date,
                            matchId: prediction.matchId,
                            bookmakerId: bookmakerId
                        }
                    }}
                    className="jp-match-link"
                >
                    <div className={`jp-match-card ${getMatchStatusClass(prediction.results, index)}`}>
                        <div className={`jp-match-header ${getMatchStatusClass(prediction.results, index)}`}>
                            <div className="jp-match-date-time">
                                <span className="jp-match-day">{getMatchDay(prediction)}</span>
                                <span className="jp-match-time">{prediction.time || '--:--'}</span>
                            </div>
                            <div className="jp-match-status">
                                {prediction.isPlayed && prediction.isPlayed.includes('clock.webp') ? (
                                    <img src={prediction.isPlayed} alt="Pending" className="jp-status-icon" />
                                ) : (
                                    <span>{prediction.results || '-'}</span>
                                )}
                            </div>
                        </div>

                        <div className="jp-match-teams">
                            <div className="jp-team">
                                <div className="jp-team-logo">
                                    <img 
                                    src={prediction.teamHomeBadge || '/images/teams/default-team.svg'} 
                                    alt="Home team"
                                    onError={(e) => { e.target.src = '/images/teams/default-team.svg'; }}
                                    />
                                </div>
                                <span className="jp-team-name">{prediction.matches?.split(' - ')[0] || 'Home Team'}</span>
                            </div>
                            <div className="jp-match-score"><span className="jp-vs-display">VS</span></div>
                            <div className="jp-team">
                                <div className="jp-team-logo">
                                    <img 
                                    src={prediction.teamAwayBadge || '/images/teams/default-team.svg'} 
                                    alt="Away team"
                                    onError={(e) => { e.target.src = '/images/teams/default-team.svg'; }}
                                    />
                                </div>
                                <span className="jp-team-name">{prediction.matches?.split(' - ')[1] || 'Away Team'}</span>
                            </div>
                        </div>

                        <div className="jp-match-prediction">
                            <div className="jp-prediction-content">
                                <div className="jp-prediction-label">
                                    <FontAwesomeIcon icon={faInfoCircle} className="jp-prediction-icon" />
                                    Prediction:
                                </div>
                                <div className="jp-prediction-value">{prediction.tip || 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                </Link>
            );
        })}

        {/* Premium matches (8th onwards) */}
        {transformedPredictions.length > 7 && !isLoggedIn && (
          <>
            {transformedPredictions.slice(7).map((prediction, index) => {
                return (
                    <div 
                        key={prediction.no || `premium-${index}`}
                        className={`jp-match-card jp-premium-match ${getMatchStatusClass(prediction.results, index + 7)}`}
                        onClick={handleUnlockClick}
                    >
                        <div className={`jp-match-header ${getMatchStatusClass(prediction.results, index + 7)}`}>
                            <div className="jp-match-date-time">
                                <span className="jp-match-day">{getMatchDay(prediction)}</span>
                                <span className="jp-match-time">{prediction.time || '--:--'}</span>
                            </div>
                            <div className="jp-match-status">
                                {/* Hide results for premium matches for non-logged users */}
                                <span>-</span>
                            </div>
                        </div>

                        <div className="jp-match-teams">
                            <div className="jp-team">
                                <div className="jp-team-logo">
                                    <img 
                                    src={prediction.teamHomeBadge || '/images/teams/default-team.svg'} 
                                    alt="Home team"
                                    onError={(e) => { e.target.src = '/images/teams/default-team.svg'; }}
                                    />
                                </div>
                                <span className="jp-team-name">{prediction.matches?.split(' - ')[0] || 'Home Team'}</span>
                            </div>
                            <div className="jp-match-score"><span className="jp-vs-display">VS</span></div>
                            <div className="jp-team">
                                <div className="jp-team-logo">
                                    <img 
                                    src={prediction.teamAwayBadge || '/images/teams/default-team.svg'} 
                                    alt="Away team"
                                    onError={(e) => { e.target.src = '/images/teams/default-team.svg'; }}
                                    />
                                </div>
                                <span className="jp-team-name">{prediction.matches?.split(' - ')[1] || 'Away Team'}</span>
                            </div>
                        </div>

                        <div className="jp-match-prediction jp-premium-prediction">
                            <div className="jp-premium-lock-overlay">
                                <FontAwesomeIcon icon={faLock} className="jp-premium-lock-icon" />
                                <span className="jp-premium-text">Premium Content</span>
                                <button className="jp-unlock-btn" onClick={handleUnlockClick}>
                                    Unlock Prediction
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
          </>
        )}

        {/* All matches for logged-in users */}
        {transformedPredictions.length > 7 && isLoggedIn && (
          <>
            {transformedPredictions.slice(7).map((prediction, index) => {
                const matchNameSlug = prediction.matches 
                    ? prediction.matches.replace(' - ', '-vs-').replace(/\s+/g, '-').toLowerCase() 
                    : 'unknown-match';
                
                const linkId = prediction.matchId || prediction.id || (index + 7);
                const pathname = `/jackpot-match-details/${linkId}/${matchNameSlug}`;

                return (
                    <Link 
                        key={prediction.no || linkId}
                        href={{
                            pathname: pathname,
                            query: {
                                homeTeamId: prediction.matchHomeTeamId,
                                awayTeamId: prediction.matchAwayTeamId,
                                date: prediction.date,
                                matchId: prediction.matchId,
                                bookmakerId: bookmakerId
                            }
                        }}
                        className="jp-match-link"
                    >
                        <div className={`jp-match-card ${getMatchStatusClass(prediction.results, index + 7)}`}>
                            <div className={`jp-match-header ${getMatchStatusClass(prediction.results, index + 7)}`}>
                                <div className="jp-match-date-time">
                                    <span className="jp-match-day">{getMatchDay(prediction)}</span>
                                    <span className="jp-match-time">{prediction.time || '--:--'}</span>
                                </div>
                                <div className="jp-match-status">
                                    <span>{prediction.results || '-'}</span>
                                </div>
                            </div>

                            <div className="jp-match-teams">
                                <div className="jp-team">
                                    <div className="jp-team-logo">
                                        <img 
                                        src={prediction.teamHomeBadge || '/images/teams/default-team.svg'} 
                                        alt="Home team"
                                        onError={(e) => { e.target.src = '/images/teams/default-team.svg'; }}
                                        />
                                    </div>
                                    <span className="jp-team-name">{prediction.matches?.split(' - ')[0] || 'Home Team'}</span>
                                </div>
                                <div className="jp-match-score"><span className="jp-vs-display">VS</span></div>
                                <div className="jp-team">
                                    <div className="jp-team-logo">
                                        <img 
                                        src={prediction.teamAwayBadge || '/images/teams/default-team.svg'} 
                                        alt="Away team"
                                        onError={(e) => { e.target.src = '/images/teams/default-team.svg'; }}
                                        />
                                    </div>
                                    <span className="jp-team-name">{prediction.matches?.split(' - ')[1] || 'Away Team'}</span>
                                </div>
                            </div>

                            <div className="jp-match-prediction">
                                <div className="jp-prediction-content">
                                    <div className="jp-prediction-label">
                                        <FontAwesomeIcon icon={faInfoCircle} className="jp-prediction-icon" />
                                        Prediction:
                                    </div>
                                    <div className="jp-prediction-value">{prediction.tip || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
          </>
        )}
      </div>

      {/* Premium access banner */}
      {transformedPredictions.length > 7 && !isLoggedIn && (
        <div className="jp-premium-banner">
          <div className="jp-premium-banner-content">
            <div className="jp-premium-banner-icon">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <div className="jp-premium-banner-text">
              <h3>Unlock All {transformedPredictions.length - 7} Premium Predictions</h3>
              <p>Get access to expert jackpot predictions and boost your winning chances</p>
            </div>
            <div className="jp-premium-banner-actions">
              <button className="jp-premium-login-btn" onClick={handleUnlockClick}>
                Login
              </button>
              <button className="jp-premium-register-btn" onClick={handleUnlockClick}>
                Get Premium Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
