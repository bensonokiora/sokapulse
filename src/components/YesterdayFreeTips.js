'use client';

import React, { useState, useEffect } from 'react';
import { fetchFeaturedTipsters } from '@/utils/api';

export default function YesterdayFreeTips() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // Get yesterday's date
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const formattedDate = yesterday.toISOString().split('T')[0];

        const data = await fetchFeaturedTipsters(formattedDate);

        // Flatten all selections from all bet slips
        const allSelections = [];
        if (Array.isArray(data)) {
          data.forEach((betSlip) => {
            if (betSlip.selections && Array.isArray(betSlip.selections)) {
              betSlip.selections.forEach((selection) => {
                // Only include finished matches
                if (selection.actualMatchStatusShort === 'FT') {
                  allSelections.push({
                    ...selection,
                    userDisplayName: betSlip.userDisplayName,
                    userPhotoUrl: betSlip.userPhotoUrl,
                  });
                }
              });
            }
          });
        }

        // Limit to 12 matches
        setMatches(allSelections.slice(0, 12));
      } catch (error) {
        console.error('Error fetching yesterday\'s free tips:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (isLoading) {
    return (
      <div className="live-matches-widget">
        <div className="widget-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
          <h3>Yesterday's Free Tips</h3>
        </div>
        <div className="widget-loading">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="live-matches-widget">
        <div className="widget-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
          <h3>Yesterday's Free Tips</h3>
        </div>
        <div className="no-matches">
          <p>No matches available for yesterday</p>
        </div>
      </div>
    );
  }

  return (
    <div className="live-matches-widget">
      <div className="widget-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
        <h3>Yesterday's Free Tips</h3>
      </div>

      <div className="matches-table">
        <div className="table-header">
          <span className="col-teams">Teams</span>
          <span className="col-results">Results</span>
          <span className="col-tip">Tip</span>
        </div>

        <div className="table-body">
          {matches.map((match, index) => (
            <div key={index} className="match-row">
              <div className="col-teams">
                <div className="team-info">
                  <span className="rank">{index + 1}</span>
                  <div className="team-names">
                    <div className="team">
                      {match.homeTeamLogo && (
                        <img
                          src={match.homeTeamLogo}
                          alt={match.matchHomeTeamName}
                          className="team-logo"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Crect width="24" height="24" fill="%23e5e7eb"/%3E%3C/svg%3E';
                          }}
                        />
                      )}
                      <span>{match.matchHomeTeamName}</span>
                    </div>
                    <div className="team">
                      {match.awayTeamLogo && (
                        <img
                          src={match.awayTeamLogo}
                          alt={match.matchAwayTeamName}
                          className="team-logo"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Crect width="24" height="24" fill="%23e5e7eb"/%3E%3C/svg%3E';
                          }}
                        />
                      )}
                      <span>{match.matchAwayTeamName}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-results">
                <div className="score">
                  <span className="score-home">{match.finalHomeScore ?? '-'}</span>
                  <span className="score-away">{match.finalAwayScore ?? '-'}</span>
                </div>
              </div>

              <div className="col-tip">
                <span className={`tip-badge ${match.selectionOutcome === 'WON' ? 'won' : match.selectionOutcome === 'LOST' ? 'lost' : ''}`}>
                  {match.oddDescription}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="widget-footer">
        <a href="/football-predictions" className="view-tips-btn">
          View All Predictions
        </a>
      </div>
    </div>
  );
}
