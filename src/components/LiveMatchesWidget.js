'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchFixturesByDatePaginated } from '@/utils/api';

export default function LiveMatchesWidget() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // Get yesterday's date to show finished matches
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const formattedDate = yesterday.toISOString().split('T')[0];

        const response = await fetchFixturesByDatePaginated(formattedDate, 10, '1');
        if (response.status && Array.isArray(response.fixtures)) {
          // Filter for finished matches with predictions
          const finishedMatches = response.fixtures
            .filter(match => match.status_short === 'FT' && match.predictions)
            .slice(0, 12);
          setMatches(finishedMatches);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const getPredictionBadge = (prediction) => {
    // Map prediction to simplified display
    const predMap = {
      '1': '1',
      'X': 'X',
      '2': '2',
      '1X': '1X',
      '12': '12',
      'X2': 'X2',
      'Over 2.5': 'OV25',
      'Under 2.5': 'U25',
      'GG': 'GG',
      'NG': 'NG'
    };
    return predMap[prediction] || prediction;
  };

  const getCountryFlag = (flagUrl) => {
    if (!flagUrl) return null;
    // Use existing flag URL transformations from your codebase
    return flagUrl;
  };

  if (isLoading) {
    return (
      <div className="live-matches-widget">
        <div className="widget-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702 1.509.229z"/>
            <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
          </svg>
          <h3>Latest VIP Wins</h3>
        </div>
        <div className="widget-loading">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="live-matches-widget">
      <div className="widget-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702 1.509.229z"/>
          <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
        </svg>
        <h3>Latest VIP Wins</h3>
      </div>

      <div className="widget-tabs">
        <button className="widget-tab active">Today</button>
      </div>

      <div className="matches-table">
        <div className="table-header">
          <span className="col-teams">Teams</span>
          <span className="col-results">Results</span>
          <span className="col-tip">Tip</span>
          <span className="col-league">League</span>
        </div>

        <div className="table-body">
          {matches.length === 0 ? (
            <div className="no-matches">
              <p>No recent wins to display</p>
            </div>
          ) : (
            matches.map((match, index) => (
              <Link
                key={match.fixture_id || index}
                href={`/football-predictions/fixture/${match.home_team_name?.toLowerCase().replace(/\s+/g, '-')}-vs-${match.away_team_name?.toLowerCase().replace(/\s+/g, '-')}-${match.fixture_id}`}
                className="match-row"
              >
                <div className="col-teams">
                  <div className="team-info">
                    <span className="rank">{index + 1}</span>
                    <div className="team-names">
                      <div className="team">
                        <img
                          src={match.home_team_logo}
                          alt=""
                          className="team-logo"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <span>{match.home_team_name}</span>
                      </div>
                      <div className="team">
                        <img
                          src={match.away_team_logo}
                          alt=""
                          className="team-logo"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <span>{match.away_team_name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-results">
                  <div className="score">
                    <span className="score-home">{match.goals_home ?? '-'}</span>
                    <span className="score-away">{match.goals_away ?? '-'}</span>
                  </div>
                </div>

                <div className="col-tip">
                  <span className="tip-badge">
                    {getPredictionBadge(match.predictions?.[0]?.option_picked || '1')}
                  </span>
                </div>

                <div className="col-league">
                  {match.country_flag && (
                    <img
                      src={getCountryFlag(match.country_flag)}
                      alt=""
                      className="country-flag"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="widget-footer">
        <Link href="/yesterday-football-predictions" className="view-tips-btn">
          View Free Tips
        </Link>
      </div>
    </div>
  );
}
