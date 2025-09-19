'use client';

import { useState, useEffect } from 'react';
import { fetchHomeTeamMatches, fetchAwayTeamMatches } from '@/utils/api';
import '@/styles/lastSixMatches.css';

export default function LastSixMatches({ matchData }) {
  const [homeTeamMatches, setHomeTeamMatches] = useState([]);
  const [awayTeamMatches, setAwayTeamMatches] = useState([]);
  const [homeTeamLimit, setHomeTeamLimit] = useState(6);
  const [awayTeamLimit, setAwayTeamLimit] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeResponse, awayResponse] = await Promise.all([
          fetchHomeTeamMatches(matchData.home_team_id, matchData.unformated_date),
          fetchAwayTeamMatches(matchData.away_team_id, matchData.unformated_date)
        ]);

        if (homeResponse.status) setHomeTeamMatches(homeResponse.data);
        if (awayResponse.status) setAwayTeamMatches(awayResponse.data);
      } catch (error) {
        console.error('Error fetching team matches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (matchData) {
      fetchData();
    }
  }, [matchData]);

  const getMatchResult = (match, teamId) => {
    if (match.home_team_id === teamId) {
      if (match.ft_goals_home > match.ft_goals_away) return 'W';
      if (match.ft_goals_home < match.ft_goals_away) return 'L';
    } else {
      if (match.ft_goals_away > match.ft_goals_home) return 'W';
      if (match.ft_goals_away < match.ft_goals_home) return 'L';
    }
    return 'D';
  };

  const getResultClass = (result) => {
    switch (result) {
      case 'W': return 'win';
      case 'L': return 'loss';
      case 'D': return 'draw';
      default: return '';
    }
  };
  
  const getHalftimeScore = (match) => {
    try {
      const scores = JSON.parse(match.scores);
      return `HT: ${scores.halftime.home}-${scores.halftime.away}`;
    } catch (error) {
      return '';
    }
  };

  if (isLoading) return null;

  return (
    <div className="lsm-modern-container">
      <div className="lsm-modern-title">LAST 6 MATCHES</div>
      
      <div className="lsm-modern-teams-container">
        {/* Home Team Matches */}
        <div className="lsm-modern-team-section">
          <div className="lsm-modern-team-title">{matchData.home_team_name}</div>
          
          <div className="lsm-modern-matches-container">
            <div className="lsm-modern-matches-header">
              <div className="lsm-modern-match-cell lsm-modern-date-cell">Date</div>
              <div className="lsm-modern-match-cell lsm-modern-team-cell">Home</div>
              <div className="lsm-modern-match-cell lsm-modern-score-cell">Score</div>
              <div className="lsm-modern-match-cell lsm-modern-team-cell">Away</div>
              <div className="lsm-modern-match-cell lsm-modern-league-cell">League</div>
              <div className="lsm-modern-match-cell lsm-modern-result-cell">Result</div>
            </div>
            
            <div className="lsm-modern-matches-body">
              {homeTeamMatches.slice(0, homeTeamLimit).map((match, index) => (
                <div key={`home-${index}`} className="lsm-modern-match-row">
                  <div className="lsm-modern-match-cell lsm-modern-date-cell">
                    {match.date}
                  </div>
                  <div className="lsm-modern-match-cell lsm-modern-team-cell">
                    <a 
                      href={`/football-predictions/team/${match.home_team_name.toLowerCase().replace(/\s+/g, '-')}-${match.home_team_id}`}
                      className={`lsm-modern-team-link ${match.home_team_name === matchData.home_team_name ? 'highlighted' : ''}`}>
                      {match.home_team_name}
                    </a>
                  </div>
                  <div className="lsm-modern-match-cell lsm-modern-score-cell">
                    <a 
                      href={`/football-predictions/fixture/${match.home_team_name.toLowerCase().replace(/\s+/g, '-')}-vs-${match.away_team_name.toLowerCase().replace(/\s+/g, '-')}-${match.fixture_id}`}
                      className="lsm-modern-match-score">
                      <span className="lsm-modern-match-score-main">
                        {match.ft_goals_home} - {match.ft_goals_away}
                      </span>
                      <span className="lsm-modern-match-score-half">
                        {getHalftimeScore(match)}
                      </span>
                    </a>
                  </div>
                  <div className="lsm-modern-match-cell lsm-modern-team-cell">
                    <a 
                      href={`/football-predictions/team/${match.away_team_name.toLowerCase().replace(/\s+/g, '-')}-${match.away_team_id}`}
                      className={`lsm-modern-team-link ${match.away_team_name === matchData.home_team_name ? 'highlighted' : ''}`}>
                      {match.away_team_name}
                    </a>
                  </div>
                  <div className="lsm-modern-match-cell lsm-modern-league-cell" title={match.league_name}>
                    {match.league_short_name}
                  </div>
                  <div className="lsm-modern-match-cell lsm-modern-result-cell">
                    <span className={`lsm-modern-result-badge ${getResultClass(getMatchResult(match, matchData.home_team_id))}`}>
                      {getMatchResult(match, matchData.home_team_id)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {homeTeamMatches.length > 6 && (
            <div className="lsm-modern-load-more">
              <button 
                className="lsm-modern-load-more-button"
                onClick={() => setHomeTeamLimit(homeTeamLimit === 6 ? homeTeamMatches.length : 6)}>
                {homeTeamLimit === 6 ? 'View More' : 'View Less'}
              </button>
            </div>
          )}
        </div>

        {/* Away Team Matches */}
        <div className="lsm-modern-team-section">
          <div className="lsm-modern-team-title">{matchData.away_team_name}</div>
          
          <div className="lsm-modern-matches-container">
            <div className="lsm-modern-matches-header">
              <div className="lsm-modern-match-cell lsm-modern-date-cell">Date</div>
              <div className="lsm-modern-match-cell lsm-modern-team-cell">Home</div>
              <div className="lsm-modern-match-cell lsm-modern-score-cell">Score</div>
              <div className="lsm-modern-match-cell lsm-modern-team-cell">Away</div>
              <div className="lsm-modern-match-cell lsm-modern-league-cell">League</div>
              <div className="lsm-modern-match-cell lsm-modern-result-cell">Result</div>
            </div>
            
            <div className="lsm-modern-matches-body">
              {awayTeamMatches.slice(0, awayTeamLimit).map((match, index) => (
                <div key={`away-${index}`} className="lsm-modern-match-row">
                  <div className="lsm-modern-match-cell lsm-modern-date-cell">
                    {match.date}
                  </div>
                  <div className="lsm-modern-match-cell lsm-modern-team-cell">
                    <a 
                      href={`/football-predictions/team/${match.home_team_name.toLowerCase().replace(/\s+/g, '-')}-${match.home_team_id}`}
                      className={`lsm-modern-team-link ${match.home_team_name === matchData.away_team_name ? 'highlighted' : ''}`}>
                      {match.home_team_name}
                    </a>
                  </div>
                  <div className="lsm-modern-match-cell lsm-modern-score-cell">
                    <a 
                      href={`/football-predictions/fixture/${match.home_team_name.toLowerCase().replace(/\s+/g, '-')}-vs-${match.away_team_name.toLowerCase().replace(/\s+/g, '-')}-${match.fixture_id}`}
                      className="lsm-modern-match-score">
                      <span className="lsm-modern-match-score-main">
                        {match.ft_goals_home} - {match.ft_goals_away}
                      </span>
                      <span className="lsm-modern-match-score-half">
                        {getHalftimeScore(match)}
                      </span>
                    </a>
                  </div>
                  <div className="lsm-modern-match-cell lsm-modern-team-cell">
                    <a 
                      href={`/football-predictions/team/${match.away_team_name.toLowerCase().replace(/\s+/g, '-')}-${match.away_team_id}`}
                      className={`lsm-modern-team-link ${match.away_team_name === matchData.away_team_name ? 'highlighted' : ''}`}>
                      {match.away_team_name}
                    </a>
                  </div>
                  <div className="lsm-modern-match-cell lsm-modern-league-cell" title={match.league_name}>
                    {match.league_short_name}
                  </div>
                  <div className="lsm-modern-match-cell lsm-modern-result-cell">
                    <span className={`lsm-modern-result-badge ${getResultClass(getMatchResult(match, matchData.away_team_id))}`}>
                      {getMatchResult(match, matchData.away_team_id)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {awayTeamMatches.length > 6 && (
            <div className="lsm-modern-load-more">
              <button 
                className="lsm-modern-load-more-button"
                onClick={() => setAwayTeamLimit(awayTeamLimit === 6 ? awayTeamMatches.length : 6)}>
                {awayTeamLimit === 6 ? 'View More' : 'View Less'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
