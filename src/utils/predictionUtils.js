/**
 * Utility functions for football match predictions
 * Shared between today and tomorrow prediction pages
 */

/**
 * Calculate expected goals for a fixture based on team performance
 * @param {Object} fixture - The fixture data
 * @returns {number} - Expected total goals
 */
export const calculateExpectedGoals = (fixture) => {
  try {
    // Team's offensive strength (goals scored)
    const homeGoalsFor = parseInt(fixture.teams_perfomance_home_for || 0);
    const awayGoalsFor = parseInt(fixture.teams_perfomance_away_for || 0);
    
    // Team's defensive record (goals conceded)
    const homeGoalsAgainst = parseInt(fixture.teams_perfomance_home_aganist || 0);
    const awayGoalsAgainst = parseInt(fixture.teams_perfomance_away_aganist || 0);
    
    // Games played
    const homeGamesPlayed = parseInt(fixture.teams_games_played_home || 1);
    const awayGamesPlayed = parseInt(fixture.teams_games_played_away || 1);
    
    // Offensive stats per game
    const homeGoalsPerGame = homeGoalsFor / homeGamesPlayed;
    const awayGoalsPerGame = awayGoalsFor / awayGamesPlayed;
    
    // Defensive stats per game
    const homeGoalsConcededPerGame = homeGoalsAgainst / homeGamesPlayed;
    const awayGoalsConcededPerGame = awayGoalsAgainst / awayGamesPlayed;
    
    // Calculate expected goals based on both offensive and defensive stats
    // Home team expected goals = home team scoring rate * away team conceding rate
    const homeExpectedGoals = (homeGoalsPerGame * (awayGoalsConcededPerGame / 1.1));
    
    // Away team expected goals = away team scoring rate * home team conceding rate
    const awayExpectedGoals = (awayGoalsPerGame * (homeGoalsConcededPerGame / 0.9));
    
    // Total expected goals with slight adjustment for home advantage
    const totalExpectedGoals = homeExpectedGoals + awayExpectedGoals;
    
    // Check edge cases
    if (isNaN(totalExpectedGoals) || totalExpectedGoals <= 0) {
      return 2.5; // Default fallback
    }
    
    return totalExpectedGoals;
  } catch (error) {
    console.error('Error calculating expected goals:', error);
    return 2.5; // Default fallback
  }
};

/**
 * Calculate under/over probabilities for a fixture
 * @param {Object} fixture - The fixture data
 * @returns {Array} - Array with [underProb, overProb]
 */
export const calculateProbabilities = (fixture) => {
  try {
    // Parse odds
    const goalsOverUnder = fixture.goals_over_under ? JSON.parse(fixture.goals_over_under) : [];
    const over25 = goalsOverUnder.find(odd => odd.value === "Over 2.5");
    const under25 = goalsOverUnder.find(odd => odd.value === "Under 2.5");

    if (!over25 || !under25) return [50, 50];

    // Calculate expected goals with our enhanced method
    const expectedGoals = calculateExpectedGoals(fixture);

    // Calculate base probabilities from odds
    const over25Odd = parseFloat(over25.odd);
    const under25Odd = parseFloat(under25.odd);
    
    const overProb = (1 / over25Odd);
    const underProb = (1 / under25Odd);
    const totalProb = overProb + underProb;

    // Calculate initial probabilities (bookmaker implied probability)
    let marketOverProb = Math.round((overProb / totalProb) * 100);
    
    // Create our own model probability based on expected goals
    let modelOverProb;
    
    // Use Poisson-based probability for over/under 2.5 goals
    if (expectedGoals < 1.8) {
      modelOverProb = 30; // Very low scoring
    } else if (expectedGoals < 2.2) {
      modelOverProb = 40; // Low scoring
    } else if (expectedGoals < 2.6) {
      modelOverProb = 50; // Average scoring
    } else if (expectedGoals < 3.0) {
      modelOverProb = 60; // Above average scoring
    } else if (expectedGoals < 3.5) {
      modelOverProb = 70; // High scoring
    } else {
      modelOverProb = 80; // Very high scoring
    }
    
    // Combine market probability and model probability (60-40 split)
    // Market odds are still the most predictive factor
    let finalOverProb = Math.round((marketOverProb * 0.6) + (modelOverProb * 0.4));
    
    // Final adjustments to ensure reasonable bounds
    finalOverProb = Math.min(Math.max(finalOverProb, 20), 80);
    const finalUnderProb = 100 - finalOverProb;

    return [finalUnderProb, finalOverProb];
  } catch (error) {
    console.error('Error calculating probabilities:', error);
    return [50, 50];
  }
};

/**
 * Get under/over prediction for a fixture
 * @param {Object} fixture - The fixture data
 * @returns {Array} - Array with [prediction, odds, expectedGoals]
 */
export const getUnderOverPrediction = (fixture) => {
  try {
    // Use avg_performance from API instead of calculating expected goals
    // Convert to number to ensure it's not a string
    const expectedGoals = fixture.avg_performance ? parseFloat(fixture.avg_performance) : calculateExpectedGoals(fixture);

    // Parse odds
    const goalsOverUnder = fixture.goals_over_under ? JSON.parse(fixture.goals_over_under) : [];
    
    // Get multiple over/under lines for better prediction
    const over15 = goalsOverUnder.find(odd => odd.value === "Over 1.5");
    const under15 = goalsOverUnder.find(odd => odd.value === "Under 1.5");
    const over25 = goalsOverUnder.find(odd => odd.value === "Over 2.5");
    const under25 = goalsOverUnder.find(odd => odd.value === "Under 2.5");
    const over35 = goalsOverUnder.find(odd => odd.value === "Over 3.5");
    const under35 = goalsOverUnder.find(odd => odd.value === "Under 3.5");

    if (!over25 || !under25) return ['Under', 2.0, expectedGoals];

    const over25Odd = parseFloat(over25.odd);
    const under25Odd = parseFloat(under25.odd);
    
    // Calculate market implied probabilities with margin adjustment
    const overProb = (1 / over25Odd);
    const underProb = (1 / under25Odd);
    const totalProb = overProb + underProb;
    
    // Remove bookmaker margin to get fair probabilities
    const fairOverProb = (overProb / totalProb) * 100;
    const fairUnderProb = (underProb / totalProb) * 100;

    // Calculate additional market signals if available
    let overUnderConfidence = 0;
    
    if (over15 && under15 && over35 && under35) {
      const over15Odd = parseFloat(over15.odd);
      const under15Odd = parseFloat(under15.odd);
      const over35Odd = parseFloat(over35.odd);
      const under35Odd = parseFloat(under35.odd);
      
      // Analyze if odds are balanced across different goal lines
      // Low over1.5 odds suggest 2+ goals are likely
      const confidentOver15 = over15Odd < 1.40;
      // Low under3.5 odds suggest 3- goals are likely
      const confidentUnder35 = under35Odd < 1.40;
      
      // Check additional confidence factors
      if (confidentOver15 && confidentUnder35) {
        // Strong indication for 2-3 goals (perfect for over 2.5)
        overUnderConfidence = expectedGoals > 2.5 ? 10 : -10;
      }
    }

    // Make prediction based on multiple factors
    let prediction;
    let confidenceScore = 0;
    
    // Factor 1: Expected goals (most important)
    if (expectedGoals > 2.8) confidenceScore += 15;
    else if (expectedGoals > 2.5) confidenceScore += 10;
    else if (expectedGoals < 2.2) confidenceScore -= 15;
    else if (expectedGoals < 2.5) confidenceScore -= 10;
    
    // Factor 2: Market implied probability
    if (fairOverProb > 60) confidenceScore += 10;
    else if (fairOverProb > 52) confidenceScore += 5;
    else if (fairOverProb < 40) confidenceScore -= 10;
    else if (fairOverProb < 48) confidenceScore -= 5;
    
    // Factor 3: Add our additional confidence factor
    confidenceScore += overUnderConfidence;
    
    // Make final prediction
    if (confidenceScore > 0) {
      prediction = 'Over';
    } else if (confidenceScore < 0) {
      prediction = 'Under';
    } else {
      // If tied, defer to expected goals
      prediction = expectedGoals > 2.5 ? 'Over' : 'Under';
    }

    return [prediction, prediction === 'Over' ? over25Odd : under25Odd, expectedGoals];
  } catch (error) {
    console.error('Error in getUnderOverPrediction:', error);
    return ['Under', 2.0, 2.5];
  }
};

/**
 * Calculate confidence level for under/over prediction
 * @param {number} underProb - Under probability percentage
 * @param {number} overProb - Over probability percentage
 * @returns {Object} - Object with confidenceLevel, confidenceText, and confidenceColor
 */


export const calculateConfidenceLevel = (underProb, overProb) => {
  const confidenceLevel = Math.abs(overProb - underProb);
  let confidenceText = "Medium";
  let confidenceColor = "#f0ad4e"; // Yellow/Orange
  
  if (confidenceLevel >= 30) {
    confidenceText = "High";
    confidenceColor = "#5cb85c"; // Green
  } else if (confidenceLevel <= 15) {
    confidenceText = "Low";
    confidenceColor = "#d9534f"; // Red
  }
  
  return {
    confidenceLevel,
    confidenceText,
    confidenceColor
  };
};


/**
 * Utility functions for 1X2 football match predictions
 * Shared between prediction pages
 */

/**
 * Get 1X2 prediction based on probabilities
 * @param {string|number} home - Home win probability
 * @param {string|number} draw - Draw probability
 * @param {string|number} away - Away win probability
 * @returns {string} - Prediction (1, X, or 2)
 */
export function getPrediction(home, draw, away) {
  // Handle null or undefined values
  if (home === null || home === undefined || 
      draw === null || draw === undefined || 
      away === null || away === undefined) {
    return "X"; // Default prediction
  }

  const homeProb = parseInt(home) || 0;
  const drawProb = parseInt(draw) || 0;
  const awayProb = parseInt(away) || 0;

  // If home has highest probability
  if (homeProb > drawProb && homeProb > awayProb) {
    return "1";
  }
  // If away has highest probability
  else if (awayProb > homeProb && awayProb > drawProb) {
    return "2";
  }
  // If draw has highest probability
  else if (drawProb > homeProb && drawProb > awayProb) {
    return "X";
  }
  // If there's a tie between probabilities, prioritize based on odds
  else {
    if (homeProb === awayProb && homeProb > drawProb) {
      return "1"; // Default to home when equal
    } else if (homeProb === drawProb && homeProb > awayProb) {
      return "1"; // Default to home when equal
    } else if (drawProb === awayProb && drawProb > homeProb) {
      return "X"; // Default to draw in this case
    }
    return "X"; // Default case
  }
}

/**
 * Get highest probability outcome
 * @param {string|number} home - Home win probability
 * @param {string|number} draw - Draw probability
 * @param {string|number} away - Away win probability
 * @returns {string} - Highest probability outcome ('home', 'draw', or 'away')
 */
export function getHighestProbability(home, draw, away) {
  // Handle null or undefined values
  if (home === null || home === undefined || 
      draw === null || draw === undefined || 
      away === null || away === undefined) {
    return 'draw'; // Default outcome
  }

  const homeProb = parseInt(home) || 0;
  const drawProb = parseInt(draw) || 0;
  const awayProb = parseInt(away) || 0;
  
  if (homeProb >= drawProb && homeProb >= awayProb) return 'home';
  if (drawProb >= homeProb && drawProb >= awayProb) return 'draw';
  return 'away';
}

/**
 * Validate prediction for 1X2 result
 * @param {string} prediction - The prediction to validate (1, X, or 2)
 * @param {Object} scores - Object containing match scores
 * @param {string} status - Match status
 * @param {Object} fixture - The fixture object with goals_home and goals_away
 * @returns {Object} - Style object based on prediction result
 */
export function validatePrediction(prediction, scores, status, fixture) {
  // Handle null or undefined values
  if (!prediction || !status) {
    return {
      backgroundColor: 'rgb(255, 180, 0)',
      color: 'white',
      border: 'none'
    };
  }

  // Check if the match is finished
  if (status !== "FT" && status !== "AET" && 
      status !== "Match Finished" && status !== "Match Finished After Extra Time") {
    return {
      backgroundColor: 'rgb(255, 180, 0)',
      color: 'white',
      border: 'none'
    };
  }

  // Use goals_home and goals_away if fixture is provided
  let homeScore, awayScore;
  
  if (fixture && fixture.goals_home !== undefined && fixture.goals_away !== undefined) {
    homeScore = parseInt(fixture.goals_home || 0);
    awayScore = parseInt(fixture.goals_away || 0);
  } else {
    // Fallback to scores.fulltime if fixture is not provided
    homeScore = parseInt(scores.fulltime?.home || 0);
    awayScore = parseInt(scores.fulltime?.away || 0);
  }

  let predictionCorrect = false;

  switch (prediction) {
    case "1":
      predictionCorrect = homeScore > awayScore;
      break;
    case "2":
      predictionCorrect = awayScore > homeScore;
      break;
    case "X":
      predictionCorrect = homeScore === awayScore;
      break;
    default:
      break;
  }

  if (predictionCorrect) {
    return {
      backgroundColor: 'green',
      color: 'white',
      border: 'none'
    };
  }

  // For incorrect predictions
  return {
    backgroundColor: 'white',
    color: 'red',
    border: '1px solid red'
  };
}

/**
 * Get Both Teams To Score (BTTS) prediction for a fixture with confidence score
 * @param {Object} fixture - The fixture data
 * @returns {Object} - Object with prediction, odds, probabilities, and confidence info
 */
export const getBothTeamToScorePrediction = (fixture) => {
  try {
    // Get probabilities using our enhanced method
    const [noProb, yesProb] = calculateBttsProbabilities(fixture);
    
    // Parse odds data
    let bttsYesOdd = 0;
    let bttsNoOdd = 0;
    
    if (fixture.both_teams_score) {
      const bothTeamsScore = JSON.parse(fixture.both_teams_score);
      const bttsYes = bothTeamsScore.find(odd => odd.value === "Yes");
      const bttsNo = bothTeamsScore.find(odd => odd.value === "No");
      
      if (bttsYes && bttsYes.odd) {
        bttsYesOdd = parseFloat(bttsYes.odd);
      }
      
      if (bttsNo && bttsNo.odd) {
        bttsNoOdd = parseFloat(bttsNo.odd);
      }
    }
    
    // Make prediction
    const prediction = yesProb > 50 ? 'Yes' : 'No';
    
    // Get the odds based on prediction
    const odds = prediction === 'Yes' ? bttsYesOdd : bttsNoOdd;
    
    // Calculate confidence score
    const confidenceInfo = calculateConfidenceLevel(noProb, yesProb, fixture, bttsYesOdd, bttsNoOdd);
    
    return {
      prediction,
      odds,
      noProb,
      yesProb,
      confidenceScore: confidenceInfo.confidenceScore,
      confidenceText: confidenceInfo.confidenceText,
      confidenceColor: confidenceInfo.confidenceColor
    };
  } catch (error) {
    console.error('Error in getBothTeamToScorePrediction:', error);
    return {
      prediction: 'No',
      odds: 2.0,
      noProb: 50,
      yesProb: 50,
      confidenceScore: 0,
      confidenceText: 'Very Low',
      confidenceColor: '#dc3545'
    };
  }
};

/**
 * Calculate likelihood of both teams scoring based on team stats
 * @param {Object} fixture - The fixture data
 * @returns {number} - Likelihood of both teams scoring (0-1)
 */
export const calculateBttsLikelihood = (fixture) => {
  try {
    // Team's offensive strength (goals scored)
    const homeGoalsFor = parseInt(fixture.teams_perfomance_home_for || 0);
    const awayGoalsFor = parseInt(fixture.teams_perfomance_away_for || 0);
    
    // Team's defensive record (goals conceded)
    const homeGoalsAgainst = parseInt(fixture.teams_perfomance_home_aganist || 0);
    const awayGoalsAgainst = parseInt(fixture.teams_perfomance_away_aganist || 0);
    
    // Games played
    const homeGamesPlayed = Math.max(1, parseInt(fixture.teams_games_played_home || 1));
    const awayGamesPlayed = Math.max(1, parseInt(fixture.teams_games_played_away || 1));
    
    // Offensive stats per game
    const homeGoalsPerGame = homeGoalsFor / homeGamesPlayed;
    const awayGoalsPerGame = awayGoalsFor / awayGamesPlayed;
    
    // Defensive stats per game - higher means weaker defense
    const homeDefensiveWeakness = homeGoalsAgainst / homeGamesPlayed;
    const awayDefensiveWeakness = awayGoalsAgainst / awayGamesPlayed;
    
    // Calculate probability of home team scoring
    // Higher if home team scores a lot AND away team concedes a lot
    const homeTeamScoreProb = Math.min(0.9, (homeGoalsPerGame * 0.7 + awayDefensiveWeakness * 0.3) / 3 + 0.3);
    
    // Calculate probability of away team scoring
    // Higher if away team scores a lot AND home team concedes a lot
    const awayTeamScoreProb = Math.min(0.85, (awayGoalsPerGame * 0.7 + homeDefensiveWeakness * 0.3) / 3 + 0.25);
    
    // Probability of both teams scoring is the product of individual probabilities
    // with some adjustment (teams scoring isn't completely independent)
    const bttsLikelihood = Math.min(0.95, Math.max(0.05, (homeTeamScoreProb * awayTeamScoreProb) * 1.2));
    
    // Check edge cases
    if (isNaN(bttsLikelihood)) {
      return 0.5; // Default fallback
    }
    
    return bttsLikelihood;
  } catch (error) {
    console.error('Error calculating BTTS likelihood:', error);
    return 0.5; // Default fallback
  }
};

/**
 * Calculate BTTS (Both Teams To Score) probabilities for a fixture
 * @param {Object} fixture - The fixture data
 * @returns {Array} - Array with [noProb, yesProb]
 */
export const calculateBttsProbabilities = (fixture) => {
  try {
    // Parse odds data directly from the fixture
    let bttsYesOdd = 0;
    let bttsNoOdd = 0;
    
    if (fixture.both_teams_score) {
      const bothTeamsScore = JSON.parse(fixture.both_teams_score);
      const bttsYes = bothTeamsScore.find(odd => odd.value === "Yes");
      const bttsNo = bothTeamsScore.find(odd => odd.value === "No");
      
      if (bttsYes && bttsYes.odd) {
        bttsYesOdd = parseFloat(bttsYes.odd);
      }
      
      if (bttsNo && bttsNo.odd) {
        bttsNoOdd = parseFloat(bttsNo.odd);
      }
    }
    
    // Calculate probability using the odds
    let yesProb = 0;
    let noProb = 0;
    
    if (bttsYesOdd > 0 && bttsNoOdd > 0) {
      yesProb = Math.round((1 / bttsYesOdd) * 100);
      noProb = Math.round((1 / bttsNoOdd) * 100);
      
      // Adjust for bookmaker margin
      const totalProb = yesProb + noProb;
      if (totalProb > 0) {
        yesProb = Math.round((yesProb / totalProb) * 100);
        noProb = 100 - yesProb;
      }
    } else {
      // Default to 50/50 if odds not available
      yesProb = 50;
      noProb = 50;
    }
    
    // Calculate team scoring strength
    const homeGoalsFor = parseInt(fixture.teams_perfomance_home_for || 0);
    const awayGoalsFor = parseInt(fixture.teams_perfomance_away_for || 0);
    const homeGoalsAgainst = parseInt(fixture.teams_perfomance_home_aganist || 0);
    const awayGoalsAgainst = parseInt(fixture.teams_perfomance_away_aganist || 0);
    
    const homeGamesPlayed = Math.max(1, parseInt(fixture.teams_games_played_home || 1));
    const awayGamesPlayed = Math.max(1, parseInt(fixture.teams_games_played_away || 1));
    
    // Calculate average goals per game
    const homeGoalsPerGame = homeGoalsFor / homeGamesPlayed;
    const awayGoalsPerGame = awayGoalsFor / awayGamesPlayed;
    
    // Adjust probability based on team stats
    if (homeGoalsPerGame > 1.5 && awayGoalsPerGame > 1.2) {
      yesProb = Math.min(90, yesProb + 10);
    } else if (homeGoalsPerGame < 0.8 && awayGoalsPerGame < 0.8) {
      yesProb = Math.max(10, yesProb - 10);
    }
    
    // Add defensive vulnerability consideration
    const homeDefensiveWeakness = homeGoalsAgainst / homeGamesPlayed;
    const awayDefensiveWeakness = awayGoalsAgainst / awayGamesPlayed;
    
    if (homeDefensiveWeakness > 1.5 && awayDefensiveWeakness > 1.5) {
      yesProb = Math.min(90, yesProb + 8); // Both teams concede a lot
    } else if (homeDefensiveWeakness < 0.8 && awayDefensiveWeakness < 0.8) {
      yesProb = Math.max(10, yesProb - 8); // Both teams defend well
    }
    
    // League-specific adjustments
    const highScoringLeagues = [
      'Bundesliga', 'Eredivisie', 'Austrian Bundesliga', 
      'Swiss Super League', 'Norwegian Eliteserien'
    ];
    
    const defensiveLeagues = [
      'Serie A', 'Ligue 1', 'La Liga', 'Primeira Liga'
    ];
    
    if (highScoringLeagues.some(league => fixture.league_name?.includes(league))) {
      yesProb = Math.min(90, yesProb + 5);
    }
    
    if (defensiveLeagues.some(league => fixture.league_name?.includes(league))) {
      yesProb = Math.max(10, yesProb - 5);
    }
    
    noProb = 100 - yesProb;
    
    return [noProb, yesProb];
  } catch (error) {
    console.error('Error calculating BTTS probabilities:', error);
    return [50, 50];
  }
};

/**
 * Validate prediction for BTTS (Both Teams To Score)
 * @param {string} prediction - The prediction to validate (Yes or No)
 * @param {Object} scores - Object containing match scores
 * @param {string} status - Match status
 * @param {Object} fixture - The fixture object with goals_home and goals_away
 * @returns {Object} - Style object based on prediction result
 */
export function validateBttsPrediction(prediction, scores, status, fixture) {
  // For upcoming matches, show amber color
  if (status !== "Match Finished" && status !== "Match Finished After Extra Time") {
    return {
      backgroundColor: 'rgb(255, 180, 0)',
      color: 'white',
      border: 'none'
    };
  }

  try {
    // Use goals_home and goals_away if fixture is provided
    let homeScore, awayScore;
    
    if (fixture && fixture.goals_home !== undefined && fixture.goals_away !== undefined) {
      homeScore = parseInt(fixture.goals_home || 0);
      awayScore = parseInt(fixture.goals_away || 0);
    } else {
      // Fallback to scores.fulltime if fixture is not provided
      homeScore = parseInt(scores.fulltime?.home || 0);
      awayScore = parseInt(scores.fulltime?.away || 0);
    }
    
    // Both teams scored if both have at least 1 goal
    const bothTeamsScored = homeScore > 0 && awayScore > 0;
    
    let predictionCorrect = false;
    
    if (prediction === "Yes") {
      predictionCorrect = bothTeamsScored;
    } else {
      predictionCorrect = !bothTeamsScored;
    }
    
    if (predictionCorrect) {
      // Strong green for correct prediction
      return {
        backgroundColor: '#00a651',
        color: 'white',
        border: 'none'
      };
    } else {
      // Red for incorrect prediction
      return {
        backgroundColor: '#cc0000',
        color: 'white',
        border: 'none'
      };
    }
  } catch (error) {
    console.error('Error validating BTTS prediction:', error);
    return {
      backgroundColor: 'white',
      color: 'black',
      border: '1px solid black'
    };
  }
} 