'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchTeamDetails, fetchUpcomingHomeMatches } from '@/utils/api';
import LeagueStandings from '@/components/LeagueStandings';
import NavigationRow from '@/components/NavigationRow';
import GamesPlayed from '@/components/GamesPlayed';
import TeamMatchesBothSides from '@/components/TeamMatchesBothSides';
import UpcomingMatchesHomeTeam from '@/components/UpcomingMatchesHomeTeam';
import '../../../../../styles/custom.css';
import LoadingAnimation from '@/components/LoadingAnimation';
import TeamDoubleChanceClient from '@/components/TeamDoubleChanceClient';

export default function TeamDoubleChance() {
  const params = useParams();
  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTeamData = async (teamDetailsParam) => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Extract team name and ID from URL
        const parts = teamDetailsParam.split('-');
        const teamId = parts[parts.length - 1];
        const teamName = parts.slice(0, -1).join('-');

        // Fetch from API
        const response = await fetchTeamDetails(teamId);

        if (response?.status && response?.data?.length > 0) {
          // Use the most recent fixture to get team info and unformatted date
          const mostRecentFixture = response.data[0];
          const isHomeTeam = teamId === mostRecentFixture.home_team_id.toString();
          
          // Try to fetch upcoming matches using the UpcomingMatches API
          let upcomingFixture = null;
          let selectedFixture = mostRecentFixture;
          let isUpcoming = false;
          
          try {
            if (mostRecentFixture.unformated_date) {
              const upcomingResponse = await fetchUpcomingHomeMatches(teamId, mostRecentFixture.unformated_date);
              if (upcomingResponse?.status && upcomingResponse?.data?.length > 0) {
                // Use the first upcoming match
                upcomingFixture = upcomingResponse.data[0];
                selectedFixture = upcomingFixture;
                isUpcoming = true;
              }
            }
          } catch (upcomingError) {
            console.log('Could not fetch upcoming matches, using recent match instead:', upcomingError);
          }
          
          // Parse scores if they exist
          if (selectedFixture.scores && typeof selectedFixture.scores === 'string' && selectedFixture.scores.trim()) {
            try {
              selectedFixture.parsedScores = JSON.parse(selectedFixture.scores);
            } catch (e) {
              console.error('Error parsing scores:', e, 'Raw scores:', selectedFixture.scores);
              selectedFixture.parsedScores = {};
            }
          } else {
            selectedFixture.parsedScores = {};
          }

          // Determine if the team is home or away in the selected fixture
          const selectedIsHomeTeam = teamId === selectedFixture.home_team_id.toString();
          
          // Create team data object using the most recent fixture for team info but selected fixture for match details
          const teamDataResult = {
            team_id: isHomeTeam ? mostRecentFixture.home_team_id : mostRecentFixture.away_team_id,
            team_name: isHomeTeam ? mostRecentFixture.home_team_name : mostRecentFixture.away_team_name,
            team_logo: isHomeTeam ? mostRecentFixture.home_team_logo : mostRecentFixture.away_team_logo,
            venue_name: selectedFixture.venue_name,
            country_name: selectedFixture.country_name,
            league_name: selectedFixture.league_name,
            league_id: selectedFixture.league_id,
            matchDetails: selectedFixture,
            last_matches: response.data.slice(1),
            next_fixture: upcomingFixture,
            isUpcoming: isUpcoming
          };

          setTeamData(teamDataResult);
        } else {
          setError('No team data available');
        }
      } catch (err) {
        setError('Error loading team details');
      } finally {
        setIsLoading(false);
      }
    };

    if (params?.['team-details']) {
      getTeamData(params['team-details']);
    }
  }, [params]);

  if (isLoading) {
    return (
      <div className="container container-mob">
        <div className="loading-container">
          <LoadingAnimation text="Loading team details..." />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container container-mob">
      <NavigationRow />
      
      <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>
        <div className="col-lg-12">
          
          {/* Team Header */}
          <div className="responsive-row match-details-header-row">
            <div className="table-cell match-details-header-cell">
              <h1 className="match-details-header-title">
                {teamData?.team_name} Double Chance Predictions
              </h1>
            </div>
          </div>

          {/* Team Details */}
          <div className="responsive-row team-details">
            <div className="team-details-content">
              <div className="team-logo-wrapper">
                {teamData?.team_logo ? (
                  <img 
                    src={teamData.team_logo} 
                    alt={`${teamData?.team_name}-double-chance-predictions`}
                    className="team-logo"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'team-logo-fallback';
                      fallback.style.cssText = 'width: 80px; height: 80px; border-radius: 50%; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; color: #333; border: 2px solid #ddd;';
                      fallback.textContent = teamData?.team_name?.charAt(0).toUpperCase() || 'T';
                      e.target.parentNode.appendChild(fallback);
                    }}
                  />
                ) : (
                  <div className="team-logo-fallback" style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#333',
                    border: '2px solid #ddd'
                  }}>
                    {teamData?.team_name?.charAt(0).toUpperCase() || 'T'}
                  </div>
                )}
              </div>
              <div className="team-info">
                <h4 className="team-name-heading">{teamData?.team_name}</h4>
                <div className="team-meta">
                  <span className="venue-text">{teamData?.venue_name}</span>
                  <div className="team-location">
                    <a href={`/football-predictions/country/${teamData?.country_name?.toLowerCase()}`} 
                       className="country-link">{teamData?.country_name}</a>
                    <span className="separator">•</span>
                    <a href={`/football-predictions/league/${teamData?.country_name?.toLowerCase()}/${teamData?.league_name?.replace(/\s+/g, '-').toLowerCase()}-${teamData?.league_id}`}
                       className="league-link">{teamData?.league_name}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="match-details-navigation">
            <div className="match-details-nav-item">
              <a href={`/football-predictions/team/${teamData?.team_name?.toLowerCase().replace(/\s+/g, '-')}-${teamData?.team_id}`}
                 className="match-details-nav-link">
                <span>1x2</span>
              </a>
            </div>
            <div className="match-details-nav-item">
              <a href={`/football-predictions/team/double-chance-prediction/${teamData?.team_name?.toLowerCase().replace(/\s+/g, '-')}-${teamData?.team_id}`}
                 className="match-details-nav-link active">
                <span>Double Chance</span>
              </a>
            </div>
            <div className="match-details-nav-item">
              <a href={`/football-predictions/team/predictions-under-over-goals/${teamData?.team_name?.toLowerCase().replace(/\s+/g, '-')}-${teamData?.team_id}`}
                 className="match-details-nav-link">
                <span>Over/Under 2.5</span>
              </a>
            </div>
          </div>

          {/* Match Status Header */}
          <div className="row" style={{ marginBottom: '10px' }}>
            <div className="col-12">
              <h2 style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {teamData?.isUpcoming ? 'Upcoming Match' : 'Recent Match'}
              </h2>
            </div>
          </div>

          {/* Match Details Header */}
          <div className="responsive-row header-size match-details-header" 
               style={{ fontWeight: 'bold', textAlign: 'center', cursor: 'auto' }}>
            <div className="responsive-cell"></div>
            <div className="responsive-cell team-link-probability" 
                 style={{ textAlign: 'left', fontWeight: 'bold' }}>
              <span>Home Team</span><br />
              <span>Away Team</span><br />
            </div>
            <div className="responsive-cell team-link-probability" 
                 style={{ whiteSpace: 'pre-wrap' }}>
              <span>&nbsp;Probability % </span><br />
              <span>1X &nbsp;X2 &nbsp;12</span>
            </div>
            <div className="responsive-cell">Prediction</div>
            <div className="responsive-cell hide-on-mobile">Avg<br />goals</div>
            <div className="responsive-cell">Odds</div>
            <div className="responsive-cell">
              <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">Scores</div>
              </div>
            </div>
          </div>

          {/* Client-side interactive content */}
          <TeamDoubleChanceClient teamData={teamData} />
          
          {/* Add other components */}
          {teamData && <LeagueStandings matchData={teamData} />}
          {teamData && <GamesPlayed teamData={teamData} />}
          {teamData && <UpcomingMatchesHomeTeam teamData={teamData} />}
          
        </div>
      </div>
    </div>
  );
}
