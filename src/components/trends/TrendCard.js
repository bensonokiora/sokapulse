import { formatDate } from '@/utils/helpers';
import Link from 'next/link';
import styles from '@/styles/trends.module.css';

export default function TrendCard({ team, stats, type, description, league, prediction, url, trendTexts }) {
  const matchUrl = url ? 
    `/football-predictions/fixture/${url}` :
    `/football-predictions/fixture/${team.name.replace(/\s+/g, '-').toLowerCase()}`;

  const formatTrendText = (teamName, prefix, value, league, suffix) => {
    // Get the correct property based on description label
    const getHomeAwayStats = () => {
      switch(description.label.toLowerCase()) {
        case 'wins':
          return {
            home: stats.fixtures.wins.home,
            away: stats.fixtures.wins.away
          };
        case 'losses':
        case 'loses':
          return {
            home: stats.fixtures.loses.home,
            away: stats.fixtures.loses.away
          };
        case 'draws':
          return {
            home: stats.fixtures.draws.home,
            away: stats.fixtures.draws.away
          };
        case 'clean sheets':
          return {
            home: stats.clean_sheet.home,
            away: stats.clean_sheet.away
          };
        case 'win streak':
          return {
            home: stats.biggest.streak.wins,
            away: 0 // Streak doesn't have home/away distinction
          };
        default:
          return { home: 0, away: 0 };
      }
    };

    const { home, away } = getHomeAwayStats();

    return (
      <p className={styles.trendText}>
        <span className={styles.teamHighlight}>{teamName}</span>{' '}
        {prefix}{' '}
        <span className={styles.valueHighlight}>{value}</span>
        <span className={styles.teamHighlight}>&nbsp;{league}</span> matches,{' '}
        <span className={styles.valueHighlight}>{home}</span>
        &nbsp; at home and{' '}
        <span className={styles.valueHighlight}>{away}</span> away,
        &nbsp;{suffix}
      </p>
    );
  };

  const formattedDate = formatDate(prediction.date);
  
  // Map type to the appropriate footer class
  const getFooterClass = () => {
    switch(type) {
      case 'success': return styles.footerSuccess;
      case 'danger': return styles.footerDanger;
      case 'warning': return styles.footerWarning;
      case 'info': return styles.footerInfo;
      default: return styles.footerInfo;
    }
  };

  return (
    <div className={styles.trendCard}>
      <div className={styles.trendRow}>
        <div className={styles.teamSection}>
          <div className={styles.teamHeader}>
            <img 
              src={team.logo} 
              alt={team.name}
              className={styles.teamLogo}
            />
            <h3 className={styles.teamName}>{team.name}</h3>
          </div>
          
          <div className={styles.teamStats}>
            <div className={styles.statsLabel}>Games Played</div>
            <div className={styles.statsValue}>
              Home: {stats.fixtures.played.home}, 
              Away: {stats.fixtures.played.away}, 
              Total: {stats.fixtures.played.total}
            </div>
          </div>
          
          <div className={`${styles.cardFooter} ${getFooterClass()}`}>
            {description.label}: {description.value}
          </div>
        </div>
        
        <div className={styles.trendDetails}>
          {formatTrendText(
            team.name,
            trendTexts.prefix,
            description.value,
            league,
            trendTexts.suffix
          )}
          
          <Link href={matchUrl} className={styles.matchLink}>
            {prediction.homeTeam} - {prediction.awayTeam}
            <span className={styles.matchDate}>&nbsp;&nbsp;{formattedDate}</span>
          </Link>
          
          <div className={styles.prediction}>
            Prediction:{' '}
            <span className={styles.predictedTeam}>
              {prediction.predictedTeam}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
