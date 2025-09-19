import { fetchWeekendFixtures } from '@/utils/api';
import NavigationRow from '@/components/NavigationRow';
import '../../../styles/custom.css';
import UnderOverPredictionsClient from './UnderOverPredictionsClient';
import SeoContent from '@/components/SeoContent';

async function getUnderOverData() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const perPage = 20;
    const nextCursor = '1'; // Default cursor for first page
    
    const data = await fetchWeekendFixtures(today, perPage, nextCursor);
    
    if (data.status === true && Array.isArray(data.data)) {
      return {
        fixtures: data.data,
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
    console.error('Error loading under/over data:', err);
    return {
      fixtures: [],
      nextCursor: null,
      perPage: 20,
      error: 'Error loading fixtures'
    };
  }
}

export default async function UnderOverPredictions() {
  const { fixtures, error, nextCursor, perPage } = await getUnderOverData();

  return (
    <div className="container container-mob">
      <NavigationRow />
      
      <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>
        <div className="col-lg-12">
          {/* Navigation Links */}
          <div className="match-details-navigation">
            <div className="match-details-nav-item">
              <a href="/weekend-football-predictions" className="match-details-nav-link">
                <span>1x2</span>
              </a>
            </div>
            <div className="match-details-nav-item">
              <a href="/weekend-football-predictions/double-chance-predictions" className="match-details-nav-link">
                <span>Double Chance</span>
              </a>
            </div>
            <div className="match-details-nav-item">
              <a href="/weekend-football-predictions/predictions-under-over-goals" className="match-details-nav-link active">
                <span>Under/Over 2.5</span>
              </a>
            </div>
            <div className="match-details-nav-item">
              <a href="/weekend-football-predictions/predictions-both-team-to-score" className="match-details-nav-link">
                <span>BTTS</span>
              </a>
            </div>
          </div>

          {/* Client-side interactive content */}
          <UnderOverPredictionsClient 
            initialFixtures={fixtures} 
            initialError={error}
            initialNextCursor={nextCursor}
            perPage={perPage}
          />
          
          {/* SEO Content */}
          <SeoContent pageType="weekend" siteName="Weekend" />
        </div>
      </div>
    </div>
  );
}
