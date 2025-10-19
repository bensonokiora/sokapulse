'use client';

import { useState, useEffect } from 'react';
import { fetchPremiumTipsters } from '@/utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import './PremiumBetSlips.css';

export default function PremiumBetSlips({ isLocked = true }) {
  const [betSlips, setBetSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchBetSlips = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPremiumTipsters(selectedDate);

        if (Array.isArray(data)) {
          // Group by betSlipId (data is already grouped from API)
          setBetSlips(data);
        } else {
          setBetSlips([]);
        }
      } catch (err) {
        console.error('Error fetching premium bet slips:', err);
        setError('Failed to load premium bet slips');
        setBetSlips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBetSlips();
  }, [selectedDate]);

  const shortenOddDescription = (oddDesc) => {
    if (!oddDesc) return oddDesc;

    // Handle Over/Under patterns
    const overMatch = oddDesc.match(/Over\s+(\d+\.?\d*)/i);
    if (overMatch) {
      return `OV${overMatch[1].replace('.', '')}`;
    }

    const underMatch = oddDesc.match(/Under\s+(\d+\.?\d*)/i);
    if (underMatch) {
      return `UN${underMatch[1].replace('.', '')}`;
    }

    // Handle GG/NG
    if (oddDesc.match(/Both.*Score.*Yes/i) || oddDesc.match(/^GG$/i)) return 'GG';
    if (oddDesc.match(/Both.*Score.*No/i) || oddDesc.match(/^NG$/i)) return 'NG';

    // Handle Home/Away/Draw
    if (oddDesc === '1' || oddDesc.toLowerCase() === 'home') return '1';
    if (oddDesc === 'X' || oddDesc.toLowerCase() === 'draw') return 'X';
    if (oddDesc === '2' || oddDesc.toLowerCase() === 'away') return '2';

    return oddDesc;
  };

  if (loading) {
    return (
      <div className="premium-betslips">
        <div className="betslips-header">
          <h2 className="betslips-title">VIP Bet Slips</h2>
        </div>
        <div className="loading-state">Loading VIP bet slips...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="premium-betslips">
        <div className="betslips-header">
          <h2 className="betslips-title">VIP Bet Slips</h2>
        </div>
        <div className="error-state">{error}</div>
      </div>
    );
  }

  return (
    <div className="premium-betslips">
      <div className="betslips-header">
        <h2 className="betslips-title">
          <FontAwesomeIcon icon={faCalendarAlt} /> VIP Bet Slips
        </h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-picker"
        />
      </div>

      {betSlips.length === 0 ? (
        <div className="no-data">No VIP bet slips available for this date</div>
      ) : (
        <div className="betslips-grid">
          {betSlips.map((betSlip, index) => (
            <div key={betSlip.betSlipId} className="betslip-card">
              {/* Anonymized Tipster Info */}
              <div className="tipster-info">
                <div className="tipster-avatar-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                    <path d="M4 22h16"></path>
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                  </svg>
                </div>
                <div className="tipster-details">
                  <div className="tipster-name">Bet Slip {index + 1}</div>
                </div>
              </div>

              {/* Bet Slip Summary */}
              <div className="betslip-summary">
                <div className="summary-item">
                  <span className="summary-label">Stake:</span>
                  <span className="summary-value">{betSlip.stake.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total Odds:</span>
                  <span className="summary-value odds-value">{betSlip.totalOdds.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Potential Return:</span>
                  <span className="summary-value return-value">{betSlip.potentialReturn.toLocaleString()}</span>
                </div>
              </div>

              {/* Selections */}
              {isLocked ? (
                <div className="locked-selections">
                  <FontAwesomeIcon icon={faLock} className="lock-icon" />
                  <div className="locked-text">
                    <strong>{betSlip.selections.length} Selections</strong>
                    <p>Subscribe to view full bet slip</p>
                  </div>
                  <button className="unlock-btn">Unlock Now</button>
                </div>
              ) : (
                <div className="selections-list">
                  <div className="selections-header">Selections ({betSlip.selections.length})</div>
                  {betSlip.selections.map((selection, index) => (
                    <div key={index} className="selection-item">
                      <div className="selection-teams">
                        <div className="team-logos">
                          {selection.homeTeamLogo && (
                            <img src={selection.homeTeamLogo} alt={selection.matchHomeTeamName} className="team-logo" />
                          )}
                          <span className="vs">vs</span>
                          {selection.awayTeamLogo && (
                            <img src={selection.awayTeamLogo} alt={selection.matchAwayTeamName} className="team-logo" />
                          )}
                        </div>
                        <div className="teams-text">
                          {selection.matchHomeTeamName} vs {selection.matchAwayTeamName}
                        </div>
                      </div>
                      <div className="selection-prediction">
                        <span className="prediction-badge">{shortenOddDescription(selection.oddDescription)}</span>
                        <span className="prediction-odds">@{selection.oddValue}</span>
                      </div>
                      <div className="selection-time">
                        {new Date(selection.matchDate + ' ' + selection.matchTime).toLocaleDateString('en-GB')} {selection.matchTime?.substring(0, 5)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Status Badge */}
              <div className={`betslip-status status-${betSlip.betSlipOutcome.toLowerCase()}`}>
                {betSlip.betSlipOutcome}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
