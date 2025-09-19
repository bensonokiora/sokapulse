/**
 * Calculate double chance probabilities based on team performance stats
 */
export function calculateDoubleChanceOdds({ avgHomeScore, avgHomeConc, avgAwayScore, avgAwayConc }) {
  // Calculate base win probabilities using scoring rates
  const homeWinProb = calculateBaseWinProbability(avgHomeScore, avgHomeConc);
  const awayWinProb = calculateBaseWinProbability(avgAwayScore, avgAwayConc);

  // Calculate draw probability based on team goal averages
  const drawProb = calculateDrawProbability(avgHomeScore, avgAwayScore);

  // Calculate double chance probabilities
  const homeOrDraw = normalizeProb(homeWinProb + drawProb); // 1X
  const drawOrAway = normalizeProb(drawProb + awayWinProb); // X2
  const homeOrAway = normalizeProb(homeWinProb + awayWinProb); // 12

  return {
    homeOrDraw,
    drawOrAway,
    homeOrAway
  };
}

/**
 * Calculate base win probability using scoring and conceding averages
 */
function calculateBaseWinProbability(avgScoring, avgConceding) {
  // Use scoring rate relative to conceding as base probability
  const baseProb = avgScoring / (avgScoring + avgConceding);
  
  // Apply diminishing returns for very high scoring rates
  const diminishedProb = baseProb * (1 - Math.exp(-avgScoring));
  
  // Clamp probability between 0.1 and 0.8 
  return Math.min(Math.max(diminishedProb, 0.1), 0.8);
}

/**
 * Calculate draw probability based on similarity of team scoring rates
 */
function calculateDrawProbability(homeAvg, awayAvg) {
  // Higher chance of draw when teams have similar scoring rates
  const scoringDiff = Math.abs(homeAvg - awayAvg);
  const maxScoring = Math.max(homeAvg, awayAvg);
  const similarity = 1 - (scoringDiff / maxScoring);
  
  // Base draw probability with bounds
  const baseDrawProb = 0.25 * similarity;
  return Math.min(Math.max(baseDrawProb, 0.15), 0.35);
}

/**
 * Normalize probability to ensure valid range
 */
function normalizeProb(prob) {
  return Math.min(Math.max(prob, 0), 1);
}
