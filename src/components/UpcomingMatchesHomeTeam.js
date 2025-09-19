'use client';

import { useState, useEffect } from 'react';
import { fetchUpcomingHomeMatches } from '@/utils/api';

export default function UpcomingMatchesHomeTeam({ teamData }) {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!teamData || !teamData.team_id || !teamData.matchDetails?.unformated_date) {
        console.log('Missing required team data:', { 
          hasTeamData: !!teamData,
          teamId: teamData?.team_id,
          date: teamData?.matchDetails?.unformated_date
        });
        setIsLoading(false);
        setError('Missing required team data');
        return;
      }
      
      try {
        console.log('Fetching upcoming matches for team:', teamData.team_id);
        const response = await fetchUpcomingHomeMatches(
          teamData.team_id,
          teamData.matchDetails.unformated_date
        );

        console.log('Upcoming matches response:', response);
        
        if (response?.status && response?.data) {
          setMatches(response.data);
        } else {
          setError('No upcoming matches found');
        }
      } catch (error) {
        console.error('Error fetching upcoming matches:', error);
        setError('Failed to fetch upcoming matches');
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchData();
  }, [teamData]);

  if (isLoading) {
    return <div className="upcoming-matches-container loading">Loading upcoming matches...</div>;
  }

  if (error || !matches.length) {
    return null; // Don't show component if there are no matches
  }

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  // Function to render a match card
  const renderMatchCard = (match) => {
    return (
      <div className="upcoming-match-card">
        <div className="match-date">
          <span className="date-text">{formatDate(match.date)}</span>
        </div>
        
        <div className="match-teams">
          <div className={`team home-side ${match.home_team_name === teamData.team_name ? 'highlighted-team' : ''}`}>
            <a href={`/football-predictions/team/${match.home_team_name.toLowerCase().replace(/\s+/g, '-')}-${match.home_team_id}`}
               className="team-name-link">
              {match.home_team_name}
            </a>
          </div>
          
          <div className="versus">vs</div>
          
          <div className={`team away-side ${match.away_team_name === teamData.team_name ? 'highlighted-team' : ''}`}>
            <a href={`/football-predictions/team/${match.away_team_name.toLowerCase().replace(/\s+/g, '-')}-${match.away_team_id}`}
               className="team-name-link">
              {match.away_team_name}
            </a>
          </div>
        </div>
        
        <div className="match-league">
          <a href={`/football-predictions/league/${match.country_name?.toLowerCase() || 'unknown'}/${match.league_name?.replace(/\s+/g, '-').toLowerCase() || 'unknown'}-${match.league_id || '0'}`}
             className="league-link">
            {match.league_name || 'Unknown League'}
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="upcoming-matches-container">
      <h2 className="upcoming-matches-title">Upcoming Matches</h2>
      
      <div className="upcoming-matches-content">
        <div className="team-matches">
          <div className="matches-list">
            {matches.map((match, idx) => (
              <div key={`upcoming-match-${match.fixture_id || idx}`}>
                {renderMatchCard(match)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
