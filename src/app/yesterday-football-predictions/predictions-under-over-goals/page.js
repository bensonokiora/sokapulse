import { fetchFixturesByDatePaginated } from '@/utils/api';
import UnderOverPredictionsClient from './UnderOverPredictionsClient';
import SeoContent from '@/components/SeoContent';

const getYesterdayDate = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

async function getYesterdayUnderOverData() {
  const yesterdayDate = getYesterdayDate();
  const perPage = 20;
  try {
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
    console.error('Error loading under/over data:', err);
    return {
      fixtures: [],
      nextCursor: null,
      perPage: perPage,
      error: 'Error loading fixtures',
      yesterdayDate: yesterdayDate
    };
  }
}

export default async function YesterdayUnderOverPredictions() {
  const { fixtures, error, nextCursor, perPage, yesterdayDate } = await getYesterdayUnderOverData();

  return (
    <div className="container container-mob">
      <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>
        <div className="col-lg-12">
          {/* Client-side interactive content */}
          <UnderOverPredictionsClient 
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
