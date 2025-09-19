'use client';

import { useState, useEffect } from 'react';
import { fetchTeamMatches, fetchTeamMatchesAway } from '@/utils/api';
import styles from '@/styles/GamesPlayed.module.css';

const groupMatchesByDate = (matches) => {
  return matches.reduce((groups, match) => {
    const date = match.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(match);
    return groups;
  }, {});
};

export default function GamesPlayed({ teamData }) {
  const [homeMatches, setHomeMatches] = useState([]);
  const [awayMatches, setAwayMatches] = useState([]);
  const [homeLeagues, setHomeLeagues] = useState([]);
  const [awayLeagues, setAwayLeagues] = useState([]);
  const [activeHomeLeagueId, setActiveHomeLeagueId] = useState('all');
  const [activeAwayLeagueId, setActiveAwayLeagueId] = useState('all');
  const [displayHomeCount, setDisplayHomeCount] = useState(6);
  const [displayAwayCount, setDisplayAwayCount] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homeResponse = await fetchTeamMatches(
          teamData.team_id,
          teamData.matchDetails.unformated_date
        );

        if (homeResponse?.status && homeResponse?.data) {
          setHomeMatches(homeResponse.data);
          
          // Extract unique leagues using Map to ensure unique entries by ID
          const homeLeaguesMap = new Map();
          homeResponse.data.forEach(match => {
            if (!homeLeaguesMap.has(match.league_id)) {
              homeLeaguesMap.set(match.league_id, {
                id: match.league_id,
                name: match.league_name,
                shortName: match.league_short_name
              });
            }
          });
          setHomeLeagues(Array.from(homeLeaguesMap.values()));
        }

        // const awayResponse = await fetchTeamMatchesAway(
        //   teamData.team_id,
        //   teamData.matchDetails.unformated_date
        // );

        // if (awayResponse?.status && awayResponse?.data) {
        //   setAwayMatches(awayResponse.data);
          
        //   // Extract unique leagues using Map to ensure unique entries by ID
        //   const awayLeaguesMap = new Map();
        //   awayResponse.data.forEach(match => {
        //     if (!awayLeaguesMap.has(match.league_id)) {
        //       awayLeaguesMap.set(match.league_id, {
        //         id: match.league_id,
        //         name: match.league_name,
        //         shortName: match.league_short_name
        //       });
        //     }
        //   });
        //   setAwayLeagues(Array.from(awayLeaguesMap.values()));
        // }

      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [teamData]);

  const getResultIndicator = (match) => {
    const isHomeTeam = match.home_team_id === teamData.team_id;
    const homeGoals = parseInt(match.ft_goals_home);
    const awayGoals = parseInt(match.ft_goals_away);
    
    if (isHomeTeam) {
      if (homeGoals > awayGoals) return ['W', 'var(--bs-success)'];
      if (homeGoals < awayGoals) return ['L', 'var(--bs-danger)'];
      return ['D', 'var(--bs-warning)'];
    } else {
      if (awayGoals > homeGoals) return ['W', 'var(--bs-success)'];
      if (awayGoals < homeGoals) return ['L', 'var(--bs-danger)'];
      return ['D', 'var(--bs-warning)'];
    }
  };

  const stats = [...homeMatches, ...awayMatches].reduce((acc, match) => {
    const [result] = getResultIndicator(match);
    acc[result] = (acc[result] || 0) + 1;
    return acc;
  }, {});

  const total = (stats.W || 0) + (stats.D || 0) + (stats.L || 0);
  const winPercent = ((stats.W || 0) / total * 100).toFixed(0);
  const drawPercent = ((stats.D || 0) / total * 100).toFixed(0);
  const lossPercent = ((stats.L || 0) / total * 100).toFixed(0);

  return (
    <div className={styles.container}>
      <div className="row">
        {/* Home Matches Section */}
        <div className="col-md-12">
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{teamData.team_name} - Previous Fixtures</h2>

            <div className={styles.leagueNav}>
              <button 
                className={`${styles.leagueTab} ${activeHomeLeagueId === 'all' ? styles.leagueTabActive : ''}`}
                onClick={() => setActiveHomeLeagueId('all')}
              >
                All
              </button>
              {homeLeagues.map(league => (
                <button
                  key={league.id}
                  className={`${styles.leagueTab} ${activeHomeLeagueId === league.id ? styles.leagueTabActive : ''}`}
                  onClick={() => setActiveHomeLeagueId(league.id)}
                >
                  {league.name}
                </button>
              ))}
            </div>

            <div>
              {Object.entries(
                groupMatchesByDate(
                  homeMatches.filter(
                    match => activeHomeLeagueId === 'all' || 
                    match.league_id === parseInt(activeHomeLeagueId)
                  ).slice(0, displayHomeCount)
                )
              ).map(([date, matches]) => (
                <div key={date}>
                  <div className={styles.dateGroup}>{date}</div>
                  <table className={styles.matchesTable}>
                    <thead>
                      <tr>
                        <th style={{ width: '35%', textAlign: 'left', padding: '0.75rem' }}>Home Team</th>
                        <th style={{ width: '15%', textAlign: 'center', padding: '0.75rem' }}>Score</th>
                        <th style={{ width: '35%', textAlign: 'left', padding: '0.75rem' }}>Away Team</th>
                        <th style={{ width: '10%', textAlign: 'left', padding: '0.75rem' }}>League</th>
                        <th style={{ width: '5%', textAlign: 'center', padding: '0.75rem' }}>Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matches.map((match, idx) => {
                        const [result, color] = getResultIndicator(match);
                        const scores = JSON.parse(match.scores);
                        return (
                          <tr key={idx} className={styles.matchRow}>
                            <td className={styles.matchCell} style={{ width: '35%', textAlign: 'left' }}>
                              <a className={`${styles.teamName} ${match.home_team_id === teamData.team_id ? styles.teamNameActive : ''}`}
                                 href={`/football-predictions/team/${match.home_team_name.toLowerCase().replace(/\s+/g, '-')}-${match.home_team_id}`}>
                                {match.home_team_name}
                              </a>
                            </td>
                            <td className={`${styles.matchCell} ${styles.score}`} style={{ width: '15%', textAlign: 'center' }}>
                              <a href={`/football-predictions/fixture/${match.home_team_name.toLowerCase().replace(/\s+/g, '-')}-vs-${match.away_team_name.toLowerCase().replace(/\s+/g, '-')}-${match.fixture_id}`}>
                                <div className={styles.mainScore}>
                                  {`${match.ft_goals_home} - ${match.ft_goals_away}`}
                                </div>
                                <div className={styles.subScore}>
                                  {`(${scores.halftime.home} - ${scores.halftime.away})`}
                                </div>
                              </a>
                            </td>
                            <td className={styles.matchCell} style={{ width: '35%', textAlign: 'left' }}>
                              <a className={`${styles.teamName} ${match.away_team_id === teamData.team_id ? styles.teamNameActive : ''}`}
                                 href={`/football-predictions/team/${match.away_team_name.toLowerCase().replace(/\s+/g, '-')}-${match.away_team_id}`}>
                                {match.away_team_name}
                              </a>
                            </td>
                            <td className={styles.matchCell} style={{ width: '10%', textAlign: 'left' }}>{match.league_short_name}</td>
                            <td className={styles.matchCell} style={{ width: '5%', textAlign: 'center' }}>
                              <div className={styles.resultBadge} style={{ backgroundColor: color }}>{result}</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            {homeMatches.length > displayHomeCount && (
              <button 
                className={styles.viewMoreBtn}
                onClick={() => setDisplayHomeCount(prev => prev + 6)}
              >
                View More
              </button>
            )}
          </div>
        </div>

        {/* Away Matches Section */}
        {/* <div className="col-md-6">
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Away Games - {teamData.team_name}</h2>

            <div className={styles.leagueNav}>
              <button 
                className={`${styles.leagueTab} ${activeAwayLeagueId === 'all' ? styles.leagueTabActive : ''}`}
                onClick={() => setActiveAwayLeagueId('all')}
              >
                All
              </button>
              {awayLeagues.map(league => (
                <button
                  key={league.id}
                  className={`${styles.leagueTab} ${activeAwayLeagueId === league.id ? styles.leagueTabActive : ''}`}
                  onClick={() => setActiveAwayLeagueId(league.id)}
                >
                  {league.name}
                </button>
              ))}
            </div>

            <div>
              {Object.entries(
                groupMatchesByDate(
                  awayMatches.filter(
                    match => activeAwayLeagueId === 'all' || 
                    match.league_id === parseInt(activeAwayLeagueId)
                  ).slice(0, displayAwayCount)
                )
              ).map(([date, matches]) => (
                <div key={date}>
                  <div className={styles.dateGroup}>{date}</div>
                  <table className={styles.matchesTable}>
                    <tbody>
                      {matches.map((match, idx) => {
                        const [result, color] = getResultIndicator(match);
                        const scores = JSON.parse(match.scores);
                        return (
                          <tr key={idx} className={styles.matchRow}>
                            <td className={styles.matchCell}>
                              <a className={`${styles.teamName} ${match.home_team_id === teamData.team_id ? styles.teamNameActive : ''}`}
                                 href={`/football-predictions/team/${match.home_team_name.toLowerCase().replace(/\s+/g, '-')}-${match.home_team_id}`}>
                                {match.home_team_name}
                              </a>
                            </td>
                            <td className={`${styles.matchCell} ${styles.score}`}>
                              <a href={`/football-predictions/fixture/${match.home_team_name.toLowerCase().replace(/\s+/g, '-')}-vs-${match.away_team_name.toLowerCase().replace(/\s+/g, '-')}-${match.fixture_id}`}>
                                <div className={styles.mainScore}>
                                  {`${match.ft_goals_home} - ${match.ft_goals_away}`}
                                </div>
                                <div className={styles.subScore}>
                                  {`(${scores.halftime.home} - ${scores.halftime.away})`}
                                </div>
                              </a>
                            </td>
                            <td className={styles.matchCell}>
                              <a className={`${styles.teamName} ${match.away_team_id === teamData.team_id ? styles.teamNameActive : ''}`}
                                 href={`/football-predictions/team/${match.away_team_name.toLowerCase().replace(/\s+/g, '-')}-${match.away_team_id}`}>
                                {match.away_team_name}
                              </a>
                            </td>
                            <td className={styles.matchCell}>{match.league_short_name}</td>
                            <td className={styles.matchCell}>
                              <div className={styles.resultBadge} style={{ backgroundColor: color }}>{result}</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            {awayMatches.length > displayAwayCount && (
              <button 
                className={styles.viewMoreBtn}
                onClick={() => setDisplayAwayCount(prev => prev + 6)}
              >
                View More
              </button>
            )}
          </div>
        </div> */}

        {/* Stats Section */}
        <div className="col-md-12">
          <div className={styles.statsContainer}>
            <div className={styles.progressBar}>
              <div style={{ width: `${winPercent}%`, height: '100%', backgroundColor: 'var(--bs-success)', float: 'left' }}></div>
              <div style={{ width: `${drawPercent}%`, height: '100%', backgroundColor: 'var(--bs-warning)', float: 'left' }}></div>
              <div style={{ width: `${lossPercent}%`, height: '100%', backgroundColor: 'var(--bs-danger)', float: 'left' }}></div>
            </div>
            <div className={styles.modernStatsLabels}>
              <div className={styles.modernStatsLabel} style={{ width: `${winPercent}%` }}>
                <span className={styles.modernStatsValue}>{stats.W || 0}</span>
                <span className={styles.modernStatsText}>Wins</span>
              </div>
              <div className={styles.modernStatsLabel} style={{ width: `${drawPercent}%` }}>
                <span className={styles.modernStatsValue}>{stats.D || 0}</span>
                <span className={styles.modernStatsText}>Draws</span>
              </div>
              <div className={styles.modernStatsLabel} style={{ width: `${lossPercent}%` }}>
                <span className={styles.modernStatsValue}>{stats.L || 0}</span>
                <span className={styles.modernStatsText}>Losses</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
