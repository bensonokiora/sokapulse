'use client';

import { useState, useEffect } from 'react';
import { fetchTeamMatchesBothSides } from '@/utils/api';
import '@/styles/lastSixMatches.css'; // Using the same CSS file

export default function TeamMatchesBothSides({ teamData }) {
  const [matches, setMatches] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [activeLeagueId, setActiveLeagueId] = useState('all');
  const [displayCount, setDisplayCount] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTeamMatchesBothSides(
          teamData.team_id,
          teamData.matchDetails.unformated_date
        );

        if (response?.status && response?.data) {
          // Sort matches by date (most recent first)
          const sortedMatches = response.data.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setMatches(sortedMatches);
          
          // Extract unique leagues using a Map to ensure uniqueness by league_id
          const leaguesMap = new Map();
          sortedMatches.forEach(match => {
            if (!leaguesMap.has(match.league_id)) {
              leaguesMap.set(match.league_id, {
                id: match.league_id,
                name: match.league_name,
                shortName: match.league_short_name
              });
            }
          });
          setLeagues(Array.from(leaguesMap.values()));
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [teamData]);

  const filteredMatches = activeLeagueId === 'all' 
    ? matches
    : matches.filter(match => match.league_id === parseInt(activeLeagueId));

  const getResultIndicator = (match) => {
    const isHomeTeam = match.home_team_id === teamData.team_id;
    const homeGoals = parseInt(match.ft_goals_home);
    const awayGoals = parseInt(match.ft_goals_away);
    
    if (isHomeTeam) {
      if (homeGoals > awayGoals) return ['W', 'win'];
      if (homeGoals < awayGoals) return ['L', 'loss'];
      return ['D', 'draw'];
    } else {
      if (awayGoals > homeGoals) return ['W', 'win'];
      if (awayGoals < homeGoals) return ['L', 'loss'];
      return ['D', 'draw'];
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
      <div className="lsm-modern-title">ALL MATCHES - {teamData.team_name}</div>
      
      {/* League filter tabs */}
      <div className="lsm-modern-tabs">
        <div 
          className={`lsm-modern-tab ${activeLeagueId === 'all' ? 'active' : ''}`}
          onClick={() => setActiveLeagueId('all')}
        >
          All
        </div>
        
        {leagues.map(league => (
          <div 
            key={league.id}
            className={`lsm-modern-tab ${activeLeagueId === league.id ? 'active' : ''}`}
            onClick={() => setActiveLeagueId(league.id)}
          >
            {league.shortName || league.name}
          </div>
        ))}
      </div>
      
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
          {filteredMatches.slice(0, displayCount).map((match, idx) => {
            const [result, resultClass] = getResultIndicator(match);
            return (
              <div key={idx} className="lsm-modern-match-row">
                <div className="lsm-modern-match-cell lsm-modern-date-cell">
                  {match.date}
                </div>
                <div className="lsm-modern-match-cell lsm-modern-team-cell">
                  <a 
                    href={`/football-predictions/team/${match.home_team_name.toLowerCase().replace(/\s+/g, '-')}-${match.home_team_id}`}
                    className={`lsm-modern-team-link ${match.home_team_id === teamData.team_id ? 'highlighted' : ''}`}>
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
                    className={`lsm-modern-team-link ${match.away_team_id === teamData.team_id ? 'highlighted' : ''}`}>
                    {match.away_team_name}
                  </a>
                </div>
                <div className="lsm-modern-match-cell lsm-modern-league-cell" title={match.league_name}>
                  {match.league_short_name}
                </div>
                <div className="lsm-modern-match-cell lsm-modern-result-cell">
                  <span className={`lsm-modern-result-badge ${resultClass}`}>
                    {result}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filteredMatches.length > displayCount && (
        <div className="lsm-modern-load-more">
          <button 
            className="lsm-modern-load-more-button"
            onClick={() => setDisplayCount(prev => prev + 6)}>
            View More
          </button>
        </div>
      )}
    </div>
  );
}
