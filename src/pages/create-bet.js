import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchFixturesForBetCreator, createBetSlip } from '@/utils/api';
import { useRouter } from 'next/router';
import Head from 'next/head';
import '../styles/create-bet.css';

// Helper to remove diacritics from strings for API compatibility
const removeDiacritics = (str) => {
  if (typeof str !== 'string') {
    return str;
  }
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Debug logger function that can be enabled/disabled
const DEBUG = true;
const debug = (...args) => {
  if (DEBUG) {
    console.log('[BetCreator]', ...args);
  }
};

// Enhanced normalize odd description to handle all odd types
const normalizeOddDescription = (description, homeTeamName, awayTeamName) => {
  debug(`Normalizing odd description: '${description}' for ${homeTeamName} vs ${awayTeamName}`);

  // Exact matches for Over/Under
  const overUnderPattern = /^(Over|Under) (0\.5|1\.5|2\.5|3\.5|4\.5|5\.5|6\.5)$/;
  if (overUnderPattern.test(description)) {
      debug(`Normalized to (O/U): ${description}`);
      return description;
  }

  // Win/Draw/Away
  if (description === `${homeTeamName} (1)`) {
      debug("Normalized to: 1");
      return "1";
  }
  if (description === "Draw (X)") {
      debug("Normalized to: X");
      return "X";
  }
  if (description === `${awayTeamName} (2)`) {
      debug("Normalized to: 2");
      return "2";
  }

  // Double Chance (from display text)
  if (description === `${homeTeamName} or Draw`) {
      debug("Normalized to: 1X");
      return "1X";
  }
  if (description === `Draw or ${awayTeamName}`) {
      debug("Normalized to: X2");
      return "X2";
  }
  if (description === `${homeTeamName} or ${awayTeamName}`) {
      debug("Normalized to: 12");
      return "12";
  }
  
  // Fallback for descriptions that might come from other sources
  // More generic Over/Under check
  if (description.includes("Over ") || description.includes("Under ")) {
      const commonThresholds = ["0.5", "1.5", "2.5", "3.5", "4.5", "5.5", "6.5"];
      for (const threshold of commonThresholds) {
          if (description.toLowerCase() === `over ${threshold}`) return `Over ${threshold}`;
          if (description.toLowerCase() === `under ${threshold}`) return `Under ${threshold}`;
      }
  }

  // More generic double chance parsing
  const descLower = description.toLowerCase();
  const homeLower = homeTeamName ? homeTeamName.toLowerCase() : '';
  const awayLower = awayTeamName ? awayTeamName.toLowerCase() : '';
  
  if (descLower.includes("or draw") && (descLower.includes(homeLower) || descLower.startsWith("home"))) return "1X";
  if (descLower.includes("draw or") && (descLower.includes(awayLower) || descLower.endsWith("away"))) return "X2";
  if (homeLower && awayLower && descLower.includes(homeLower) && descLower.includes(awayLower) && descLower.includes("or")) return "12";
  if (descLower === "home/draw" || descLower === "home or draw") return "1X";
  if (descLower === "draw/away" || descLower === "draw or away") return "X2";
  if (descLower === "home/away" || descLower === "home or away") return "12";

  debug(`Odd description '${description}' did not match any normalization rules. Returning original.`);
  return description; // Fallback
};

// Convert normalized code to display text
const getDisplayText = (code, homeTeam, awayTeam) => {
  switch (code) {
    case "1": return `${homeTeam} (1)`;
    case "2": return `${awayTeam} (2)`;
    case "X": return "Draw (X)";
    case "1X": return `${homeTeam} or Draw`;
    case "X2": return `Draw or ${awayTeam}`;
    case "12": return `${homeTeam} or ${awayTeam}`;
    default:
      // Handle Over/Under markets
      if (code.startsWith("Over ") || code.startsWith("Under ")) {
        return code;
      }
      return code;
  }
};

// Group odds by category for better UI organization
const groupOddsByCategory = (fixture) => {
  debug('Grouping odds for fixture:', fixture.fixture_id);
  
  const groups = {
    mainMarkets: [
      {
        id: `${fixture.fixture_id}-1`,
        value: "1",
        displayText: `${fixture.home_team_name} (1)`,
        odd: fixture.bets_home
      },
      {
        id: `${fixture.fixture_id}-X`,
        value: "X",
        displayText: "Draw (X)",
        odd: fixture.bets_draw
      },
      {
        id: `${fixture.fixture_id}-2`,
        value: "2",
        displayText: `${fixture.away_team_name} (2)`,
        odd: fixture.bets_away
      }
    ],
    doubleChance: [],
    overUnder: []
  };

  // Add double chance markets if available
  if (fixture.double_chance_goals) {
    try {
      let doubleChanceOdds;
      
      // Handle both string and array formats
      if (typeof fixture.double_chance_goals === 'string') {
        debug('Parsing double chance odds from string:', fixture.double_chance_goals);
        doubleChanceOdds = JSON.parse(fixture.double_chance_goals);
      } else if (Array.isArray(fixture.double_chance_goals)) {
        debug('Using double chance odds array directly');
        doubleChanceOdds = fixture.double_chance_goals;
      } else {
        debug('Invalid double chance odds format:', typeof fixture.double_chance_goals);
        doubleChanceOdds = [];
      }
      
      if (Array.isArray(doubleChanceOdds)) {
        debug(`Found ${doubleChanceOdds.length} double chance markets`);
        
        doubleChanceOdds.forEach((dc, index) => {
          // Skip if odd or value is missing
          if (!dc.odd || !dc.value) {
            debug('Skipping invalid double chance market:', dc);
            return;
          }
          
          let normalizedValue = dc.value;
          let displayText = dc.value;
          
          // Map API values to normalized values
          if (dc.value === "Home/Draw") {
            normalizedValue = "1X";
            displayText = `${fixture.home_team_name} or Draw`;
          } else if (dc.value === "Home/Away") {
            normalizedValue = "12";
            displayText = `${fixture.home_team_name} or ${fixture.away_team_name}`;
          } else if (dc.value === "Draw/Away") {
            normalizedValue = "X2";
            displayText = `Draw or ${fixture.away_team_name}`;
          }
          
          debug('Added double chance market:', {
            id: `${fixture.fixture_id}-dc-${index}`,
            value: normalizedValue,
            displayText
          });
          
          groups.doubleChance.push({
            id: `${fixture.fixture_id}-dc-${index}`,
            value: normalizedValue,
            displayText: displayText,
            odd: dc.odd
          });
        });
      }
    } catch (e) {
      console.error("Error parsing double chance odds", e);
      debug('Error parsing double chance odds:', e.message);
    }
  }

  // Add over/under markets if available
  if (fixture.goals_over_under) {
    try {
      let overUnderOdds;
      
      // Handle both string and array formats
      if (typeof fixture.goals_over_under === 'string') {
        debug('Parsing over/under odds from string:', fixture.goals_over_under);
        overUnderOdds = JSON.parse(fixture.goals_over_under);
      } else if (Array.isArray(fixture.goals_over_under)) {
        debug('Using over/under odds array directly');
        overUnderOdds = fixture.goals_over_under;
      } else {
        debug('Invalid over/under odds format:', typeof fixture.goals_over_under);
        overUnderOdds = [];
      }
      
      if (Array.isArray(overUnderOdds)) {
        debug(`Found ${overUnderOdds.length} over/under markets`);
        
        // Sort the odds for better presentation (Over 0.5, Over 1.5, etc.)
        overUnderOdds.sort((a, b) => {
          // Extract the number from "Over X.X" or "Under X.X"
          const numA = parseFloat(a.value.replace(/^(Over|Under)\s+/, ""));
          const numB = parseFloat(b.value.replace(/^(Over|Under)\s+/, ""));
          
          // Compare by type (Over first, then Under) and then by number
          if (a.value.startsWith("Over") && b.value.startsWith("Under")) return -1;
          if (a.value.startsWith("Under") && b.value.startsWith("Over")) return 1;
          return numA - numB;
        });
        
        overUnderOdds.forEach((ou, index) => {
          // Skip if odd or value is missing
          if (!ou.odd || !ou.value) {
            debug('Skipping invalid over/under market:', ou);
            return;
          }
          
          debug('Added over/under market:', {
            id: `${fixture.fixture_id}-ou-${index}`,
            value: ou.value
          });
          
          groups.overUnder.push({
            id: `${fixture.fixture_id}-ou-${index}`,
            value: ou.value,
            displayText: ou.value,
            odd: ou.odd
          });
        });
      }
    } catch (e) {
      console.error("Error parsing over/under odds", e);
      debug('Error parsing over/under odds:', e.message);
    }
  }

  debug('Grouped odds summary:', {
    fixtureId: fixture.fixture_id,
    mainMarkets: groups.mainMarkets.length,
    doubleChance: groups.doubleChance.length,
    overUnder: groups.overUnder.length
  });
  
  return groups;
};

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);

const ErrorDisplay = ({ message, onRetry }) => (
  <div className="error-container">
    <h3 className="error-title">Something Went Wrong</h3>
    <p>{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="retry-button">
        Try Again
      </button>
    )}
  </div>
);

const OddsButton = ({ market, onSelect, isSelected }) => {
  if (!market?.odd || parseFloat(market.odd) === 0) return null;

  return (
    <button
      onClick={() => onSelect(market)}
      className={`odds-button ${isSelected ? 'selected' : ''}`}
    >
      <span className="market-name">{market.displayText}</span>
      <span className="odd-value">{market.odd}</span>
    </button>
  );
};

const FixtureCard = ({ fixture, onSelectOdd, selectedOdds }) => {
  const [expandedSection, setExpandedSection] = useState('mainMarkets');
  const oddGroups = useMemo(() => groupOddsByCategory(fixture), [fixture]);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const isOddSelected = (marketId) => {
    return selectedOdds.some(odd => odd.matchId === String(fixture.fixture_id) && odd.marketId === marketId);
  };

  const matchDateTime = new Date(fixture.date);
  const matchDateDisplay = matchDateTime.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const matchTimeDisplay = matchDateTime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // Format the match date in YYYY-MM-DD format for the API
  const matchDate = fixture.unformatedDate || new Date(fixture.date).toISOString().split('T')[0];
  
  // Format the match time in HH:MM:SS format for the API
  const matchTime = new Date(fixture.date).toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: false 
  });

  const handleSelectOdd = (market) => {
    onSelectOdd({
      matchId: String(fixture.fixture_id),
      marketId: market.id,
      matchHomeTeamName: fixture.home_team_name,
      matchAwayTeamName: fixture.away_team_name,
      oddCode: market.value,
      oddValue: String(market.odd),
      oddDisplayText: market.displayText,
      matchDate: matchDate,
      matchTime: matchTime,
    });
  };

  return (
    <div className="match-card">
      <div className="match-header">
        <div className="league-info">
          <img src={fixture.logo} alt={`${fixture.league_name} logo`} className="league-logo" />
          <div className="league-details">
            <span className="league-name">{fixture.league_name}</span>
            <span className="country-name">{fixture.country_name}</span>
          </div>
        </div>
        <div className="match-datetime">
          <span>{matchDateDisplay}</span>
          <span>{matchTimeDisplay}</span>
        </div>
      </div>

      <div className="match-body">
        <div className="team">
          <span className="team-name">{fixture.home_team_name}</span>
        </div>
        <div className="versus">vs</div>
        <div className="team">
          <span className="team-name">{fixture.away_team_name}</span>
        </div>
      </div>

      <div className="odds-container">
        {/* Main Markets */}
        <div className="odds-section">
          <div
            className="section-header"
            onClick={() => toggleSection('mainMarkets')}
          >
            <h4>Match Result</h4>
            <span className={`toggle-icon ${expandedSection === 'mainMarkets' ? 'expanded' : ''}`}>
              {expandedSection === 'mainMarkets' ? '−' : '+'}
            </span>
          </div>
          {expandedSection === 'mainMarkets' && (
            <div className="odds-grid">
              {oddGroups.mainMarkets.map(market => (
                <OddsButton
                  key={market.id}
                  market={market}
                  onSelect={handleSelectOdd}
                  isSelected={isOddSelected(market.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Double Chance */}
        {oddGroups.doubleChance.length > 0 && (
          <div className="odds-section">
            <div 
              className="section-header"
              onClick={() => toggleSection('doubleChance')}
            >
              <h4>Double Chance</h4>
              <span className={`toggle-icon ${expandedSection === 'doubleChance' ? 'expanded' : ''}`}>
                {expandedSection === 'doubleChance' ? '−' : '+'}
              </span>
            </div>
            
            {expandedSection === 'doubleChance' && (
              <div className="odds-grid">
                {oddGroups.doubleChance.map(market => (
                  <OddsButton
                    key={market.id}
                    market={market}
                    onSelect={handleSelectOdd}
                    isSelected={isOddSelected(market.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Over/Under */}
        {oddGroups.overUnder.length > 0 && (
          <div className="odds-section">
            <div 
              className="section-header"
              onClick={() => toggleSection('overUnder')}
            >
              <h4>Goals Over/Under</h4>
              <span className={`toggle-icon ${expandedSection === 'overUnder' ? 'expanded' : ''}`}>
                {expandedSection === 'overUnder' ? '−' : '+'}
              </span>
            </div>
            
            {expandedSection === 'overUnder' && (
              <div className="odds-grid odds-grid-wrap">
                {oddGroups.overUnder.map(market => (
                  <OddsButton
                    key={market.id}
                    market={market}
                    onSelect={handleSelectOdd}
                    isSelected={isOddSelected(market.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const MessageDisplay = ({ message, onDismiss }) => {
  if (!message) return null;
  
  return (
    <div className={`message-container ${message.type}`}>
      <div className="message-content">
        <span className="message-text">{message.text}</span>
        {onDismiss && (
          <button 
            className="message-dismiss" 
            onClick={onDismiss}
            aria-label="Dismiss message"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

const FloatingBetBuilder = ({ slip, onRemove, stake, onStakeChange, isPremium, onPremiumChange, onSubmit, submitting, userId, onUserChange, users, submitMessage, isVisible, onToggle, onDismissMessage }) => {
  const totalOdds = useMemo(() => slip.reduce((total, item) => total * parseFloat(item.oddValue), 1), [slip]);
  const potentialReturn = useMemo(() => totalOdds * stake, [totalOdds, stake]);

  return (
    <>
      <div className={`bet-slip ${isVisible ? 'active' : ''}`}>
        <div className="bet-slip-header">
          <h2 className="bet-slip-title">Bet Builder</h2>
          <div className="bet-slip-actions">
            <span className="selections-count">{slip.length} Selection{slip.length !== 1 ? 's' : ''}</span>
            <button className="close-button" onClick={onToggle}>×</button>
          </div>
        </div>
        
        <MessageDisplay 
          message={submitMessage} 
          onDismiss={onDismissMessage} 
        />

        <div className="bet-slip-content">
          {slip.length === 0 ? (
            <div className="empty-slip">
              <p>Your selections will appear here</p>
            </div>
          ) : (
            slip.map(item => (
              <div key={item.marketId} className="selection-item">
                <div className="selection-header">
                  <div className="selection-teams">
                    {item.matchHomeTeamName} vs {item.matchAwayTeamName}
                  </div>
                  <button 
                    onClick={() => onRemove(item.matchId, item.marketId)}
                    className="remove-selection"
                    aria-label="Remove selection"
                  >
                    ×
                  </button>
                </div>
                <div className="selection-details">
                  <span className="selection-type">
                    {item.oddDisplayText}
                  </span>
                  <span className="odds-value">{item.oddValue}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {slip.length > 0 && (
          <div className="bet-slip-footer">
            <div className="stake-container">
              <label>User Account</label>
              <select
                value={userId}
                onChange={e => onUserChange(e.target.value)}
                className="stake-input"
              >
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>

            <div className="stake-container">
              <label>Stake (KES)</label>
              <div className="stake-controls">
                <button 
                  onClick={() => onStakeChange(Math.max(1000, stake - 1000))}
                  className="stake-button"
                >
                  -
                </button>
                <input
                  type="number"
                  value={stake}
                  onChange={e => {
                    const value = parseInt(e.target.value, 10);
                    onStakeChange(isNaN(value) || value < 1000 ? 1000 : Math.floor(value / 1000) * 1000);
                  }}
                  className="stake-input"
                />
                <button 
                  onClick={() => onStakeChange(stake + 1000)}
                  className="stake-button"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bet-summary">
              <div className="total-odds">
                <span>Total Odds</span>
                <span className="value">{totalOdds.toFixed(2)}</span>
              </div>

              <div className="potential-return">
                <span>Potential Return</span>
                <span className="value">
                  KES {potentialReturn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="premium-option">
              <input
                type="checkbox"
                checked={isPremium}
                onChange={e => onPremiumChange(e.target.checked)}
                id="premium-checkbox"
              />
              <label htmlFor="premium-checkbox">
                Mark as Premium
              </label>
            </div>

            <button
              onClick={onSubmit}
              disabled={totalOdds <  1.50|| submitting || slip.length === 0}
              className="place-bet-button"
            >
              {submitting ? 'Placing Bet...' : (
                slip.length === 0 ? 'Select matches' : 
                totalOdds < 1.50 ? 'Minimum odds: 1.50' : 
                'Place Bet'
              )}
            </button>
          </div>
        )}
      </div>
      
      {!isVisible && slip.length > 0 && (
        <button className="floating-bet-button" onClick={onToggle}>
          <span className="bet-count">{slip.length}</span>
          <span>View Bet Builder</span>
          <span className="bet-odds">{totalOdds.toFixed(2)}</span>
        </button>
      )}
    </>
  );
};

export default function CreateBetPage() {
  const router = useRouter();
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [betSlip, setBetSlip] = useState([]);
  const [stake, setStake] = useState(1000);
  const [isPremium, setIsPremium] = useState(false);
  const [userId, setUserId] = useState('u5JbxPmOLCYa6LjiazTN5YyMer73');
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBetSlipVisible, setIsBetSlipVisible] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const users = useMemo(() => [
    { id: 'Ps50RNZiw0dtDMhztdJcvUKSZ223', name: 'Benson' },
    { id: 'SMy9NVG0E1Rkhd9ZwxBlqTzhqug2', name: 'Bet Of the Day' },
    { id: 'ehXPwhoyVBY6mkoKsRzS9AY9Sww2', name: 'Dan Sef' },
    { id: '7tv8gBiRoVUk6Hf3ObWmvgmcBfb2', name: 'Lucy Gaserii' },
    { id: 'B9EVefAqnjdy1LXHSYsQbVuPerH3', name: 'Sportpesa Mega Jackpot Predictions' },
    { id: 'BAVDsUiNgLQpR19h061Suj42bDu1', name: 'Glen Williams' },
  ], []);

  // Dismiss message handler
  const dismissMessage = useCallback(() => {
    setSubmitMessage(null);
  }, []);

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      // The middleware will handle the authentication
      // If we reach this point, we're authenticated
      setIsAuthenticated(true);
      
      // Handle bet slip visibility on resize
      const mediaQuery = window.matchMedia('(min-width: 1024px)');
      const handleResize = () => {
        setIsBetSlipVisible(mediaQuery.matches);
      };
      handleResize(); // Set initial state
      mediaQuery.addEventListener('change', handleResize);
      return () => mediaQuery.removeEventListener('change', handleResize);
    }
  }, []);

  const loadFixtures = useCallback(async () => {
    if (!isAuthenticated) return;
    
    debug('Loading fixtures for bet creator');
    setLoading(true);
    setError(null);
    try {
      const dateToFetch = selectedDate.toLocaleDateString('en-CA');
      
      debug('Fetching fixtures for date:', dateToFetch);
      const response = await fetchFixturesForBetCreator(dateToFetch);
      
      debug('Received fixtures response:', {
        status: response.status,
        fixturesCount: response.fixtures?.length || 0,
        message: response.message
      });
      
      if (response.status && Array.isArray(response.fixtures)) {
        if (response.fixtures.length === 0) {
          setFixtures([]);
          setError('No fixtures found for the selected date. Please try another date.');
        } else {
          debug('Successfully loaded fixtures:', response.fixtures.length);
          setFixtures(response.fixtures);
        }
      } else {
        setFixtures([]);
        debug('Failed to load fixtures:', response.message);
        setError(response.message || 'Failed to load fixtures.');
      }
    } catch (err) {
      console.error("Error loading fixtures:", err);
      debug('Exception while loading fixtures:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      
      if (err.response?.status === 401) {
        debug('Unauthorized access, redirecting to login');
        router.push('/login');
        return;
      }
      setFixtures([]);
      setError(err.message || 'An error occurred while fetching fixtures.');
    } finally {
      setLoading(false);
      debug('Finished loading fixtures');
    }
  }, [isAuthenticated, selectedDate, router]);

  useEffect(() => {
    loadFixtures();
  }, [loadFixtures]);

  const filteredFixtures = useMemo(() => {
    if (!searchQuery) return fixtures;
    const query = searchQuery.toLowerCase();
    return fixtures.filter(fixture =>
      fixture.home_team_name?.toLowerCase().includes(query) ||
      fixture.away_team_name?.toLowerCase().includes(query) ||
      fixture.league_name?.toLowerCase().includes(query)
    );
  }, [fixtures, searchQuery]);

  const handleSelectOdd = useCallback((selection) => {
    setBetSlip(currentSlip => {
      const existingIndex = currentSlip.findIndex(item => 
        item.matchId === selection.matchId && item.marketId === selection.marketId
      );
      
      if (existingIndex >= 0) {
        // Remove if already selected
        return currentSlip.filter((_, index) => index !== existingIndex);
      }
      
      // Check if another market from the same match is already selected
      const hasOtherMarketFromSameMatch = currentSlip.some(item => 
        item.matchId === selection.matchId && item.marketId !== selection.marketId
      );
      
      if (hasOtherMarketFromSameMatch) {
        // Replace the existing selection for this match
        return currentSlip.map(item => 
          item.matchId === selection.matchId ? selection : item
        );
      }
      
      // Add new selection
      return [...currentSlip, selection];
    });
    
    // Show bet slip when adding selections
    if (!isBetSlipVisible) {
      setIsBetSlipVisible(true);
    }
    
    // Clear any previous error messages
    if (submitMessage?.type === 'error') {
      setSubmitMessage(null);
    }
  }, [isBetSlipVisible, submitMessage]);

  const handleRemoveFromSlip = useCallback((matchId, marketId) => {
    setBetSlip(currentSlip => currentSlip.filter(item => !(item.matchId === matchId && item.marketId === marketId)));
  }, []);

  const toggleBetSlip = useCallback(() => {
    setIsBetSlipVisible(prev => !prev);
  }, []);

  const handleRetry = () => {
    loadFixtures();
  };

  const handleSubmitBet = async () => {
    if (!isAuthenticated) {
      setSubmitMessage({ type: 'error', text: 'Please log in to place bets.' });
      return;
    }

    const totalOdds = betSlip.reduce((total, item) => total * parseFloat(item.oddValue), 1);
    if (totalOdds < 1.50) {
      setSubmitMessage({ type: 'error', text: 'Minimum total odds must be at least 1.80.' });
      return;
    }
    
    if (betSlip.length === 0) {
      setSubmitMessage({ type: 'error', text: 'Please select at least one match to place a bet.' });
      return;
    }
    
    debug('Starting bet submission process');
    setSubmitting(true);
    setSubmitMessage(null);

    try {
      // Generate a unique ID for the bet slip
      const betSlipId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : `bet_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      debug('Generated betSlipId:', betSlipId);
      
      // Normalize selections to match the API's expected format
      const normalizedSelections = betSlip.map(selection => {
        // Get the display text for this odd
        const rawOddDescription = selection.oddDisplayText || getDisplayText(
          selection.oddCode, 
          selection.matchHomeTeamName, 
          selection.matchAwayTeamName
        );

        const oddDescription = normalizeOddDescription(
          rawOddDescription,
          selection.matchHomeTeamName,
          selection.matchAwayTeamName
        );
        
        debug('Normalized selection:', {
          original: selection,
          rawOddDescription,
          finalOddDescription: oddDescription
        });
        
        const sanitizedHomeTeamName = removeDiacritics(selection.matchHomeTeamName);
        const sanitizedAwayTeamName = removeDiacritics(selection.matchAwayTeamName);

        debug('Sanitized team names for API:', {
          home: sanitizedHomeTeamName,
          away: sanitizedAwayTeamName
        });
        
        // Format data according to BetSlipSelectionItemInternalDto
        return {
          matchId: selection.matchId,
          matchHomeTeamName: sanitizedHomeTeamName,
          matchAwayTeamName: sanitizedAwayTeamName,
          oddDescription: oddDescription,
          oddValue: selection.oddValue,
          matchDate: selection.matchDate,
          matchTime: selection.matchTime
        };
      });
      
      // Prepare data according to CreateBetSlipRequest
      const betSlipData = {
        userId,
        selections: normalizedSelections,
        stake: parseFloat(stake),
        totalOdds: parseFloat(totalOdds.toFixed(2)),
        potentialReturn: parseFloat((totalOdds * stake).toFixed(2)),
        isPremium: isPremium,
        betSlipId,
        timestamp: Date.now()
      };
      
      debug('Submitting bet slip data:', JSON.stringify(betSlipData, null, 2));
      
      const result = await createBetSlip(betSlipData);
      
      debug('API response:', result);
      
      setSubmitMessage({ 
        type: 'success', 
        text: `Bet slip created successfully! ID: ${result.betSlipId || betSlipId}` 
      });
      setBetSlip([]);
      setStake(1000);
      setIsPremium(false);
    } catch (error) {
      console.error('Error creating bet slip:', error);
      debug('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      
      // Handle different error types with user-friendly messages
      let errorMessage = 'Failed to create bet slip. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
        router.push('/login');
      } else if (error.message) {
        // Use the error message from the API if available
        errorMessage = `Error: ${error.message}`;
      }
      
      setSubmitMessage({ type: 'error', text: errorMessage });
    } finally {
      setSubmitting(false);
      // Clear success messages after 5 seconds, but leave error messages
      if (submitMessage?.type === 'success') {
        setTimeout(() => setSubmitMessage(null), 5000);
      }
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    if (newDate) {
      setSelectedDate(new Date(newDate + 'T00:00:00'));
    }
  };

  return (
    <>
      <Head>
        <title>Create Bet - SokaPulse</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="creator-page-container">
        <header className="creator-header">
          <h1 className="creator-title">Bet Creator</h1>
          <p className="creator-subtitle">Build and place your bets on upcoming matches.</p>
        </header>

        <div className="creator-content-area">
          <div className="fixtures-column">
            <div className="controls-container">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search teams or leagues..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="date-picker-container">
                <input
                  type="date"
                  value={selectedDate.toLocaleDateString('en-CA')}
                  onChange={handleDateChange}
                  className="date-picker-input"
                />
              </div>
            </div>

            {!isAuthenticated ? (
              <div className="auth-container">
                <div className="auth-content">
                  <h2>Authentication Required</h2>
                  <p>Please log in to access the bet creator.</p>
                  <div className="credentials-box">
                    <p>Default credentials:</p>
                    <p>Username: <span>okiora</span></p>
                    <p>Password: <span>@_b_e_n_b_e_n_</span></p>
                  </div>
                </div>
              </div>
            ) : loading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorDisplay message={error} onRetry={handleRetry} />
            ) : filteredFixtures.length === 0 ? (
              <div className="no-fixtures">
                <p>No fixtures found. Try changing your search criteria or select another date.</p>
              </div>
            ) : (
              <div className="fixtures-grid">
                {filteredFixtures.map(fixture => (
                  <FixtureCard
                    key={fixture.fixture_id}
                    fixture={fixture}
                    onSelectOdd={handleSelectOdd}
                    selectedOdds={betSlip}
                  />
                ))}
              </div>
            )}
          </div>

          {isAuthenticated && (
            <div className="bet-slip-column">
              <FloatingBetBuilder
                slip={betSlip}
                onRemove={handleRemoveFromSlip}
                stake={stake}
                onStakeChange={setStake}
                isPremium={isPremium}
                onPremiumChange={setIsPremium}
                onSubmit={handleSubmitBet}
                submitting={submitting}
                userId={userId}
                onUserChange={setUserId}
                users={users}
                submitMessage={submitMessage}
                isVisible={isBetSlipVisible}
                onToggle={toggleBetSlip}
                onDismissMessage={dismissMessage}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
} 