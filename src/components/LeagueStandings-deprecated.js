'use client';

import { useState, useEffect } from 'react';
import { fetchTeamStandings } from '@/utils/api';
import Image from 'next/image';

export default function LeagueStandingsDeprecated({ matchData }) {
  const [standings, setStandings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTeamStandings(matchData.league_id);
        if (response?.status && response?.data?.[0]?.standings_data) {
          setStandings(JSON.parse(response.data[0].standings_data)[0]);
        }
      } catch (error) {
        console.error('Error fetching standings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (matchData?.league_id) {
      fetchData();
    }
  }, [matchData]);

  if (isLoading || !standings.length) return null;

  // Function to determine qualification or relegation zone styling
  const getPositionStyle = (rank) => {
    // These values should be adjusted based on the league's actual qualification/relegation rules
    if (rank <= 4) return 'champions-league-position';
    if (rank === 5) return 'europa-league-position';
    if (rank >= standings.length - 3) return 'relegation-position';
    return '';
  };

  const handleImageError = (teamId) => {
    setImageErrors(prev => ({ ...prev, [teamId]: true }));
  };

  return (
    <div className="standings-container compact-table">
      <h2 className="standings-title">League Table</h2>
      <div className="standings-wrapper">
        <div className="standings-header">
          <div className="standings-cell position-cell">POS</div>
          <div className="standings-cell team-cell">TEAM</div>
          <div className="standings-cell">PTS</div>
          <div className="standings-cell">GP</div>
          <div className="standings-cell">W</div>
          <div className="standings-cell">D</div>
          <div className="standings-cell">L</div>
          <div className="standings-cell">GF</div>
          <div className="standings-cell">GA</div>
          <div className="standings-cell">+/-</div>
        </div>

        <div className="standings-body">
          {standings.map((team) => {
            const isCurrentMatchTeam = team.team.name === matchData.home_team_name || 
                                      team.team.name === matchData.away_team_name;
            
            return (
              <div 
                key={team.team.id} 
                className={`standings-row compact-row ${isCurrentMatchTeam ? 'highlighted-team' : ''}`}
              >
                <div className={`standings-cell position-cell ${getPositionStyle(team.rank)}`}>
                  <span className="team-rank">{team.rank}</span>
                </div>
                <div className="standings-cell team-cell">
                  {team.team.logo && !imageErrors[team.team.id] ? (
                    <div className="team-logo-container">
                      <Image 
                        src={team.team.logo} 
                        alt={team.team.name}
                        width={20}
                        height={20}
                        className="team-logo"
                        onError={() => handleImageError(team.team.id)}
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="team-logo-placeholder">{team.team.name.charAt(0)}</div>
                  )}
                  <a 
                    href={`/football-predictions/team/${team.team.name.toLowerCase().replace(/\s+/g, '-')}-${team.team.id}`} 
                    className="team-name-link"
                  >
                    {team.team.name}
                  </a>
                </div>
                <div className="standings-cell points-cell">{team.points}</div>
                <div className="standings-cell">{team.all.played}</div>
                <div className="standings-cell">{team.all.win}</div>
                <div className="standings-cell">{team.all.draw}</div>
                <div className="standings-cell">{team.all.lose}</div>
                <div className="standings-cell">{team.all.goals.for}</div>
                <div className="standings-cell">{team.all.goals.against}</div>
                <div className="standings-cell goal-diff-cell">{team.goalsDiff}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      <style jsx>{`
        .compact-table .standings-row {
          height: 36px;
          min-height: 36px;
          font-size: 0.9rem;
        }
        
        .compact-table .standings-cell {
          padding: 4px 6px;
        }
        
        .compact-table .team-logo-container,
        .compact-table .team-logo-placeholder {
          width: 20px;
          height: 20px;
          min-width: 20px;
          margin-right: 6px;
        }
        
        .compact-table .team-logo-placeholder {
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .compact-table .standings-header {
          height: 32px;
          font-size: 0.85rem;
        }
        
        .compact-table .team-name-link {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 130px;
          display: inline-block;
        }
      `}</style>
      
      <div className="standings-legend">
        <div className="legend-item">
          <span className="legend-color champions-league-position"></span>
          <span className="legend-text">Champions League</span>
        </div>
        <div className="legend-item">
          <span className="legend-color europa-league-position"></span>
          <span className="legend-text">Europa League</span>
        </div>
        <div className="legend-item">
          <span className="legend-color relegation-position"></span>
          <span className="legend-text">Relegation</span>
        </div>
      </div>
    </div>
  );
}
