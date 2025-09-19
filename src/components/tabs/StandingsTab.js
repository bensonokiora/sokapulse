'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function StandingsTab({ standings }) {
  const [imageErrors, setImageErrors] = useState({});
  const [standingsData, setStandingsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("StandingsTab received:", standings);
    
    // Extract standings data based on the API response
    let extractedData = null;
    
    try {
      // Case 1: Raw API response with data array
      if (standings?.data && Array.isArray(standings.data) && standings.data.length > 0) {
        console.log("Case 1: Raw API with data array");
        
        // Check if standings has the expected format
        if (standings.data[0]?.standings && Array.isArray(standings.data[0].standings[0])) {
          extractedData = standings.data[0].standings[0];
          console.log("  Found standings in data[0].standings[0]");
        }
      }
      // Case 2: Direct standings array - happens when the data is already processed
      else if (Array.isArray(standings) && standings.length > 0) {
        console.log("Case 2: Array of standings items");
        
        // Check for processed new format
        if (standings[0]?.standings && Array.isArray(standings[0].standings[0])) {
          extractedData = standings[0].standings[0];
          console.log("  Found standings in standings[0].standings[0]");
        }
        // Check for old format
        else if (standings[0]?.standings_data) {
          console.log("  Found old format with standings_data");
          extractedData = JSON.parse(standings[0].standings_data)[0];
        }
      }
      // Case 3: Single standings object - new format 
      else if (standings?.standings && Array.isArray(standings.standings[0])) {
        console.log("Case 3: Single standings object");
        extractedData = standings.standings[0];
      }
      // Case 4: Raw API as is
      else if (standings) {
        console.log("Case 4: Attempting to use standings directly");
        // Try to use the standings directly as a last resort
        extractedData = standings;
      }
      
      console.log("Extracted data:", extractedData);
    } catch (error) {
      console.error("Error processing standings data:", error);
    } finally {
      setStandingsData(extractedData);
      setLoading(false);
    }
  }, [standings]);

  if (loading) {
    return <div>Loading standings data...</div>;
  }

  if (!standingsData) {
    return (
      <div>
        <div>No standings data available</div>
        <div style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
          Received: {JSON.stringify(standings).substring(0, 150)}...
        </div>
      </div>
    );
  }

  // Function to determine qualification or relegation zone styling
  const getPositionStyle = (rank, description) => {
    // If description is available (new API), use it to determine position type
    if (description) {
      if (description.includes('Champions League')) return 'champions-league-position';
      if (description.includes('Europa League')) return 'europa-league-position';
      if (description.includes('Relegation') || description.includes('2. Bundesliga')) return 'relegation-position';
      return '';
    }
    
    // Fallback for old API or when description is not available
    if (rank <= 4) return 'champions-league-position';
    if (rank === 5) return 'europa-league-position';
    if (rank >= standingsData.length - 3) return 'relegation-position';
    return '';
  };

  const handleImageError = (teamId) => {
    setImageErrors(prev => ({ ...prev, [teamId]: true }));
  };

  // Check if standingsData is an array
  if (!Array.isArray(standingsData)) {
    console.error("standingsData is not an array:", standingsData);
    return <div>Invalid standings data format</div>;
  }

  return (
    <div className="standings-container">
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
          {standingsData.map((team) => (
            <div 
              key={team.team.id} 
              className="standings-row"
            >
              <div className={`standings-cell position-cell ${getPositionStyle(team.rank, team.description)}`}>
                <span className="team-rank">{team.rank}</span>
              </div>
              <div className="standings-cell team-cell">
                {team.team.logo && !imageErrors[team.team.id] ? (
                  <div className="team-logo-container">
                    <Image 
                      src={team.team.logo} 
                      alt={team.team.name}
                      width={24}
                      height={24}
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
          ))}
        </div>
      </div>
      
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

