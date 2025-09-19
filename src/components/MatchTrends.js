'use client';

import { useState, useEffect } from 'react';
import { fetchMatchTrends } from '@/utils/api';

export default function MatchTrends({ matchData }) {
  const [trendsData, setTrendsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchMatchTrends(matchData.fixture_id);
        if (response?.status) {
          if (response.data[0]?.predictions?.length > 0) {
            setTrendsData(response.data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching trends:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (matchData?.fixture_id) {
      fetchData();
    }
  }, [matchData]);

  if (isLoading || !trendsData || !trendsData.predictions?.[0]) return null;

  // Add null checks for team stats
  const prediction = trendsData.predictions[0];
  const homeStats = prediction?.home_team_stats?.league;
  const awayStats = prediction?.away_team_stats?.league;
  
  // Return null if we don't have the required stats data
  if (!homeStats || !awayStats) return null;

  const teams = {
    home: {
      name: matchData.home_team_name,
      stats: homeStats
    },
    away: {
      name: matchData.away_team_name,
      stats: awayStats
    }
  };

  // Define trend categories
  const trendCategories = [
    {
      id: 'wins',
      label: 'Wins',
      color: 'success',
      icon: '🏆',
      getText: (team) => (
        <>
          <span className="team-name">{team.name}</span> has won their last{' '}
          <span className="highlight-stat">{team.stats.fixtures.wins.total}</span> {matchData.league_name} matches,{' '}
          <span className="highlight-stat">{team.stats.fixtures.wins.home}</span> at home and{' '}
          <span className="highlight-stat">{team.stats.fixtures.wins.away}</span> away.
        </>
      )
    },
    {
      id: 'clean-sheet',
      label: 'Clean Sheet',
      color: 'info',
      icon: '🛡️',
      getText: (team) => (
        <>
          <span className="team-name">{team.name}</span> has maintained a clean sheet in their last{' '}
          <span className="highlight-stat">{team.stats.clean_sheet.total}</span> {matchData.league_name} matches,
          including{' '}
          <span className="highlight-stat">{team.stats.clean_sheet.home}</span> at home and{' '}
          <span className="highlight-stat">{team.stats.clean_sheet.away}</span> away.
        </>
      )
    },
    {
      id: 'streaks',
      label: 'Win Streak',
      color: 'secondary',
      icon: '📈',
      getText: (team) => (
        <>
          <span className="team-name">{team.name}</span> has won{' '}
          <span className="highlight-stat">{team.stats.biggest.streak.wins}</span> consecutive matches
          in {matchData.league_name}.
        </>
      )
    },
    {
      id: 'draws',
      label: 'Draws',
      color: 'warning',
      icon: '🤝',
      getText: (team) => (
        <>
          <span className="team-name">{team.name}</span> has recorded{' '}
          <span className="highlight-stat">{team.stats.fixtures.draws.total}</span> draws with{' '}
          <span className="highlight-stat">{team.stats.fixtures.draws.home}</span> at home and{' '}
          <span className="highlight-stat">{team.stats.fixtures.draws.away}</span> away.
        </>
      )
    },
    {
      id: 'losses',
      label: 'Losses',
      color: 'danger',
      icon: '❌',
      getText: (team) => (
        <>
          <span className="team-name">{team.name}</span> has lost{' '}
          <span className="highlight-stat">{team.stats.fixtures.loses.total}</span> matches in {matchData.league_name},
          with{' '}
          <span className="highlight-stat">{team.stats.fixtures.loses.home}</span> losses at home and{' '}
          <span className="highlight-stat">{team.stats.fixtures.loses.away}</span> away.
        </>
      )
    }
  ];

  return (
    <div className="trends-container">
      <h2 className="trends-title">Match Trends</h2>
      
      <div className="teams-header">
        <div className="team-header home-team">
          <h3>{teams.home.name}</h3>
        </div>
        <div className="team-header away-team">
          <h3>{teams.away.name}</h3>
        </div>
      </div>

      <div className="trends-content">
        {trendCategories.map((category) => (
          <div key={category.id} className="trend-category">
            <div className="trend-category-header">
              <span className={`trend-icon trend-${category.color}`}>{category.icon}</span>
              <h4 className="trend-label">{category.label}</h4>
            </div>
            
            <div className="trend-data-container">
              <div className="trend-data home-team">
                <p>{category.getText(teams.home)}</p>
              </div>
              
              <div className="trend-data away-team">
                <p>{category.getText(teams.away)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
