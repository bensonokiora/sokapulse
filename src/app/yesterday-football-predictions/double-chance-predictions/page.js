import { fetchFixturesByDatePaginated } from '@/utils/api';
import YesterdayDoubleChancePredictionsClient from '@/components/YesterdayDoubleChancePredictionsClient';
import SeoContent from '@/components/SeoContent';

const getYesterdayDate = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

async function getYesterdayDoubleChanceData() {
  const yesterdayDate = getYesterdayDate();
  const perPage = 20; // Define items per page
  try {
    // Use fetchFixturesByDatePaginated with perPage and initial cursor '1'
    const data = await fetchFixturesByDatePaginated(yesterdayDate, perPage, '1');
    
    if (data.status === true && Array.isArray(data.fixtures)) {
      return {
        fixtures: data.fixtures,
        nextCursor: data.nextCursor, // Pass the next cursor
        perPage: perPage,
        error: null,
        yesterdayDate: yesterdayDate // Pass the date for the client component
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
    console.error('Error loading yesterday double chance data:', err);
    return {
      fixtures: [],
      nextCursor: null,
      perPage: perPage,
      error: 'Error loading fixtures',
      yesterdayDate: yesterdayDate
    };
  }
}

export default async function YesterdayDoubleChancePredictions() {
  const { fixtures, error, nextCursor, perPage, yesterdayDate } = await getYesterdayDoubleChanceData();

  return (
    <div className="container container-mob">
      <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>
        <div className="col-lg-12">
          {/* Client-side interactive content */}
          <YesterdayDoubleChancePredictionsClient 
            initialFixtures={fixtures} 
            initialError={error}
            initialNextCursor={nextCursor} // Pass the next cursor
            perPage={perPage} // Pass perPage
            initialDate={yesterdayDate} // Pass the fetched date
          />
          
          {/* SEO Content */}
          <SeoContent pageType="yesterday" siteName="Yesterday" />
        </div>
      </div>
    </div>
  );
}
