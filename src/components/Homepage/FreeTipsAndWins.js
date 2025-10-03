'use client';
import { useState, useEffect } from 'react';
import { fetchFeaturedTipsters, fetchPremiumTipsters } from '@/utils/api';
import './FreeTipsAndWins.css';

const FreeTipsAndWins = () => {
  const [activeFreeTipTab, setActiveFreeTipTab] = useState('today');
  const [freeTips, setFreeTips] = useState([]);
  const [vipWins, setVipWins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vipLoading, setVipLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vipError, setVipError] = useState(null);

  // Helper function to get date string in YYYY-MM-DD format
  const getDateString = (daysOffset = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
  };

  // Fetch tips based on active tab
  useEffect(() => {
    const fetchTips = async () => {
      setLoading(true);
      setError(null);

      let dateString;
      if (activeFreeTipTab === 'yesterday') {
        dateString = getDateString(-1);
      } else if (activeFreeTipTab === 'today') {
        dateString = getDateString(0);
      } else {
        dateString = getDateString(1);
      }

      try {
        const data = await fetchFeaturedTipsters(dateString);

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
                  userWinPercentage: betSlip.userThirtyDayWinPercentage
                });
              });
            }
          });
        }

        console.log('Fetched tips data:', allSelections.slice(0, 2)); // Log first 2 items for debugging
        setFreeTips(allSelections);
      } catch (err) {
        console.error('Error fetching tips:', err);
        setError('Failed to load tips');
        setFreeTips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, [activeFreeTipTab]);

  // Fetch VIP Wins (yesterday's premium results)
  useEffect(() => {
    const fetchVipWins = async () => {
      setVipLoading(true);
      setVipError(null);

      const yesterdayDate = getDateString(-1);

      try {
        const data = await fetchPremiumTipsters(yesterdayDate);

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
                  userWinPercentage: betSlip.userThirtyDayWinPercentage
                });
              });
            }
          });
        }

        // Filter only winning selections
        const winningSelections = allSelections.filter(
          selection => selection.selectionOutcome === 'WON'
        );

        console.log('Fetched VIP wins:', winningSelections.slice(0, 2)); // Log first 2 items for debugging
        setVipWins(winningSelections);
      } catch (err) {
        console.error('Error fetching VIP wins:', err);
        setVipError('Failed to load VIP wins');
        setVipWins([]);
      } finally {
        setVipLoading(false);
      }
    };

    fetchVipWins();
  }, []); // Only fetch once on mount

  return (
    <div className="free-tips-wins-container">
      {/* Free Predictions Section */}
      <div className="tips-section">
        <div className="section-header">
          <div className="header-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <h2>Free Predictions</h2>
          </div>
        </div>

        <div className="tabs-container">
          <button
            className={`tab-button ${activeFreeTipTab === 'yesterday' ? 'active' : ''}`}
            onClick={() => setActiveFreeTipTab('yesterday')}
          >
            Yesterday
          </button>
          <button
            className={`tab-button ${activeFreeTipTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveFreeTipTab('today')}
          >
            Today
          </button>
          <button
            className={`tab-button ${activeFreeTipTab === 'tomorrow' ? 'active' : ''}`}
            onClick={() => setActiveFreeTipTab('tomorrow')}
          >
            Tomorrow
          </button>
        </div>

        <div className="tips-table-wrapper">
          {loading ? (
            <div className="loading-state">Loading...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : (
            <table className="tips-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Teams</th>
                  <th>Results</th>
                  <th>Tip</th>
                  <th>Odds</th>
                </tr>
              </thead>
              <tbody>
                {freeTips.length > 0 ? (
                  freeTips.map((tip, index) => (
                    <tr key={index}>
                      <td className="match-number">{index + 1}</td>
                      <td className="teams-cell">
                        <div className="match-info">
                          <div className="match-date">
                            {new Date(tip.matchDate + ' ' + tip.matchTime).toLocaleDateString('en-GB')}
                            <br />
                            {tip.matchTime?.substring(0, 5)}
                          </div>
                          <div className="teams">
                            <div className="team">
                              {tip.homeTeamLogo ? (
                                <img
                                  src={tip.homeTeamLogo}
                                  alt={tip.matchHomeTeamName}
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
                              <span>{tip.matchHomeTeamName}</span>
                            </div>
                            <div className="team">
                              {tip.awayTeamLogo ? (
                                <img
                                  src={tip.awayTeamLogo}
                                  alt={tip.matchAwayTeamName}
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
                              <span>{tip.matchAwayTeamName}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="results-cell">
                        <div className="score">{tip.finalHomeScore ?? '-'}</div>
                        <div className="score">{tip.finalAwayScore ?? '-'}</div>
                      </td>
                      <td className="tip-cell">
                        <span className={`tip-badge tip-${tip.oddDescription?.toLowerCase().replace(/\s+/g, '-')}`}>
                          {tip.oddDescription}
                        </span>
                      </td>
                      <td className="league-cell">
                        <div className="league-info">
                          <span className="league-abbr">@{tip.oddValue}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">No predictions available</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* VIP Wins Section */}
      <div className="vip-wins-section">
        <div className="section-header">
          <div className="header-title vip-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            <h2 className="vip-title">Latest VIP Wins</h2>
          </div>
        </div>

        <div className="vip-table-wrapper">
          {vipLoading ? (
            <div className="loading-state">Loading VIP wins...</div>
          ) : vipError ? (
            <div className="error-state">{vipError}</div>
          ) : (
            <table className="vip-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Teams</th>
                  <th>Results</th>
                  <th>Tip</th>
                  <th>Odds</th>
                </tr>
              </thead>
              <tbody>
                {vipWins.length > 0 ? (
                  vipWins.map((win, index) => (
                    <tr key={index}>
                      <td className="match-number">{index + 1}</td>
                      <td className="teams-cell">
                        <div className="vip-match-info">
                          <div className="vip-date">
                            {new Date(win.matchDate + ' ' + win.matchTime).toLocaleDateString('en-GB')}
                            <br />
                            <span className="vip-status">{win.actualMatchStatusShort || 'FT'}</span>
                          </div>
                          <div className="vip-teams">
                            <div className="vip-team">
                              {win.homeTeamLogo ? (
                                <img
                                  src={win.homeTeamLogo}
                                  alt={win.matchHomeTeamName}
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
                              <span>{win.matchHomeTeamName}</span>
                            </div>
                            <div className="vip-team">
                              {win.awayTeamLogo ? (
                                <img
                                  src={win.awayTeamLogo}
                                  alt={win.matchAwayTeamName}
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
                              <span>{win.matchAwayTeamName}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="results-cell">
                        <div className="score">{win.finalHomeScore ?? '-'}</div>
                        <div className="score">{win.finalAwayScore ?? '-'}</div>
                      </td>
                      <td className="tip-cell">
                        <span className="vip-tip-badge won">
                          {win.oddDescription}
                        </span>
                      </td>
                      <td className="league-cell">
                        <div className="league-info">
                          <span className="league-abbr">@{win.oddValue}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">No VIP wins available</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreeTipsAndWins;
