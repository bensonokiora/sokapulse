import TrendCard from './TrendCard';
import { getRandomText } from '@/utils/trendDescriptions';
import styles from '@/styles/trends.module.css';

// Helper function to get team stats from either new or old API format
const getTeamStats = (match) => {
  try {
    // Check for the new API structure with predictions
    if (match?.predictions?.[0]) {
      return {
        home: match.predictions[0].home_team_stats,
        away: match.predictions[0].away_team_stats
      };
    }
    // Fallback to legacy structure
    else if (match?.teams_perfomance_per_fixture) {
      return JSON.parse(match.teams_perfomance_per_fixture);
    }
    
    return null;
  } catch (e) {
    console.error("Error getting team stats:", e, "Match:", match);
    return null;
  }
};

// Helper to get formatted date from different API structures
const getFormattedDate = (match) => {
  try {
    // Check if formatted_date exists and return it directly
    if (match.formatted_date && typeof match.formatted_date === 'string') {
      return match.formatted_date;
    }
    
    // Fallback to formatedDate (old property name)
    if (match.formatedDate && typeof match.formatedDate === 'string') {
      return match.formatedDate;
    }
    
    // If date property exists, return it directly or format it
    if (match.date && typeof match.date === 'string') {
      // Just extract date part from datetime string (remove time if needed)
      const [datePart] = match.date.split(' ');
      if (datePart) {
        // If it's a date in format YYYY-MM-DD, convert to DD/MM/YYYY
        if (datePart.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const [year, month, day] = datePart.split('-');
          return `${day}/${month}/${year}`;
        }
        return datePart;
      }
    }
    
    // Return a fallback if no valid date is found
    return 'Upcoming match';
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Upcoming match';
  }
};

export function WinningTrends({ match }) {
  const stats = getTeamStats(match);
  if (!stats) return null;
  
  if (stats.home.league.fixtures.wins.total > 15 || 
      stats.away.league.fixtures.wins.total > 15) {
    const winningTeam = stats.home.league.fixtures.wins.total > stats.away.league.fixtures.wins.total 
      ? { stats: stats.home, type: 'home' }
      : { stats: stats.away, type: 'away' };

    const preferredPrediction = {
      text: winningTeam.type === 'home' ? '1' : '2',
      type: 'high',
      confidence: winningTeam.stats.league.fixtures.wins.total > 20 ? 'high' : 'medium'
    };

    return (
      <div className={styles.trendSection}>
        <TrendCard
          team={{
            name: match[`${winningTeam.type}_team_name`],
            logo: match[`${winningTeam.type}_team_logo`]
          }}
          stats={winningTeam.stats.league}
          type="success"
          description={{
            label: "Wins",
            value: winningTeam.stats.league.fixtures.wins.total
          }}
          league={match.league_name}
          prediction={{
            homeTeam: match.home_team_name,
            awayTeam: match.away_team_name,
            date: getFormattedDate(match),
            predictedTeam: winningTeam.type === 'home' ? match.home_team_name : match.away_team_name
          }}
          url={`${match.home_team_name.toLowerCase()}-vs-${match.away_team_name.toLowerCase()}-${match.fixture_id}`}
          trendTexts={getRandomText('wins')}
          preferredPrediction={preferredPrediction}
        />
      </div>
    );
  }

  return null;
}

export function LosingTrends({ match }) {
  const stats = getTeamStats(match);
  if (!stats) return null;
  
  if (stats.home.league.fixtures.loses.total > 15 || 
      stats.away.league.fixtures.loses.total > 15) {
    const losingTeam = stats.home.league.fixtures.loses.total > stats.away.league.fixtures.loses.total 
      ? { stats: stats.home, type: 'home' }
      : { stats: stats.away, type: 'away' };

    const preferredPrediction = {
      text: losingTeam.type === 'home' ? '2' : '1',
      type: 'medium',
      confidence: losingTeam.stats.league.fixtures.loses.total > 20 ? 'high' : 'medium'
    };

    return (
      <div className={styles.trendSection}>
        <TrendCard
          team={{
            name: match[`${losingTeam.type}_team_name`],
            logo: match[`${losingTeam.type}_team_logo`]
          }}
          stats={losingTeam.stats.league}
          type="danger"
          description={{
            label: "Losses",
            value: losingTeam.stats.league.fixtures.loses.total
          }}
          league={match.league_name}
          prediction={{
            homeTeam: match.home_team_name,
            awayTeam: match.away_team_name,
            date: getFormattedDate(match),
            predictedTeam: losingTeam.type === 'home' ? match.away_team_name : match.home_team_name
          }}
          url={`${match.home_team_name.toLowerCase()}-vs-${match.away_team_name.toLowerCase()}-${match.fixture_id}`}
          trendTexts={getRandomText('losses')}
          preferredPrediction={preferredPrediction}
        />
      </div>
    );
  }

  return null;
}

export function CleanSheetTrends({ match }) {
  const stats = getTeamStats(match);
  if (!stats) return null;
  
  if (stats.home.league.clean_sheet.total > 15 || 
      stats.away.league.clean_sheet.total > 15) {
    const cleanSheetTeam = stats.home.league.clean_sheet.total > stats.away.league.clean_sheet.total 
      ? { stats: stats.home, type: 'home' }
      : { stats: stats.away, type: 'away' };

    const preferredPrediction = {
      text: 'Under 2.5',
      type: 'high',
      confidence: cleanSheetTeam.stats.league.clean_sheet.total > 20 ? 'high' : 'medium'
    };

    return (
      <div className={styles.trendSection}>
        <TrendCard
          team={{
            name: match[`${cleanSheetTeam.type}_team_name`],
            logo: match[`${cleanSheetTeam.type}_team_logo`]
          }}
          stats={cleanSheetTeam.stats.league}
          type="success"
          description={{
            label: "Clean Sheets",
            value: cleanSheetTeam.stats.league.clean_sheet.total
          }}
          league={match.league_name}
          prediction={{
            homeTeam: match.home_team_name,
            awayTeam: match.away_team_name,
            date: getFormattedDate(match),
            predictedTeam: cleanSheetTeam.type === 'home' ? match.home_team_name : match.away_team_name
          }}
          url={`${match.home_team_name.toLowerCase()}-vs-${match.away_team_name.toLowerCase()}-${match.fixture_id}`}
          trendTexts={getRandomText('cleanSheet')}
          preferredPrediction={preferredPrediction}
        />
      </div>
    );
  }

  return null;
}

export function WinningStreaksTrends({ match }) {
  const stats = getTeamStats(match);
  if (!stats) return null;
  
  if (stats.home.league.biggest.streak.wins > 5 || 
      stats.away.league.biggest.streak.wins > 5) {
    const streakTeam = stats.home.league.biggest.streak.wins > stats.away.league.biggest.streak.wins 
      ? { stats: stats.home, type: 'home' }
      : { stats: stats.away, type: 'away' };

    const preferredPrediction = {
      text: streakTeam.type === 'home' ? '1' : '2',
      type: 'high',
      confidence: streakTeam.stats.league.biggest.streak.wins > 7 ? 'high' : 'medium'
    };

    return (
      <div className={styles.trendSection}>
        <TrendCard
          team={{
            name: match[`${streakTeam.type}_team_name`],
            logo: match[`${streakTeam.type}_team_logo`]
          }}
          stats={streakTeam.stats.league}
          type="info"
          description={{
            label: "Win Streak",
            value: streakTeam.stats.league.biggest.streak.wins
          }}
          league={match.league_name}
          prediction={{
            homeTeam: match.home_team_name,
            awayTeam: match.away_team_name,
            date: getFormattedDate(match),
            predictedTeam: streakTeam.type === 'home' ? match.home_team_name : match.away_team_name
          }}
          url={`${match.home_team_name.toLowerCase()}-vs-${match.away_team_name.toLowerCase()}-${match.fixture_id}`}
          trendTexts={getRandomText('winningStreak')}
          preferredPrediction={preferredPrediction}
        />
      </div>
    );
  }

  return null;
}

export function DrawsTrends({ match }) {
  const stats = getTeamStats(match);
  if (!stats) return null;
  
  if (stats.home.league.fixtures.draws.total > 5 && 
      stats.home.league.fixtures.wins.total < 15 && 
      stats.away.league.fixtures.wins.total < 15) {
    
    const drawTeam = stats.home.league.fixtures.draws.total > stats.away.league.fixtures.draws.total 
      ? { stats: stats.home, type: 'home' }
      : { stats: stats.away, type: 'away' };

    const preferredPrediction = {
      text: 'X',
      type: 'medium',
      confidence: drawTeam.stats.league.fixtures.draws.total > 8 ? 'high' : 'medium'
    };

    return (
      <div className={styles.trendSection}>
        <TrendCard
          team={{
            name: match[`${drawTeam.type}_team_name`],
            logo: match[`${drawTeam.type}_team_logo`]
          }}
          stats={drawTeam.stats.league}
          type="warning"
          description={{
            label: "Draws",
            value: drawTeam.stats.league.fixtures.draws.total
          }}
          league={match.league_name}
          prediction={{
            homeTeam: match.home_team_name,
            awayTeam: match.away_team_name,
            date: getFormattedDate(match),
            predictedTeam: drawTeam.type === 'home' ? match.home_team_name : match.away_team_name
          }}
          url={`${match.home_team_name.toLowerCase()}-vs-${match.away_team_name.toLowerCase()}-${match.fixture_id}`}
          trendTexts={getRandomText('draws')}
          preferredPrediction={preferredPrediction}
        />
      </div>
    );
  }

  return null;
}
