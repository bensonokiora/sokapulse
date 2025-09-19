/**
 * Utility functions for double chance football match predictions
 * Shared between today and tomorrow prediction pages
 */

/**
 * Get double chance prediction based on probabilities
 * @param {string|number} home - Home win probability
 * @param {string|number} draw - Draw probability
 * @param {string|number} away - Away win probability
 * @param {string} doubleChanceGoals - JSON string of double chance odds
 * @returns {Object} - Object with prediction and odd properties
 */
export const getDoubleChancePrediction = (home, draw, away, doubleChanceGoals) => {
  // Handle null or undefined values
  if (home === null || home === undefined || 
      draw === null || draw === undefined || 
      away === null || away === undefined) {
    return { prediction: "-", odd: "-" };
  }

  const homeProb = parseInt(home) || 0;
  const drawProb = parseInt(draw) || 0;
  const awayProb = parseInt(away) || 0;
  let prediction = "";
  let odd = "-";

  try {
    const odds = doubleChanceGoals ? JSON.parse(doubleChanceGoals) : [];
    const homeDrawOdd = odds && odds[0] && odds[0].odd ? odds[0].odd : "-";
    const homeAwayOdd = odds && odds[1] && odds[1].odd ? odds[1].odd : "-";
    const drawAwayOdd = odds && odds[2] && odds[2].odd ? odds[2].odd : "-";

    if (homeProb > drawProb && homeProb > awayProb && drawProb > awayProb) {
      prediction = "1X";
      odd = homeDrawOdd;
    } else if (homeProb > drawProb && homeProb > awayProb && drawProb === awayProb) {
      prediction = "1X";
      odd = homeDrawOdd;
    } else if (awayProb > drawProb && awayProb > homeProb && drawProb === homeProb) {
      prediction = "X2";
      odd = drawAwayOdd;
    } else if (drawProb > homeProb && drawProb > awayProb && awayProb > homeProb) {
      prediction = "X2";
      odd = drawAwayOdd;
    } else if (drawProb > homeProb && drawProb > awayProb && homeProb > awayProb) {
      prediction = "1X";
      odd = drawAwayOdd;
    } else if (awayProb > homeProb && awayProb > drawProb && homeProb > drawProb) {
      prediction = "12";
      odd = homeAwayOdd;
    } else if (awayProb > homeProb && awayProb > drawProb && drawProb > homeProb) {
      prediction = "X2";
      odd = drawAwayOdd;
    } else if (homeProb > drawProb && homeProb > awayProb && awayProb > drawProb) {
      prediction = "12";
      odd = homeAwayOdd;
    } else if (homeProb === drawProb && drawProb === awayProb) {
      prediction = "1X";
      odd = homeDrawOdd;
    } else {
      prediction = "1X";
      odd = homeDrawOdd;
    }
  } catch (error) {
    console.error('Error parsing double chance odds:', error);
    prediction = "1X"; // default prediction
    odd = "-";
  }

  return { prediction, odd };
};

/**
 * Calculate double chance probabilities
 * @param {string|number} home - Home win probability
 * @param {string|number} draw - Draw probability
 * @param {string|number} away - Away win probability
 * @returns {Object} - Object with type and value properties
 */
export const getDoubleChanceProb = (home, draw, away) => {
  // Handle null or undefined values
  if (home === null || home === undefined || 
      draw === null || draw === undefined || 
      away === null || away === undefined) {
    return { type: '1X', value: 0 };
  }

  const homeProb = parseInt(home) || 0;
  const drawProb = parseInt(draw) || 0;
  const awayProb = parseInt(away) || 0;
  
  const homeDrawProb = homeProb + drawProb;
  const homeAwayProb = homeProb + awayProb;
  const drawAwayProb = drawProb + awayProb;

  if (homeDrawProb >= homeAwayProb && homeDrawProb >= drawAwayProb) {
    return { type: '1X', value: homeDrawProb };
  }
  if (drawAwayProb >= homeDrawProb && drawAwayProb >= homeAwayProb) {
    return { type: 'X2', value: drawAwayProb };
  }
  return { type: '12', value: homeAwayProb };
};

/**
 * Validate double chance prediction against match result
 * @param {string} prediction - The prediction to validate (1X, X2, or 12)
 * @param {string} status - Match status
 * @param {number|string} homeGoals - Home team goals or fixture.goals_home
 * @param {number|string} awayGoals - Away team goals or fixture.goals_away
 * @param {Object} fixture - Optional fixture object with goals_home and goals_away
 * @returns {Object} - Style object based on prediction result
 */
export const validateDoubleChancePrediction = (prediction, status, homeGoals, awayGoals, fixture) => {
  // Use fixture.goals_home and fixture.goals_away if available
  let homeScore, awayScore;
  
  if (fixture && fixture.goals_home !== undefined && fixture.goals_away !== undefined) {
    homeScore = parseInt(fixture.goals_home || 0);
    awayScore = parseInt(fixture.goals_away || 0);
    console.log('Using fixture goals:', { homeScore, awayScore });
  } else {
    // Use provided homeGoals and awayGoals
    homeScore = parseInt(homeGoals || 0);
    awayScore = parseInt(awayGoals || 0);
    console.log('Using provided goals:', { homeScore, awayScore });
  }
  
  // Debug information
  console.log('Validating prediction:', { prediction, status, homeScore, awayScore });
  
  // Handle null or undefined values
  if (!prediction || !status) {
    console.log('Missing prediction or status');
    return {
      backgroundColor: 'rgb(255, 180, 0)',
      color: 'white',
      border: 'none'
    };
  }

  // Check if the match is finished
  if (status !== "FT" && status !== "AET" && status !== "Match Finished" && status !== "Match Finished After Extra Time") {
    console.log('Match not finished, status:', status);
    return {
      backgroundColor: 'rgb(255, 180, 0)',
      color: 'white',
      border: 'none'
    };
  }
  
  let predictionCorrect = false;

  switch (prediction) {
    case "1X":
      predictionCorrect = homeScore >= awayScore;
      console.log('1X prediction, correct:', predictionCorrect);
      break;
    case "X2":
      predictionCorrect = homeScore <= awayScore;
      console.log('X2 prediction, correct:', predictionCorrect);
      break;
    case "12":
      // For "12" prediction, it's correct if it's not a draw
      predictionCorrect = homeScore !== awayScore;
      console.log('12 prediction, correct:', predictionCorrect, 'homeScore:', homeScore, 'awayScore:', awayScore);
      break;
    default:
      console.log('Unknown prediction type:', prediction);
      break;
  }

  if (predictionCorrect) {
    console.log('Prediction correct, returning green style');
    return {
      backgroundColor: 'green',
      color: 'white',
      border: 'none'
    };
  }

  console.log('Prediction incorrect, returning red style');
  return {
    backgroundColor: 'white',
    color: 'red',
    border: '1px solid red'
  };
};