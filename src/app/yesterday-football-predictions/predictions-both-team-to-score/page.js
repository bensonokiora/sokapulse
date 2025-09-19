import { fetchFixturesByDatePaginated } from '@/utils/api';
import BothTeamsToScorePredictionsClient from './BothTeamsToScorePredictionsClient';
import SeoContent from '@/components/SeoContent';

async function getYesterdayBothTeamsToScoreData() {
  const perPage = 20;
  try {
    // Get yesterday's date
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];

    const data = await fetchFixturesByDatePaginated(yesterdayDate, perPage, '1');
    
    if (data.status === true && Array.isArray(data.fixtures)) {
      return {
        fixtures: data.fixtures,
        nextCursor: data.nextCursor,
        perPage: perPage,
        error: null,
        yesterdayDate: yesterdayDate
      };
    } else {
      return {
        fixtures: [],
        nextCursor: null,
        perPage: perPage,
        error: data.message || 'Failed to load fixtures',
        yesterdayDate: yesterdayDate
      };
    }
  } catch (err) {
    console.error('Error loading both teams to score data:', err);
    return {
      fixtures: [],
      nextCursor: null,
      perPage: perPage,
      error: 'Error loading fixtures',
      yesterdayDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]
    };
  }
}

export default async function YesterdayBothTeamsToScorePredictions() {
  const { fixtures, error, nextCursor, perPage, yesterdayDate } = await getYesterdayBothTeamsToScoreData();

  return (
    <div className="container container-mob">
      <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>
        <div className="col-lg-12">
          {/* Client-side interactive content */}
          <BothTeamsToScorePredictionsClient 
            initialFixtures={fixtures} 
            initialError={error}
            initialNextCursor={nextCursor}
            perPage={perPage}
            initialDate={yesterdayDate}
          />
          
          {/* SEO Content */}
          <SeoContent />
        </div>
      </div>
    </div>
  );
} 