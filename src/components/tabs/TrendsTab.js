'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getRandomText } from '@/utils/trendDescriptions';

const TrendCategory = ({ title, teams, type, icon }) => {
  const trendType = type === 'clean-sheet' ? 'cleanSheet' :
                   type === 'winning-streaks' ? 'winningStreak' :
                   type === 'winning' ? 'wins' :
                   type === 'losing' ? 'losses' : 'draws';

  // Map trend types to colors
  const colorMap = {
    'winning': 'success',
    'clean-sheet': 'info',
    'winning-streaks': 'secondary',
    'losing': 'danger',
    'draws': 'warning'
  };

  // Map trend types to icons
  const iconMap = {
    'winning': '🏆',
    'clean-sheet': '🛡️',
    'winning-streaks': '📈',
    'losing': '❌',
    'draws': '🤝'
  };

  const trendIcon = icon || iconMap[type] || '📊';
  const trendColor = colorMap[type] || 'secondary';

  return (
    <div className="trend-category">
      <div className="trend-category-header">
        <span className={`trend-icon trend-${trendColor}`}>{trendIcon}</span>
        <h4 className="trend-label">{title || `${type.charAt(0).toUpperCase() + type.slice(1)} Trends`}</h4>
      </div>
      
      {teams.map((team, index) => {
        const trendTexts = getRandomText(trendType);
        
        return (
          <div key={index} className="trend-data-container">
            <div className="trend-data home-team">
              <div className="team-header-compact">
                <div className="team-logo-wrapper-small">
                  {team.logo ? (
                    <Image 
                      src={team.logo} 
                      alt={team.name} 
                      width={40} 
                      height={40}
                      className="team-logo"
                      unoptimized
                    />
                  ) : (
                    <div className="team-logo-placeholder">{team.name.charAt(0)}</div>
                  )}
                </div>
                <h5 className="team-name">{team.name}</h5>
              </div>
              
              <div className="team-stats-summary">
                <p className="games-played">
                  <span className="stat-label">Games Played:</span>{' '}
                  <span className="stat-value">Home: {team.homeGames}, Away: {team.awayGames}, Total: {team.totalGames}</span>
                </p>
                
                <p className="trend-description">
                  <span className="team-name">{team.name}</span>
                  {' '}{trendTexts.prefix}{' '}
                  <span className="highlight-stat">{team.statValue}</span>
                  <span className="league-name">&nbsp;{team.league}</span>
                  {' matches, '}
                  <span className="highlight-stat">{team.homeStatValue}</span>
                  &nbsp;{type === 'clean-sheet' ? 'clean sheets' : 'victories'} at home and{' '}
                  <span className="highlight-stat">{team.awayStatValue}</span>
                  {' away, '}{trendTexts.suffix}
                </p>
                
                <p className="next-match-info">
                  <a className="team-name-link" href={team.nextMatchUrl}>
                    {team.nextMatchText}
                  </a>
                  <span className="match-date">&nbsp;&nbsp;{team.nextMatchDate}</span>
                </p>
                
                <p className="prediction-info">
                  Prediction:{' '}
                  <span className="prediction-value">
                    {team.preferredPrediction.text === 'X' ? 'Draw' : 
                     team.preferredPrediction.text === '1' ? team.homeTeam : 
                     team.awayTeam}
                  </span>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function TrendsTab({ trends }) {
  if (!trends?.length) {
    return <div>No trends data available</div>;
  }

  const processTeamTrends = (trendsData) => {
    const processTeamStats = (team, statType) => {
      // Extract predictions data
      const predictions = team.predictions?.[0];
      if (!predictions) return null;
      
      // Get team stats from predictions
      const homeTeamStats = predictions.home_team_stats;
      const awayTeamStats = predictions.away_team_stats;
      
      // Use home team stats for the league data
      const homeStats = homeTeamStats.league;
      const awayStats = awayTeamStats.league;
      
      // Determine prediction based on percentages
      const predComputation = team.prediction_computation?.[0];
      const homePct = predComputation ? parseFloat(predComputation.percent_pred_home.replace('%', '')) : 33;
      const drawPct = predComputation ? parseFloat(predComputation.percent_pred_draw.replace('%', '')) : 33;
      const awayPct = predComputation ? parseFloat(predComputation.percent_pred_away.replace('%', '')) : 33;
      
      let preferredPrediction = {
        text: '',
        type: 'medium',
        confidence: 'medium'
      };

      // Determine prediction
      if (homePct > drawPct && homePct > awayPct) {
        preferredPrediction.text = '1';
      } else if (drawPct > homePct && drawPct > awayPct) {
        preferredPrediction.text = 'X';
      } else {
        preferredPrediction.text = '2';
      }

      // Set confidence based on stats
      if (homeStats.fixtures.wins.total > 20 || awayStats.fixtures.wins.total > 20) {
        preferredPrediction.confidence = 'high';
        preferredPrediction.type = 'high';
      }

      const getStatValues = (type) => {
        switch(type) {
          case 'clean-sheet':
            return {
              total: homeStats.clean_sheet.total,
              home: homeStats.clean_sheet.home,
              away: homeStats.clean_sheet.away
            };
          case 'winning':
            return {
              total: homeStats.fixtures.wins.total,
              home: homeStats.fixtures.wins.home,
              away: homeStats.fixtures.wins.away
            };
          case 'losing':
            return {
              total: homeStats.fixtures.loses.total,
              home: homeStats.fixtures.loses.home,
              away: homeStats.fixtures.loses.away
            };
          case 'winning-streaks':
            return {
              total: homeStats.biggest.streak.wins,
              home: homeStats.biggest.streak.wins,
              away: 0
            };
          default:
            return {
              total: 0,
              home: 0,
              away: 0
            };
        }
      };

      const stats = getStatValues(statType);

      return {
        name: homeTeamStats.name,
        logo: homeTeamStats.logo,
        league: team.league_name,
        homeGames: homeStats.fixtures.played.home,
        awayGames: homeStats.fixtures.played.away,
        totalGames: homeStats.fixtures.played.total,
        homeWins: homeStats.fixtures.wins.home,
        awayWins: homeStats.fixtures.wins.away,
        wins: homeStats.fixtures.wins.total,
        homeLosses: homeStats.fixtures.loses.home,
        awayLosses: homeStats.fixtures.loses.away,
        losses: homeStats.fixtures.loses.total,
        homeCleanSheets: homeStats.clean_sheet.home,
        awayCleanSheets: homeStats.clean_sheet.away,
        cleanSheets: homeStats.clean_sheet.total,
        streak: homeStats.biggest.streak.wins,
        nextMatchText: `${team.home_team_name} - ${team.away_team_name}`,
        nextMatchUrl: `/football-predictions/fixture/${team.home_team_name.toLowerCase().replace(/\s+/g, '-')}-vs-${team.away_team_name.toLowerCase().replace(/\s+/g, '-')}-${team.fixture_id}`,
        nextMatchDate: team.formatted_date,
        homeTeam: team.home_team_name,
        awayTeam: team.away_team_name,
        preferredPrediction,
        statValue: stats.total,
        homeStatValue: stats.home,
        awayStatValue: stats.away
      };
    };

    const result = {
      winningTeams: [],
      cleanSheetTeams: [],
      streakTeams: [],
      losingTeams: []
    };

    trendsData.forEach(team => {
      if (!team.predictions || team.predictions.length === 0) return;
      
      // Process stats for each type
      const winStats = processTeamStats(team, 'winning');
      const cleanSheetStats = processTeamStats(team, 'clean-sheet');
      const streakStats = processTeamStats(team, 'winning-streaks');
      const lossStats = processTeamStats(team, 'losing');

      if (!winStats) return;

      // Apply filtering logic
      if ((winStats.wins / winStats.totalGames) > 0.5) {
        result.winningTeams.push(winStats);
      }
      if ((cleanSheetStats.cleanSheets / cleanSheetStats.totalGames) > 0.3) {
        result.cleanSheetTeams.push(cleanSheetStats);
      }
      if (streakStats.streak >= 3) {
        result.streakTeams.push(streakStats);
      }
      if ((lossStats.losses / lossStats.totalGames) > 0.5) {
        result.losingTeams.push(lossStats);
      }
    });

    // Sort teams by their respective metrics
    result.winningTeams.sort((a, b) => b.wins - a.wins);
    result.cleanSheetTeams.sort((a, b) => b.cleanSheets - a.cleanSheets);
    result.streakTeams.sort((a, b) => b.streak - a.streak);
    result.losingTeams.sort((a, b) => b.losses - a.losses);

    return result;
  };

  const { winningTeams, cleanSheetTeams, streakTeams, losingTeams } = processTeamTrends(trends);

  return (
    <div className="trends-container">
      <h2 className="trends-title">League Top Trends</h2>
      
      <div className="trends-content">
        {winningTeams?.length > 0 && (
          <TrendCategory title="Winning Teams" teams={winningTeams} type="winning" icon="🏆" />
        )}
        
        {cleanSheetTeams?.length > 0 && (
          <TrendCategory title="Clean Sheet Teams" teams={cleanSheetTeams} type="clean-sheet" icon="🛡️" />
        )}
        
        {streakTeams?.length > 0 && (
          <TrendCategory title="Teams on Winning Streaks" teams={streakTeams} type="winning-streaks" icon="📈" />
        )}
        
        {losingTeams?.length > 0 && (
          <TrendCategory title="Teams on Losing Streaks" teams={losingTeams} type="losing" icon="❌" />
        )}
      </div>
    </div>
  );
}
