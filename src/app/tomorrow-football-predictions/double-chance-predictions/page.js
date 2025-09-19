import { fetchFixturesByDatePaginated } from '@/utils/api';
import DoubleChancePredictionsClient from './DoubleChancePredictionsClient';
import SeoContent from '@/components/SeoContent';

async function getTomorrowDoubleChanceData() {
  const perPage = 20;
  try {
    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];
    
    const data = await fetchFixturesByDatePaginated(tomorrowDate, perPage, '1');
    
    if (data.status === true && Array.isArray(data.fixtures)) {
      return {
        fixtures: data.fixtures,
        nextCursor: data.nextCursor,
        perPage: perPage,
        error: null
      };
    } else {
      return {
        fixtures: [],
        nextCursor: null,
        perPage: perPage,
        error: data.message || 'Failed to load fixtures'
      };
    }
  } catch (err) {
    console.error('Error loading tomorrow double chance data:', err);
    return {
      fixtures: [],
      nextCursor: null,
      perPage: perPage,
      error: 'Error loading fixtures'
    };
  }
}

export default async function TomorrowDoubleChancePredictions() {
  const { fixtures, error, nextCursor, perPage } = await getTomorrowDoubleChanceData();

  return (
    <div className="container container-mob">
      <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>
        <div className="col-lg-12">
          {/* Client-side interactive content */}
          <DoubleChancePredictionsClient 
            initialFixtures={fixtures} 
            initialError={error}
            initialNextCursor={nextCursor}
            perPage={perPage}
          />
          
          {/* SEO Content */}
          <SeoContent />
        </div>
      </div>
    </div>
  );
}
