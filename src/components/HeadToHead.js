'use client';

import { useState, useEffect } from 'react';
import { fetchH2HFixtures } from '@/utils/api';
import '@/styles/headToHead.css';

export default function HeadToHead({ matchData }) {
  const [h2hMatches, setH2HMatches] = useState([]);
  const [matchLimit, setMatchLimit] = useState(6);
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [leagues, setLeagues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchH2HFixtures(
          matchData.home_team_id,
          matchData.away_team_id,
          matchData.unformated_date
        );

        if (response?.status) {
          setH2HMatches(response.data);
          // Extract unique leagues
          const uniqueLeagues = [...new Set(response.data.map(match => match.league_id))];
          setLeagues(uniqueLeagues);
        }
      } catch (error) {
        console.error('Error fetching H2H matches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (matchData) {
      fetchData();
    }
  }, [matchData]);

  const filterMatchesByLeague = (leagueId) => {
    setSelectedLeague(leagueId);
  };

  const getFilteredMatches = () => {
    if (selectedLeague === 'all') return h2hMatches;
    return h2hMatches.filter(match => match.league_id === selectedLeague);
  };

  const calculateStats = (matches) => {
    const totalMatches = matches.length;
    let homeWins = 0;
    let draws = 0;
    let awayWins = 0;

    matches.forEach(match => {
      if (match.ft_goals_home > match.ft_goals_away) {
        if (match.home_team_id === matchData.home_team_id) {
          homeWins++;
        } else {
          awayWins++;
        }
      } else if (match.ft_goals_home < match.ft_goals_away) {
        if (match.away_team_id === matchData.home_team_id) {
          homeWins++;
        } else {
          awayWins++;
        }
      } else {
        draws++;
      }
    });

    return {
      homeWins,
      draws,
      awayWins,
      homeWinPerc: Math.round((homeWins / totalMatches) * 100),
      drawPerc: Math.round((draws / totalMatches) * 100),
      awayWinPerc: Math.round((awayWins / totalMatches) * 100)
    };
  };

  if (isLoading || !h2hMatches.length) return null;

  const filteredMatches = getFilteredMatches();
  const stats = calculateStats(filteredMatches);

  return (
    <div className="h2h-modern-container">
      <div className="h2h-modern-title">HEAD TO HEAD</div>
      
      <div className="h2h-modern-tabs">
        <button 
          className={`h2h-modern-tab ${selectedLeague === 'all' ? 'active' : ''}`}
          onClick={() => filterMatchesByLeague('all')}>
          All
        </button>
        {leagues.map(leagueId => (
          <button 
            key={leagueId}
            className={`h2h-modern-tab ${selectedLeague === leagueId ? 'active' : ''}`}
            onClick={() => filterMatchesByLeague(leagueId)}>
            {h2hMatches.find(m => m.league_id === leagueId)?.league_name}
          </button>
        ))}
      </div>

      {filteredMatches.length > 0 && (
        <div className="h2h-modern-stats-container">
          <div className="h2h-modern-stats-bar">
            <div 
              className="h2h-modern-stats-segment home-wins" 
              style={{ width: `${stats.homeWinPerc}%` }}
            />
            <div 
              className="h2h-modern-stats-segment draws" 
              style={{ width: `${stats.drawPerc}%` }}
            />
            <div 
              className="h2h-modern-stats-segment away-wins" 
              style={{ width: `${stats.awayWinPerc}%` }}
            />
          </div>
          <div className="h2h-modern-stats-labels">
            <div className="h2h-modern-stats-label" style={{ width: `${stats.homeWinPerc}%` }}>
              <span className="h2h-modern-stats-value">{stats.homeWins}</span>
              <span className="h2h-modern-stats-text">Wins</span>
            </div>
            <div className="h2h-modern-stats-label" style={{ width: `${stats.drawPerc}%` }}>
              <span className="h2h-modern-stats-value">{stats.draws}</span>
              <span className="h2h-modern-stats-text">Draws</span>
            </div>
            <div className="h2h-modern-stats-label" style={{ width: `${stats.awayWinPerc}%` }}>
              <span className="h2h-modern-stats-value">{stats.awayWins}</span>
              <span className="h2h-modern-stats-text">Losses</span>
            </div>
          </div>
        </div>
      )}

      <div className="h2h-modern-matches-container">
        <div className="h2h-modern-matches-header">
          <div className="h2h-modern-match-cell h2h-modern-date-cell">Date</div>
          <div className="h2h-modern-match-cell h2h-modern-team-cell">Home</div>
          <div className="h2h-modern-match-cell h2h-modern-score-cell">Score</div>
          <div className="h2h-modern-match-cell h2h-modern-team-cell">Away</div>
          <div className="h2h-modern-match-cell h2h-modern-league-cell">League</div>
        </div>
        
        <div className="h2h-modern-matches-body">
          {filteredMatches.slice(0, matchLimit).reduce((acc, match, index) => {
            if (index === 0 || match.match_date !== filteredMatches[index - 1].match_date) {
              acc.push(
                <div key={`date-${match.match_date}`} className="h2h-modern-date-header">
                  {match.match_date}
                </div>
              );
            }
            acc.push(
              <div key={index} className="h2h-modern-match-row">
                <div className="h2h-modern-match-cell h2h-modern-date-cell">{match.match_date}</div>
                <div className="h2h-modern-match-cell h2h-modern-team-cell">
                  <a 
                    href={`/football-predictions/team/${match.home_team_name.toLowerCase().replace(/\s+/g, '-')}-${match.home_team_id}`}
                    className={`h2h-modern-team-link ${match.home_team_name === matchData.home_team_name ? 'highlighted' : ''}`}>
                    {match.home_team_name}
                  </a>
                </div>
                <div className="h2h-modern-match-cell h2h-modern-score-cell">
                  <span className="h2h-modern-match-score">
                    {match.ft_goals_home}-{match.ft_goals_away}
                  </span>
                </div>
                <div className="h2h-modern-match-cell h2h-modern-team-cell">
                  <a 
                    href={`/football-predictions/team/${match.away_team_name.toLowerCase().replace(/\s+/g, '-')}-${match.away_team_id}`}
                    className={`h2h-modern-team-link ${match.away_team_name === matchData.away_team_name ? 'highlighted' : ''}`}>
                    {match.away_team_name}
                  </a>
                </div>
                <div className="h2h-modern-match-cell h2h-modern-league-cell" title={match.league_name}>
                  {match.league_short_name}
                </div>
              </div>
            );
            return acc;
          }, [])}
        </div>
      </div>

      {filteredMatches.length > 6 && (
        <div className="h2h-modern-load-more">
          <button 
            className="h2h-modern-load-more-button"
            onClick={() => setMatchLimit(matchLimit === 6 ? filteredMatches.length : 6)}>
            {matchLimit === 6 ? 'View More' : 'View Less'}
          </button>
        </div>
      )}
    </div>
  );
}
