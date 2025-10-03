'use client';
import { useState, useEffect } from 'react';
import { fetchPremiumTipsters } from '@/utils/api';
import './LatestVIPResults.css';

const LatestVIPResults = () => {
  const [vipResults, setVipResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to get yesterday's date string in YYYY-MM-DD format
  const getYesterdayDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  };

  // Fetch VIP results on component mount
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      const dateString = getYesterdayDate();

      try {
        const data = await fetchPremiumTipsters(dateString);

        // Flatten all selections from all bet slips
        const allSelections = [];
        if (Array.isArray(data)) {
          data.forEach((betSlip) => {
            if (betSlip.selections && Array.isArray(betSlip.selections)) {
              betSlip.selections.forEach((selection) => {
                allSelections.push({
                  ...selection,
                  userDisplayName: betSlip.userDisplayName,
                  userPhotoUrl: betSlip.userPhotoUrl,
                  userWinPercentage: betSlip.userThirtyDayWinPercentage,
                  betSlipOutcome: betSlip.betSlipOutcome,
                  totalOdds: betSlip.totalOdds,
                  potentialReturn: betSlip.potentialReturn
                });
              });
            }
          });
        }

        // Filter only winning selections
        const winningSelections = allSelections.filter(
          selection => selection.selectionOutcome === 'WON'
        );

        console.log('Fetched VIP results:', winningSelections.slice(0, 2)); // Log first 2 items for debugging
        setVipResults(winningSelections);
      } catch (err) {
        console.error('Error fetching VIP results:', err);
        setError('Failed to load VIP results');
        setVipResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="vip-results-container">
      <div className="vip-results-section">
        <div className="section-header">
          <div className="header-title vip-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            <h2 className="vip-title">Latest VIP Wins</h2>
          </div>
          <div className="vip-subtitle">Yesterday's Premium Predictions</div>
        </div>

        <div className="vip-table-wrapper">
          {loading ? (
            <div className="loading-state">Loading VIP results...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : (
            <table className="vip-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Teams</th>
                  <th>Results</th>
                  <th>Tip</th>
                  <th>League</th>
                </tr>
              </thead>
              <tbody>
                {vipResults.length > 0 ? (
                  vipResults.map((result, index) => (
                    <tr key={index}>
                      <td className="match-number">{index + 1}</td>
                      <td className="teams-cell">
                        <div className="vip-match-info">
                          <div className="vip-date">
                            {new Date(result.matchDate + ' ' + result.matchTime).toLocaleDateString('en-GB')}
                            <br />
                            <span className="vip-status">
                              {result.actualMatchStatusShort || 'FT'}
                            </span>
                          </div>
                          <div className="vip-teams">
                            <div className="vip-team">
                              {result.homeTeamLogo ? (
                                <img
                                  src={result.homeTeamLogo}
                                  alt={result.matchHomeTeamName}
                                  className="team-logo"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Crect width="24" height="24" fill="%23e5e7eb"/%3E%3C/svg%3E';
                                  }}
                                />
                              ) : (
                                <span className="team-logo-placeholder"></span>
                              )}
                              <span>{result.matchHomeTeamName}</span>
                            </div>
                            <div className="vip-team">
                              {result.awayTeamLogo ? (
                                <img
                                  src={result.awayTeamLogo}
                                  alt={result.matchAwayTeamName}
                                  className="team-logo"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Crect width="24" height="24" fill="%23e5e7eb"/%3E%3C/svg%3E';
                                  }}
                                />
                              ) : (
                                <span className="team-logo-placeholder"></span>
                              )}
                              <span>{result.matchAwayTeamName}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="results-cell">
                        <div className="score">{result.finalHomeScore ?? '-'}</div>
                        <div className="score">{result.finalAwayScore ?? '-'}</div>
                      </td>
                      <td className="tip-cell">
                        <span className="vip-tip-badge won">
                          {result.oddDescription}
                        </span>
                      </td>
                      <td className="league-cell">
                        <div className="league-info">
                          <span className="league-abbr">
                            {result.oddValue ? `@${result.oddValue}` : 'N/A'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">No VIP wins available for yesterday</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {vipResults.length > 0 && (
          <div className="vip-footer">
            <div className="vip-stats">
              <div className="stat-item">
                <span className="stat-label">Total Wins:</span>
                <span className="stat-value">{vipResults.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Success Rate:</span>
                <span className="stat-value success">100%</span>
              </div>
            </div>
            <a href="/vip-predictions" className="view-vip-btn">
              View All VIP Predictions
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestVIPResults;
