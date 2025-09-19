import { fetchLeagueFixtures, fetchLeagueStandings, fetchLeagueTrends } from '@/utils/api';
import LoadingAnimation from '@/components/LoadingAnimation';
import LeaguePageClient from '@/components/LeaguePageClient';

async function getLeagueData(leagueId, leagueName, countryName) {
  try {
    // Fetch all data in parallel
    const [fixturesData, standingsData, trendsData] = await Promise.all([
      fetchLeagueFixtures(leagueId, leagueName, countryName),
      fetchLeagueStandings(leagueId),
      fetchLeagueTrends(leagueId)
    ]);

    return {
      fixtures: fixturesData.status ? fixturesData.data : [],
      standings: standingsData.status !== undefined ? standingsData.data : standingsData,
      trends: trendsData.status ? trendsData.data : [],
      error: null
    };
  } catch (err) {
    console.error('Error loading league data:', err);
    return {
      fixtures: [],
      standings: [],
      trends: [],
      error: 'Error loading league data'
    };
  }
}

export default async function LeaguePage({ params }) {
  const leagueName = params.league.split('-').slice(0, -1).join('-');
  const leagueId = params.league.split('-').pop();
  const countryName = params.country;

  const { fixtures, standings, trends, error } = await getLeagueData(leagueId, leagueName, countryName);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div id="wrapper">
      <div className="container">
        <LeaguePageClient 
          initialFixtures={fixtures}
          initialStandings={standings}
          initialTrends={trends}
          leagueName={leagueName}
          leagueId={leagueId}
          countryName={countryName}
        />
      </div>
    </div>
  );
}
