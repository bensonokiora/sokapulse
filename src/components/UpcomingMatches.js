'use client';

import { useState, useEffect } from 'react';
import { fetchUpcomingHomeMatches, fetchUpcomingAwayMatches } from '@/utils/api';
import Image from 'next/image';

export default function UpcomingMatches({ matchData }) {
  const [homeMatches, setHomeMatches] = useState([]);
  const [awayMatches, setAwayMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeResponse, awayResponse] = await Promise.all([
          fetchUpcomingHomeMatches(matchData.home_team_id, matchData.unformated_date),
          fetchUpcomingAwayMatches(matchData.away_team_id, matchData.unformated_date)
        ]);


        if (homeResponse.status) setHomeMatches(homeResponse.data);
        if (awayResponse.status) setAwayMatches(awayResponse.data);
      } catch (error) {
        console.error('Error fetching upcoming matches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (matchData) {
      fetchData();
    }
  }, [matchData]);

  if (isLoading || (!homeMatches.length && !awayMatches.length)) return null;

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  // Function to render a match card
  const renderMatchCard = (match, isHomeTeam) => {
    const teamToHighlight = isHomeTeam ? matchData.home_team_name : matchData.away_team_name;
    
    return (
      <div className="upcoming-match-card">
        <div className="match-date">
          <span className="date-text">{formatDate(match.date)}</span>
        </div>
        
        <div className="match-teams">
          <div className={`team home-side ${match.home_team_name === teamToHighlight ? 'highlighted-team' : ''}`}>
            <a href={`/football-predictions/team/${match.home_team_name.toLowerCase().replace(/\s+/g, '-')}-${match.home_team_id}`}
               className="team-name-link">
              {match.home_team_name}
            </a>
          </div>
          
          <div className="versus">vs</div>
          
          <div className={`team away-side ${match.away_team_name === teamToHighlight ? 'highlighted-team' : ''}`}>
            <a href={`/football-predictions/team/${match.away_team_name.toLowerCase().replace(/\s+/g, '-')}-${match.away_team_id}`}
               className="team-name-link">
              {match.away_team_name}
            </a>
          </div>
        </div>
        
        <div className="match-league">
          <a href={`/football-predictions/league/${match.country_name.toLowerCase()}/${match.league_name.replace(/\s+/g, '-').toLowerCase()}-${match.league_id}`}
             className="league-link">
            {match.league_name}
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="upcoming-matches-container">
      <h2 className="upcoming-matches-title">Upcoming Matches</h2>
      
      <div className="upcoming-matches-content">
        {/* Home Team Matches */}
        {homeMatches.length > 0 && (
          <div className="team-matches">
            <div className="team-header">
              <h3>{matchData.home_team_name}</h3>
            </div>
            
            <div className="matches-list">
              {homeMatches.map((match, idx) => (
                <div key={`home-${idx}`}>
                  {renderMatchCard(match, true)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Away Team Matches */}
        {awayMatches.length > 0 && (
          <div className="team-matches">
            <div className="team-header">
              <h3>{matchData.away_team_name}</h3>
            </div>
            
            <div className="matches-list">
              {awayMatches.map((match, idx) => (
                <div key={`away-${idx}`}>
                  {renderMatchCard(match, false)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
